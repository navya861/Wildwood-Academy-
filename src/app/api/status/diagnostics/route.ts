import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/db/supabase';
import { getAIStatus } from '@/lib/ai/ai-service';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const aiStatus = getAIStatus();
  const dbDir = path.join(process.cwd(), 'data');
  const uploadsDir = path.join(process.cwd(), 'storage', 'uploads');

  const localDbHealthy = fs.existsSync(dbDir);
  const localUploadsHealthy = fs.existsSync(uploadsDir);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    database: {
      supabaseConfigured: isSupabaseConfigured,
      mode: isSupabaseConfigured ? 'supabase_cloud' : 'local_persistent_json_db',
      healthy: isSupabaseConfigured || localDbHealthy,
      details: isSupabaseConfigured 
        ? 'Connected to remote Supabase PostgreSQL'
        : 'Running in Local Atomic Relational Mode (data/wildwood.json)',
    },
    storage: {
      supabaseStorage: isSupabaseConfigured,
      mode: isSupabaseConfigured ? 'supabase_private_bucket' : 'local_secure_storage',
      healthy: isSupabaseConfigured || localUploadsHealthy,
      storagePath: isSupabaseConfigured ? 'bucket: study_materials' : 'storage/uploads/[userId]',
    },
    ai: {
      isConfigured: aiStatus.isConfigured,
      activeProvider: aiStatus.activeProvider,
      modelName: aiStatus.modelName,
      setupInstruction: aiStatus.isConfigured
        ? `Active AI Provider: ${aiStatus.activeProvider.toUpperCase()} (${aiStatus.modelName})`
        : 'Set GEMINI_API_KEY in .env.local to enable real-time Gemini LLM calls. Intelligent domain extraction active as fallback.',
    },
  });
}
