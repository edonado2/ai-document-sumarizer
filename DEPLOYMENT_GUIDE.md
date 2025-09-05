# 🚀 AI Document Summarizer - Render Deployment Guide

This guide will walk you through deploying your AI Document Summarizer app to Render.

## 📋 Prerequisites

1. **GitHub Repository**: Your code must be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **AI API Keys**: You'll need at least one of:
   - OpenAI API Key
   - Google Gemini API Key
   - Anthropic Claude API Key

## 🔧 Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - AI Document Summarizer"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 1.2 Verify File Structure
Your repository should have this structure:
```
ai-document-summarizer/
├── backend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── render.yaml
└── package.json
```

## 🌐 Step 2: Deploy to Render

### 2.1 Create Backend Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the backend service:

**Service Settings:**
- **Name**: `ai-document-summarizer-backend`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install && npm run build`
- **Start Command**: `cd backend && npm start`
- **Plan**: `Free`

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://ai-document-summarizer-frontend.onrender.com
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
CLAUDE_API_KEY=your_claude_api_key_here
```

### 2.2 Create Frontend Service

1. Click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure the frontend service:

**Service Settings:**
- **Name**: `ai-document-summarizer-frontend`
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`
- **Plan**: `Free`

**Environment Variables:**
```
VITE_API_URL=https://ai-document-summarizer-backend.onrender.com/api
```

## 🔑 Step 3: Configure Environment Variables

### 3.1 Backend Environment Variables
In your Render backend service dashboard, add these environment variables:

**Required:**
- `NODE_ENV=production`
- `PORT=10000`
- `CORS_ORIGIN=https://ai-document-summarizer-frontend.onrender.com`

**AI Provider (choose at least one):**
- `OPENAI_API_KEY=sk-your-openai-key`
- `GEMINI_API_KEY=your-gemini-key`
- `CLAUDE_API_KEY=your-claude-key`

### 3.2 Frontend Environment Variables
In your Render frontend service dashboard, add:
- `VITE_API_URL=https://ai-document-summarizer-backend.onrender.com/api`

## 🚀 Step 4: Deploy

1. **Deploy Backend First**: Click "Create Web Service" for the backend
2. **Wait for Backend**: Wait for the backend to deploy successfully
3. **Deploy Frontend**: Click "Create Static Site" for the frontend
4. **Update CORS**: Once frontend is deployed, update the backend's `CORS_ORIGIN` with the actual frontend URL

## 🔍 Step 5: Verify Deployment

### 5.1 Test Backend
Visit: `https://ai-document-summarizer-backend.onrender.com/api/health`

Expected response:
```json
{
  "status": "OK",
  "message": "AI Document Summarizer API is running"
}
```

### 5.2 Test Frontend
Visit: `https://ai-document-summarizer-frontend.onrender.com`

You should see your React application.

### 5.3 Test Full Flow
1. Upload a document
2. Verify text extraction works
3. Generate a summary
4. Verify AI integration works

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `CORS_ORIGIN` in backend matches your frontend URL
2. **API Key Errors**: Verify your AI provider API keys are correctly set
3. **Build Failures**: Check the build logs in Render dashboard
4. **Timeout Issues**: Free tier has limitations, consider upgrading for production

### Debug Steps:

1. Check Render service logs
2. Test API endpoints directly
3. Verify environment variables are set
4. Check network requests in browser dev tools

## 📊 Monitoring

- **Backend Logs**: Available in Render dashboard
- **Frontend Logs**: Check browser console
- **API Health**: Use `/api/health` endpoint
- **Service Status**: Monitor in Render dashboard

## 🔄 Updates

To update your deployment:
1. Push changes to GitHub
2. Render will automatically redeploy
3. Check logs for any issues

## 💰 Cost Considerations

- **Free Tier**: Limited to 750 hours/month per service
- **Paid Plans**: Start at $7/month for always-on services
- **AI API Costs**: Separate from hosting costs

## 🎉 Success!

Once deployed, your AI Document Summarizer will be live at:
- **Frontend**: `https://ai-document-summarizer-frontend.onrender.com`
- **Backend**: `https://ai-document-summarizer-backend.onrender.com`

Your app is now ready for production use! 🚀
