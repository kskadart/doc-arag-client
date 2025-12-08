// API client for backend communication

import {
  AgentQueryResponse,
  ApiError,
  DeleteResponse,
  EmbeddingResponse,
  HealthResponse,
  QueryRequest,
  TaskStatusResponse,
  UploadedFilesListResponse,
  UploadResponse,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = 'An error occurred';
        const contentType = response.headers.get('content-type');

        try {
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || errorMessage;
          } else {
            const text = await response.text();
            if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
              errorMessage = 'Service is unavailable. Please check your connection.';
            } else {
              errorMessage = text || errorMessage;
            }
          }
        } catch {
          errorMessage = 'Service is unavailable. Please check your connection.';
        }

        const error: ApiError = {
          detail: errorMessage,
          status: response.status,
        };
        throw error;
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
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      const contentType = response.headers.get('content-type');

      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } else {
          const text = await response.text();
          if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
            errorMessage = 'Service is unavailable. Please check your connection.';
          } else {
            errorMessage = text || errorMessage;
          }
        }
      } catch {
        errorMessage = 'Service is unavailable. Please check your connection.';
      }

      const error: ApiError = {
        detail: errorMessage,
        status: response.status,
      };
      throw error;
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
