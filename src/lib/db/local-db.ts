import fs from 'fs';
import path from 'path';
import {
  UserProfile,
  Subject,
  StudyMaterial,
  DocumentChunk,
  Course,
  Module,
  Lesson,
  LessonProgress,
  Note,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  AIConversation,
  AIMessage,
  StudySession,
  Achievement,
  GameSession,
  ProcessingJob
} from '../types';

export interface UserAuthRecord {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface WildwoodDatabaseSchema {
  users: UserAuthRecord[];
  profiles: UserProfile[];
  subjects: Subject[];
  study_materials: StudyMaterial[];
  document_chunks: DocumentChunk[];
  courses: Course[];
  modules: Module[];
  lessons: Lesson[];
  lesson_progress: LessonProgress[];
  notes: Note[];
  quizzes: Quiz[];
  quiz_questions: QuizQuestion[];
  quiz_attempts: QuizAttempt[];
  ai_conversations: AIConversation[];
  ai_messages: AIMessage[];
  study_sessions: StudySession[];
  achievements: Achievement[];
  game_sessions: GameSession[];
  processing_jobs: ProcessingJob[];
}

const DB_PATH = path.join(process.cwd(), 'data', 'wildwood.json');

const INITIAL_DB: WildwoodDatabaseSchema = {
  users: [],
  profiles: [],
  subjects: [],
  study_materials: [],
  document_chunks: [],
  courses: [],
  modules: [],
  lessons: [],
  lesson_progress: [],
  notes: [],
  quizzes: [],
  quiz_questions: [],
  quiz_attempts: [],
  ai_conversations: [],
  ai_messages: [],
  study_sessions: [],
  achievements: [],
  game_sessions: [],
  processing_jobs: [],
};

function ensureDbFile(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
  }
}

export function readDb(): WildwoodDatabaseSchema {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...INITIAL_DB, ...parsed };
  } catch (error) {
    console.error('Error reading wildwood.json:', error);
    return INITIAL_DB;
  }
}

export function writeDb(data: WildwoodDatabaseSchema): void {
  ensureDbFile();
  const tempPath = `${DB_PATH}.${Date.now()}.tmp`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_PATH);
  } catch (error) {
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch {}
    }
    throw error;
  }
}
