
const playButton = document.getElementById("playButton");
const stopButton = document.getElementById("stopButton");
const statusText = document.getElementById("status");

const notes = [
  "F5", "F5", "E5", "G5", "E5",
  "F5", "F5", "E5", "F5", "G5", "F5", "E5",
  "F5", "F5", "E5", "G5", "E5",
  "F5", "F5", "E5", "F5", "G5", "F5", "D5", "E5"
];

const frequencies = {
  F5: 698.46,
  E5: 659.25,
  G5: 783.99,
  D5: 587.33
};

let audioContext;
let timers = [];
let isPlaying = false;

function stopMusic() {
  timers.forEach(timer => clearTimeout(timer));
  timers = [];
  isPlaying = false;

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  statusText.textContent = "Music stopped.";
}

async function playMusic() {
  stopMusic();

  audioContext = new (
    window.AudioContext || window.webkitAudioContext
  )();

  await audioContext.resume();

  isPlaying = true;
  statusText.textContent = "♪ Playing your inspired melody...";

  const startTime = audioContext.currentTime + 0.1;
  const noteDuration = 0.38;

  notes.forEach((note, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    const time = startTime + index * noteDuration;

    oscillator.type = "triangle";
    oscillator.frequency.value = frequencies[note];

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.18, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      time + noteDuration * 0.85
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(time);
    oscillator.stop(time + noteDuration);

  });

  const totalDuration = notes.length * noteDuration;

  const finishTimer = setTimeout(() => {
    isPlaying = false;
    statusText.textContent = "Melody finished. Play again ✨";
    audioContext?.close();
    audioContext = null;
  }, totalDuration * 1000 + 200);

  timers.push(finishTimer);
}

playButton.addEventListener("click", playMusic);
stopButton.addEventListener("click", stopMusic);
