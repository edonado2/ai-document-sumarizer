import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { ExtractedText } from '../types';

/**
 * Extract text from various file formats
 */
export class TextExtractor {
  /**
   * Extract text from uploaded file based on file type
   */
  static async extractText(filePath: string, fileName: string, mimeType: string): Promise<ExtractedText> {
    try {
      let text: string = '';
      const fileType = this.getFileType(mimeType);

      switch (fileType) {
        case 'pdf':
          text = await this.extractFromPDF(filePath);
          break;
        case 'docx':
          text = await this.extractFromDocx(filePath);
          break;
        case 'txt':
          text = await this.extractFromTxt(filePath);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      // Clean up the extracted text
      text = this.cleanText(text);
      const wordCount = this.countWords(text);

      return {
        text,
        fileName,
        fileType,
        wordCount
      };
    } catch (error) {
      throw new Error(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract text from PDF file
   */
  private static async extractFromPDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  /**
   * Extract text from DOCX file
   */
  private static async extractFromDocx(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  /**
   * Extract text from TXT file
   */
  private static async extractFromTxt(filePath: string): Promise<string> {
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Get file type from MIME type
   */
  private static getFileType(mimeType: string): string {
    const mimeToType: { [key: string]: string } = {
      'application/pdf': 'pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'text/plain': 'txt'
    };
    
    return mimeToType[mimeType] || 'unknown';
  }

  /**
   * Clean and normalize extracted text
   */
  private static cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Replace multiple whitespaces with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();
  }

  /**
   * Count words in text
   */
  private static countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Validate file type
   */
  static isValidFileType(mimeType: string): boolean {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    return validTypes.includes(mimeType);
  }

  /**
   * Get file size in MB
   */
  static getFileSizeInMB(filePath: string): number {
    const stats = fs.statSync(filePath);
    return stats.size / (1024 * 1024);
  }
}

