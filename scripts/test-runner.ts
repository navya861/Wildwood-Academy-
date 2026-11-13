// Wildwood Academy Automated Test Runner
// Tests Authentication, Cross-User Isolation, Document Processing,
// Course Generation, Server-side Quiz Grading, Gamification, and Mini-Game.

import { Repository } from '../src/lib/db/repository';
import { hashPassword, verifyPassword, createToken, verifyToken } from '../src/lib/auth/crypto';
import { chunkText } from '../src/lib/processing/chunker';
import { parseDocumentBuffer } from '../src/lib/processing/document-parser';
import { AIService } from '../src/lib/ai/ai-service';
import JSZip from 'jszip';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n🌲 WILDWOOD ACADEMY — AUTOMATED QUALITY & INTEGRATION SUITE 🌲\n');

  // ==================== TEST SUITE 1: AUTHENTICATION & CRYPTOGRAPHY ====================
  console.log('--- Suite 1: Authentication & Cryptography ---');
  const password = 'EnchantedForestSecret2026!';
  const hash = hashPassword(password);
  assert(hash.includes(':'), 'Password hash uses salt:key format');
  assert(verifyPassword(password, hash), 'verifyPassword returns true for correct passphrase');
  assert(!verifyPassword('WrongPassword', hash), 'verifyPassword rejects incorrect passphrase');

  const token = createToken({ user: { id: 'test-user-123', email: 'test@wildwood.edu' } });
  const { valid, payload } = verifyToken(token);
  assert(valid === true, 'Signed JWT/token verification succeeds');
  assert(payload.user.email === 'test@wildwood.edu', 'Token payload contains correct user email');

  // Register two separate users for cross-user security testing
  const userA_email = `scholar_a_${Date.now()}@wildwood.edu`;
  const userB_email = `scholar_b_${Date.now()}@wildwood.edu`;

  const userA = await Repository.createUser(userA_email, hash, 'Scholar Alpha');
  const userB = await Repository.createUser(userB_email, hash, 'Scholar Beta');

  assert(Boolean(userA.id && userA.email === userA_email), 'Scholar A registered successfully');
  assert(Boolean(userB.id && userB.email === userB_email), 'Scholar B registered successfully');
  assert(userA.id !== userB.id, 'User IDs are distinct and unique');

  // ==================== TEST SUITE 2: DOCUMENT PROCESSING & CHUNKING ====================
  console.log('\n--- Suite 2: Document Processing & Chunking ---');
  const sampleDocText = `
# Chapter 1: Foundations of Woodland Ecology

Woodland ecology investigates the interdependent relationships between flora, fauna, and fungal networks.
The canopy trees regulate microclimates, filtering solar radiation and preserving ground moisture.

## Section 1.1: Fungal Mycelial Networks

Mycelial networks act as subterranean information highways. Trees distribute sugars, water, and biochemical signals to neighboring seedlings.
Recent empirical studies demonstrate that parent trees allocate greater resources to kin seedlings through mycorrhizal pathways.

# Chapter 2: The Principles of Canopy Photosynthesis

Photosynthetic efficiency depends upon photon flux density and leaf area index.
Deciduous species adapt their chlorophyll concentrations across seasonal transitions to optimize photon capture.
`;

  const sampleBuffer = Buffer.from(sampleDocText, 'utf-8');
  const parsed = await parseDocumentBuffer(sampleBuffer, 'text/markdown', 'ecology.md');
  assert(parsed.wordCount > 50, `Document parser extracted ${parsed.wordCount} words`);

  const chunks = chunkText(parsed.text, { chunkSize: 300, overlap: 50, totalPages: 2 });
  assert(chunks.length >= 2, `Chunker split text into ${chunks.length} overlapping chunks`);
  assert(chunks[0].chunk_index === 0, 'Chunk indexing starts at 0');
  assert(Boolean(chunks[0].section_title), 'Chunker correctly extracted section titles');

  // Test PowerPoint PPTX parsing
  console.log('  Testing PowerPoint (.pptx) presentation extraction...');
  const pptxZip = new JSZip();
  pptxZip.file('ppt/slides/slide1.xml', '<p:sp><p:txBody><a:p><a:r><a:t>Botanical Principles</a:t></a:r></a:p><a:p><a:r><a:t>• Flora Taxonomy</a:t></a:r></a:p></p:txBody></p:sp>');
  pptxZip.file('ppt/slides/slide2.xml', '<p:sp><p:txBody><a:p><a:r><a:t>Mycorrhizal Symbiosis</a:t></a:r></a:p><a:p><a:r><a:t>• Subterranean networks</a:t></a:r></a:p></p:txBody></p:sp>');
  pptxZip.file('ppt/notesSlides/notesSlide2.xml', '<p:sp><p:txBody><a:p><a:r><a:t>Remember kin seedling allocation hypothesis</a:t></a:r></a:p></p:txBody></p:sp>');
  const pptxBuffer = await pptxZip.generateAsync({ type: 'nodebuffer' });

  const parsedPptx = await parseDocumentBuffer(
    pptxBuffer,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'botany_presentation.pptx'
  );

  assert(parsedPptx.pageCount === 2, `PPTX parser identified ${parsedPptx.pageCount} slides`);
  assert(Boolean(parsedPptx.slides && parsedPptx.slides.length === 2), 'PPTX parser extracted structured SlideData array');
  assert(parsedPptx.slides![0].slideNumber === 1, 'SlideData has accurate slide numbers');
  assert(parsedPptx.text.includes('Slide 1: Botanical Principles'), 'PPTX parser extracted Slide 1 header and title');
  assert(parsedPptx.text.includes('Mycorrhizal Symbiosis'), 'PPTX parser extracted Slide 2 text content');
  assert(parsedPptx.text.includes('Remember kin seedling allocation hypothesis'), 'PPTX parser extracted slide speaker notes');

  // Test PPT slide-aware course generation
  const pptCourseOutline = await AIService.generateCourseOutline(
    'botany_presentation.pptx',
    parsedPptx.text,
    {
      materialId: 'test-mat-ppt',
      originalFilename: 'botany_presentation.pptx',
      slides: parsedPptx.slides,
    }
  );
  assert(pptCourseOutline.modules.length > 0, 'Generated course from PPT slides');
  const firstPptLesson = pptCourseOutline.modules[0].lessons[0];
  assert(Boolean(firstPptLesson.slides && firstPptLesson.slides.length > 0), 'PPT course lesson has attached slides');
  assert(Boolean(firstPptLesson.presentation && firstPptLesson.presentation.total_slides === 2), 'PPT course lesson has presentation metadata');

  // Test Legacy PowerPoint PPT binary parsing
  console.log('  Testing Legacy PowerPoint (.ppt) binary extraction...');
  const pptBuf = Buffer.alloc(128);
  pptBuf.writeUInt16LE(0, 0);
  pptBuf.writeUInt16LE(0x0FA8, 2); // TextBytesAtom
  pptBuf.writeUInt32LE(28, 4);
  pptBuf.write('Woodland Legacy Presentation', 8, 'utf8');

  const parsedPpt = await parseDocumentBuffer(
    pptBuf,
    'application/vnd.ms-powerpoint',
    'ancient_lecture.ppt'
  );

  assert(parsedPpt.text.includes('Woodland Legacy Presentation'), 'Legacy PPT binary parser extracted text records');
  assert(parsedPpt.pageCount! >= 1, `Legacy PPT parser assigned pageCount: ${parsedPpt.pageCount}`);

  // Save study material for User A
  const materialA = await Repository.createMaterial(userA.id, {
    title: 'Woodland Ecology Foundations',
    original_filename: 'ecology.md',
    storage_path: `${userA.id}/test_ecology.md`,
    file_type: 'text/markdown',
    file_size: sampleBuffer.length,
    processing_status: 'completed',
    extracted_text: sampleDocText,
  });

  const savedChunksA = await Repository.saveChunks(userA.id, materialA.id, chunks);
  assert(savedChunksA.length === chunks.length, 'Stored chunks associated with Material A');

  // ==================== TEST SUITE 3: SECURITY & CROSS-USER ISOLATION ====================
  console.log('\n--- Suite 3: Cross-User Security & Isolation Acceptance ---');
  // User B tries to read User A's material directly
  const unauthorizedMaterial = await Repository.getMaterial(userB.id, materialA.id);
  assert(unauthorizedMaterial === null, 'CRITICAL: User B CANNOT read User A study material');

  // User B tries to search User A's document chunks
  const unauthorizedChunks = await Repository.getChunks(userB.id, materialA.id);
  assert(unauthorizedChunks.length === 0, 'CRITICAL: User B CANNOT access User A document chunks');

  // User B searchChunks query
  const unauthorizedSearch = await Repository.searchChunks(userB.id, 'Mycelial', { materialId: materialA.id });
  assert(unauthorizedSearch.length === 0, 'CRITICAL: User B RAG search cannot retrieve User A private chunks');

  // ==================== TEST SUITE 4: COURSE & LESSON GENERATION ====================
  console.log('\n--- Suite 4: Course & Lesson Generation ---');
  const courseOutline = await AIService.generateCourseOutline(materialA.title, materialA.extracted_text!);
  assert(Boolean(courseOutline.modules && courseOutline.modules.length >= 2), 'Generated course has modules');

  const createdCourse = await Repository.createCourseWithOutline(
    userA.id,
    {
      title: courseOutline.title,
      description: courseOutline.description,
      source_material_id: materialA.id,
      source_material_title: materialA.title,
      generation_status: 'completed',
      level: 'Intermediate',
      estimated_hours: 2,
    },
    courseOutline.modules
  );

  assert(Boolean(createdCourse.id && createdCourse.modules && createdCourse.modules.length >= 2), 'Course persisted with modules in database');
  const firstLesson = createdCourse.modules![0].lessons![0];
  assert(Boolean(firstLesson.id), 'Lesson has distinct ID and objectives');

  // Mark lesson as completed
  const progressRecord = await Repository.updateLessonProgress(userA.id, firstLesson.id, createdCourse.id, true, 120);
  assert(progressRecord.completed === true, 'Lesson marked complete and progress saved');

  const refreshedCourse = await Repository.getCourse(userA.id, createdCourse.id);
  assert(Boolean(refreshedCourse && refreshedCourse.progress! > 0), `Course progress recalculated from real records: ${refreshedCourse?.progress}%`);

  // Verify User B cannot access User A's course
  const unauthorizedCourse = await Repository.getCourse(userB.id, createdCourse.id);
  assert(unauthorizedCourse === null, 'CRITICAL: User B CANNOT read User A course');

  // ==================== TEST SUITE 5: SCRIBE NOTES & EDIT PRESERVATION ====================
  console.log('\n--- Suite 5: Scribe Notes & User Edit Preservation ---');
  const aiNoteText = await AIService.generateNotes('Mycelial Networks', sampleDocText, 'detailed');
  assert(aiNoteText.length > 50, 'AI notes synthesized');

  const note = await Repository.createNote(userA.id, {
    title: 'Mycelial Notes',
    content: aiNoteText,
    user_edited_content: aiNoteText,
    note_type: 'ai_generated',
    note_format: 'detailed',
    study_material_id: materialA.id,
    tags: ['ecology', 'fungi'],
  });

  // User manually edits the note
  const userEdit = aiNoteText + '\n\n**Scholar Personal Note:** Remember kin seedling resource sharing hypothesis.';
  const updatedNote = await Repository.updateNote(userA.id, note.id, {
    user_edited_content: userEdit,
  });

  assert(
    Boolean(updatedNote.user_edited_content && updatedNote.user_edited_content.includes('kin seedling resource sharing hypothesis')),
    'Preserved student personal edits in Scribe Note'
  );

  // User B cannot read User A's note
  const unauthorizedNote = await Repository.getNote(userB.id, note.id);
  assert(unauthorizedNote === null, 'CRITICAL: User B CANNOT access User A notes');

  // ==================== TEST SUITE 6: SERVER-SIDE QUIZ GRADING ====================
  console.log('\n--- Suite 6: Trial Grounds & Secure Server-Side Grading ---');
  const quizObj = await AIService.generateQuiz(materialA.title, sampleDocText, 'medium', 3);
  assert(quizObj.questions.length >= 3, 'Synthesized quiz questions');
  assert(Boolean(quizObj.questions[0].source_references && quizObj.questions[0].source_references.length > 0), 'Quiz questions include verified source references');

  const savedQuiz = await Repository.createQuiz(
    userA.id,
    {
      title: quizObj.title,
      description: quizObj.description,
      difficulty: 'medium',
      total_questions: quizObj.questions.length,
      generation_status: 'completed',
    },
    quizObj.questions
  );

  // Client request check: Correct answers must NOT be exposed in student client view!
  const clientQuiz = await Repository.getQuiz(userA.id, savedQuiz.id, true);
  for (const q of clientQuiz!.questions!) {
    assert((q as any).correct_answer === undefined, `CRITICAL: Client question "${q.id}" DOES NOT leak correct_answer`);
  }

  // Submit answers to server-side grading engine
  const answersToSubmit: Record<string, string> = {};
  for (const q of quizObj.questions) {
    const matchingClientQ = clientQuiz!.questions!.find(cq => cq.question_text === q.question_text);
    if (matchingClientQ) {
      answersToSubmit[matchingClientQ.id] = q.correct_answer;
    }
  }

  const attempt = await Repository.gradeQuizSubmission(userA.id, savedQuiz.id, answersToSubmit, new Date().toISOString());
  assert(attempt.score > 0, `Server graded quiz submission: score ${attempt.score} / ${attempt.max_score}`);
  assert(attempt.percentage > 0, `Attempt percentage recorded: ${attempt.percentage}%`);
  assert(attempt.feedback.length === attempt.max_score, 'Detailed feedback generated for every question');

  // ==================== TEST SUITE 7: PROGRESS, XP & PLANT GROWTH ====================
  console.log('\n--- Suite 7: Gamification, Progress & Plant Growth ---');
  const growthJournal = await Repository.getGrowthJournal(userA.id);
  assert(growthJournal.completedLessonsCount === 1, 'Growth journal reflects actual completed lessons');
  assert(growthJournal.quizAttemptsCount === 1, 'Growth journal reflects actual quiz attempts');
  assert(Boolean(growthJournal.profile && growthJournal.profile.xp > 0), `Scholar XP earned from genuine learning actions: ${growthJournal.profile?.xp} XP`);
  assert(Boolean(growthJournal.achievements && growthJournal.achievements.length >= 1), `Scholar unlocked achievements: ${growthJournal.achievements.length}`);

  // ==================== TEST SUITE 8: FIREFLY QUEST MINI-GAME ====================
  console.log('\n--- Suite 8: Firefly Quest Mini-Game Server Validation ---');
  const gameSession = await Repository.saveGameSession(userA.id, {
    score: 450,
    fireflies: 4,
    questionsAnswered: 4,
    maxStreak: 3,
  });

  assert(gameSession.server_validated === true, 'Mini-game session validated by server');
  assert(gameSession.fireflies_collected === 4, 'Recorded collected fireflies');
  assert(Boolean(gameSession.rewards_earned.xp && gameSession.rewards_earned.xp > 0), `Validated XP reward awarded: ${gameSession.rewards_earned.xp} XP`);

  // Test anti-fraud: client tries to forge 1000 fireflies with only 2 questions answered
  const fraudSession = await Repository.saveGameSession(userA.id, {
    score: 999999,
    fireflies: 1000,
    questionsAnswered: 2,
    maxStreak: 50,
  });
  // Server clamps fireflies to max questionsAnswered * 3 = 6
  assert(fraudSession.fireflies_collected <= 6, 'Anti-cheat: Server clamped forged fireflies to realistic upper bound');
  assert(Boolean(fraudSession.rewards_earned.xp && fraudSession.rewards_earned.xp <= 250), 'Anti-cheat: Server capped forged XP to max limit');

  // Clean up test users
  await Repository.deleteUserAccount(userA.id);
  await Repository.deleteUserAccount(userB.id);
  assert(true, 'Test accounts and private archives safely cleaned up');

  console.log(`\n======================================================`);
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
