import OpenAI from 'openai';
import { SummaryRequest, SummaryResponse } from '../types';
import { AIProvider, getActiveProvider } from '../config/aiProviders';
import { GeminiService } from '../services/geminiService';

/**
 * AI service for document summarization with multiple provider support
 */
export class AIService {
  private provider: AIProvider;
  private openai?: OpenAI;
  private gemini?: GeminiService;

  constructor() {
    this.provider = getActiveProvider();
    
    if (this.provider.name === 'OpenAI') {
      this.openai = new OpenAI({
        apiKey: this.provider.apiKey,
      });
    } else if (this.provider.name === 'Google Gemini') {
      this.gemini = new GeminiService(this.provider);
    }
  }

  /**
   * Generate summary and key insights from document text
   */
  async summarizeDocument(request: SummaryRequest): Promise<SummaryResponse> {
    try {
      if (this.provider.name === 'OpenAI' && this.openai) {
        return await this.summarizeWithOpenAI(request);
      } else if (this.provider.name === 'Google Gemini' && this.gemini) {
        return await this.gemini.summarizeDocument(request);
      } else {
        throw new Error(`Unsupported AI provider: ${this.provider.name}`);
      }
    } catch (error) {
      console.error(`${this.provider.name} API error:`, error);
      throw error;
    }
  }

  private async summarizeWithOpenAI(request: SummaryRequest): Promise<SummaryResponse> {
    const startTime = Date.now();

    try {
      // Prepare the prompt for summarization
      const prompt = this.createSummarizationPrompt(request.text, request.fileName);

      // Call OpenAI API
      const completion = await this.openai!.chat.completions.create({
        model: this.provider.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert document summarizer. Provide clear, concise summaries and actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.provider.maxTokens,
        temperature: this.provider.temperature,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response received from OpenAI');
      }

      // Parse the response to extract summary and insights
      const parsedResponse = this.parseOpenAIResponse(response);
      
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
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('Invalid OpenAI API key. Please check your configuration.');
        } else if (error.message.includes('quota')) {
          throw new Error('OpenAI API quota exceeded. Please check your billing.');
        } else if (error.message.includes('rate limit')) {
          throw new Error('OpenAI API rate limit exceeded. Please try again later.');
        }
      }
      
      throw new Error(`Failed to generate summary with OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a structured prompt for document summarization
   */
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

  /**
   * Parse OpenAI response to extract summary and insights
   */
  private parseOpenAIResponse(response: string): { summary: string; keyInsights: string[] } {
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
      console.error('Error parsing OpenAI response:', error);
      return {
        summary: response.substring(0, 500) + (response.length > 500 ? '...' : ''),
        keyInsights: ['Response parsing failed - see summary for details']
      };
    }
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Test AI provider connection
   */
  async testConnection(): Promise<boolean> {
    try {
      if (this.provider.name === 'OpenAI' && this.openai) {
        await this.openai.models.list();
        return true;
      } else if (this.provider.name === 'Google Gemini' && this.gemini) {
        return await this.gemini.testConnection();
      }
      return false;
    } catch (error) {
      console.error(`${this.provider.name} connection test failed:`, error);
      return false;
    }
  }

  /**
   * Get current provider information
   */
  getProviderInfo(): { name: string; model: string } {
    return {
      name: this.provider.name,
      model: this.provider.model
    };
  }
}

// Export for backward compatibility
export { AIService as OpenAIService };
