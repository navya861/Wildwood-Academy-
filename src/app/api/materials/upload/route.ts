import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';
import { StorageProvider } from '@/lib/storage/storage-provider';
import { parseDocumentBuffer } from '@/lib/processing/document-parser';
import { chunkText } from '@/lib/processing/chunker';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || file?.name || 'Untitled Scroll';
    const subjectId = (formData.get('subject_id') as string) || undefined;

    if (!file) {
      return NextResponse.json({ error: 'No file was provided in the upload request.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File exceeds maximum allowed size of 25MB.` }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Save original file securely in storage
    const storagePath = await StorageProvider.saveFile(session.id, file.name, buffer, file.type || 'application/octet-stream');

    // 2. Create study_material entry with pending status
    const material = await Repository.createMaterial(session.id, {
      title,
      original_filename: file.name,
      storage_path: storagePath,
      file_type: file.type || 'application/octet-stream',
      file_size: file.size,
      processing_status: 'processing',
      subject_id: subjectId,
    });

    // 3. Create persistent background processing job
    const job = await Repository.createJob(
      session.id,
      'document_extraction',
      'study_material',
      material.id,
      { filename: file.name, size: file.size }
    );

    // 4. Process document extraction
    try {
      await Repository.updateJob(session.id, job.id, { progress: 30, attempt_count: 1 });

      const parsed = await parseDocumentBuffer(buffer, file.type, file.name);

      await Repository.updateJob(session.id, job.id, { progress: 60 });

      // 5. Chunk the text
      const chunks = chunkText(parsed.text, {
        totalPages: parsed.pageCount || 1,
      });

      // 6. Save chunks
      await Repository.saveChunks(session.id, material.id, chunks);

      await Repository.updateJob(session.id, job.id, { progress: 90 });

      // 7. Update material to completed
      const updatedMaterial = await Repository.updateMaterial(session.id, material.id, {
        processing_status: 'completed',
        extracted_text: parsed.text,
        metadata: {
          page_count: parsed.pageCount,
          word_count: parsed.wordCount,
          chunk_count: chunks.length,
          ocr_applied: parsed.ocrApplied,
          slides: parsed.slides,
        },
      });

      await Repository.updateJob(session.id, job.id, { status: 'completed', progress: 100 });

      // 8. Award XP and check first archive achievement
      await Repository.awardXP(session.id, 40, `Archived study material: ${title}`);
      await Repository.unlockAchievement(session.id, 'first_scroll', {
        title: 'Archivist of the Grove',
        description: 'Enshrined your first study material in the Woodland Library.',
        icon: 'Scroll',
        xp_reward: 50,
      });

      return NextResponse.json({
        success: true,
        material: updatedMaterial,
        jobId: job.id,
      });
    } catch (parseErr: any) {
      console.error('Document extraction error:', parseErr);
      await Repository.updateMaterial(session.id, material.id, {
        processing_status: 'failed',
        error_message: parseErr.message || 'Failed to extract text from document.',
      });

      await Repository.updateJob(session.id, job.id, {
        status: 'failed',
        error_message: parseErr.message,
      });

      return NextResponse.json({
        success: false,
        error: parseErr.message || 'Document processing failed.',
        materialId: material.id,
      }, { status: 422 });
    }
  } catch (err: any) {
    console.error('Upload handler error:', err);
    return NextResponse.json({ error: err.message || 'File upload failed.' }, { status: 500 });
  }
}
