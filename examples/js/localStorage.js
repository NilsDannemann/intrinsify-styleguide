function saveToLocalStorage() {
    const workTasks = Array.from(document.getElementById('workList').children).map((li, index) => ({
        text: li.querySelector('span').textContent,
        checked: li.querySelector('.custom-checkbox').classList.contains('checked'),
        position: parseInt(li.dataset.position)
    }));
    const healthGoals = Array.from(document.getElementById('healthList').children).map((li, index) => ({
        text: li.querySelector('span').textContent,
        checked: li.querySelector('.custom-checkbox').classList.contains('checked'),
        position: parseInt(li.dataset.position)
    }));
    localStorage.setItem('workTasks', JSON.stringify(workTasks));
    localStorage.setItem('healthGoals', JSON.stringify(healthGoals));
}

function loadFromLocalStorage() {
    const workTasks = JSON.parse(localStorage.getItem('workTasks') || '[]');
    const healthGoals = JSON.parse(localStorage.getItem('healthGoals') || '[]');
    
    workTasks.sort((a, b) => a.position - b.position);
    healthGoals.sort((a, b) => a.position - b.position);
    
    workTasks.forEach(task => createListItem(task.text, 'workList', 'workProgress', 'workProgressRing', task.checked, task.position));
    healthGoals.forEach(goal => createListItem(goal.text, 'healthList', 'healthProgress', 'healthProgressRing', goal.checked, goal.position));
    
    updateProgress('workList', 'workProgress', 'workProgressRing');
    updateProgress('healthList', 'healthProgress', 'healthProgressRing');
    updateCleanupButtonVisibility();
}

// Add this event listener at the end of the file
document.addEventListener('tasksReordered', saveToLocalStorage);