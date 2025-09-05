import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { TextExtractor } from '../utils/textExtractor';
import { ExtractedText } from '../types';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (TextExtractor.isValidFileType(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'));
    }
  }
});

/**
 * POST /api/upload
 * Upload and extract text from document
 */
router.post('/', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a document to upload'
      });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    // Check file size
    const fileSizeMB = TextExtractor.getFileSizeInMB(filePath);
    if (fileSizeMB > 10) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: 'File too large',
        message: 'File size must be less than 10MB'
      });
    }

    // Extract text from the uploaded file
    const extractedData: ExtractedText = await TextExtractor.extractText(filePath, fileName, mimeType);

    // Clean up uploaded file after extraction
    fs.unlinkSync(filePath);

    // Check if text extraction was successful
    if (!extractedData.text || extractedData.text.trim().length === 0) {
      return res.status(400).json({
        error: 'No text found',
        message: 'The uploaded document appears to be empty or contains no readable text'
      });
    }

    // Check minimum word count
    if (extractedData.wordCount < 10) {
      return res.status(400).json({
        error: 'Document too short',
        message: 'Document must contain at least 10 words for summarization'
      });
    }

    res.json({
      success: true,
      data: extractedData,
      message: 'Text extracted successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Failed to process uploaded file'
    });
  }
});

/**
 * GET /api/upload/supported-formats
 * Get list of supported file formats
 */
router.get('/supported-formats', (req, res) => {
  res.json({
    supportedFormats: [
      {
        type: 'PDF',
        mimeType: 'application/pdf',
        extension: '.pdf',
        description: 'Portable Document Format'
      },
      {
        type: 'DOCX',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extension: '.docx',
        description: 'Microsoft Word Document'
      },
      {
        type: 'TXT',
        mimeType: 'text/plain',
        extension: '.txt',
        description: 'Plain Text File'
      }
    ],
    maxFileSize: '10MB',
    minWordCount: 10
  });
});

export { router as uploadRouter };

