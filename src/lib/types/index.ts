// Wildwood Academy Core Type Definitions
// Defines all 18 entities according to the PRD specifications

export type Role = 'user' | 'assistant' | 'system';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';
export type NoteType = 'ai_generated' | 'personalized' | 'user_written';
export type NoteFormat = 'concise' | 'detailed' | 'beginner' | 'exam' | 'flashcards';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  learning_preferences: {
    style: 'socratic' | 'structured' | 'visual' | 'concise';
    pace: 'gentle' | 'moderate' | 'rigorous';
    tone: 'scholarly_whimsical' | 'academic' | 'friendly';
    notes_preference?: NoteFormat;
  };
  xp: number;
  level: number;
  streak_days: number;
  last_active_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  icon?: string;
  cover_image?: string;
  created_at: string;
  updated_at: string;
}

export interface StudyMaterial {
  id: string;
  user_id: string;
  subject_id?: string;
  title: string;
  original_filename: string;
  storage_path: string;
  file_type: string;
  file_size: number;
  processing_status: ProcessingStatus;
  extracted_text?: string;
  error_message?: string;
  metadata?: {
    page_count?: number;
    word_count?: number;
    chunk_count?: number;
    ocr_applied?: boolean;
    detected_topics?: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: string;
  study_material_id: string;
  user_id: string;
  chunk_index: number;
  chunk_text: string;
  page_number?: number;
  section_title?: string;
  embedding?: number[];
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Course {
  id: string;
  user_id: string;
  subject_id?: string;
  title: string;
  description: string;
  source_material_id?: string;
  source_material_title?: string;
  generation_status: ProcessingStatus;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_hours: number;
  created_at: string;
  updated_at: string;
  modules?: Module[];
  progress?: number; // 0 - 100 percentage
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  created_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  course_id: string;
  user_id: string;
  title: string;
  content: string; // Markdown or rich structured text
  learning_objectives: string[];
  key_terms: { term: string; definition: string }[];
  examples: { title: string; explanation: string }[];
  summary?: string;
  estimated_duration: number; // minutes
  source_references: { material_title: string; page?: number; excerpt?: string }[];
  order_index: number;
  publication_status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  is_completed?: boolean;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  completed: boolean;
  completed_at?: string;
  last_accessed: string;
  study_duration_seconds: number;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  lesson_id?: string;
  study_material_id?: string;
  course_id?: string;
  title: string;
  content: string;
  user_edited_content?: string;
  note_type: NoteType;
  note_format: NoteFormat;
  generation_preferences?: Record<string, any>;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  user_id: string;
  lesson_id?: string;
  course_id?: string;
  study_material_id?: string;
  title: string;
  description?: string;
  difficulty: 'beginner' | 'medium' | 'advanced';
  total_questions: number;
  generation_status: ProcessingStatus;
  created_at: string;
  questions?: QuizQuestionClient[];
  best_score?: number;
  attempts_count?: number;
}

// Stored in DB with correct_answer
export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: QuestionType;
  options: string[];
  correct_answer: string; // Kept secure on server
  grading_criteria?: string;
  explanation: string;
  source_references?: string[];
  order_index: number;
  created_at: string;
}

// Client-facing question (hides correct_answer and explanation before submit)
export interface QuizQuestionClient {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: QuestionType;
  options: string[];
  order_index: number;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  submitted_answers: Record<string, string>; // questionId -> answer
  score: number;
  max_score: number;
  percentage: number;
  feedback: {
    question_id: string;
    question_text: string;
    submitted: string;
    correct: string;
    is_correct: boolean;
    explanation: string;
  }[];
  started_at: string;
  completed_at: string;
  grading_status: 'completed';
  created_at: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  title: string;
  subject_id?: string;
  course_id?: string;
  lesson_id?: string;
  study_material_id?: string;
  created_at: string;
  updated_at: string;
  messages?: AIMessage[];
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: Role;
  content: string;
  source_citations?: {
    material_id?: string;
    title: string;
    page?: number;
    quote?: string;
  }[];
  created_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject_id?: string;
  course_id?: string;
  lesson_id?: string;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_key: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  earned_at: string;
  metadata?: Record<string, any>;
}

export interface GameSession {
  id: string;
  user_id: string;
  game_type: string;
  course_id?: string;
  score: number;
  fireflies_collected: number;
  questions_answered: number;
  max_streak: number;
  rewards_earned: {
    xp?: number;
    achievement_unlocked?: string;
  };
  started_at: string;
  completed_at?: string;
  server_validated: boolean;
  created_at: string;
}

export interface ProcessingJob {
  id: string;
  user_id: string;
  job_type: 'document_extraction' | 'embedding_generation' | 'course_generation' | 'quiz_generation';
  resource_type: 'study_material' | 'course' | 'quiz';
  resource_id: string;
  status: ProcessingStatus;
  progress: number;
  attempt_count: number;
  max_attempts: number;
  error_message?: string;
  payload?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
