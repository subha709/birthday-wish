const surpriseBtn = document.getElementById('surpriseBtn');
const messageBox = document.getElementById('messageBox');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
const balloonsContainer = document.getElementById('balloons');
const music = document.getElementById('birthday-music');
const soundToggle = document.getElementById('soundToggle');

let musicStarted = false;
let isMuted = true;

// Set canvas sizes
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

function startCelebration() {
    console.log("SURPRISE! Celebration logic starting...");
    playMusic();
    initParticles();
    animate();
}

function playMusic() {
    music.volume = 0.8;
    music.play().then(() => {
        musicStarted = true;
        isMuted = false;
        soundToggle.innerHTML = '🔊';
    }).catch(err => {
        console.error("Audio Playback failed:", err.message);
        soundToggle.innerHTML = '🔇';
    });
}

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

// Surprise Button Action
surpriseBtn.addEventListener('click', () => {
    messageBox.classList.add('reveal');
    surpriseBtn.innerHTML = 'Stay Awesome! 🥳';
    surpriseBtn.style.background = 'linear-gradient(45deg, #00b4d8, #90e0ef)';

    if (!musicStarted) {
        startCelebration();
        musicStarted = true;
    }

    // Trigger more balloons
    for (let i = 0; i < 15; i++) {
        createBalloon();
    }
});
