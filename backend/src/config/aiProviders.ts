export interface AIProvider {
  name: string;
  model: string;
  apiKey: string;
  baseUrl?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIProviders {
  openai: AIProvider;
  gemini: AIProvider;
  claude?: AIProvider;
}

export const getAIProviders = (): AIProviders => {
  return {
    openai: {
      name: 'OpenAI',
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      apiKey: process.env.OPENAI_API_KEY || '',
      maxTokens: 1000,
      temperature: 0.3
    },
    gemini: {
      name: 'Google Gemini',
      model: 'gemini-2.0-flash',
      apiKey: process.env.GEMINI_API_KEY || '',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      maxTokens: 1000,
      temperature: 0.3
    },
    claude: process.env.CLAUDE_API_KEY ? {
      name: 'Anthropic Claude',
      model: 'claude-3-haiku-20240307',
      apiKey: process.env.CLAUDE_API_KEY,
      maxTokens: 1000,
      temperature: 0.3
    } : undefined
  };
};

export const getActiveProvider = (): AIProvider => {
  const providers = getAIProviders();
  
  // Priority order: Gemini > OpenAI > Claude
  if (providers.gemini.apiKey) {
    return providers.gemini;
  } else if (providers.openai.apiKey) {
    return providers.openai;
  } else if (providers.claude?.apiKey) {
    return providers.claude;
  }
  
  throw new Error('No AI provider API key configured. Please add OPENAI_API_KEY, GEMINI_API_KEY, or CLAUDE_API_KEY to your environment variables.');
};


