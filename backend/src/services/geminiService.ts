import { AIProvider } from '../config/aiProviders';
import { SummaryRequest, SummaryResponse } from '../types';

interface GeminiErrorResponse {
  error?: {
    message?: string;
  };
}

interface GeminiContent {
  parts: Array<{
    text: string;
  }>;
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

export class GeminiService {
  private provider: AIProvider;

  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  async summarizeDocument(request: SummaryRequest): Promise<SummaryResponse> {
    const startTime = Date.now();

    try {
      const prompt = this.createSummarizationPrompt(request.text, request.fileName);
      
      const response = await fetch(`${this.provider.baseUrl}/models/${this.provider.model}:generateContent?key=${this.provider.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: this.provider.temperature,
            maxOutputTokens: this.provider.maxTokens,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json() as GeminiErrorResponse;
        throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json() as GeminiResponse;
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No response received from Gemini');
      }

      const parsedResponse = this.parseGeminiResponse(generatedText);
      const processingTime = Date.now() - startTime;
      const originalWordCount = this.countWords(request.text);
      const summaryWordCount = this.countWords(parsedResponse.summary);
      const reduction = Math.round(((originalWordCount - summaryWordCount) / originalWordCount) * 100);

      return {
        summary: parsedResponse.summary,
        keyInsights: parsedResponse.keyInsights,
        wordCount: {
          original: originalWordCount,
          summary: summaryWordCount,
          reduction
        },
        processingTime
      };

    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Failed to generate summary with Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private createSummarizationPrompt(text: string, fileName: string): string {
    return `
Please analyze and summarize the following document: "${fileName}"

Document content:
${text}

Please provide your response in the following JSON format:
{
  "summary": "A comprehensive summary of the document (2-3 paragraphs, 150-300 words)",
  "keyInsights": [
    "Key insight 1 (actionable and specific)",
    "Key insight 2 (actionable and specific)", 
    "Key insight 3 (actionable and specific)",
    "Key insight 4 (actionable and specific)",
    "Key insight 5 (actionable and specific)"
  ]
}

Guidelines:
- The summary should capture the main points, arguments, and conclusions
- Key insights should be specific, actionable, and directly derived from the content
- Focus on the most important information that would be valuable to someone who needs to understand the document quickly
- Maintain the original meaning and context
- Use clear, professional language
- Each insight should be a complete, standalone statement

Please respond with valid JSON only, no additional text.
    `.trim();
  }

  private parseGeminiResponse(response: string): { summary: string; keyInsights: string[] } {
    try {
      // Try to parse as JSON first
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || 'No summary provided',
          keyInsights: Array.isArray(parsed.keyInsights) ? parsed.keyInsights : []
        };
      }

      // Fallback: try to extract summary and insights from text format
      const lines = response.split('\n').map(line => line.trim()).filter(line => line);
      
      let summary = '';
      const keyInsights: string[] = [];
      let inInsights = false;

      for (const line of lines) {
        if (line.toLowerCase().includes('summary') || line.toLowerCase().includes('overview')) {
          inInsights = false;
          continue;
        }
        
        if (line.toLowerCase().includes('insight') || line.toLowerCase().includes('key point')) {
          inInsights = true;
          continue;
        }

        if (inInsights && (line.startsWith('-') || line.startsWith('•') || line.match(/^\d+\./))) {
          keyInsights.push(line.replace(/^[-•\d.\s]+/, '').trim());
        } else if (!inInsights && line.length > 20) {
          summary += line + ' ';
        }
      }

      return {
        summary: summary.trim() || 'Summary could not be extracted',
        keyInsights: keyInsights.length > 0 ? keyInsights : ['No specific insights could be extracted']
      };

    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return {
        summary: response.substring(0, 500) + (response.length > 500 ? '...' : ''),
        keyInsights: ['Response parsing failed - see summary for details']
      };
    }
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.provider.baseUrl}/models?key=${this.provider.apiKey}`);
      return response.ok;
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }
}
