'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TutorChat } from '@/components/tutor/TutorChat';

function TutorContent() {
  const searchParams = useSearchParams();
  const materialId = searchParams.get('material_id') || undefined;
  const lessonId = searchParams.get('lesson_id') || undefined;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold text-parchment">
          The Forest Guide
        </h1>
        <p className="text-xs md:text-sm text-sage mt-1">
          Your source-grounded woodland mentor. Inquire about theorems, request worked solutions, or practice step-by-step recall.
        </p>
      </div>

      <TutorChat initialMaterialId={materialId} initialLessonId={lessonId} />
    </div>
  );
}

export default function TutorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-sage">Connecting to the Forest Guide...</div>}>
      <TutorContent />
    </Suspense>
  );
}
