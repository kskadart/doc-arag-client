// API client for backend communication

import { redirectToLogin } from './auth';
import {
  AgentQueryResponse,
  ApiError,
  DeleteResponse,
  EmbeddingResponse,
  HealthResponse,
  MeResponse,
  QueryRequest,
  TaskStatusResponse,
  UploadedFilesListResponse,
  UploadResponse,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
const SERVICE_UNAVAILABLE = 'Service is unavailable. Please check your connection.';

// Marks the call as a programmatic request so the edge (Authelia) answers an
// expired session with 401 instead of redirecting to the login portal; a
// redirect would be followed cross-origin and surface as a network error
const XHR_HEADERS = {
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

// Turns a failed response into an ApiError. A 401 (or, as a fallback, any
// redirect: the backend never redirects, the edge does) means the session is
// gone, so a navigation is started first and Caddy sends the user to the portal.
async function errorFromResponse(response: Response, fallback: string): Promise<ApiError> {
  if (response.type === 'opaqueredirect') {
    redirectToLogin();
    return { detail: 'Not authenticated', status: 401 };
  }
  if (response.status === 401) redirectToLogin();

  let detail = fallback;
  const contentType = response.headers.get('content-type');

  try {
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      detail = errorData.detail || errorData.message || fallback;
    } else {
      const text = await response.text();
      if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
        detail = SERVICE_UNAVAILABLE;
      } else {
        detail = text || fallback;
      }
    }
  } catch {
    detail = SERVICE_UNAVAILABLE;
  }

  return { detail, status: response.status };
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        redirect: 'manual',
        headers: {
          'Content-Type': 'application/json',
          ...XHR_HEADERS,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw await errorFromResponse(response, 'An error occurred');
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        detail: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError;
    }
  }

  // Health check
  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  // Who is signed in (as asserted by the edge proxy) and whether they administer documents
  async me(): Promise<MeResponse> {
    return this.request<MeResponse>('/me');
  }

  // Query documents with the agent
  async query(request: QueryRequest): Promise<AgentQueryResponse> {
    return this.request<AgentQueryResponse>('/query', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Upload document
  async uploadDocument(file: File, documentName?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('document', file, file.name);
    formData.append('document_name', documentName || file.name);

    const response = await fetch(`${API_BASE}/uploads`, {
      method: 'POST',
      redirect: 'manual',
      headers: XHR_HEADERS,
      body: formData,
    });

    if (!response.ok) {
      throw await errorFromResponse(response, 'Upload failed');
    }

    return await response.json();
  }

  // Generate embeddings for a document
  async generateEmbeddings(documentId: string): Promise<EmbeddingResponse> {
    return this.request<EmbeddingResponse>(`/embeddings/${documentId}`, {
      method: 'POST',
    });
  }

  // List documents with pagination
  async listDocuments(page: number = 1, pageSize: number = 10): Promise<UploadedFilesListResponse> {
    return this.request<UploadedFilesListResponse>(`/documents?page=${page}&page_size=${pageSize}`);
  }

  // Delete document
  async deleteDocument(documentId: string): Promise<DeleteResponse> {
    return this.request<DeleteResponse>(`/documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  // Get task status
  async getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
    return this.request<TaskStatusResponse>(`/tasks/${taskId}`);
  }

  // Poll task status until completion
  async pollTaskStatus(
    taskId: string,
    onProgress?: (status: TaskStatusResponse) => void,
    interval: number = 2000
  ): Promise<TaskStatusResponse> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getTaskStatus(taskId);

          if (onProgress) {
            onProgress(status);
          }

          if (status.status === 'completed') {
            resolve(status);
          } else if (status.status === 'failed') {
            reject(new Error(status.message));
          } else {
            setTimeout(poll, interval);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }
}

export const apiClient = new ApiClient();
