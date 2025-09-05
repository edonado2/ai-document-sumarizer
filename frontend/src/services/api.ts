import axios, { type AxiosResponse } from 'axios';
import type {
  UploadResponse,
  SummarizeResponse,
  SupportedFormatsResponse,
  ProcessingLimitsResponse,
  ExtractedText,
  SummaryResponse
} from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // 60 seconds timeout for large files
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'Server error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('Network error - please check your connection'));
    } else {
      // Something else happened
      return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
    }
  }
);

export class ApiService {
  /**
   * Upload file and extract text
   */
  static async uploadFile(file: File): Promise<ExtractedText> {
    const formData = new FormData();
    formData.append('document', file);

    const response: AxiosResponse<UploadResponse> = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Upload failed');
    }

    return response.data.data;
  }

  /**
   * Generate summary from extracted text
   */
  static async summarizeText(text: string, fileName: string): Promise<SummaryResponse> {
    const response: AxiosResponse<SummarizeResponse> = await api.post('/summarize', {
      text,
      fileName,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Summarization failed');
    }

    return response.data.data;
  }

  /**
   * Get supported file formats
   */
  static async getSupportedFormats(): Promise<SupportedFormatsResponse> {
    const response: AxiosResponse<SupportedFormatsResponse> = await api.get('/upload/supported-formats');
    return response.data;
  }

  /**
   * Get processing limits
   */
  static async getProcessingLimits(): Promise<ProcessingLimitsResponse> {
    const response: AxiosResponse<ProcessingLimitsResponse> = await api.get('/summarize/limits');
    return response.data;
  }

  /**
   * Check API health
   */
  static async checkHealth(): Promise<{ status: string; message: string }> {
    const response = await api.get('/health');
    return response.data;
  }

  /**
   * Check summarization service health
   */
  static async checkSummarizationHealth(): Promise<{ status: string; message: string; model?: string }> {
    const response = await api.get('/summarize/health');
    return response.data;
  }
}

export default api;


