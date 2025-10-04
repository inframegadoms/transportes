/* ========================================
   ADVANCED ANIMATIONS CONTROLLER
   Efectos visuales y animaciones complejas
======================================== */

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

const AnimationController = {
    observers: {},
    
    init() {
        this.initScrollReveal();
        this.initCounters();
        this.initProgressBars();
        this.initParallax();
        this.initMorphingShapes();
        console.log('🎨 Animation Controller inicializado');
    },
    
    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    
    initScrollReveal() {
        const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
        this.observers.reveal = revealObserver;
    },
    
    // ========================================
    // ANIMATED COUNTERS
    // ========================================
    
    initCounters() {
        const counterElements = document.querySelectorAll('.counter');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });
        
        counterElements.forEach(el => counterObserver.observe(el));
        this.observers.counter = counterObserver;
    },
    
    animateCounter(element) {
        const target = parseInt(element.dataset.target) || 0;
        const duration = parseInt(element.dataset.duration) || 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    },
    
    // ========================================
    // PROGRESS BARS
    // ========================================
    
    initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateProgressBar(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(el => progressObserver.observe(el));
        this.observers.progress = progressObserver;
    },
    
    animateProgressBar(element) {
        const percentage = element.dataset.percentage || 0;
        const fill = element.querySelector('.progress-fill');
        const text = element.querySelector('.progress-text');
        
        if (fill) {
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = percentage + '%';
                fill.style.transition = 'width 2s ease-out';
            }, 100);
        }
        
        if (text) {
            let current = 0;
            const timer = setInterval(() => {
                current++;
                text.textContent = current + '%';
                if (current >= percentage) {
                    clearInterval(timer);
                }
            }, 20);
        }
    },
    
    // ========================================
    // PARALLAX EFFECTS
    // ========================================
    
    initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        if (parallaxElements.length === 0) return;
        
        const parallaxHandler = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.speed) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };
        
        // Use throttle for performance
        window.addEventListener('scroll', this.throttle(parallaxHandler, 16));
    },
    
    // ========================================
    // MORPHING SHAPES
    // ========================================
    
    initMorphingShapes() {
        this.createMorphingBackground();
        this.createFloatingShapes();
    },
    
    createMorphingBackground() {
        const sections = document.querySelectorAll('.hero-section, .services-section');
        
        sections.forEach(section => {
            for (let i = 0; i < 4; i++) {
                const taxi = document.createElement('div');
                taxi.className = 'floating-background-taxi';
                
                const size = Math.random() * 0.8 + 0.8; // Between 0.8 and 1.6rem
                const startY = Math.random() * 80 + 10; // Between 10% and 90%
                const animationDelay = Math.random() * 10 + i * 3; // Stagger the animations
                const animationDuration = Math.random() * 8 + 12; // Between 12-20 seconds
                const direction = Math.random() > 0.5 ? 1 : -1; // Random direction
                
                // Use taxi icons for lateral view
                const taxiIcons = ['fas fa-taxi', 'fas fa-car-side', 'fas fa-shuttle-van'];
                const randomIcon = taxiIcons[Math.floor(Math.random() * taxiIcons.length)];
                
                taxi.innerHTML = `<i class="${randomIcon}"></i>`;
                taxi.style.cssText = `
                    position: absolute;
                    top: ${startY}%;
                    left: ${direction === 1 ? '-10%' : '110%'};
                    font-size: ${size}rem;
                    color: rgba(230, 166, 13, 0.4);
                    animation: backgroundTaxi${direction === 1 ? 'Right' : 'Left'} ${animationDuration}s linear infinite;
                    animation-delay: ${animationDelay}s;
                    z-index: 0;
                    pointer-events: none;
                    transform: ${direction === -1 ? 'scaleX(-1)' : 'scaleX(1)'};
                `;
                section.appendChild(taxi);
            }
        });
    },
    
    createFloatingShapes() {
        const container = document.querySelector('.hero-section');
        if (!container) return;
        
        // Create additional floating taxis for more movement
        for (let i = 0; i < 5; i++) {
            const taxi = document.createElement('div');
            taxi.className = 'floating-hero-taxi';
            
            const size = Math.random() * 0.6 + 1.2; // Between 1.2 and 1.8rem
            const startY = Math.random() * 60 + 20; // Between 20% and 80%
            const animationDelay = Math.random() * 8 + i * 2;
            const animationDuration = Math.random() * 6 + 10; // Between 10-16 seconds
            const direction = Math.random() > 0.5 ? 1 : -1;
            
            const taxiIcons = ['fas fa-taxi', 'fas fa-car-side'];
            const randomIcon = taxiIcons[Math.floor(Math.random() * taxiIcons.length)];
            
            taxi.innerHTML = `<i class="${randomIcon}"></i>`;
            taxi.style.cssText = `
                position: absolute;
                top: ${startY}%;
                left: ${direction === 1 ? '-8%' : '108%'};
                font-size: ${size}rem;
                color: rgba(230, 166, 13, 0.6);
                animation: heroTaxi${direction === 1 ? 'Right' : 'Left'} ${animationDuration}s linear infinite;
                animation-delay: ${animationDelay}s;
                z-index: 1;
                pointer-events: none;
                transform: ${direction === -1 ? 'scaleX(-1)' : 'scaleX(1)'};
            `;
            container.appendChild(taxi);
        }
    },
    
    // ========================================
    // TEXT EFFECTS
    // ========================================
    
    initTextEffects() {
        this.initTypewriter();
        this.initTextReveal();
    },
    
    initTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '3px solid var(--accent-cyan)';
            
            let i = 0;
            const timer = setInterval(() => {
                element.textContent += text[i];
                i++;
                if (i >= text.length) {
                    clearInterval(timer);
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            }, 100);
        });
    },
    
    initTextReveal() {
        const textRevealElements = document.querySelectorAll('.text-reveal');
        
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateTextReveal(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        textRevealElements.forEach(el => textObserver.observe(el));
    },
    
    animateTextReveal(element) {
        const text = element.textContent;
        const words = text.split(' ');
        element.innerHTML = '';
        
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.style.opacity = '0';
            span.style.transform = 'translateY(50px)';
            span.style.display = 'inline-block';
            span.style.transition = 'all 0.6s ease-out';
            element.appendChild(span);
            
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, index * 100);
        });
    },
    
    // ========================================
    // INTERACTIVE EFFECTS
    // ========================================
    
    initInteractiveEffects() {
        this.initHoverEffects();
        this.initMouseTracker();
        this.initRippleEffect();
    },
    
    initHoverEffects() {
        const hoverElements = document.querySelectorAll('.hover-3d');
        
        hoverElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    },
    
    initMouseTracker() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-inner"></div>';
        document.body.appendChild(cursor);
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const animateCursor = () => {
            const delay = 0.1;
            cursorX += (mouseX - cursorX) * delay;
            cursorY += (mouseY - cursorY) * delay;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();
        
        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .clickable');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    },
    
    initRippleEffect() {
        const rippleElements = document.querySelectorAll('.ripple');
        
        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                element.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    },
    
    // ========================================
    // LOADING ANIMATIONS
    // ========================================
    
    initLoadingAnimations() {
        this.createCustomLoader();
        this.initSkeletonLoading();
    },
    
    createCustomLoader() {
        const loader = document.querySelector('.custom-loader');
        if (!loader) return;
        
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo">
                    <i class="fas fa-car"></i>
                </div>
                <div class="loader-text">Cargando experiencia premium...</div>
                <div class="loader-progress">
                    <div class="loader-bar"></div>
                </div>
            </div>
        `;
    },
    
    initSkeletonLoading() {
        const skeletonElements = document.querySelectorAll('.skeleton');
        
        skeletonElements.forEach(element => {
            element.classList.add('skeleton-loading');
            
            // Remove skeleton after content loads
            const img = element.querySelector('img');
            if (img) {
                img.addEventListener('load', () => {
                    element.classList.remove('skeleton-loading');
                });
            }
        });
    },
    
    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },
    
    // ========================================
    // CLEANUP
    // ========================================
    
    destroy() {
        Object.values(this.observers).forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });
        
        // Remove custom cursor
        const customCursor = document.querySelector('.custom-cursor');
        if (customCursor) {
            customCursor.remove();
        }
        
        console.log('🎨 Animation Controller destruido');
    }
};

// ========================================
// CSS INJECTION FOR DYNAMIC ANIMATIONS
// ========================================

const dynamicCSS = `
    .floating-shape {
        opacity: 0.6;
    }
    
    @keyframes float-random {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
        }
        25% {
            transform: translateY(-20px) rotate(90deg);
        }
        50% {
            transform: translateY(-40px) rotate(180deg);
        }
        75% {
            transform: translateY(-20px) rotate(270deg);
        }
    }
    
    .custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--accent-cyan);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    }
    
    .custom-cursor.hover {
        transform: scale(1.5);
        background: var(--accent-gold);
    }
    
    .cursor-inner {
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .ripple-effect {
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        pointer-events: none;
        animation: ripple-animation 0.6s linear;
        transform: translate(-50%, -50%);
    }
    
    @keyframes ripple-animation {
        0% {
            width: 2px;
            height: 2px;
            opacity: 1;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
    
    .skeleton-loading {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
    }
    
    @keyframes skeleton-loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
    
    .hover-3d {
        transition: transform 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .custom-cursor {
            display: none;
        }
        
        .hover-3d {
            transform: none !important;
        }
    }
`;

// Inject CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicCSS;
document.head.appendChild(styleSheet);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    AnimationController.init();
});

// Export for external use
window.AnimationController = AnimationController;