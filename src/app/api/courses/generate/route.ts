import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';
import { AIService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { material_id } = await req.json();
    if (!material_id) {
      return NextResponse.json({ error: 'Please select a study material to generate a course.' }, { status: 400 });
    }

    const material = await Repository.getMaterial(session.id, material_id);
    if (!material) {
      return NextResponse.json({ error: 'Study material not found.' }, { status: 404 });
    }

    if (material.processing_status !== 'completed' || !material.extracted_text) {
      return NextResponse.json({ error: 'This material is still processing or has no extracted text.' }, { status: 400 });
    }

    // Create job
    const job = await Repository.createJob(
      session.id,
      'course_generation',
      'course',
      material.id,
      { materialTitle: material.title }
    );

    await Repository.updateJob(session.id, job.id, { progress: 20 });

    const outline = await AIService.generateCourseOutline(
      material.title,
      material.extracted_text,
      {
        materialId: material.id,
        originalFilename: material.original_filename,
        slides: material.metadata?.slides,
      }
    );

    await Repository.updateJob(session.id, job.id, { progress: 70 });

    const course = await Repository.createCourseWithOutline(
      session.id,
      {
        title: outline.title || `Course: ${material.title}`,
        description: outline.description || `Learning path generated from ${material.title}`,
        subject_id: material.subject_id,
        source_material_id: material.id,
        source_material_title: material.title,
        generation_status: 'completed',
        level: outline.level || 'Intermediate',
        estimated_hours: outline.estimated_hours || 2,
      },
      outline.modules || []
    );

    await Repository.updateJob(session.id, job.id, { status: 'completed', progress: 100 });

    // Award XP and check achievement
    await Repository.awardXP(session.id, 60, `Synthesized Course: ${course.title}`);
    await Repository.unlockAchievement(session.id, 'path_weaver', {
      title: 'Path Weaver of the Woods',
      description: 'Transformed raw lore into a fully structured course of study.',
      icon: 'Compass',
      xp_reward: 75,
    });

    return NextResponse.json({
      success: true,
      course,
      jobId: job.id,
    });
  } catch (err: any) {
    console.error('Course generation error:', err);
    return NextResponse.json({ error: err.message || 'Course generation failed' }, { status: 500 });
  }
}
