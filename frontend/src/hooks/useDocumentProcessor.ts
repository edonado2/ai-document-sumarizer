import { useState, useCallback } from 'react';
import { ApiService } from '../services/api';
import type { ExtractedText, SummaryResponse, ProcessingState } from '../types';

export const useDocumentProcessor = () => {
  const [processingState, setProcessingState] = useState<ProcessingState>({
    step: 'idle',
    progress: 0,
    message: ''
  });
  
  const [extractedText, setExtractedText] = useState<ExtractedText | null>(null);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateState = useCallback((step: ProcessingState['step'], message: string, progress: number = 0) => {
    setProcessingState({ step, progress, message });
  }, []);

  const processDocument = useCallback(async (file: File) => {
    try {
      setError(null);
      setSummary(null);
      setExtractedText(null);

      // Step 1: Upload and extract text
      updateState('uploading', 'Uploading your document...', 20);
      const extracted = await ApiService.uploadFile(file);
      setExtractedText(extracted);
      updateState('extracting', 'Text extracted successfully!', 50);

      // Step 2: Generate summary
      updateState('summarizing', 'Generating AI summary...', 70);
      const summaryResult = await ApiService.summarizeText(extracted.text, extracted.fileName);
      setSummary(summaryResult);
      updateState('complete', 'Summary generated successfully!', 100);

      return { extracted, summary: summaryResult };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      updateState('error', errorMessage);
      throw err;
    }
  }, [updateState]);

  const reset = useCallback(() => {
    setProcessingState({ step: 'idle', progress: 0, message: '' });
    setExtractedText(null);
    setSummary(null);
    setError(null);
  }, []);

  const isProcessing = processingState.step !== 'idle' && processingState.step !== 'complete' && processingState.step !== 'error';
  const isComplete = processingState.step === 'complete';
  const hasError = processingState.step === 'error';

  return {
    processingState,
    extractedText,
    summary,
    error,
    isProcessing,
    isComplete,
    hasError,
    processDocument,
    reset,
    setExtractedText,
    setSummary,
    setError
  };
};
