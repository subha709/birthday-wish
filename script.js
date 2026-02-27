const surpriseBtn = document.getElementById('surpriseBtn');
const messageBox = document.getElementById('messageBox');
const hiddenMessage = document.getElementById('hiddenMessage');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
const balloonsContainer = document.getElementById('balloons');
const music = document.getElementById('birthday-music');
const soundToggle = document.getElementById('soundToggle');
const blurCover = document.getElementById('blurCover');
const slides = document.querySelectorAll('.slides');
const passwordScreen = document.getElementById('password-screen');
const passwordInput = document.getElementById('passwordInput');
const passwordBtn = document.getElementById('passwordBtn');
const passwordError = document.getElementById('passwordError');

const CORRECT_PASSWORD = "TANI";

let musicStarted = false;
let isMuted = true;
let currentSlide = 0;

// Typing effect
function typeWriter(text, element, speed = 50) {
    element.innerHTML = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Password check logic
function checkPassword() {
    const entered = passwordInput.value.trim().toUpperCase();
    if (entered === CORRECT_PASSWORD) {
        passwordScreen.style.opacity = '0';
        setTimeout(() => passwordScreen.classList.add('hidden'), 500);
        for (let i = 0; i < 5; i++) {
            createBalloon();
        }
    } else {
        passwordError.classList.add('show');
        setTimeout(() => passwordError.classList.remove('show'), 3000);
    }
}

passwordBtn.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
});

// Set canvas sizes
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

// Slideshow Logic
function showNextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}
setInterval(showNextSlide, 4000);

function startCelebration() {
    messageBox.classList.add('reveal');
    blurCover.classList.add('hide');

    // Typing animation for message
    const originalText = hiddenMessage.textContent;
    typeWriter(originalText, hiddenMessage);

    playMusic();
    initParticles();
    animate();

    for (let i = 0; i < 20; i++) {
        setTimeout(createBalloon, i * 200);
    }
}

function playMusic() {
    music.volume = 0.8;
    music.play().then(() => {
        musicStarted = true;
        isMuted = false;
        soundToggle.innerHTML = '🔊';
    }).catch(err => {
        soundToggle.innerHTML = '🔇';
    });
}

soundToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (music.paused) {
        music.play();
        soundToggle.innerHTML = '🔊';
    } else {
        music.pause();
        soundToggle.innerHTML = '🔇';
    }
});

// Confetti System
let particles = [];
const colors = ['#ff0055', '#7000ff', '#ffd700', '#ffffff', '#00d4ff'];

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
    for (let i = 0; i < 200; i++) {
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

function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    const left = Math.random() * 100;
    const duration = Math.random() * 8 + 7;
    const size = Math.random() * 30 + 40;
    const color = colors[Math.floor(Math.random() * colors.length)];

    balloon.style.left = `${left}%`;
    balloon.style.width = `${size}px`;
    balloon.style.height = `${size * 1.3}px`;
    balloon.style.backgroundColor = color;
    balloon.style.boxShadow = `inset -5px -5px 15px rgba(0,0,0,0.3), 0 0 20px ${color}33`;
    balloon.style.animationDuration = `${duration}s`;

    balloonsContainer.appendChild(balloon);
    setTimeout(() => balloon.remove(), duration * 1000);
}

resizeCanvas();
setInterval(createBalloon, 1500);

function handleInteraction() {
    if (!musicStarted) {
        startCelebration();
        musicStarted = true;
        surpriseBtn.innerHTML = 'Endless Joy! �';
        surpriseBtn.style.background = 'linear-gradient(45deg, #ffd700, #ffcc33)';
        surpriseBtn.style.color = '#000';
    }
}

blurCover.addEventListener('click', handleInteraction);
surpriseBtn.addEventListener('click', handleInteraction);
