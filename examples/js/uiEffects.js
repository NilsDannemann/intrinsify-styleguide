function showEncouragingMessage() {
    if (isSpeechBubbleVisible) return;

    const speechBubble = document.getElementById('speechBubble');
    const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    
    isSpeechBubbleVisible = true;
    speechBubble.innerHTML = '<span class="speech-bubble-text">&nbsp;</span>';
    speechBubble.classList.remove('hidden', 'hide');
    
    setTimeout(() => {
        speechBubble.classList.add('show');
        setTimeout(() => {
            typeText(speechBubble.querySelector('.speech-bubble-text'), randomMessage, 0);
        }, 400);
    }, 10);
}

function typeText(element, text, index) {
    if (index < text.length) {
        element.textContent = text.substring(0, index + 1);
        
        if (index > 0 && ".!?".includes(text[index]) && (index === text.length - 1 || text[index + 1] === ' ')) {
            typingTimeout = setTimeout(() => typeText(element, text, index + 1), 500);
        } else {
            typingTimeout = setTimeout(() => typeText(element, text, index + 1), 30);
        }
    } else {
        setTimeout(hideSpeechBubble, 3000);
    }
}

function hideSpeechBubble() {
    const speechBubble = document.getElementById('speechBubble');
    speechBubble.classList.remove('show');
    speechBubble.classList.add('hide');
    setTimeout(() => {
        speechBubble.classList.add('hidden');
        speechBubble.classList.remove('hide');
        isSpeechBubbleVisible = false;
    }, 300);
}

function showTaskCompletionMessage() {
    if (isSpeechBubbleVisible) return;

    const speechBubble = document.getElementById('speechBubble');
    const randomMessage = taskCompletionMessages[Math.floor(Math.random() * taskCompletionMessages.length)];
    
    isSpeechBubbleVisible = true;
    speechBubble.innerHTML = '<span class="speech-bubble-text">&nbsp;</span>';
    speechBubble.classList.remove('hidden', 'hide');
    
    setTimeout(() => {
        speechBubble.classList.add('show');
        setTimeout(() => {
            typeText(speechBubble.querySelector('.speech-bubble-text'), randomMessage, 0);
        }, 500);
    }, 10);
}

function setRandomRobotImage() {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    const imagePath = `images/Robot${randomNumber}.png`;
    document.getElementById('robotImage').src = imagePath;
}

