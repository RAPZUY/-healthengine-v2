'use client';

import { WORKOUT_SCHEDULE } from '@/data/workoutData';
import { PhaseVector, getExercisePose } from '@/components/ui/ExerciseVector';

export default function VectorCheckPage() {
  const variations = [];
  WORKOUT_SCHEDULE.forEach((day) => {
    day.slots?.forEach((slot) => {
      slot.variations.forEach((variation) => {
        variations.push(variation);
      });
    });
  });

  return (
    <div>
      {variations.map((variation) => {
        const pose = getExercisePose(variation.name, variation.vectorPoseCategory);
        console.log(`POSE|${variation.name}|${pose.pose}|${pose.variant ?? '-'}`);
        return (
          <div key={variation.id} style={{ width: 320 }}>
            <p>{variation.name}</p>
            <PhaseVector pose={pose.pose} variant={pose.variant} phase={1} />
            <PhaseVector pose={pose.pose} variant={pose.variant} phase={2} />
          </div>
        );
      })}
    </div>
  );
}
