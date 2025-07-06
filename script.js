// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollInView({
            behavior: 'smooth'
        });
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });
});

// Toggle mobile menu
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

// Particle animation for background
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const numberOfParticles = 100; // Adjust for more/fewer particles
const maxLineDistance = 120; // Max distance for lines to connect particles

// Particle constructor
function Particle(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
}

// Draw individual particle
Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
};

// Update particle position and handle boundaries
Particle.prototype.update = function() {
    // Reverse direction if hitting canvas edges
    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
        this.directionX = -this.directionX;
    }
    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
        this.directionY = -this.directionY;
    }

    this.x += this.directionX;
    this.y += this.directionY;
};

// Initialize particles
function initParticles() {
    particles = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 3 + 1; // Particle size between 1 and 4
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let directionX = (Math.random() * 0.5) - 0.25; // Speed between -0.25 and 0.25
        let directionY = (Math.random() * 0.5) - 0.25; // Speed between -0.25 and 0.25
        let color = 'rgba(255, 255, 255, 0.8)'; // White particles with some transparency

        particles.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Animation loop
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Draw lines between nearby particles
        for (let j = i; j < particles.length; j++) {
            const distance = Math.sqrt(
                Math.pow(particles[i].x - particles[j].x, 2) +
                Math.pow(particles[i].y - particles[j].y, 2)
            );

            if (distance < maxLineDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(99, 179, 237, ${1 - (distance / maxLineDistance)})`; // Blue-400 with fading opacity
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

// Event listener for window resize
window.addEventListener('resize', initParticles);

// Initialize and start animation when the window loads
window.onload = function() {
    initParticles();
    animateParticles();
};
