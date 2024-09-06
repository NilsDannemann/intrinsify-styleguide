function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function createListItem(text, listId, progressId, progressRingId, checked = false, position = -1) {
    const li = document.createElement('li');
    li.className = 'task-item flex items-center space-x-2 bg-white p-2 rounded';
    li.dataset.position = position;
    
    const checkbox = document.createElement('div');
    checkbox.className = `custom-checkbox mr-2 rounded ${checked ? 'checked' : ''}`;
    checkbox.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;
    
    const span = document.createElement('span');
    span.textContent = text;
    span.className = 'flex-grow leading-normal';
    if (checked) span.style.textDecoration = 'line-through';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
            <title>e-remove</title>
            <g fill="currentColor">
                <path d="M10.707,1.293a1,1,0,0,0-1.414,0L6,4.586,2.707,1.293A1,1,0,0,0,1.293,2.707L4.586,6,1.293,9.293a1,1,0,1,0,1.414,1.414L6,7.414l3.293,3.293a1,1,0,0,0,1.414-1.414L7.414,6l3.293-3.293A1,1,0,0,0,10.707,1.293Z"></path>
            </g>
        </svg>
    `;
    deleteBtn.className = 'text-gray-400 hover:text-gray-600 opacity-50 hover:opacity-100 transition-opacity duration-200 ease-in-out p-1';
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    
    document.getElementById(listId).appendChild(li);
    updateCleanupButtonVisibility();
    updateResetDayButtonVisibility();
    
    checkbox.addEventListener('click', () => {
        checkbox.classList.toggle('checked');
        span.style.textDecoration = checkbox.classList.contains('checked') ? 'line-through' : 'none';
        updateTaskStatus();
        if (checkbox.classList.contains('checked')) {
            const rect = checkbox.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { x, y }
            });
            moveCompletedTaskToBottom(li, listId);
            showTaskCompletionMessage();
        } else {
            moveTaskToOriginalPosition(li, listId);
        }
    });
    deleteBtn.addEventListener('click', () => {
        li.remove();
        updateTaskStatus();
    });

    span.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent;
        input.className = 'w-full bg-input-bg rounded-md px-2 py-1 -my-2';
        li.replaceChild(input, span);
        input.focus();

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                updateTaskText(input, span, li, listId);
            } else if (e.key === 'Escape') {
                li.replaceChild(span, input);
            }
        });

        input.addEventListener('blur', () => {
            updateTaskText(input, span, li, listId);
        });
    });

    return li;
}

function addNewTask(text, listId, progressId, progressRingId) {
    const list = document.getElementById(listId);
    
    Array.from(list.children).forEach(li => {
        li.dataset.position = parseInt(li.dataset.position) + 1;
    });
    
    const li = createListItem(text, listId, progressId, progressRingId, false, 0);
    
    list.insertBefore(li, list.firstChild);
    
    updateProgress(listId, progressId, progressRingId);
    saveToLocalStorage();
    showEncouragingMessage();
}

function updateTaskText(input, span, li, listId) {
    const newText = input.value.trim();
    if (newText) {
        span.textContent = newText;
        li.replaceChild(span, input);
        saveToLocalStorage();
        updateProgress(listId, listId === 'workList' ? 'workProgress' : 'healthProgress', 
                       listId === 'workList' ? 'workProgressRing' : 'healthProgressRing');
    } else {
        li.replaceChild(span, input);
    }
}

function moveCompletedTaskToBottom(taskElement, listId) {
    const list = document.getElementById(listId);
    const taskRect = taskElement.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    const displacement = listRect.bottom - taskRect.top - taskElement.offsetHeight;
    
    let start;
    const duration = 500;

    function animate(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutCubic(progress);
        
        taskElement.style.transform = `translateY(${displacement * easeProgress}px)`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            taskElement.style.transform = '';
            list.appendChild(taskElement);
            
            updatePositionsAfterMove(list);
            
            saveToLocalStorage();
        }
    }

    requestAnimationFrame(animate);
}

function moveTaskToOriginalPosition(taskElement, listId) {
    const list = document.getElementById(listId);
    const taskPosition = parseInt(taskElement.dataset.position);
    let targetElement = null;

    for (let i = 0; i < list.children.length; i++) {
        const currentPosition = parseInt(list.children[i].dataset.position);
        if (currentPosition > taskPosition) {
            targetElement = list.children[i];
            break;
        }
    }

    if (targetElement !== taskElement.nextElementSibling) {
        const taskRect = taskElement.getBoundingClientRect();
        const targetRect = targetElement ? targetElement.getBoundingClientRect() : list.lastElementChild.getBoundingClientRect();
        const displacement = taskRect.top - targetRect.top;

        let start;
        const duration = 500;

        function animate(timestamp) {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easeOutCubic(progress);
            
            taskElement.style.transform = `translateY(${-displacement * easeProgress}px)`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                taskElement.style.transform = '';
                list.insertBefore(taskElement, targetElement);
            }
        }

        requestAnimationFrame(animate);
    }
}

function cleanupCompletedTasks(listId) {
    const list = document.getElementById(listId);
    let completedCount = 0;

    Array.from(list.children).forEach(li => {
        if (li.querySelector('.custom-checkbox').classList.contains('checked')) {
            li.remove();
            completedCount++;
        }
    });

    updatePositionsAfterMove(list);
    saveToLocalStorage();
    updateProgress(listId, listId === 'workList' ? 'workProgress' : 'healthProgress', 
                   listId === 'workList' ? 'workProgressRing' : 'healthProgressRing');
    updateCleanupButtonVisibility();
    updateResetDayButtonVisibility();

    showCelebrationPopup(completedCount);
}

function updateTaskStatus() {
    updateProgress('workList', 'workProgress', 'workProgressRing');
    updateProgress('healthList', 'healthProgress', 'healthProgressRing');
    updateCleanupButtonVisibility();
    updateResetDayButtonVisibility();
    saveToLocalStorage();
}