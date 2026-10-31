import crypto from 'crypto';
import { readDb, writeDb, UserAuthRecord } from './local-db';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase';
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
  ProcessingJob,
  NoteFormat,
  NoteType
} from '../types';

export const Repository = {
  // ===================== AUTH & PROFILES =====================
  async createUser(email: string, passwordHash: string, displayName: string): Promise<UserProfile> {
    const db = readDb();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('A scholar with this email already exists.');
    }

    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    const userRecord: UserAuthRecord = {
      id: userId,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      created_at: now,
    };

    const profile: UserProfile = {
      id: userId,
      email: email.toLowerCase(),
      display_name: displayName || 'Woodland Scholar',
      avatar_url: '/avatars/apprentice.svg',
      learning_preferences: {
        style: 'socratic',
        pace: 'moderate',
        tone: 'scholarly_whimsical',
        notes_preference: 'detailed',
      },
      xp: 0,
      level: 1,
      streak_days: 1,
      last_active_at: now,
      created_at: now,
      updated_at: now,
    };

    // First initial achievement: Welcome to the Academy
    const firstAchievement: Achievement = {
      id: crypto.randomUUID(),
      user_id: userId,
      achievement_key: 'first_steps',
      title: 'First Steps in the Grove',
      description: 'Entered Wildwood Academy and registered your scholar journal.',
      icon: 'Sprout',
      xp_reward: 25,
      earned_at: now,
    };

    profile.xp += 25;

    db.users.push(userRecord);
    db.profiles.push(profile);
    db.achievements.push(firstAchievement);

    writeDb(db);
    return profile;
  },

  async getUserByEmail(email: string): Promise<{ user: UserAuthRecord; profile: UserProfile } | null> {
    const db = readDb();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    const profile = db.profiles.find(p => p.id === user.id);
    if (!profile) return null;
    return { user, profile };
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    const db = readDb();
    return db.profiles.find(p => p.id === userId) || null;
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const db = readDb();
    const idx = db.profiles.findIndex(p => p.id === userId);
    if (idx === -1) throw new Error('Scholar profile not found');

    const updated = {
      ...db.profiles[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    db.profiles[idx] = updated;
    writeDb(db);
    return updated;
  },

  async deleteUserAccount(userId: string): Promise<void> {
    const db = readDb();
    db.users = db.users.filter(u => u.id !== userId);
    db.profiles = db.profiles.filter(p => p.id !== userId);
    db.subjects = db.subjects.filter(s => s.user_id !== userId);
    db.study_materials = db.study_materials.filter(m => m.user_id !== userId);
    db.document_chunks = db.document_chunks.filter(c => c.user_id !== userId);
    db.courses = db.courses.filter(c => c.user_id !== userId);
    db.lessons = db.lessons.filter(l => l.user_id !== userId);
    db.lesson_progress = db.lesson_progress.filter(lp => lp.user_id !== userId);
    db.notes = db.notes.filter(n => n.user_id !== userId);
    db.quizzes = db.quizzes.filter(q => q.user_id !== userId);
    db.quiz_attempts = db.quiz_attempts.filter(qa => qa.user_id !== userId);
    db.ai_conversations = db.ai_conversations.filter(ac => ac.user_id !== userId);
    db.ai_messages = db.ai_messages.filter(am => am.user_id !== userId);
    db.study_sessions = db.study_sessions.filter(ss => ss.user_id !== userId);
    db.achievements = db.achievements.filter(a => a.user_id !== userId);
    db.game_sessions = db.game_sessions.filter(gs => gs.user_id !== userId);
    db.processing_jobs = db.processing_jobs.filter(pj => pj.user_id !== userId);
    writeDb(db);
  },

  // ===================== SUBJECTS =====================
  async getSubjects(userId: string): Promise<Subject[]> {
    const db = readDb();
    return db.subjects.filter(s => s.user_id === userId);
  },

  async createSubject(userId: string, title: string, description?: string, icon?: string): Promise<Subject> {
    const db = readDb();
    const now = new Date().toISOString();
    const subject: Subject = {
      id: crypto.randomUUID(),
      user_id: userId,
      title,
      description,
      icon: icon || 'BookOpen',
      created_at: now,
      updated_at: now,
    };
    db.subjects.push(subject);
    writeDb(db);
    return subject;
  },

  // ===================== STUDY MATERIALS =====================
  async getMaterials(userId: string): Promise<StudyMaterial[]> {
    const db = readDb();
    return db.study_materials
      .filter(m => m.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getMaterial(userId: string, materialId: string): Promise<StudyMaterial | null> {
    const db = readDb();
    const material = db.study_materials.find(m => m.id === materialId && m.user_id === userId);
    return material || null;
  },

  async createMaterial(userId: string, data: Omit<StudyMaterial, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<StudyMaterial> {
    const db = readDb();
    const now = new Date().toISOString();
    const material: StudyMaterial = {
      ...data,
      id: crypto.randomUUID(),
      user_id: userId,
      created_at: now,
      updated_at: now,
    };
    db.study_materials.push(material);
    writeDb(db);
    return material;
  },

  async updateMaterial(userId: string, materialId: string, updates: Partial<StudyMaterial>): Promise<StudyMaterial> {
    const db = readDb();
    const idx = db.study_materials.findIndex(m => m.id === materialId && m.user_id === userId);
    if (idx === -1) throw new Error('Study material not found or unauthorized');

    const updated = {
      ...db.study_materials[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    db.study_materials[idx] = updated;
    writeDb(db);
    return updated;
  },

  async deleteMaterial(userId: string, materialId: string): Promise<void> {
    const db = readDb();
    db.study_materials = db.study_materials.filter(m => !(m.id === materialId && m.user_id === userId));
    db.document_chunks = db.document_chunks.filter(c => !(c.study_material_id === materialId && c.user_id === userId));
    writeDb(db);
  },

  // ===================== DOCUMENT CHUNKS & RAG =====================
  async saveChunks(userId: string, materialId: string, chunks: Omit<DocumentChunk, 'id' | 'user_id' | 'study_material_id' | 'created_at'>[]): Promise<DocumentChunk[]> {
    const db = readDb();
    // remove any old chunks for this material (idempotency)
    db.document_chunks = db.document_chunks.filter(c => !(c.study_material_id === materialId && c.user_id === userId));

    const now = new Date().toISOString();
    const createdChunks: DocumentChunk[] = chunks.map(c => ({
      ...c,
      id: crypto.randomUUID(),
      study_material_id: materialId,
      user_id: userId,
      created_at: now,
    }));

    db.document_chunks.push(...createdChunks);
    writeDb(db);
    return createdChunks;
  },

  async getChunks(userId: string, materialId?: string): Promise<DocumentChunk[]> {
    const db = readDb();
    return db.document_chunks.filter(c => c.user_id === userId && (!materialId || c.study_material_id === materialId));
  },

  async searchChunks(userId: string, query: string, options?: { materialId?: string; limit?: number }): Promise<DocumentChunk[]> {
    const db = readDb();
    const limit = options?.limit || 5;
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

    let candidates = db.document_chunks.filter(c => c.user_id === userId);
    if (options?.materialId) {
      candidates = candidates.filter(c => c.study_material_id === options.materialId);
    }

    if (queryTerms.length === 0) {
      return candidates.slice(0, limit);
    }

    // Keyword & semantic relevance scoring
    const scored = candidates.map(chunk => {
      const text = chunk.chunk_text.toLowerCase();
      let score = 0;
      for (const term of queryTerms) {
        if (text.includes(term)) {
          score += 2;
          // exact phrase bonus
          const matches = (text.match(new RegExp(term, 'g')) || []).length;
          score += Math.min(matches, 5);
        }
      }
      return { chunk, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.chunk);
  },

  // ===================== COURSES, MODULES & LESSONS =====================
  async getCourses(userId: string): Promise<Course[]> {
    const db = readDb();
    const courses = db.courses.filter(c => c.user_id === userId);
    
    // Calculate real progress for each course
    return courses.map(course => {
      const courseLessons = db.lessons.filter(l => l.course_id === course.id);
      const total = courseLessons.length;
      if (total === 0) return { ...course, progress: 0 };
      
      const completed = db.lesson_progress.filter(
        lp => lp.course_id === course.id && lp.user_id === userId && lp.completed
      ).length;

      return {
        ...course,
        progress: Math.round((completed / total) * 100),
      };
    });
  },

  async getCourse(userId: string, courseId: string): Promise<Course | null> {
    const db = readDb();
    const course = db.courses.find(c => c.id === courseId && c.user_id === userId);
    if (!course) return null;

    const modules = db.modules
      .filter(m => m.course_id === courseId)
      .sort((a, b) => a.order_index - b.order_index);

    const userProgress = db.lesson_progress.filter(lp => lp.course_id === courseId && lp.user_id === userId);
    const completedSet = new Set(userProgress.filter(p => p.completed).map(p => p.lesson_id));

    const modulesWithLessons = modules.map(m => {
      const lessons = db.lessons
        .filter(l => l.module_id === m.id)
        .sort((a, b) => a.order_index - b.order_index)
        .map(l => ({
          ...l,
          is_completed: completedSet.has(l.id),
        }));
      return { ...m, lessons };
    });

    const allLessons = modulesWithLessons.flatMap(m => m.lessons || []);
    const progress = allLessons.length > 0 
      ? Math.round((allLessons.filter(l => l.is_completed).length / allLessons.length) * 100)
      : 0;

    return {
      ...course,
      modules: modulesWithLessons,
      progress,
    };
  },

  async createCourseWithOutline(
    userId: string,
    courseData: Omit<Course, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    modules: {
      title: string;
      description?: string;
      order_index: number;
      lessons: {
        title: string;
        content: string;
        learning_objectives: string[];
        key_terms: { term: string; definition: string }[];
        examples: { title: string; explanation: string }[];
        summary: string;
        estimated_duration: number;
        source_references: { material_title: string; page?: number; excerpt?: string }[];
      }[];
    }[]
  ): Promise<Course> {
    const db = readDb();
    const courseId = crypto.randomUUID();
    const now = new Date().toISOString();

    const course: Course = {
      ...courseData,
      id: courseId,
      user_id: userId,
      created_at: now,
      updated_at: now,
    };

    db.courses.push(course);

    modules.forEach((mod, modIdx) => {
      const moduleId = crypto.randomUUID();
      const moduleRecord: Module = {
        id: moduleId,
        course_id: courseId,
        title: mod.title,
        description: mod.description,
        order_index: mod.order_index ?? modIdx,
        created_at: now,
      };
      db.modules.push(moduleRecord);

      mod.lessons.forEach((les, lesIdx) => {
        const lessonId = crypto.randomUUID();
        const lessonRecord: Lesson = {
          id: lessonId,
          module_id: moduleId,
          course_id: courseId,
          user_id: userId,
          title: les.title,
          content: les.content,
          learning_objectives: les.learning_objectives || [],
          key_terms: les.key_terms || [],
          examples: les.examples || [],
          summary: les.summary || '',
          estimated_duration: les.estimated_duration || 15,
          source_references: les.source_references || [],
          order_index: lesIdx,
          publication_status: 'published',
          created_at: now,
          updated_at: now,
        };
        db.lessons.push(lessonRecord);
      });
    });

    writeDb(db);
    return (await this.getCourse(userId, courseId))!;
  },

  async getLesson(userId: string, lessonId: string): Promise<Lesson | null> {
    const db = readDb();
    const lesson = db.lessons.find(l => l.id === lessonId && l.user_id === userId);
    if (!lesson) return null;

    const progress = db.lesson_progress.find(lp => lp.lesson_id === lessonId && lp.user_id === userId);
    return {
      ...lesson,
      is_completed: progress?.completed ?? false,
    };
  },

  async updateLessonProgress(
    userId: string,
    lessonId: string,
    courseId: string,
    completed: boolean,
    studyDurationSeconds = 0
  ): Promise<LessonProgress> {
    const db = readDb();
    const now = new Date().toISOString();
    let record = db.lesson_progress.find(lp => lp.lesson_id === lessonId && lp.user_id === userId);

    if (record) {
      record.completed = completed;
      if (completed && !record.completed_at) {
        record.completed_at = now;
      }
      record.last_accessed = now;
      record.study_duration_seconds += studyDurationSeconds;
    } else {
      record = {
        id: crypto.randomUUID(),
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        completed,
        completed_at: completed ? now : undefined,
        last_accessed: now,
        study_duration_seconds: studyDurationSeconds,
        created_at: now,
      };
      db.lesson_progress.push(record);
    }

    // Award XP if completed
    if (completed) {
      await this.awardXP(userId, 50, 'Completed a Woodland Lesson');
    }

    writeDb(db);
    return record;
  },

  async deleteCourse(userId: string, courseId: string): Promise<void> {
    const db = readDb();
    db.courses = db.courses.filter(c => !(c.id === courseId && c.user_id === userId));
    db.modules = db.modules.filter(m => m.course_id !== courseId);
    db.lessons = db.lessons.filter(l => !(l.course_id === courseId && l.user_id === userId));
    db.lesson_progress = db.lesson_progress.filter(lp => !(lp.course_id === courseId && lp.user_id === userId));
    writeDb(db);
  },

  // ===================== NOTES (The Scribe's Corner) =====================
  async getNotes(userId: string, filters?: { lessonId?: string; courseId?: string; materialId?: string }): Promise<Note[]> {
    const db = readDb();
    let list = db.notes.filter(n => n.user_id === userId);
    if (filters?.lessonId) list = list.filter(n => n.lesson_id === filters.lessonId);
    if (filters?.courseId) list = list.filter(n => n.course_id === filters.courseId);
    if (filters?.materialId) list = list.filter(n => n.study_material_id === filters.materialId);

    return list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },

  async getNote(userId: string, noteId: string): Promise<Note | null> {
    const db = readDb();
    return db.notes.find(n => n.id === noteId && n.user_id === userId) || null;
  },

  async createNote(userId: string, data: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Note> {
    const db = readDb();
    const now = new Date().toISOString();
    const note: Note = {
      ...data,
      id: crypto.randomUUID(),
      user_id: userId,
      created_at: now,
      updated_at: now,
    };
    db.notes.push(note);
    writeDb(db);
    return note;
  },

  async updateNote(userId: string, noteId: string, updates: Partial<Note>): Promise<Note> {
    const db = readDb();
    const idx = db.notes.findIndex(n => n.id === noteId && n.user_id === userId);
    if (idx === -1) throw new Error('Note not found or unauthorized');

    const updated = {
      ...db.notes[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    db.notes[idx] = updated;
    writeDb(db);
    return updated;
  },

  async deleteNote(userId: string, noteId: string): Promise<void> {
    const db = readDb();
    db.notes = db.notes.filter(n => !(n.id === noteId && n.user_id === userId));
    writeDb(db);
  },

  // ===================== QUIZZES & THE TRIAL GROUNDS =====================
  async getQuizzes(userId: string): Promise<Quiz[]> {
    const db = readDb();
    const quizzes = db.quizzes.filter(q => q.user_id === userId);
    return quizzes.map(q => {
      const attempts = db.quiz_attempts.filter(qa => qa.quiz_id === q.id && qa.user_id === userId);
      const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : undefined;
      return {
        ...q,
        best_score: bestScore,
        attempts_count: attempts.length,
      };
    });
  },

  async getQuiz(userId: string, quizId: string, includeQuestions = true): Promise<Quiz | null> {
    const db = readDb();
    const quiz = db.quizzes.find(q => q.id === quizId && q.user_id === userId);
    if (!quiz) return null;

    let questionsClient: any = undefined;
    if (includeQuestions) {
      // Hide correct_answer and explanation before submit!
      const questions = db.quiz_questions
        .filter(qq => qq.quiz_id === quizId)
        .sort((a, b) => a.order_index - b.order_index);

      questionsClient = questions.map(q => ({
        id: q.id,
        quiz_id: q.quiz_id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        order_index: q.order_index,
      }));
    }

    const attempts = db.quiz_attempts.filter(qa => qa.quiz_id === quizId && qa.user_id === userId);
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : undefined;

    return {
      ...quiz,
      questions: questionsClient,
      best_score: bestScore,
      attempts_count: attempts.length,
    };
  },

  async createQuiz(
    userId: string,
    quizData: Omit<Quiz, 'id' | 'user_id' | 'created_at'>,
    questions: Omit<QuizQuestion, 'id' | 'quiz_id' | 'created_at'>[]
  ): Promise<Quiz> {
    const db = readDb();
    const quizId = crypto.randomUUID();
    const now = new Date().toISOString();

    const quiz: Quiz = {
      ...quizData,
      id: quizId,
      user_id: userId,
      total_questions: questions.length,
      created_at: now,
    };
    db.quizzes.push(quiz);

    questions.forEach((q, idx) => {
      const questionRecord: QuizQuestion = {
        ...q,
        id: crypto.randomUUID(),
        quiz_id: quizId,
        order_index: q.order_index ?? idx,
        created_at: now,
      };
      db.quiz_questions.push(questionRecord);
    });

    writeDb(db);
    return (await this.getQuiz(userId, quizId, true))!;
  },

  async gradeQuizSubmission(
    userId: string,
    quizId: string,
    submittedAnswers: Record<string, string>,
    startedAt: string
  ): Promise<QuizAttempt> {
    const db = readDb();
    const quiz = db.quizzes.find(q => q.id === quizId && q.user_id === userId);
    if (!quiz) throw new Error('Quiz not found or unauthorized');

    const questions = db.quiz_questions
      .filter(qq => qq.quiz_id === quizId)
      .sort((a, b) => a.order_index - b.order_index);

    let score = 0;
    const maxScore = questions.length;
    const feedback: any[] = [];

    for (const q of questions) {
      const submitted = (submittedAnswers[q.id] || '').trim();
      let isCorrect = false;

      if (q.question_type === 'multiple_choice' || q.question_type === 'true_false') {
        isCorrect = submitted.toLowerCase() === q.correct_answer.trim().toLowerCase();
      } else {
        // Short answer rubric check
        const normalizedSub = submitted.toLowerCase();
        const normalizedCorrect = q.correct_answer.toLowerCase();
        isCorrect = normalizedSub === normalizedCorrect ||
          normalizedSub.includes(normalizedCorrect) ||
          normalizedCorrect.includes(normalizedSub) && normalizedSub.length > 3;
      }

      if (isCorrect) score += 1;

      feedback.push({
        question_id: q.id,
        question_text: q.question_text,
        submitted,
        correct: q.correct_answer,
        is_correct: isCorrect,
        explanation: q.explanation,
      });
    }

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const now = new Date().toISOString();

    const attempt: QuizAttempt = {
      id: crypto.randomUUID(),
      user_id: userId,
      quiz_id: quizId,
      submitted_answers: submittedAnswers,
      score,
      max_score: maxScore,
      percentage,
      feedback,
      started_at: startedAt || now,
      completed_at: now,
      grading_status: 'completed',
      created_at: now,
    };

    db.quiz_attempts.push(attempt);

    // Award XP based on score
    const earnedXp = Math.max(10, score * 15);
    await this.awardXP(userId, earnedXp, `Completed Trial Grounds Quiz: ${quiz.title}`);

    // If perfect score, check achievement
    if (percentage === 100) {
      await this.unlockAchievement(userId, 'master_trial', {
        title: 'Master of Trials',
        description: 'Achieved a perfect 100% score on a trial quiz.',
        icon: 'Crown',
        xp_reward: 100,
      });
    }

    writeDb(db);
    return attempt;
  },

  async getQuizAttempts(userId: string, quizId?: string): Promise<QuizAttempt[]> {
    const db = readDb();
    let list = db.quiz_attempts.filter(qa => qa.user_id === userId);
    if (quizId) list = list.filter(qa => qa.quiz_id === quizId);
    return list.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
  },

  // ===================== AI CONVERSATIONS (The Forest Guide) =====================
  async getConversations(userId: string): Promise<AIConversation[]> {
    const db = readDb();
    return db.ai_conversations
      .filter(c => c.user_id === userId)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },

  async getConversation(userId: string, convId: string): Promise<AIConversation | null> {
    const db = readDb();
    const conv = db.ai_conversations.find(c => c.id === convId && c.user_id === userId);
    if (!conv) return null;

    const messages = db.ai_messages
      .filter(m => m.conversation_id === convId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return {
      ...conv,
      messages,
    };
  },

  async createConversation(userId: string, title: string, context?: {
    subjectId?: string;
    courseId?: string;
    lessonId?: string;
    studyMaterialId?: string;
  }): Promise<AIConversation> {
    const db = readDb();
    const now = new Date().toISOString();
    const conv: AIConversation = {
      id: crypto.randomUUID(),
      user_id: userId,
      title: title || 'Woodland Inquiries',
      subject_id: context?.subjectId,
      course_id: context?.courseId,
      lesson_id: context?.lessonId,
      study_material_id: context?.studyMaterialId,
      created_at: now,
      updated_at: now,
    };
    db.ai_conversations.push(conv);
    writeDb(db);
    return conv;
  },

  async addMessage(
    userId: string,
    convId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    sourceCitations?: any[]
  ): Promise<AIMessage> {
    const db = readDb();
    const now = new Date().toISOString();
    const msg: AIMessage = {
      id: crypto.randomUUID(),
      conversation_id: convId,
      user_id: userId,
      role,
      content,
      source_citations: sourceCitations || [],
      created_at: now,
    };

    db.ai_messages.push(msg);

    const conv = db.ai_conversations.find(c => c.id === convId);
    if (conv) {
      conv.updated_at = now;
    }

    writeDb(db);
    return msg;
  },

  // ===================== STUDY SESSIONS & PROGRESS =====================
  async recordStudySession(userId: string, durationSeconds: number, context?: {
    courseId?: string;
    lessonId?: string;
    subjectId?: string;
  }): Promise<StudySession> {
    const db = readDb();
    const now = new Date().toISOString();
    const startedAt = new Date(Date.now() - durationSeconds * 1000).toISOString();

    const session: StudySession = {
      id: crypto.randomUUID(),
      user_id: userId,
      subject_id: context?.subjectId,
      course_id: context?.courseId,
      lesson_id: context?.lessonId,
      started_at: startedAt,
      ended_at: now,
      duration_seconds: durationSeconds,
      created_at: now,
    };

    db.study_sessions.push(session);

    // Calculate XP for study session (1 XP per minute, max 120 per session)
    const minutes = Math.floor(durationSeconds / 60);
    if (minutes > 0) {
      const xp = Math.min(120, minutes * 2);
      await this.awardXP(userId, xp, `Focused Study Session (${minutes} mins)`);
    }

    writeDb(db);
    return session;
  },

  // ===================== GAMIFICATION & GROWTH JOURNAL =====================
  async awardXP(userId: string, amount: number, reason?: string): Promise<{ xp: number; level: number; leveledUp: boolean }> {
    const db = readDb();
    const profile = db.profiles.find(p => p.id === userId);
    if (!profile) return { xp: 0, level: 1, leveledUp: false };

    const oldLevel = profile.level;
    profile.xp += Math.max(0, amount);
    // Level formula: level = floor(sqrt(xp / 100)) + 1
    const newLevel = Math.max(1, Math.floor(Math.sqrt(profile.xp / 100)) + 1);
    const leveledUp = newLevel > oldLevel;
    profile.level = newLevel;
    profile.updated_at = new Date().toISOString();

    if (leveledUp) {
      await this.unlockAchievement(userId, `level_${newLevel}`, {
        title: `Reached Level ${newLevel}`,
        description: `Your wisdom in the enchanted grove has reached Circle ${newLevel}!`,
        icon: 'Award',
        xp_reward: 50,
      });
    }

    writeDb(db);
    return { xp: profile.xp, level: profile.level, leveledUp };
  },

  async getAchievements(userId: string): Promise<Achievement[]> {
    const db = readDb();
    return db.achievements.filter(a => a.user_id === userId);
  },

  async unlockAchievement(
    userId: string,
    key: string,
    data: { title: string; description: string; icon: string; xp_reward?: number }
  ): Promise<Achievement | null> {
    const db = readDb();
    const existing = db.achievements.find(a => a.user_id === userId && a.achievement_key === key);
    if (existing) return null;

    const now = new Date().toISOString();
    const achievement: Achievement = {
      id: crypto.randomUUID(),
      user_id: userId,
      achievement_key: key,
      title: data.title,
      description: data.description,
      icon: data.icon,
      xp_reward: data.xp_reward ?? 50,
      earned_at: now,
    };

    db.achievements.push(achievement);
    const profile = db.profiles.find(p => p.id === userId);
    if (profile && achievement.xp_reward) {
      profile.xp += achievement.xp_reward;
      profile.level = Math.max(1, Math.floor(Math.sqrt(profile.xp / 100)) + 1);
    }

    writeDb(db);
    return achievement;
  },

  async getGrowthJournal(userId: string) {
    const db = readDb();
    const profile = db.profiles.find(p => p.id === userId);
    const materials = db.study_materials.filter(m => m.user_id === userId);
    const courses = db.courses.filter(c => c.user_id === userId);
    const lessons = db.lessons.filter(l => l.user_id === userId);
    const completedProgress = db.lesson_progress.filter(lp => lp.user_id === userId && lp.completed);
    const attempts = db.quiz_attempts.filter(qa => qa.user_id === userId);
    const sessions = db.study_sessions.filter(ss => ss.user_id === userId);
    const achievements = db.achievements.filter(a => a.user_id === userId);
    const gameSessions = db.game_sessions.filter(gs => gs.user_id === userId);

    const totalStudyTimeSeconds = sessions.reduce((acc, s) => acc + s.duration_seconds, 0);
    const averageQuizScore = attempts.length > 0 
      ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length)
      : 0;

    // Weak topics calculation from quiz attempts
    const incorrectQuestions = attempts.flatMap(a => a.feedback.filter(f => !f.is_correct));
    const topicFrequency: Record<string, number> = {};
    for (const q of incorrectQuestions) {
      const snippet = q.question_text.slice(0, 45);
      topicFrequency[snippet] = (topicFrequency[snippet] || 0) + 1;
    }
    const weakTopics = Object.entries(topicFrequency)
      .map(([topic, count]) => ({ topic, missedCount: count }))
      .sort((a, b) => b.missedCount - a.missedCount)
      .slice(0, 5);

    return {
      profile,
      materialsCount: materials.length,
      coursesCount: courses.length,
      lessonsCount: lessons.length,
      completedLessonsCount: completedProgress.length,
      totalStudyTimeSeconds,
      averageQuizScore,
      quizAttemptsCount: attempts.length,
      achievements,
      gameSessionsCount: gameSessions.length,
      totalFireflies: gameSessions.reduce((acc, g) => acc + (g.fireflies_collected || 0), 0),
      weakTopics,
    };
  },

  // ===================== FIREFLY QUEST (Enchanted Clearing) =====================
  async saveGameSession(userId: string, data: {
    courseId?: string;
    score: number;
    fireflies: number;
    questionsAnswered: number;
    maxStreak: number;
  }): Promise<GameSession> {
    const db = readDb();
    const now = new Date().toISOString();

    // Server-side validation of scores:
    // Fireflies cannot exceed questionsAnswered * 3
    const validatedFireflies = Math.min(data.fireflies, Math.max(1, data.questionsAnswered * 3));
    const validatedXp = Math.min(250, validatedFireflies * 10 + data.maxStreak * 5);

    const gameSession: GameSession = {
      id: crypto.randomUUID(),
      user_id: userId,
      game_type: 'firefly_quest',
      course_id: data.courseId,
      score: data.score,
      fireflies_collected: validatedFireflies,
      questions_answered: data.questionsAnswered,
      max_streak: data.maxStreak,
      rewards_earned: {
        xp: validatedXp,
      },
      started_at: new Date(Date.now() - 180000).toISOString(),
      completed_at: now,
      server_validated: true,
      created_at: now,
    };

    db.game_sessions.push(gameSession);

    // Award server-validated XP
    await this.awardXP(userId, validatedXp, `Completed Firefly Quest (${validatedFireflies} Fireflies caught)`);

    // Achievement check
    if (validatedFireflies >= 5) {
      await this.unlockAchievement(userId, 'firefly_whisperer', {
        title: 'Firefly Whisperer',
        description: 'Captured 5 or more fireflies in a single magical quest.',
        icon: 'Flame',
        xp_reward: 50,
      });
    }

    writeDb(db);
    return gameSession;
  },

  // ===================== PROCESSING JOBS =====================
  async createJob(
    userId: string,
    jobType: ProcessingJob['job_type'],
    resourceType: ProcessingJob['resource_type'],
    resourceId: string,
    payload?: Record<string, any>
  ): Promise<ProcessingJob> {
    const db = readDb();
    const now = new Date().toISOString();
    const job: ProcessingJob = {
      id: crypto.randomUUID(),
      user_id: userId,
      job_type: jobType,
      resource_type: resourceType,
      resource_id: resourceId,
      status: 'pending',
      progress: 0,
      attempt_count: 0,
      max_attempts: 3,
      payload: payload || {},
      created_at: now,
      updated_at: now,
    };
    db.processing_jobs.push(job);
    writeDb(db);
    return job;
  },

  async updateJob(userId: string, jobId: string, updates: Partial<ProcessingJob>): Promise<ProcessingJob> {
    const db = readDb();
    const idx = db.processing_jobs.findIndex(j => j.id === jobId && j.user_id === userId);
    if (idx === -1) throw new Error('Job not found or unauthorized');

    const updated = {
      ...db.processing_jobs[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    db.processing_jobs[idx] = updated;
    writeDb(db);
    return updated;
  },

  async getJob(userId: string, jobId: string): Promise<ProcessingJob | null> {
    const db = readDb();
    return db.processing_jobs.find(j => j.id === jobId && j.user_id === userId) || null;
  },
};
