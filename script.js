// Get all DOM elements
const focusBtn = document.getElementById('focus-btn');
const breakBtn = document.getElementById('break-btn');
const longBreakBtn = document.getElementById('longbreak-btn');
const timerDisplay = document.getElementById('timer-display');
const sessionCycle = document.getElementById('session-cycle');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// Timer state
let currentSession = 'focus';
let timeRemaining = 25 * 60; // in seconds
let timerInterval = null;
let isRunning = false;
let currentCycle = 1;
let focusCount = 0;

// Session durations in seconds
const SESSION_DURATIONS = {
    focus: 25 * 60,
    break: 5 * 60,
    longbreak: 15 * 60
};

// Audio
const bellSound = new Audio('bell.mp3');

// Initialize
init();

function init() {
    updateDisplay();
    updateCycleDisplay();
    setActiveButton(focusBtn);

    // Event listeners
    focusBtn.addEventListener('click', () => selectSession('focus'));
    breakBtn.addEventListener('click', () => selectSession('break'));
    longBreakBtn.addEventListener('click', () => selectSession('longbreak'));
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
}

function selectSession(session) {
    if (isRunning) return; // Prevent changing session while timer is running

    currentSession = session;
    timeRemaining = SESSION_DURATIONS[session];
    updateDisplay();

    // Update active button
    if (session === 'focus') {
        setActiveButton(focusBtn);
    } else if (session === 'break') {
        setActiveButton(breakBtn);
    } else {
        setActiveButton(longBreakBtn);
    }
}

function setActiveButton(activeBtn) {
    focusBtn.classList.remove('active');
    breakBtn.classList.remove('active');
    longBreakBtn.classList.remove('active');
    activeBtn.classList.add('active');
}

function startTimer() {
    if (isRunning) return;

    isRunning = true;
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            onSessionComplete();
        }
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;

    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeRemaining = SESSION_DURATIONS[currentSession];
    updateDisplay();
}

function updateDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateCycleDisplay() {
    sessionCycle.textContent = `${currentCycle} of 4 sessions`;
}

function onSessionComplete() {
    // Play bell sound
    bellSound.play();

    // Wait for bell to finish (5 seconds) before transitioning
    setTimeout(() => {
        autoTransition();
    }, 5000);
}

function autoTransition() {
    if (currentSession === 'focus') {
        focusCount++;

        // After 4 focus sessions, give long break
        if (focusCount === 4) {
            currentSession = 'longbreak';
            setActiveButton(longBreakBtn);
        } else {
            // Regular break after focus
            currentSession = 'break';
            setActiveButton(breakBtn);
        }
    } else if (currentSession === 'break') {
        // After break, go to focus and increment cycle
        currentSession = 'focus';
        setActiveButton(focusBtn);
        currentCycle++;
        updateCycleDisplay();
    } else if (currentSession === 'longbreak') {
        // After long break, stop and reset cycle
        currentSession = 'focus';
        setActiveButton(focusBtn);
        focusCount = 0;
        currentCycle = 1;
        updateCycleDisplay();
        timeRemaining = SESSION_DURATIONS[currentSession];
        updateDisplay();
        return; // Don't auto-start after long break
    }

    // Set time for next session and auto-start
    timeRemaining = SESSION_DURATIONS[currentSession];
    updateDisplay();
    startTimer();
}
