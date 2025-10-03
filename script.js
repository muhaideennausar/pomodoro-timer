// Timer state variables
let isRunning = false;
let isPaused = false;
let isFocusMode = true;
let timeLeft = 25 * 60; // 25 minutes in seconds
let timerInterval = null;
let completedOneCycle = false; // Track if one full cycle is done

// Default durations
const FOCUS_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60;  // 5 minutes

// DOM elements
const timerDisplay = document.querySelector('h1');
const statusDisplay = document.querySelector('.focus-break');
const startBtn = document.querySelector('.start-btn');
const pauseBtn = document.querySelector('.pause-btn');
const resetBtn = document.querySelector('.reset-btn');

// Audio element - ONLY bell sound for completion
const bellSound = new Audio('bell.mp3');

// Format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Update timer display
function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
}

// Play bell sound
function playBell() {
    bellSound.currentTime = 0;
    bellSound.play().catch(err => console.log('Audio play failed:', err));
}

// Run the countdown
function runTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            // Timer completed - PLAY BELL
            clearInterval(timerInterval);
            playBell();

            // Check if this is focus ending (going to break) or break ending (cycle complete)
            if (isFocusMode) {
                // Focus just finished, start break automatically
                isFocusMode = false;
                statusDisplay.textContent = 'BREAK TIME';
                timeLeft = BREAK_DURATION;
                updateDisplay();
                runTimer(); // Auto-start break
            } else {
                // Break just finished, one cycle complete - STOP
                isRunning = false;
                isFocusMode = true;
                statusDisplay.textContent = 'FOCUS TIME';
                timeLeft = FOCUS_DURATION;
                updateDisplay();
                // Don't start timer again - wait for user to click Start
            }
        }
    }, 1000);
}

// Start timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        isPaused = false;
        runTimer();
    }
}

// Pause timer
function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        isPaused = true;
    }
}

// Reset timer
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = false;
    isFocusMode = true;
    timeLeft = FOCUS_DURATION;
    statusDisplay.textContent = 'FOCUS TIME';
    updateDisplay();
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize display
updateDisplay();
