import fs from 'fs';
import { readDb, writeDb } from '../src/lib/db/local-db';
import { AIService } from '../src/lib/ai/ai-service';
import { Repository } from '../src/lib/db/repository';

async function main() {
  const db = readDb();
  const material = db.study_materials.find(m => m.original_filename?.endsWith('.pptx') || m.title.includes('Databases'));

  if (!material) {
    console.error('No PPT material found in database!');
    return;
  }

  console.log(`Found material: "${material.title}" with ${material.metadata?.slides?.length} slides.`);

  const outline = await AIService.generateCourseOutline(
    material.title,
    material.extracted_text || '',
    {
      materialId: material.id,
      originalFilename: material.original_filename,
      slides: material.metadata?.slides,
    }
  );

  console.log(`Generated course outline: "${outline.title}" with ${outline.modules.length} modules.`);

  // Remove old course and lessons for this material to ensure clean state
  const oldCourseIds = db.courses
    .filter(c => c.source_material_id === material.id || c.title.includes('PM2-Databases'))
    .map(c => c.id);

  db.courses = db.courses.filter(c => !oldCourseIds.includes(c.id));
  db.modules = db.modules.filter(m => !oldCourseIds.includes(m.course_id));
  db.lessons = db.lessons.filter(l => !oldCourseIds.includes(l.course_id));
  writeDb(db);

  // Create course with outline
  const course = await Repository.createCourseWithOutline(
    material.user_id,
    {
      title: outline.title,
      description: outline.description,
      subject_id: material.subject_id,
      source_material_id: material.id,
      source_material_title: material.title,
      generation_status: 'completed',
      level: outline.level,
      estimated_hours: outline.estimated_hours,
    },
    outline.modules
  );

  console.log(`Successfully created Course: "${course.title}" (ID: ${course.id})`);
  const finalDb = readDb();
  const courseLessons = finalDb.lessons.filter(l => l.course_id === course.id);
  console.log(`Total lessons created: ${courseLessons.length}`);
  courseLessons.forEach((l, i) => {
    console.log(`  Lesson ${i + 1}: "${l.title}" | Slides attached: ${l.slides?.length || 0}`);
  });

  // Also forge a 5-question strictly grounded quiz for this material
  const quizGenerated = await AIService.generateQuiz(
    material.title,
    material.extracted_text || '',
    'medium',
    5
  );

  const quiz = await Repository.createQuiz(
    material.user_id,
    {
      title: quizGenerated.title,
      description: quizGenerated.description,
      difficulty: 'medium',
      course_id: course.id,
      study_material_id: material.id,
      total_questions: quizGenerated.questions.length,
      generation_status: 'completed',
    },
    quizGenerated.questions.map((q: any, i: number) => ({
      question_text: q.question_text,
      question_type: q.question_type || 'multiple_choice',
      options: q.options || [],
      correct_answer: q.correct_answer,
      grading_criteria: q.grading_criteria || '',
      explanation: q.explanation || '',
      source_references: q.source_references || [],
      order_index: i,
    }))
  );

  console.log(`Successfully forged grounded quiz: "${quiz.title}" (ID: ${quiz.id}) with ${quiz.total_questions} questions.`);
}

main().catch(err => {
  console.error('Rebuild failed:', err);
  process.exit(1);
});