function showCelebrationPopup(completedCount) {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 frosted-glass-overlay flex items-center justify-center z-50';
    popup.innerHTML = `
        <div class="popup-content sm:p-12 p-8 mx-4 sm:mx-0 max-w-md w-full text-center relative overflow-hidden transform scale-0 transition-transform duration-300">
            <h2 class="text-2xl font-bold mb-3 -mt-2">Computation Successful!</h2>
            <p class="mb-8">Beep boop! You've completed ${completedCount} thing${completedCount !== 1 ? 's' : ''}! Alfred is awarding you ${completedCount} intrinsify Point${completedCount !== 1 ? 's' : ''}.</p>
            <div id="pointContainer" class="flex justify-center mb-4 space-x-2"></div>
            <img src="images/RobotHappy.png" alt="Happy Robot" class="h-32 w-auto mb-8 m-auto floating-robot">
            <button id="closePopup" class="bg-input-bg hover:bg-opacity-80 text-black font-semibold py-2 px-4 rounded">
                Thank you, Alfred!
            </button>
            <div class="absolute inset-0 pointer-events-none">
                <canvas id="confettiCanvas"></canvas>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    popup.offsetHeight;

    setTimeout(() => {
        popup.firstElementChild.style.transform = 'scale(1)';
    }, 10);

    const pointContainer = popup.querySelector('#pointContainer');
    const pointSVG = `<svg height="28" width="28" viewBox="295 -1 58 59" xmlns="http://www.w3.org/2000/svg"><path d="m300.4 0h46.5q.8 0 1.6.3.7.4 1.3.9.6.6.9 1.4.3.8.3 1.6v47.1q0 .9-.3 1.6-.3.8-.9 1.4-.6.5-1.3.9-.8.3-1.6.3h-46.5q-.9 0-1.6-.3-.8-.4-1.3-.9-.6-.6-.9-1.4-.3-.7-.3-1.5v-47.2q0-.8.3-1.6.3-.8.8-1.4.6-.5 1.4-.9.7-.3 1.6-.3z" fill="#f2ba4f"/><g fill="#fff"><path d="m331 46.7h-14.8q-.2 0-.3-.1-.1 0-.3-.1-.1-.1-.2-.2-.1-.1-.2-.3 0-.1-.1-.3 0-.1 0-.3 0-.1.1-.2l5.5-21.7q0-.2.2-.4.1-.2.2-.3.2-.2.4-.3.2 0 .4 0h3.7q.2 0 .4 0 .2.1.3.3.2.1.3.3.1.2.2.4l5.6 21.7q.1.1.1.2 0 .2-.1.3 0 .2 0 .3-.1.2-.2.3-.1.1-.2.2-.1.1-.2.1-.2.1-.3.1-.1.1-.3.1m-13.2-2.6h11.6l-5-19.1h-1.7z"/><path d="m323.6 19.3c-2.2 0-4.1-1.2-4.9-3.2-.9-2-.4-4.2 1.1-5.8 1.5-1.5 3.7-1.9 5.7-1.1s3.3 2.7 3.3 4.8q0 1.1-.4 2-.4 1-1.1 1.8-.8.7-1.7 1.1-1 .4-2 .4zm0-8c-1.1 0-2.1.6-2.5 1.6s-.2 2.2.5 3c.8.7 2 1 3 .6s1.6-1.4 1.6-2.5q0-.5-.2-1-.2-.5-.5-.9-.4-.4-.9-.6-.5-.2-1-.2z"/></g></svg>`;

    for (let i = 0; i < completedCount; i++) {
        const point = document.createElement('div');
        point.innerHTML = pointSVG;
        point.firstChild.style.fill = '#ccc';
        point.style.transform = 'scale(0)';
        point.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        pointContainer.appendChild(point);

        setTimeout(() => {
            point.style.transform = 'scale(1)';
            point.firstChild.style.fill = '#FFA500';
        }, i * 200);
    }

    // Confetti animation
    const confettiCanvas = popup.querySelector('#confettiCanvas');
    const myConfetti = confetti.create(confettiCanvas, { resize: true });
    myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    function closePopup() {
        popup.firstElementChild.style.transform = 'scale(0)';
        
        setTimeout(() => {
            popup.remove();
        }, 300);
    }

    popup.querySelector('#closePopup').addEventListener('click', closePopup);

    // Add click event listener to the overlay
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup();
        }
    });
}

function showSettingsPopup() {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 frosted-glass-overlay flex items-center justify-center z-50';
    popup.innerHTML = `
        <div class="popup-content sm:p-12 p-8 mx-4 sm:mx-0 max-w-md w-full text-center relative overflow-hidden transform scale-0 transition-transform duration-300">
            <h2 class="text-2xl font-bold mb-3 -mt-2">Settings</h2>
            <p class="mb-8">Settings, Shortcuts, Keyboard-Controls and other options coming soon. Keep computing!</p>
            <img src="images/RobotSettings.png" alt="Happy Settings" class="h-24 w-auto mb-8 m-auto floating-robot">
            <button id="closePopup" class="bg-input-bg hover:bg-opacity-80 text-black font-semibold py-2 px-4 rounded">
                Okay, got it!
            </button>
        </div>
    `;

    document.body.appendChild(popup);

    popup.offsetHeight;

    setTimeout(() => {
        popup.firstElementChild.style.transform = 'scale(1)';
    }, 10);

    function closePopup() {
        popup.firstElementChild.style.transform = 'scale(0)';
        
        setTimeout(() => {
            popup.remove();
        }, 300);
    }

    popup.querySelector('#closePopup').addEventListener('click', closePopup);

    // Add click event listener to the overlay
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup();
        }
    });
}

// Add this event listener at the end of the file
document.addEventListener('DOMContentLoaded', () => {
    const settingsButton = document.getElementById('settingsButton');
    if (settingsButton) {
        settingsButton.addEventListener('click', (e) => {
            e.preventDefault();
            showSettingsPopup();
        });
    }
});