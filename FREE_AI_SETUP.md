# 🆓 Free AI Alternatives Setup Guide

This guide shows you how to set up free AI alternatives to GPT-4 for your document summarizer.

## 🥇 **Recommended: Google Gemini (FREE)**

### Why Gemini?
- ✅ **Completely FREE** with generous limits
- ✅ **High quality** summarization
- ✅ **Easy setup** - just need an API key
- ✅ **No credit card** required

### Setup Steps:

1. **Get API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

2. **Add to Backend**:
   ```bash
   # In backend/.env file
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Test**:
   - Restart your backend server
   - Upload a document to test

### Gemini Limits:
- **Free tier**: 15 requests per minute
- **Daily limit**: 1M tokens per day
- **Perfect for**: Personal use, small projects, testing

---

## 🥈 **Alternative: Ollama (Local)**

### Why Ollama?
- ✅ **100% FREE** - runs on your computer
- ✅ **No internet** required after setup
- ✅ **Privacy** - data stays local
- ✅ **Multiple models** available

### Setup Steps:

1. **Install Ollama**:
   ```bash
   # Windows (PowerShell)
   winget install Ollama.Ollama
   
   # Or download from: https://ollama.ai/download
   ```

2. **Pull a Model**:
   ```bash
   # Llama 2 (recommended)
   ollama pull llama2
   
   # Or Mistral (faster)
   ollama pull mistral
   ```

3. **Test**:
   ```bash
   ollama run llama2 "Summarize this text: Hello world"
   ```

### Ollama Models:
- **llama2**: Best quality, slower
- **mistral**: Good quality, faster
- **codellama**: Good for code documents

---

## 🥉 **Alternative: Hugging Face**

### Why Hugging Face?
- ✅ **Many free models**
- ✅ **Good for specific tasks**
- ✅ **API available**

### Setup Steps:

1. **Get API Key**:
   - Go to [Hugging Face](https://huggingface.co/settings/tokens)
   - Create account and generate token

2. **Add to Backend**:
   ```bash
   # In backend/.env file
   HUGGINGFACE_API_KEY=your_hf_token_here
   ```

---

## 🔧 **Backend Configuration**

The app automatically detects which API keys you have and uses them in priority order:

1. **OpenAI** (if `OPENAI_API_KEY` is set)
2. **Gemini** (if `GEMINI_API_KEY` is set)
3. **Claude** (if `CLAUDE_API_KEY` is set)

### Example .env file:
```env
# Choose one or more (priority order)
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here
CLAUDE_API_KEY=your_claude_key_here

# Server settings
PORT=5000
NODE_ENV=development
```

---

## 📊 **Comparison Table**

| Provider | Cost | Quality | Speed | Setup |
|----------|------|---------|-------|-------|
| **Gemini** | FREE | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Ollama** | FREE | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Hugging Face** | FREE | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **OpenAI** | Paid | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🚀 **Quick Start with Gemini**

1. **Get API Key**: [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Add to .env**: `GEMINI_API_KEY=your_key_here`
3. **Restart backend**: `npm run dev`
4. **Test**: Upload a document!

**That's it!** Your app now uses free AI for document summarization.

---

## 💡 **Tips**

- **Start with Gemini** - easiest free option
- **Use Ollama** if you want complete privacy
- **Combine providers** for redundancy
- **Monitor usage** to stay within limits

## 🆘 **Need Help?**

- Check the console for error messages
- Verify your API key is correct
- Make sure the backend is running
- Test with a simple text file first

---

**Happy summarizing! 🎉**


