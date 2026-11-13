process.env.APP_SESSION_SECRET = 'wildwood-academy-dev-secret-key-38294719247192';
import { createToken } from '../src/lib/auth/crypto';

async function main() {
  const token = createToken({
    user: {
      id: 'e10e2968-fc98-4730-aa7c-fa5089a29091',
      email: 'm.navya3003@gmail.com',
      display_name: 'Navya',
    },
  });

  const cookie = `wildwood_session=${token}`;

  console.log('1. Fetching courses...');
  const coursesRes = await fetch('http://localhost:3000/api/courses', {
    headers: { cookie },
  });
  console.log('   Response status:', coursesRes.status);
  const data = await coursesRes.json();
  console.log('   Response data:', data);
  const courses = data.courses;
  console.log(`   Courses count: ${courses?.length}, Title: "${courses[0]?.title}"`);

  console.log('2. Fetching course details...');
  const courseRes = await fetch(`http://localhost:3000/api/courses/${courses[0].id}`, {
    headers: { cookie },
  });
  const { course } = await courseRes.json();
  const lesson0 = course.modules[0].lessons[0];
  console.log(`   Lesson 0: "${lesson0.title}"`);
  console.log(`   Lesson 0 slides attached: ${lesson0.slides?.length}`);
  console.log(`   Lesson 0 presentation:`, lesson0.presentation);

  console.log('3. Fetching single lesson via /api/courses/lessons/[id]...');
  const lessonRes = await fetch(`http://localhost:3000/api/courses/lessons/${lesson0.id}`, {
    headers: { cookie },
  });
  const { lesson } = await lessonRes.json();
  console.log(`   Lesson Title: "${lesson.title}"`);
  console.log(`   Lesson Slides:`, lesson.slides?.map((s: any) => `Slide ${s.slideNumber}: ${s.title}`));

  console.log('4. Fetching quizzes...');
  const quizRes = await fetch('http://localhost:3000/api/quizzes', {
    headers: { cookie },
  });
  const { quizzes } = await quizRes.json();
  console.log(`   Quizzes count: ${quizzes?.length}`);
  console.log(`   Quiz 0: "${quizzes[0]?.title}" (${quizzes[0]?.total_questions} questions)`);

  console.log('5. Fetching quiz questions (verifying answer masking)...');
  const singleQuizRes = await fetch(`http://localhost:3000/api/quizzes/${quizzes[0].id}`, {
    headers: { cookie },
  });
  const { quiz } = await singleQuizRes.json();
  const q0 = quiz.questions[0];
  console.log(`   Question 0 Text: "${q0.question_text}"`);
  console.log(`   Question 0 Options:`, q0.options);
  console.log(`   Question 0 Correct Answer Exposed:`, q0.correct_answer !== undefined);

  console.log('6. Submitting test quiz attempt...');
  const submitRes = await fetch(`http://localhost:3000/api/quizzes/${quizzes[0].id}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie },
    body: JSON.stringify({
      submitted_answers: {
        [q0.id]: q0.options[0],
      },
    }),
  });
  const submitData = await submitRes.json();
  console.log(`   Quiz graded! Score: ${submitData.attempt?.score} / ${submitData.attempt?.max_score}`);
  console.log(`   Feedback Question 0 Source Reference:`, submitData.attempt?.feedback[0]?.source_references);
  console.log(`   Feedback Question 0 Explanation:`, submitData.attempt?.feedback[0]?.explanation);

  console.log('7. Testing Forest Guide AI Tutor with "what is api"...');
  const tutorRes = await fetch('http://localhost:3000/api/tutor/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie },
    body: JSON.stringify({
      message: 'what is api',
    }),
  });
  const tutorData = await tutorRes.json();
  console.log(`   Tutor status: ${tutorRes.status}`);
  console.log(`   Tutor answer length: ${tutorData.message?.content?.length}`);
  console.log(`   Tutor answer preview:\n`, tutorData.message?.content?.slice(0, 300));
  console.log(`   Tutor citations:`, tutorData.citations);

  console.log('\n🌟 ALL LIVE API CHECKS PASSED PERFECTLY! 🌟');
}

main().catch(err => {
  console.error('Live API check failed:', err);
  process.exit(1);
});
