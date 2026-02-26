
// Mobile menu toggle
function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Canvas animated background for showreel
const canvas = document.getElementById('reelCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        w = canvas.width = rect.width;
        h = canvas.height = rect.height;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 2 + 0.5,
                dx: (Math.random() - 0.5) * 0.8,
                dy: (Math.random() - 0.5) * 0.8,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0f0a1e');
        grad.addColorStop(1, '#0a1628');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Particles
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > w) p.dx *= -1;
            if (p.y < 0 || p.y > h) p.dy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 58, 237, ${p.opacity})`;
            ctx.fill();
        });

        // Lines between close particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${0.1 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();
    window.addEventListener('resize', () => { resize(); createParticles(); });
}

// Counter animation for stats
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statItems = entry.target.querySelectorAll('.stat-item h3');
            statItems.forEach(item => {
                const text = item.textContent;
                const num = parseInt(text);
                const suffix = text.replace(/[0-9]/g, '');
                let current = 0;
                const increment = num / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= num) {
                        current = num;
                        clearInterval(timer);
                    }
                    item.textContent = Math.floor(current) + suffix;
                }, 20);
            });
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statObserver.observe(statsGrid);

//---------------------------------------------BUTTON
const buttons = document.querySelectorAll('.work-card');
const backdrop = document.getElementById('backdrop');
let activeButton = null;

function toggleExpand(button) {
    const isExpanded = button.classList.contains('expanded');

    // Close any open button first
    if (activeButton && activeButton !== button) {
    activeButton.classList.remove('expanded');
    }

    button.classList.toggle('expanded', !isExpanded);
    backdrop.classList.toggle('visible', !isExpanded);

    if (!isExpanded) {
    activeButton = button;
    document.body.style.overflow = 'hidden'; // Prevent page scroll
    } else {
    activeButton = null;
    document.body.style.overflow = 'auto';
    }
}

// Click on button to expand (if not clicking close)
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
    if (!button.classList.contains('expanded') && !e.target.classList.contains('close-btn')) {
        toggleExpand(button);
    }
    });

    // Close button inside each expanded overlay
    button.querySelector('.close-btn').addEventListener('click', () => {
    toggleExpand(button);
    });
});

// Click backdrop to close
backdrop.addEventListener('click', () => {
    if (activeButton) {
    toggleExpand(activeButton);
    }
});

// ESC key to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeButton) {
    toggleExpand(activeButton);
    }
});
