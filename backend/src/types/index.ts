export interface ExtractedText {
  text: string;
  fileName: string;
  fileType: string;
  wordCount: number;
}

export interface SummaryRequest {
  text: string;
  fileName: string;
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

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

