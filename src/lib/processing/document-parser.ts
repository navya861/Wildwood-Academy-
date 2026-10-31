import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';

export interface ExtractedDocumentResult {
  text: string;
  pageCount?: number;
  wordCount: number;
  ocrApplied?: boolean;
}

export async function parseDocumentBuffer(
  buffer: Buffer,
  fileType: string,
  filename: string
): Promise<ExtractedDocumentResult> {
  const mime = fileType.toLowerCase();
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  // 1. Plain Text and Markdown
  if (mime.includes('text') || ext === 'txt' || ext === 'md' || ext === 'markdown') {
    const text = buffer.toString('utf-8').trim();
    if (!text) throw new Error('The uploaded text file is empty.');
    return {
      text,
      pageCount: 1,
      wordCount: text.split(/\s+/).filter(Boolean).length,
      ocrApplied: false,
    };
  }

  // 2. PDF Documents
  if (mime.includes('pdf') || ext === 'pdf') {
    try {
      // Dynamic import / require of pdf-parse to handle node runtime
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer);
      const text = (data.text || '').trim();

      if (!text) {
        throw new Error('No readable text could be extracted from this PDF. It may be a scanned image without a text layer.');
      }

      return {
        text,
        pageCount: data.numpages || 1,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        ocrApplied: false,
      };
    } catch (err: any) {
      throw new Error(`Failed to parse PDF document: ${err.message || 'Corrupt or unsupported PDF format'}`);
    }
  }

  // 3. Word Documents (.docx)
  if (
    mime.includes('wordprocessingml') ||
    mime.includes('msword') ||
    ext === 'docx'
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = (result.value || '').trim();

      if (!text) {
        throw new Error('The DOCX document contains no readable text.');
      }

      return {
        text,
        pageCount: Math.ceil(text.length / 2500) || 1,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        ocrApplied: false,
      };
    } catch (err: any) {
      throw new Error(`Failed to parse DOCX document: ${err.message || 'Invalid Word document format'}`);
    }
  }

  // 4. Images (OCR Optical Character Recognition for scans and handwritten notes)
  if (mime.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'bmp'].includes(ext)) {
    try {
      const worker = await createWorker('eng');
      const ret = await worker.recognize(buffer);
      await worker.terminate();

      const text = (ret.data.text || '').trim();
      if (!text) {
        throw new Error('OCR completed, but no legible text was recognized in this image.');
      }

      return {
        text,
        pageCount: 1,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        ocrApplied: true,
      };
    } catch (err: any) {
      throw new Error(`Image OCR recognition failed: ${err.message || 'Image unreadable'}`);
    }
  }

  throw new Error(`Unsupported document format (.${ext}). Wildwood Academy supports PDF, DOCX, TXT, Markdown, and PNG/JPEG/WebP images.`);
}
