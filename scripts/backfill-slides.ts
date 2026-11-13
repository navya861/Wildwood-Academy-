import fs from 'fs';
import path from 'path';
import { readDb, writeDb } from '../src/lib/db/local-db';
import { parseDocumentBuffer } from '../src/lib/processing/document-parser';

async function main() {
  const db = readDb();
  let updatedCount = 0;

  for (const m of db.study_materials) {
    if (m.storage_path) {
      const fullPath = path.resolve(process.cwd(), 'storage/uploads', m.storage_path);
      if (fs.existsSync(fullPath)) {
        console.log(`Processing material "${m.title}" (${m.original_filename})...`);
        const buf = fs.readFileSync(fullPath);
        const parsed = await parseDocumentBuffer(buf, m.file_type, m.original_filename);
        
        m.metadata = {
          ...m.metadata,
          page_count: parsed.pageCount || m.metadata?.page_count,
          word_count: parsed.wordCount || m.metadata?.word_count,
          slides: parsed.slides || [],
        };
        m.extracted_text = parsed.text;
        m.processing_status = 'completed';
        updatedCount++;
        console.log(`Successfully parsed ${parsed.slides?.length || 0} slides for "${m.title}".`);
      }
    }
  }

  writeDb(db);
  console.log(`Completed backfill. Updated ${updatedCount} material(s).`);
}

main().catch(err => {
  console.error('Error during backfill:', err);
  process.exit(1);
});
