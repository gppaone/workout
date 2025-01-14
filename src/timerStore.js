// src/timerStore.js
import { writable } from 'svelte/store';

export const exercises = writable([
    { name: "Push-ups", duration: 30 },
    { name: "Squats", duration: 30 },
    { name: "Plank", duration: 30 },
    { name: "Oblique Twists", duration: 30 },
    { name: "Arm Haulers", duration: 30 },
    { name: "Knee to Nose", duration: 30 },
    { name: "Leg Raises", duration: 30 },
    { name: "Jumping Jacks", duration: 30 },
    { name: "Good Mornings", duration: 30 },
    { name: "Lunges", duration: 30 },
    { name: "Sit-ups", duration: 30 },
    { name: "Lying Heel Taps", duration: 30 }
]);

export const settings = writable({
    restDuration: 10,
    warningBeforeEnd: 5
});

export const currentExerciseIndex = writable(0);
export const isPaused = writable(false);
export const isResting = writable(false);
export const timeLeft = writable(0);
export const isRunning = writable(false);