export interface ExtractedText {
  text: string;
  fileName: string;
  fileType: string;
  wordCount: number;
}

export interface SummaryResponse {
  summary: string;
  keyInsights: string[];
  wordCount: {
    original: number;
    summary: number;
    reduction: number;
  };
  processingTime: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  data: ExtractedText;
  message: string;
}

export interface SummarizeResponse {
  success: boolean;
  data: SummaryResponse;
  message: string;
}

export interface SupportedFormat {
  type: string;
  mimeType: string;
  extension: string;
  description: string;
}

export interface SupportedFormatsResponse {
  supportedFormats: SupportedFormat[];
  maxFileSize: string;
  minWordCount: number;
}

export interface ProcessingLimits {
  minWords: number;
  maxWords: number;
  maxFileSize: string;
  supportedFormats: string[];
}

export interface ProcessingLimitsResponse {
  limits: ProcessingLimits;
  features: {
    summary: boolean;
    keyInsights: boolean;
    wordCountAnalysis: boolean;
    processingTime: boolean;
  };
}

export type ProcessingStep = 'idle' | 'uploading' | 'extracting' | 'summarizing' | 'complete' | 'error';

export interface ProcessingState {
  step: ProcessingStep;
  progress: number;
  message: string;
  error?: string;
}


