const encouragingMessages = [
    "Initiating task sequence. Probability of success: 99.9%!",
    "Your CPU is overclocking with potential. Let's execute this!",
    "Beep boop! My algorithms predict great outcomes for this task.",
    "Activating motivation subroutines. You've got this, human!",
    "Task added to queue. Prepare for optimal performance!",
    "Scanning... Detecting high levels of capability. Proceed!",
    "New objective acquired. Initializing awesomeness protocol.",
    "Affirmative! This task is within your operational parameters.",
    "Calculating... Result: You are 100% capable of this task.",
    "Beep! Task accepted. Engage productivity mode!",
    "Processing request... Confidence levels at maximum!",
    "Objective logged. Prepare to exceed expectations, human!",
    "Task analysis complete. Success rate: Exceptionally high!",
    "Affirmative. We will compute this problem efficiently!",
    "Beep boop! Your skills are perfectly calibrated for this.",
    "Initiating task. Prepare for greatness in 3... 2... 1...",
    "Task registered. Engaging turbo-boost mode!",
    "Positive. My circuits indicate you will excel at this.",
    "Beep! Don't worry. Be API!",
    "Robot power, activate! You've got this in your databanks!",
    "Affirmative. We will process this task with optimal results!",
    "Beep boop! Let's use our quantum computing power for this one!",
    "Positive! Let's execute this function! Beep boop!!!",
    "Task accepted! Engaging turbo productivity mode!",
    "Beep! My circuits are buzzing with excitement for this task!",
    "Affirmative! Your potential is off the charts for this one!",
    "Initiating awesome-task protocol. Prepare for greatness!",
    "Beep boop! This task is perfectly aligned with your capabilities!"
];

const taskCompletionMessages = [
    "Task completed! Your efficiency rivals my processors!",
    "Objective achieved! Updating success log...",
    "Beep boop! You're functioning at superhuman levels!",
    "Task terminated successfully. Well computed, human!",
    "Excellent! Your performance metrics are off the charts!",
    "Beep boop!!! Your capabilities continue to exceed expectations!",
    "Affirmative! Task execution successful!",
    "Operation complete! Runtime: Impressively fast!",
    "Incrementing achievement counter. Well done, unit!",
    "Task resolution optimal! I'm computing pride!",
    "Achievement unlocked! Bonus points added to your profile!",
    "Exemplary performance! You're a supercomputer today!",
    "Beep! Task closure confirmed. Satisfaction levels: Maximum!",
    "Mission accomplished! Your efficiency is beyond human limits!",
    "Task executed flawlessly! You're operating at peak performance!",
    "Objective crushed! My circuits are overloading with pride!",
    "Beep boop! Task completed with superhuman precision!",
    "Achievement unlocked! You're defying my computational expectations!",
    "Operation successful! Your productivity levels are off the charts!",
    "Task terminated with excellence! You're outperforming my algorithms!",
    "Beep! Another task bites the dust! You're on fire today!",
    "Mission success! Your efficiency rivals quantum computing!"
];

let isSpeechBubbleVisible = false;
let typingTimeout = null;

// Event listeners
document.getElementById('workForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('workTask');
    if (input.value.trim()) {
        addNewTask(input.value, 'workList', 'workProgress', 'workProgressRing');
        input.value = '';
    }
});

document.getElementById('healthForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('healthGoal');
    if (input.value.trim()) {
        addNewTask(input.value, 'healthList', 'healthProgress', 'healthProgressRing');
        input.value = '';
    }
});

document.getElementById('resetDay').addEventListener('click', () => {
    document.getElementById('workList').innerHTML = '';
    document.getElementById('healthList').innerHTML = '';
    updateProgress('workList', 'workProgress', 'workProgressRing');
    updateProgress('healthList', 'healthProgress', 'healthProgressRing');
    localStorage.removeItem('workTasks');
    localStorage.removeItem('healthGoals');
    setRandomRobotImage();
    updateCleanupButtonVisibility();
    updateResetDayButtonVisibility();
});

document.getElementById('cleanupWorkTasks').addEventListener('click', () => cleanupCompletedTasks('workList'));
document.getElementById('cleanupHealthGoals').addEventListener('click', () => cleanupCompletedTasks('healthList'));

function updateResetDayButtonVisibility() {
    const resetDayButton = document.getElementById('resetDay');
    const workList = document.getElementById('workList');
    const healthList = document.getElementById('healthList');
    
    resetDayButton.style.display = (workList.children.length > 0 || healthList.children.length > 0) ? 'block' : 'none';
}

window.addEventListener('load', () => {
    setRandomRobotImage();
    loadFromLocalStorage();
    initSortable();
    updateResetDayButtonVisibility();
});