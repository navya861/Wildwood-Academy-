import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';
import JSZip from 'jszip';
import { SlideData } from '../types';

export interface ExtractedDocumentResult {
  text: string;
  pageCount?: number;
  wordCount: number;
  ocrApplied?: boolean;
  slides?: SlideData[];
}

/**
 * Extracts text and speaker notes from modern OpenXML PowerPoint presentations (.pptx)
 */
async function parsePptxBuffer(buffer: Buffer): Promise<ExtractedDocumentResult> {
  const zip = await JSZip.loadAsync(buffer);

  // Find all slide files
  const slideFiles = Object.keys(zip.files).filter(name =>
    /^ppt\/slides\/slide\d+\.xml$/i.test(name)
  );

  if (slideFiles.length === 0) {
    throw new Error('The PPTX file contains no recognizable slides.');
  }

  // Sort slides in natural numerical order (slide1, slide2, slide10, etc.)
  slideFiles.sort((a, b) => {
    const numA = parseInt(a.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
    const numB = parseInt(b.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
    return numA - numB;
  });

  const slideTexts: string[] = [];
  const structuredSlides: SlideData[] = [];

  for (let i = 0; i < slideFiles.length; i++) {
    const filename = slideFiles[i];
    const xml = await zip.file(filename)!.async('string');

    // Extract text runs inside <a:t>...</a:t> grouped by paragraphs <a:p>
    const paraRegex = /<a:p[\s>]([\s\S]*?)<\/a:p>/gi;
    const paragraphs: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = paraRegex.exec(xml)) !== null) {
      const paraContent = match[1];
      const textMatches = paraContent.match(/<a:t[\s>]([^<]*)<\/a:t>/gi) || [];
      const textLine = textMatches
        .map(t => t.replace(/<[^>]+>/g, '').trim())
        .filter(Boolean)
        .join(' ');

      if (textLine) {
        paragraphs.push(textLine);
      }
    }

    // Check for optional speaker notes in ppt/notesSlides/notesSlide{N}.xml
    let noteText = '';
    const noteZipEntry = zip.file(new RegExp(`ppt/notesSlides/notesSlide${i + 1}\\.xml$`, 'i'))[0];
    if (noteZipEntry) {
      const noteXml = await noteZipEntry.async('string');
      const noteMatches = noteXml.match(/<a:t[\s>]([^<]*)<\/a:t>/gi) || [];
      noteText = noteMatches
        .map(t => t.replace(/<[^>]+>/g, '').trim())
        .filter(Boolean)
        .join(' ');
    }

    const slideTitle = paragraphs[0] || `Slide ${i + 1}`;
    const body = paragraphs.length > 1 ? paragraphs.slice(1).join('\n') : paragraphs.join('\n');
    const notesStr = noteText ? `\n*Speaker Notes:* ${noteText}` : '';
    const rawSlideText = `### Slide ${i + 1}: ${slideTitle}\n${body}${notesStr}`;

    slideTexts.push(rawSlideText);
    structuredSlides.push({
      slideNumber: i + 1,
      title: slideTitle.replace(/^###\s*Slide\s*\d+:?\s*/i, '').trim() || `Slide ${i + 1}`,
      content: paragraphs.length > 0 ? paragraphs : ['(Visual slide)'],
      notes: noteText || undefined,
      rawText: rawSlideText,
    });
  }

  const fullText = slideTexts.join('\n\n').trim();
  if (!fullText) {
    throw new Error('No readable text could be extracted from this PowerPoint presentation.');
  }

  return {
    text: fullText,
    pageCount: slideFiles.length,
    wordCount: fullText.split(/\s+/).filter(Boolean).length,
    ocrApplied: false,
    slides: structuredSlides,
  };
}

/**
 * Extracts text from legacy binary PowerPoint presentations (.ppt, PowerPoint 97-2003)
 */
function parsePptBinaryBuffer(buffer: Buffer): ExtractedDocumentResult {
  const strings: string[] = [];

  // Scan binary records for TextCharsAtom (0x0FA0) and TextBytesAtom (0x0FA8)
  for (let i = 0; i < buffer.length - 8; i++) {
    const recType = buffer.readUInt16LE(i + 2);
    const recLen = buffer.readUInt32LE(i + 4);

    // TextBytesAtom (ASCII 8-bit text)
    if (recType === 0x0FA8 && recLen > 0 && recLen < 200000 && i + 8 + recLen <= buffer.length) {
      const text = buffer.toString('utf8', i + 8, i + 8 + recLen).trim();
      if (text.length > 2 && /^[\x20-\x7E\s\r\n\t]+$/.test(text)) {
        strings.push(text);
      }
    }
    // TextCharsAtom (UTF-16LE 16-bit text)
    else if (recType === 0x0FA0 && recLen > 0 && recLen < 400000 && i + 8 + recLen <= buffer.length) {
      const text = buffer.toString('utf16le', i + 8, i + 8 + recLen).trim();
      if (text.length > 2 && !/[\u0000-\u0008\u000E-\u001F]/.test(text)) {
        strings.push(text);
      }
    }
  }

  // Fallback: extract contiguous printable text blocks
  if (strings.length === 0) {
    const utf8Str = buffer.toString('utf8');
    const matches = utf8Str.match(/[\x20-\x7E]{6,}/g) || [];
    const filtered = matches.filter(s =>
      !/^[0-9a-f]{8,}$/i.test(s) &&
      !s.includes('Microsoft') &&
      !s.includes('PowerPoint') &&
      !s.includes('Current User')
    );
    strings.push(...filtered);
  }

  // Deduplicate and assemble
  const uniqueStrings = Array.from(new Set(strings)).filter(s => s.length > 2);
  if (uniqueStrings.length === 0) {
    throw new Error('No readable text could be extracted from this binary PowerPoint (.ppt) document.');
  }

  // Group into slides
  const slides: string[] = [];
  const structuredSlides: SlideData[] = [];
  let currentSlide = 1;
  for (let i = 0; i < uniqueStrings.length; i += 3) {
    const groupLines = uniqueStrings.slice(i, i + 3);
    const group = groupLines.join('\n\n');
    const slideTitle = groupLines[0] || `Slide ${currentSlide}`;
    const rawSlideText = `### Slide ${currentSlide}: ${slideTitle}\n${group}`;
    slides.push(rawSlideText);
    structuredSlides.push({
      slideNumber: currentSlide++,
      title: slideTitle.replace(/^###\s*Slide\s*\d+:?\s*/i, '').trim(),
      content: groupLines,
      rawText: rawSlideText,
    });
  }

  const fullText = slides.join('\n\n').trim();

  return {
    text: fullText,
    pageCount: slides.length || 1,
    wordCount: fullText.split(/\s+/).filter(Boolean).length,
    ocrApplied: false,
    slides: structuredSlides,
  };
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

  // 4. PowerPoint Presentations (.pptx and .ppt)
  if (
    mime.includes('presentationml') ||
    mime.includes('powerpoint') ||
    ext === 'pptx' ||
    ext === 'ppt'
  ) {
    try {
      // Check if it's modern OpenXML PPTX (ZIP container)
      const isZip = buffer.length > 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;
      if (ext === 'pptx' || isZip) {
        return await parsePptxBuffer(buffer);
      } else {
        // Legacy binary PowerPoint (.ppt)
        return parsePptBinaryBuffer(buffer);
      }
    } catch (err: any) {
      throw new Error(`Failed to parse PowerPoint presentation: ${err.message || 'Unsupported presentation format'}`);
    }
  }

  // 5. Images (OCR Optical Character Recognition for scans and handwritten notes)
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

  throw new Error(`Unsupported document format (.${ext}). Wildwood Academy supports PDF, DOCX, PPT/PPTX presentations, TXT, Markdown, and PNG/JPEG/WebP images.`);
}
