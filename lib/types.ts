// TypeScript types mirroring backend Pydantic models

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface UploadResponse {
  file_id: string;
  filename: string;
  status: string;
  message: string;
}

export interface ScrapeRequest {
  url: string;
  extract_links?: boolean;
}

export interface ScrapeResponse {
  file_id: string;
  url: string;
  status: string;
  message: string;
}

export interface QueryRequest {
  query: string;
  domain?: string;
  max_iterations?: number;
}

export interface AgentQueryResponse {
  query: string;
  answer: string;
  rephrased_query: string | null;
  confidence: number;
  iterations: number;
  sources_used: number;
}

export interface EmbeddingResponse {
  task_id: string;
  file_id: string;
  status: string;
  message: string;
  chunks_processed?: number;
  parsed_chunks?: Array<{
    content: string;
    page: number;
  }>;
}

export interface Source {
  file_id: string;
  content: string;
  score: number;
  source_type: string;
  chunk_index: number;
}

export interface VectorSearchResult {
  uuid: string;
  document_name: string;
  page: number;
  content: string;
  date_created: string;
  similarity_score: number;
}

export interface QueryResponse {
  query: string;
  domain: string;
  results: VectorSearchResult[];
  total_results: number;
}

export interface DocumentResponse {
  file_id: string;
  filename: string;
  source_type: string;
  size_bytes: number;
  created_at: string;
  chunks_count: number;
}

export interface UploadedFileResponse {
  file_id: string;
  object_key: string;
  filename: string;
  size_bytes: number;
  content_type: string;
  last_modified: string;
  metadata: Record<string, string>;
}

export interface UploadedFilesListResponse {
  files: UploadedFileResponse[];
  total: number;
  page: number;
  page_size: number;
}

export interface DeleteResponse {
  file_id: string;
  status: string;
  message: string;
}

export interface TaskStatusResponse {
  task_id: string;
  status: string;
  file_id: string | null;
  message: string;
  chunks_processed: number;
  total_chunks: number;
  created_at: string;
  completed_at: string | null;
}

// Frontend-specific types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  sources_used?: number;
  rephrased_query?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: Date;
  updated_at: Date;
}

export interface ApiError {
  detail: string;
  status: number;
}
