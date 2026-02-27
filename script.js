const surpriseBtn = document.getElementById('surpriseBtn');
const messageBox = document.getElementById('messageBox');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
const balloonsContainer = document.getElementById('balloons');

const scratchCanvas = document.getElementById('scratch-canvas');
const scratchCtx = scratchCanvas.getContext('2d');
const music = document.getElementById('birthday-music');
const soundToggle = document.getElementById('soundToggle');

let isScratched = false;
let musicStarted = false;
let isMuted = true;

// Set canvas sizes
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Resize scratch canvas to match its container
    const container = scratchCanvas.parentElement;
    scratchCanvas.width = container.offsetWidth;
    scratchCanvas.height = container.offsetHeight;
    initScratchCanvas();
}

window.addEventListener('resize', resizeCanvas);

// Initialize Scratch Canvas
function initScratchCanvas() {
    scratchCtx.fillStyle = '#C0C0C0'; // Silver color
    // Create a shiny gradient
    const grad = scratchCtx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
    grad.addColorStop(0, '#adb5bd');
    grad.addColorStop(0.5, '#dee2e6');
    grad.addColorStop(1, '#adb5bd');
    scratchCtx.fillStyle = grad;
    scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

    // Add some "scratch here" text
    scratchCtx.fillStyle = '#6c757d';
    scratchCtx.font = 'bold 20px Poppins';
    scratchCtx.textAlign = 'center';
    scratchCtx.fillText('Scratch to Reveal! ✨', scratchCanvas.width / 2, scratchCanvas.height / 2);
}

// Scratching Logic
let isDrawing = false;

function scratch(e) {
    if (!isDrawing) return;

    const rect = scratchCanvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 30, 0, Math.PI * 2);
    scratchCtx.fill();

    if (!musicStarted) {
        startCelebration();
        musicStarted = true;
    }
}

function startCelebration() {
    console.log("SURPRISE! Celebration logic starting...");
    playMusic();

    // Initial Confetti
    initParticles();
    animate();
}

function playMusic() {
    console.log("Attempting to play music from:", music.currentSrc);
    music.volume = 0.8;

    // Check if audio is ready
    if (music.readyState < 2) {
        console.warn("Audio not fully loaded yet. Waiting...");
    }

    music.play().then(() => {
        console.log("✅ Music started playing successfully!");
        musicStarted = true;
        isMuted = false;
        soundToggle.innerHTML = '🔊';
    }).catch(err => {
        console.error("❌ Audio Playback failed:", err.message);
        console.log("Hint: Try clicking the music player bar directly below the scratch card.");
        soundToggle.innerHTML = '🔇';
    });
}

// Log audio load errors
music.addEventListener('error', (e) => {
    console.error("🔥 Audio Source Error:", music.error);
});

music.addEventListener('canplaythrough', () => {
    console.log("📡 Audio is ready to play through without interruption.");
});

soundToggle.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        soundToggle.innerHTML = '🔊';
        isMuted = false;
    } else {
        music.pause();
        soundToggle.innerHTML = '🔇';
        isMuted = true;
    }
});

scratchCanvas.addEventListener('mousedown', () => isDrawing = true);
scratchCanvas.addEventListener('touchstart', (e) => { isDrawing = true; e.preventDefault(); });
window.addEventListener('mouseup', () => isDrawing = false);
window.addEventListener('touchend', () => isDrawing = false);
scratchCanvas.addEventListener('mousemove', scratch);
scratchCanvas.addEventListener('touchmove', scratch);

// Confetti System
let particles = [];
const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#fdf0d5', '#00b4d8', '#ffdf5d'];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 8 + 4;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 5 + 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas.height) {
            this.y = -20;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

// Balloons Generation
function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const size = Math.random() * 30 + 30;
    const color = colors[Math.floor(Math.random() * colors.length)];

    balloon.style.left = `${left}%`;
    balloon.style.width = `${size}px`;
    balloon.style.height = `${size * 1.2}px`;
    balloon.style.backgroundColor = color;
    balloon.style.animationDuration = `${duration}s`;

    balloonsContainer.appendChild(balloon);

    setTimeout(() => {
        balloon.remove();
    }, duration * 1000);
}

// Initial Setup
resizeCanvas();
for (let i = 0; i < 15; i++) {
    setTimeout(createBalloon, Math.random() * 5000);
}
setInterval(createBalloon, 2000);

// Surprise Button Action (Manual Trigger)
surpriseBtn.addEventListener('click', () => {
    messageBox.classList.add('reveal');
    surpriseBtn.innerHTML = 'Stay Awesome! 🥳';
    surpriseBtn.style.background = 'linear-gradient(45deg, #00b4d8, #90e0ef)';

    if (!musicStarted) {
        startCelebration();
        musicStarted = true;
    }

    // Clear and fade out scratch canvas
    scratchCanvas.style.opacity = '0';
    setTimeout(() => scratchCanvas.style.display = 'none', 500);

    // Trigger more balloons
    for (let i = 0; i < 15; i++) {
        createBalloon();
    }
});
