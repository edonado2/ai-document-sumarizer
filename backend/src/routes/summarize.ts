import express from 'express';
import { AIService } from '../utils/openaiService';
import { SummaryRequest } from '../types';

const router = express.Router();

/**
 * POST /api/summarize
 * Generate summary and key insights from document text
 */
router.post('/', async (req, res) => {
  try {
    const { text, fileName } = req.body;

    // Validate required fields
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Text content is required and must be a string'
      });
    }

    if (!fileName || typeof fileName !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'File name is required and must be a string'
      });
    }

    // Check minimum text length
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 10) {
      return res.status(400).json({
        error: 'Text too short',
        message: 'Text must contain at least 10 words for summarization'
      });
    }

    // Check maximum text length (to prevent API limits)
    if (wordCount > 50000) {
      return res.status(400).json({
        error: 'Text too long',
        message: 'Text must contain less than 50,000 words for processing'
      });
    }

    // Create summary request
    const summaryRequest: SummaryRequest = {
      text: text.trim(),
      fileName: fileName.trim()
    };

    // Initialize AI service and generate summary
    const aiService = new AIService();
    const summaryResponse = await aiService.summarizeDocument(summaryRequest);

    res.json({
      success: true,
      data: summaryResponse,
      message: 'Summary generated successfully'
    });

  } catch (error) {
    console.error('Summarization error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return res.status(500).json({
          error: 'Configuration error',
          message: 'AI provider API key is not configured properly'
        });
      } else if (error.message.includes('quota') || error.message.includes('billing')) {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'AI service quota exceeded. Please try again later.'
        });
      } else if (error.message.includes('rate limit')) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.'
        });
      } else if (error.message.includes('No AI provider')) {
        return res.status(500).json({
          error: 'Configuration error',
          message: 'No AI provider is configured. Please check your environment variables.'
        });
      }
    }

    res.status(500).json({
      error: 'Summarization failed',
      message: error instanceof Error ? error.message : 'Failed to generate summary'
    });
  }
});

/**
 * GET /api/summarize/providers
 * Get information about available AI providers
 */
router.get('/providers', async (req, res) => {
  try {
    const aiService = new AIService();
    const providerInfo = aiService.getProviderInfo();
    
    // Test connection to current provider
    const isConnected = await aiService.testConnection();
    
    res.json({
      currentProvider: providerInfo,
      isConnected,
      availableProviders: [
        {
          name: 'OpenAI',
          model: 'gpt-4o-mini',
          description: 'OpenAI GPT models for text generation'
        },
        {
          name: 'Google Gemini',
          model: 'gemini-2.0-flash',
          description: 'Google Gemini models for text generation'
        }
      ],
      requirements: {
        minWordCount: 10,
        maxWordCount: 50000,
        supportedFormats: ['Plain text extracted from documents']
      }
    });

  } catch (error) {
    console.error('Provider info error:', error);
    res.status(500).json({
      error: 'Failed to get provider information',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/summarize/test
 * Test AI provider connection
 */
router.post('/test', async (req, res) => {
  try {
    const aiService = new AIService();
    const isConnected = await aiService.testConnection();
    const providerInfo = aiService.getProviderInfo();
    
    if (isConnected) {
      res.json({
        success: true,
        message: `${providerInfo.name} connection successful`,
        provider: providerInfo
      });
    } else {
      res.status(503).json({
        success: false,
        message: `${providerInfo.name} connection failed`,
        provider: providerInfo
      });
    }

  } catch (error) {
    console.error('Connection test error:', error);
    res.status(500).json({
      success: false,
      error: 'Connection test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/summarize/health
 * Check summarization service health
 */
router.get('/health', async (req, res) => {
  try {
    const aiService = new AIService();
    const providerInfo = aiService.getProviderInfo();
    const isConnected = await aiService.testConnection();
    
    res.json({
      status: isConnected ? 'OK' : 'ERROR',
      message: isConnected 
        ? `${providerInfo.name} service is running` 
        : `${providerInfo.name} service is unavailable`,
      model: providerInfo.model,
      provider: providerInfo.name
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Service health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/summarize/limits
 * Get processing limits and requirements
 */
router.get('/limits', (req, res) => {
  res.json({
    limits: {
      minWordCount: 10,
      maxWordCount: 50000,
      maxFileSize: '10MB',
      supportedFormats: ['PDF', 'DOCX', 'TXT'],
      processingTimeout: 60000
    },
    requirements: {
      textRequired: true,
      fileNameRequired: true,
      supportedLanguages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese']
    }
  });
});

export { router as summarizeRouter };

