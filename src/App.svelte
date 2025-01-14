<script>
    import { onMount } from "svelte";
    import {
      exercises,
      settings,
      currentExerciseIndex,
      isPaused,
      isResting,
      isRunning,
      timeLeft
    } from "./timerStore";
  
    let interval;
    let audioContext;
    let warningSound;
  
    async function loadWarningSound() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const response = await fetch("/sounds/whistle.mp3");
        const arrayBuffer = await response.arrayBuffer();
        warningSound = await audioContext.decodeAudioData(arrayBuffer);
    }
  
    function playDing() {
      const source = audioContext.createBufferSource();
      source.buffer = warningSound;
      source.connect(audioContext.destination);
      source.start(0);
    }
  
    let exercisesList = [];
    let appSettings;
    let currentIndex = 0;
    let isRest = false;
  
    $: $exercises, exercisesList = $exercises;
    $: $settings, appSettings = $settings;
    $: $currentExerciseIndex, currentIndex = $currentExerciseIndex;
    $: $isResting, isRest = $isResting;
  
    const startTimer = (duration) => {
      $timeLeft = duration;
      $isRunning = true;
      interval = setInterval(() => {
        if(!$isPaused) {
            if ($timeLeft > 1) {
                $timeLeft--;
                if ($timeLeft <= appSettings.warningBeforeEnd && !isRest) {
                    playDing();
                }
            } else {
                clearInterval(interval);
                if (isRest) {
                    $currentExerciseIndex++;
                    $isResting = false;
                    if (currentIndex < exercisesList.length) {
                        startTimer(exercisesList[currentIndex].duration);
                    } else {
                        $isRunning = false;
                    }
                } else {
                    $isResting = true;
                    startTimer(appSettings.restDuration);
                }
            }
        }
      }, 1000);
    };

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    function togglePause() {
        $isPaused = !$isPaused;
    }

    onMount(async () => {
      await loadWarningSound();
    });
  </script>
  
  <main class="items-center justify-center w-full">
     <div class="flex mb-4 gap-2 w-full">
        <button
        class="bg-slate-500 text-white py-3 px-4 btn w-1/2 btn-outline text-xl"
        on:click={() => startTimer($exercises[$currentExerciseIndex].duration)}
        disabled={$isRunning}
      >
        Start
      </button>
      <button
        class="bg-slate-500 text-white py-3 px-4 btn w-1/2 btn-outline text-xl"
        class:bg-yellow-600="{$isPaused}"
        on:click={togglePause}
      >
        {$isPaused ? "Resume" : "Pause"}
      </button>
    </div>
  
    {#if currentIndex < exercisesList.length}
      <div class="text-center">
        <h2 class="text-4xl m-3">
          {isRest ? "Rest Time" : exercisesList[currentIndex].name}
        </h2>
        <p class="text-6xl font-bold">{formatTime($timeLeft)}</p>
      </div>
    {:else}
      <h2 class="text-3xl">Workout Complete!</h2>
    {/if}
  
    <ul class="mt-6">
      {#each exercisesList as exercise, index}
        <li
          class="mb-2 w-full !py-4"
          class:bg-green-600="{index === currentIndex && !isRest}"
          class:bg-red-600="{index === currentIndex && isRest}"
          class:bg-gray-700="{index !== currentIndex}"
        >
          {exercise.name}
        </li>
      {/each}
    </ul>

  </main>
  
  <style>
    li {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      color: white;
    }
  </style>