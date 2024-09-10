function setProgress(progressRing, percentage) {
    const radius = progressRing.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = offset;
}

function updateProgress(listId, progressId, progressRingId) {
    const list = document.getElementById(listId);
    const total = list.children.length;
    const completed = list.querySelectorAll('.custom-checkbox.checked').length;
    const progressElement = document.getElementById(progressId);
    const progressRing = document.getElementById(progressRingId);
    const progressBar = document.getElementById(progressId + 'Bar');
    const progressMobile = document.getElementById(progressId + 'Mobile');
    
    progressElement.textContent = `${completed}/${total}`;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    // Update circular progress (desktop)
    setProgress(progressRing, percentage);
    
    // Update linear progress bar (mobile)
    progressBar.style.width = `${percentage}%`;
    progressMobile.textContent = `${completed}/${total}`;
}

function updatePositionsAfterMove(list) {
    Array.from(list.children).forEach((li, index) => {
        li.dataset.position = index;
    });
}

function updateCleanupButtonVisibility() {
    const workList = document.getElementById('workList');
    const healthList = document.getElementById('healthList');
    const cleanupWorkButton = document.getElementById('cleanupWorkTasks');
    const cleanupHealthButton = document.getElementById('cleanupHealthGoals');
    
    const hasCompletedWorkTasks = Array.from(workList.children)
        .some(li => li.querySelector('.custom-checkbox').classList.contains('checked'));
    const hasCompletedHealthGoals = Array.from(healthList.children)
        .some(li => li.querySelector('.custom-checkbox').classList.contains('checked'));
    
    cleanupWorkButton.classList.toggle('hidden', !hasCompletedWorkTasks);
    cleanupHealthButton.classList.toggle('hidden', !hasCompletedHealthGoals);
}