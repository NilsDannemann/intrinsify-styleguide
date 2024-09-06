let currentFocusedTask = null;
let isShiftPressed = false;

function initKeyboardControls() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('click', handleDocumentClick);
}

function handleKeyDown(event) {
    // Only proceed if we're on desktop
    if (window.innerWidth < 768) return;

    if (event.key === 'Shift') {
        isShiftPressed = true;
    }

    if (event.key === 'Escape') {
        handleEscapeKey();
        return;
    }

    // Check if an input is focused
    if (document.activeElement.tagName === 'INPUT') {
        return; // Exit the function if an input is focused
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        if (!currentFocusedTask) {
            currentFocusedTask = document.querySelector('.task-item');
        } else {
            if (isShiftPressed) {
                moveTask(event.key === 'ArrowUp' ? 'up' : 'down');
            } else {
                navigateTasks(event.key === 'ArrowUp' ? 'prev' : 'next');
            }
        }
        highlightTask();
    }

    // Add Enter key handling
    if (event.key === 'Enter' && currentFocusedTask) {
        event.preventDefault();
        toggleTaskCompletion(currentFocusedTask);
    }
}

function handleKeyUp(event) {
    if (event.key === 'Shift') {
        isShiftPressed = false;
    }
}

function handleDocumentClick(event) {
    // Check if the click is outside any task item
    if (!event.target.closest('.task-item')) {
        removeHighlight();
    }
}

function removeHighlight() {
    if (currentFocusedTask) {
        currentFocusedTask.style.outline = 'none';
        currentFocusedTask = null;
    }
}

function handleEscapeKey() {
    // Remove focus from any active element
    if (document.activeElement) {
        document.activeElement.blur();
    }
    // Clear any text selection
    window.getSelection().removeAllRanges();
    // Remove highlight from the current focused task
    removeHighlight();
}

function navigateTasks(direction) {
    const tasks = Array.from(document.querySelectorAll('.task-item'));
    const currentIndex = tasks.indexOf(currentFocusedTask);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < tasks.length) {
        currentFocusedTask = tasks[newIndex];
    }
}

function moveTask(direction) {
    const list = currentFocusedTask.parentNode;
    const tasks = Array.from(list.children);
    const currentIndex = tasks.indexOf(currentFocusedTask);
    let newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < tasks.length) {
        list.insertBefore(currentFocusedTask, direction === 'up' ? tasks[newIndex] : tasks[newIndex].nextSibling);
        updateTaskPositions(list);
        // Dispatch a custom event instead of directly calling saveToLocalStorage
        document.dispatchEvent(new CustomEvent('tasksReordered'));
    }
}

function updateTaskPositions(list) {
    Array.from(list.children).forEach((task, index) => {
        task.dataset.position = index;
    });
}

function highlightTask() {
    document.querySelectorAll('.task-item').forEach(task => {
        task.style.outline = 'none';
    });
    if (currentFocusedTask) {
        currentFocusedTask.style.outline = '2px solid #52B6D3';
    }
}

function toggleTaskCompletion(task) {
    const checkbox = task.querySelector('.custom-checkbox');
    const span = task.querySelector('span');
    
    checkbox.classList.toggle('checked');
    span.style.textDecoration = checkbox.classList.contains('checked') ? 'line-through' : 'none';
    
    // Update progress
    const listId = task.closest('ul').id;
    const progressId = listId === 'workList' ? 'workProgress' : 'healthProgress';
    const progressRingId = listId === 'workList' ? 'workProgressRing' : 'healthProgressRing';
    updateProgress(listId, progressId, progressRingId);
    
    if (checkbox.classList.contains('checked')) {
        const rect = checkbox.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x, y }
        });
        moveCompletedTaskToBottom(task, listId);
        showTaskCompletionMessage();
    } else {
        moveTaskToOriginalPosition(task, listId);
    }
    
    // Save to local storage
    saveToLocalStorage();
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', initKeyboardControls);
