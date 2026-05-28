/**
 * Funngro Student Hub - Core Interaction Script
 * Features: Particles, Typing Effect, Counters, Scroll Reveal, Dash Charts
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen Logic
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.visibility = 'hidden', 1000);
            initApp(); // Initialize animations after loader is gone
        }, 1500);
    });

    // 2. Navbar Scroll Effect & Progress Bar
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        // Sticky Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";

        // Active Link Tracking
        updateActiveLink();
    });

    // 3. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            mobileBtn.querySelector('i').classList.toggle('fa-bars-staggered');
            mobileBtn.querySelector('i').classList.toggle('fa-xmark');
        });
    }

    // 4. Typing Text Effect
    function initTypingEffect() {
        const textElement = document.getElementById('typing-text');
        const text = "Earn While You Learn";
        let index = 0;

        textElement.innerHTML = "";
        
        function type() {
            if (index < text.length) {
                textElement.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        }
        type();
    }

    // 5. Particles Background Logic (Vanilla Canvas)
    function initParticles() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const particlesContainer = document.getElementById('particles-js');
        
        if (!particlesContainer) return;
        
        particlesContainer.appendChild(canvas);
        
        let width, height, particles;
        
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < 80; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 2 + 1,
                    speedX: Math.random() * 0.5 - 0.25,
                    speedY: Math.random() * 0.5 - 0.25,
                    opacity: Math.random() * 0.5
                });
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#39FF14';
            
            particles.forEach(p => {
                ctx.globalAlpha = p.opacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                p.x += p.speedX;
                p.y += p.speedY;
                
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;
            });
            
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // 6. Intersection Observer for Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger counter if its child
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => animateCounter(counter));
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 7. Counter Animation
    function animateCounter(counter) {
        if (counter.classList.contains('animated')) return;
        
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / 100;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 20);
        } else {
            counter.innerText = target;
            counter.classList.add('animated');
        }
    }

    // 8. Dashboard Chart Initialization (Chart.js)
    function initDashboardChart() {
        const ctx = document.getElementById('earningChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Earnings (₹)',
                    data: [2000, 4500, 3000, 8000, 6500, 12000],
                    borderColor: '#39FF14',
                    backgroundColor: 'rgba(57, 255, 20, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#39FF14',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });
    }

    // 9. Lucide Icons Initialization
    if (window.lucide) {
        lucide.createIcons();
    }

    // 10. Daily Reward & Toast Notifications
    const rewardPopup = document.getElementById('reward-popup');
    const closePopup = document.getElementById('close-popup');

    function showReward() {
        setTimeout(() => {
            rewardPopup.classList.remove('hidden');
            setTimeout(() => rewardPopup.classList.add('active'), 100);
        }, 3000);
    }

    if (closePopup) {
        closePopup.addEventListener('click', () => {
            rewardPopup.classList.remove('active');
            setTimeout(() => {
                rewardPopup.classList.add('hidden');
                showToast("Reward Claimed! Check your wallet.");
            }, 500);
        });
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast glass-card';
        toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #39FF14"></i> ${message}`;
        document.body.appendChild(toast);

        // Toast styling (dynamic addition for minimal CSS clutter)
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            padding: '12px 24px',
            zIndex: '10001',
            opacity: '0',
            transition: 'all 0.4s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderRadius: '12px',
            background: 'rgba(7, 24, 38, 0.9)',
            border: '1px solid rgba(57, 255, 20, 0.3)',
            color: 'white'
        });

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // 11. Custom Smooth Hover Tilt (Manual if vanilla-tilt fails)
    function initTiltEffect() {
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
            });
        }
    }

    // 12. Active Link Highlighting on Scroll
    function updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    // Global Initialization
    function initApp() {
        initParticles();
        initTypingEffect();
        initDashboardChart();
        initTiltEffect();
        showReward();
    }

    // AI Chatbot Button Interaction
    const aiBtn = document.getElementById('ai-chatbot');
    if (aiBtn) {
        aiBtn.addEventListener('click', () => {
            showToast("AI Mentor: Focus on the Web Design project first! Boost your UI skills.");
        });
    }

    // Contact Form Handling (Prevent Default)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast("Message sent successfully! We'll reach out soon.");
            contactForm.reset();
        });
    }
});
