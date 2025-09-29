// script.js
const colors = ['green', 'red', 'yellow', 'blue'];
let sequence = [];
let playerSequence = [];
let round = 0;

const colorFrequencies = {
  green: 261.6,  // C4
  red: 329.6,    // E4
  yellow: 392.0, // G4
  blue: 523.3    // C5
};

function playNote(frequency) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine'; // tipo de onda: sine, square, triangle, etc.
  oscillator.frequency.value = frequency; // frequência em Hz
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); // volume
  oscillator.stop(audioCtx.currentTime + 0.3); // duração de 0.3s
}

const startButton = document.getElementById('start');
const colorElements = colors.map(color => document.getElementById(color));

startButton.addEventListener('click', startGame);

function startGame() {
  sequence = [];
  playerSequence = [];
  round = 0;
  updateRoundDisplay();
  nextRound();
}

function updateRoundDisplay() {
  let roundDisplay = document.getElementById('round-display');
  if (!roundDisplay) {
    roundDisplay = document.createElement('div');
    roundDisplay.id = 'round-display';
    roundDisplay.style.margin = '10px';
    document.body.insertBefore(roundDisplay, document.getElementById('game-board'));
  }
  roundDisplay.textContent = `Rodada: ${round}`;
}

function nextRound() {
  round++;
  updateRoundDisplay();
  playerSequence = [];
  const nextColor = colors[Math.floor(Math.random() * 4)];
  sequence.push(nextColor);
  playSequence();
}

function playSequence() {
  let delay = 0;
  sequence.forEach((color, index) => {
    setTimeout(() => {
      flashColor(color);
    }, delay);
    delay += 600;
  });
}

function flashColor(color) {
  const el = document.getElementById(color);
  el.classList.add('active');
  playNote(colorFrequencies[color]); // toca a nota
  setTimeout(() => el.classList.remove('active'), 400);
}

colorElements.forEach(el => {
  el.addEventListener('click', () => {
    const color = el.id;
    playerSequence.push(color);
    flashColor(color);
    checkInput();
  });
});

function checkInput() {
  const currentIndex = playerSequence.length - 1;
  if (playerSequence[currentIndex] !== sequence[currentIndex]) {
    alert('Você errou! Tente novamente.');
    return;
  }

  if (playerSequence.length === sequence.length) {
    setTimeout(nextRound, 1000);
  }
}