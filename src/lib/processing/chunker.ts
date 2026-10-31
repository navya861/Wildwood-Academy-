export interface ChunkData {
  chunk_index: number;
  chunk_text: string;
  page_number?: number;
  section_title?: string;
}

export function chunkText(
  fullText: string,
  options?: {
    chunkSize?: number;
    overlap?: number;
    totalPages?: number;
  }
): ChunkData[] {
  const chunkSize = options?.chunkSize || 1200;
  const overlap = options?.overlap || 200;
  const totalPages = options?.totalPages || 1;

  const paragraphs = fullText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const chunks: ChunkData[] = [];

  let currentChunk = '';
  let currentSection = 'General Overview';
  let chunkIndex = 0;
  const totalChars = fullText.length;

  for (const para of paragraphs) {
    // Detect headings
    if (para.length < 80 && /^(#|Chapter|Section|[0-9]+\.|[A-Z\s]{4,})/i.test(para)) {
      currentSection = para.replace(/^#+\s*/, '').trim();
    }

    if ((currentChunk.length + para.length) > chunkSize && currentChunk.length > 0) {
      // Calculate estimated page based on progress through text
      const progressRatio = (chunks.length * chunkSize) / Math.max(1, totalChars);
      const estPage = Math.min(totalPages, Math.max(1, Math.round(progressRatio * totalPages)));

      chunks.push({
        chunk_index: chunkIndex++,
        chunk_text: currentChunk.trim(),
        page_number: estPage,
        section_title: currentSection,
      });

      // Keep overlap from end of currentChunk
      const sliceStart = Math.max(0, currentChunk.length - overlap);
      currentChunk = currentChunk.slice(sliceStart) + '\n\n' + para;
    } else {
      currentChunk = currentChunk ? currentChunk + '\n\n' + para : para;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      chunk_index: chunkIndex++,
      chunk_text: currentChunk.trim(),
      page_number: totalPages,
      section_title: currentSection,
    });
  }

  return chunks;
}
