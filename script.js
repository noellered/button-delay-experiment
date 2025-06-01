const button = document.getElementById("clickButton");
const body = document.body;
let clickCount = 0;
let currentDelay = 0;
let soundEnabled = true;

const delayIncrementInput = document.getElementById("delayIncrement");
const clicksBeforeDelayInput = document.getElementById("clicksBeforeDelay");
const maxDelayInput = document.getElementById("maxDelay");
const settingsButton = document.getElementById("settingsButton");
const settingsPopup = document.getElementById("settingsPopup");
const resetButton = document.getElementById("resetButton");
const soundButton = document.getElementById("soundButton");

const DEFAULT_VALUES = {
  delayIncrement: 10,
  clicksBeforeDelay: 5,
  maxDelay: 200,
};

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playClickSound() {
  if (!soundEnabled) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}

function flashScreen() {
  body.classList.add("flash");
  playClickSound();

  setTimeout(() => {
    body.classList.remove("flash");
  }, 100);
}

function getConfigValue(input) {
  return parseInt(input.value, 10) || 0;
}

function resetToDefaults() {
  delayIncrementInput.value = DEFAULT_VALUES.delayIncrement;
  clicksBeforeDelayInput.value = DEFAULT_VALUES.clicksBeforeDelay;
  maxDelayInput.value = DEFAULT_VALUES.maxDelay;
  currentDelay = 0;
  clickCount = 0;
}

function toggleSettings(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  settingsButton.classList.toggle("active");
  settingsPopup.classList.toggle("visible");
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const icon = soundButton.querySelector("i");
  icon.className = soundEnabled ? "fas fa-volume-up" : "fas fa-volume-mute";
}

// Close settings when clicking outside
document.addEventListener("click", (event) => {
  if (
    !settingsButton.contains(event.target) &&
    !settingsPopup.contains(event.target)
  ) {
    settingsButton.classList.remove("active");
    settingsPopup.classList.remove("visible");
  }
});

settingsPopup.addEventListener("click", (event) => {
  event.stopPropagation();
});

settingsButton.addEventListener("click", toggleSettings);
resetButton.addEventListener("click", resetToDefaults);
soundButton.addEventListener("click", toggleSound);

button.addEventListener("click", () => {
  clickCount++;

  const clicksBeforeDelay = getConfigValue(clicksBeforeDelayInput);
  const delayIncrement = getConfigValue(delayIncrementInput);
  const maxDelay = getConfigValue(maxDelayInput);

  if (clickCount % clicksBeforeDelay === 0) {
    currentDelay += delayIncrement;
    console.log("Current Delay:", currentDelay);
    if (currentDelay > maxDelay) {
      currentDelay = 0;
      console.log("Resetting Delay");
    }
  }

  setTimeout(flashScreen, currentDelay);
});
