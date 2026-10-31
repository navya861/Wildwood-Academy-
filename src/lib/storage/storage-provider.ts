import fs from 'fs';
import path from 'path';
import { getSupabaseAdmin, isSupabaseConfigured } from '../db/supabase';

const UPLOAD_ROOT = path.join(process.cwd(), 'storage', 'uploads');

export const StorageProvider = {
  async saveFile(userId: string, filename: string, buffer: Buffer, mimeType: string): Promise<string> {
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${userId}/${Date.now()}_${sanitizedFilename}`;

    // If Supabase Storage is configured and available
    if (isSupabaseConfigured) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const { data, error } = await supabase.storage
          .from('study_materials')
          .upload(storagePath, buffer, {
            contentType: mimeType,
            upsert: false,
          });

        if (!error && data) {
          return storagePath;
        }
        console.warn('Supabase storage upload failed, falling back to local file storage:', error?.message);
      }
    }

    // Local secure storage fallback
    const userDir = path.join(UPLOAD_ROOT, userId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const localFilePath = path.join(UPLOAD_ROOT, storagePath);
    const localDir = path.dirname(localFilePath);
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }

    fs.writeFileSync(localFilePath, buffer);
    return storagePath;
  },

  async getFileBuffer(userId: string, storagePath: string): Promise<Buffer> {
    // Prevent path traversal
    if (storagePath.includes('..') || !storagePath.startsWith(`${userId}/`)) {
      throw new Error('Unauthorized or invalid storage path.');
    }

    if (isSupabaseConfigured) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const { data, error } = await supabase.storage
          .from('study_materials')
          .download(storagePath);
        if (!error && data) {
          const arrayBuffer = await data.arrayBuffer();
          return Buffer.from(arrayBuffer);
        }
      }
    }

    const localFilePath = path.join(UPLOAD_ROOT, storagePath);
    if (!fs.existsSync(localFilePath)) {
      throw new Error('Requested file not found in storage archive.');
    }

    return fs.readFileSync(localFilePath);
  },

  async deleteFile(userId: string, storagePath: string): Promise<void> {
    if (!storagePath.startsWith(`${userId}/`)) {
      return;
    }

    if (isSupabaseConfigured) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        await supabase.storage.from('study_materials').remove([storagePath]);
      }
    }

    const localFilePath = path.join(UPLOAD_ROOT, storagePath);
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (e) {
        console.error('Failed to unlink local file:', e);
      }
    }
  },
};
