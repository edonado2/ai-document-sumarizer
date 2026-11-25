# AI-Powered Document Summarizer

A TypeScript web app that summarizes uploaded PDF, DOCX and text files with Gemini, OpenAI or Claude.

![AI Document Summarizer](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-18+-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-green)


## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Business Value](#-business-value)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Functionality
- **Multi-Format Support**: Upload PDF, Word (.docx), and text files
- **AI-Powered Summarization**: Gemini, OpenAI or Claude generates the summary
- **Key Insights Extraction**: Automatically generates 3-5 actionable insights
- **Real-time Processing**: Live progress tracking with detailed status updates
- **Secure File Handling**: Temporary file processing with automatic cleanup

### User Experience
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional interface built with TailwindCSS
- **Copy to Clipboard**: Easy sharing of summaries and insights
- **Error Handling**: Comprehensive error messages and retry functionality

### Technical Excellence
- **TypeScript**: Full type safety across frontend and backend
- **Modular Architecture**: Clean separation of concerns and reusable components
- **API-First Design**: RESTful API with comprehensive error handling
- **Performance Optimized**: Efficient file processing and memory management
- **Environment configuration**: documented variables for each provider

## 🛠 Tech Stack

### Frontend
- **React 18+** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for modern, responsive styling
- **Axios** for HTTP client
- **React Dropzone** for file upload handling
- **Lucide React** for beautiful icons

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **AI providers**: Gemini 2.0 Flash, OpenAI gpt-4o-mini, optional Claude
- **Multer** for file upload handling
- **PDF-Parse** for PDF text extraction
- **Mammoth** for Word document processing

### Development & Deployment
- **ESLint** for code quality
- **PostCSS** for CSS processing
- **Environment Variables** for configuration
- **Docker** support (optional)

## 💼 Business Value

### For Legal Professionals
- **Contract Analysis**: Quickly summarize lengthy legal documents and contracts
- **Case Research**: Extract key points from legal briefs and case studies
- **Due Diligence**: Process multiple documents efficiently during mergers and acquisitions
- **Time Savings**: Reduce document review time by up to 80%

### For Educational Institutions
- **Research Papers**: Summarize academic papers and research documents
- **Student Submissions**: Quickly review and provide feedback on lengthy assignments
- **Curriculum Development**: Process educational materials and textbooks
- **Administrative Documents**: Handle policy documents and administrative reports

### For Business & Research
- **Market Research**: Analyze industry reports and market studies
- **Financial Reports**: Extract key insights from quarterly and annual reports
- **Technical Documentation**: Summarize complex technical manuals and specifications
- **Competitive Analysis**: Process competitor documents and industry analysis

### ROI Benefits
- **Time Efficiency**: Process documents 10x faster than manual review
- **Cost Reduction**: Reduce labor costs for document analysis tasks
- **Accuracy**: AI-powered analysis reduces human error
- **Scalability**: Handle multiple documents simultaneously
- **Accessibility**: Make complex documents accessible to non-experts

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-document-summarizer.git
   cd ai-document-summarizer
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Backend configuration
   cd backend
   cp env.example .env
   # Edit .env with your OpenAI API key
   
   # Frontend configuration
   cd ../frontend
   cp env.example .env
   # Edit .env with your API URL
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## ⚙️ Configuration

### Backend Environment Variables
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### Frontend Environment Variables
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=AI Document Summarizer
VITE_APP_VERSION=1.0.0
```

### OpenAI API Setup
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and generate an API key
3. Add credits to your account (minimum $5 recommended)
4. Copy your API key to the backend `.env` file

## 📖 Usage

### Basic Workflow
1. **Upload Document**: Drag and drop or click to select a PDF, Word, or text file
2. **Text Extraction**: The system automatically extracts text from your document
3. **AI Processing**: Gemini or OpenAI generates the summary
4. **View Results**: Review the summary and key insights
5. **Copy & Share**: Use the copy buttons to share results

### Supported File Types
- **PDF**: Portable Document Format files
- **DOCX**: Microsoft Word documents
- **TXT**: Plain text files

### File Limits
- **Maximum Size**: 10MB per file
- **Minimum Words**: 10 words for processing
- **Maximum Words**: 50,000 words for optimal performance

## 📚 API Documentation

### Upload Endpoint
```http
POST /api/upload
Content-Type: multipart/form-data

Body: FormData with 'document' field
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Extracted text content...",
    "fileName": "document.pdf",
    "fileType": "pdf",
    "wordCount": 1500
  },
  "message": "Text extracted successfully"
}
```

### Summarize Endpoint
```http
POST /api/summarize
Content-Type: application/json

{
  "text": "Document text content...",
  "fileName": "document.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Comprehensive summary...",
    "keyInsights": [
      "Key insight 1",
      "Key insight 2",
      "Key insight 3"
    ],
    "wordCount": {
      "original": 1500,
      "summary": 200,
      "reduction": 87
    },
    "processingTime": 2500
  },
  "message": "Summary generated successfully"
}
```

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "AI Document Summarizer API is running"
}
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production database (if needed)
- Set up SSL certificates
- Configure reverse proxy (nginx/Apache)

### Docker Deployment (Optional)
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Cloud Deployment Options
- **Vercel**: Frontend deployment
- **Railway**: Full-stack deployment
- **AWS**: EC2 + S3 + CloudFront
- **Google Cloud**: App Engine + Cloud Storage
- **Azure**: App Service + Blob Storage

## 🔧 Development

### Project Structure
```
ai-document-summarizer/
├── backend/
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   └── index.ts         # Main server file
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom hooks
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main app component
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

### Available Scripts
```bash
# Backend
npm run dev          # Development server
npm run build        # Build for production
npm run start        # Start production server

# Frontend
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting (recommended)
- **Git Hooks**: Pre-commit validation (optional)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues
- **API Key Error**: Ensure your OpenAI API key is valid and has credits
- **File Upload Fails**: Check file size (max 10MB) and format
- **CORS Issues**: Verify frontend and backend URLs match
- **Build Errors**: Ensure all dependencies are installed

### Getting Help
- 📧 Email: support@yourdomain.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ai-document-summarizer/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/ai-document-summarizer/wiki)

## 🌟 Acknowledgments

- Gemini, OpenAI and Claude for the summarization models
- React and Vite teams for excellent developer tools
- TailwindCSS for beautiful, utility-first CSS
- All contributors and users who provide feedback

---

**Built with ❤️ for the developer community**

*Ready to transform your document processing workflow? [Get started today!](#-installation)*


