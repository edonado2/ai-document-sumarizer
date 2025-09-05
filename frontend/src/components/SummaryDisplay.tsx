import React from 'react';
import { FileText, Clock, TrendingDown, Lightbulb, Copy, Check } from 'lucide-react';
import type { SummaryResponse, ExtractedText } from '../types';

interface SummaryDisplayProps {
  summary: SummaryResponse;
  extractedText: ExtractedText;
  onCopy: (text: string, type: string) => void;
  copiedItems: { [key: string]: boolean };
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({
  summary,
  extractedText,
  onCopy,
  copiedItems
}) => {
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      onCopy(text, type);
    });
  };

  return (
    <div className="space-y-6">
      {/* Document Info Card */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">{extractedText.fileName}</h3>
              <p className="text-sm text-secondary-600 capitalize">{extractedText.fileType} Document</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-secondary-500">
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  {extractedText.wordCount.toLocaleString()} words
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(summary.processingTime)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-secondary-900">Document Summary</h3>
          <button
            onClick={() => copyToClipboard(summary.summary, 'summary')}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-secondary-600 hover:text-primary-600 transition-colors"
          >
            {copiedItems.summary ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap">
            {summary.summary}
          </p>
        </div>
      </div>

      {/* Key Insights Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-secondary-900">Key Insights</h3>
          <button
            onClick={() => copyToClipboard(summary.keyInsights.join('\n• '), 'insights')}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-secondary-600 hover:text-primary-600 transition-colors"
          >
            {copiedItems.insights ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
        <div className="space-y-3">
          {summary.keyInsights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-secondary-50 rounded-lg">
              <div className="flex-shrink-0 p-1 bg-primary-100 rounded-full">
                <Lightbulb className="h-4 w-4 text-primary-600" />
              </div>
              <p className="text-secondary-700 flex-1">{insight}</p>
              <button
                onClick={() => copyToClipboard(insight, `insight-${index}`)}
                className="flex-shrink-0 p-1 text-secondary-400 hover:text-primary-600 transition-colors"
              >
                {copiedItems[`insight-${index}`] ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Card */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Processing Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <div className="text-2xl font-bold text-secondary-900">
              {summary.wordCount.original.toLocaleString()}
            </div>
            <div className="text-sm text-secondary-600">Original Words</div>
          </div>
          <div className="text-center p-4 bg-secondary-50 rounded-lg">
            <div className="text-2xl font-bold text-secondary-900">
              {summary.wordCount.summary.toLocaleString()}
            </div>
            <div className="text-sm text-secondary-600">Summary Words</div>
          </div>
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-primary-600">
              <TrendingDown className="h-6 w-6" />
              <span>{summary.wordCount.reduction}%</span>
            </div>
            <div className="text-sm text-primary-600">Reduction</div>
          </div>
        </div>
      </div>
    </div>
  );
};


