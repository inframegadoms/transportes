/* ========================================
   TRANSPORTE EJECUTIVO - MAIN JAVASCRIPT
   Interactividad avanzada y efectos dinámicos
======================================== */

// ========================================
// GLOBAL VARIABLES & INITIALIZATION
// ========================================

// Removed carousel functionality - replaced with About section
let isMenuOpen = false;
let particles = [];
let fleetData = {};

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        delay: 100
    });
    
    // Initialize all components
    initializeApp();
});

// ========================================
// APP INITIALIZATION
// ========================================

function initializeApp() {
    // Loading screen
    handleLoadingScreen();
    
    // Navigation
    initializeNavigation();
    
    // Hero particles
    initializeParticles();
    
    // About section
    initializeAboutSection();
    
    // Fleet data
    initializeFleetData();
    
    // Smooth scrolling
    initializeSmoothScrolling();
    
    // Form handling removed - using TaxiCaller components
    
    // Scroll effects
    initializeScrollEffects();
    
    // Floating Action Button
    initializeFloatingActionButton();
    
    // Resize handlers (debounced for performance)
    window.addEventListener('resize', debounce(handleResize, 250));
    
    console.log('🚗 Transporte Ejecutivo - Aplicación inicializada correctamente');
}

// ========================================
// LOADING SCREEN
// ========================================

function handleLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'visible';
                
                // Start hero animations
                setTimeout(startHeroAnimations, 500);
            }, 500);
        }
        
        loadingProgress.style.width = `${progress}%`;
    }, 150);
}

// ========================================
// NAVIGATION
// ========================================

function initializeNavigation() {
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect on navigation
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Solo interceptar enlaces internos (que empiecen con #)
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    // Update active link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Smooth scroll to section
                    scrollToSection(href.substring(1));
                    
                    // Close mobile menu if open
                    if (isMenuOpen) {
                        toggleMobileMenu();
                    }
                }
            }
            // Para enlaces externos (.html), dejar que funcionen normalmente
        });
    });
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        navMenu.classList.add('mobile-active');
        navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        navMenu.classList.remove('mobile-active');
        navToggle.classList.remove('active');
        document.body.style.overflow = 'visible';
    }
}

// ========================================
// TAXI ANIMATION SYSTEM
// ========================================

function initializeParticles() {
    const heroParticles = document.getElementById('heroParticles');
    if (!heroParticles) return;
    
    // Create floating taxis (optimized for performance)
    for (let i = 0; i < 5; i++) {
        createParticle(heroParticles);
    }
    
    // Start CSS-based taxi animations
    startTaxiAnimations();
}

function createParticle(container) {
    const taxi = document.createElement('div');
    taxi.className = 'floating-taxi';
    
    // Simple random properties
    const startY = Math.random() * 70 + 15; // 15% to 85% height
    const animationDelay = Math.random() * 5;
    const animationDuration = Math.random() * 4 + 6; // 6-10 seconds
    const direction = Math.random() > 0.5 ? 'Right' : 'Left';
    
    // Use taxi icon
    taxi.innerHTML = `<i class="fas fa-taxi"></i>`;
    
    // Simple direct styling
    taxi.style.position = 'absolute';
    taxi.style.top = startY + '%';
    taxi.style.left = '0px';
    taxi.style.zIndex = '10';
    taxi.style.fontSize = '2rem';
    taxi.style.color = '#e6a60d';
    taxi.style.animation = `taxiDrive${direction} ${animationDuration}s linear infinite`;
    taxi.style.animationDelay = animationDelay + 's';
    taxi.style.pointerEvents = 'none';
    taxi.style.display = 'block';
    taxi.style.visibility = 'visible';
    taxi.style.opacity = '1';
    
    container.appendChild(taxi);
    particles.push(taxi);
}

function startTaxiAnimations() {
    // Ensure taxi elements have the proper animations applied
    particles.forEach((taxi, index) => {
        // Add staggered animation delays for variety
        const delay = Math.random() * 3;
        taxi.style.animationDelay = `${delay}s`;
        
        // Ensure animations are running
        taxi.style.animationPlayState = 'running';
    });
}

// ========================================
// HERO ANIMATIONS
// ========================================

function startHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroActions = document.querySelector('.hero-actions');
    const heroBookingCard = document.querySelector('.hero-booking-card');
    
    // Staggered animations
    setTimeout(() => heroTitle?.classList.add('aos-animate'), 200);
    setTimeout(() => heroDescription?.classList.add('aos-animate'), 600);
    setTimeout(() => heroActions?.classList.add('aos-animate'), 1000);
    setTimeout(() => heroBookingCard?.classList.add('aos-animate'), 1400);
}

// ========================================
// ABOUT SECTION ANIMATIONS
// ========================================

function initializeAboutSection() {
    // Add enhanced animations for about cards
    const aboutCards = document.querySelectorAll('.about-card');
    
    aboutCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0)';
        });
    });
}

// ========================================
// FLEET MANAGEMENT
// ========================================

function initializeFleetData() {
    fleetData = {
        All: [
            {
                name: 'Yaris',
                image: 'https://transporteejecutivo.domkard.com/wp-content/uploads/2022/09/yaris-1.png',
                capacity: '4 pasajeros',
                features: ['Aire acondicionado', 'GPS', 'Cajuela amplia'],
            },
            {
                name: 'Hiace',
                image: 'https://transporteejecutivo.domkard.com/wp-content/uploads/2022/09/hiace.png',
                capacity: '10 pasajeros',
                features: ['Aire acondicionado', 'GPS', 'Cajuela amplia'],
            },
            {
                name: 'Suburban',
                image: 'https://transporteejecutivo.domkard.com/wp-content/uploads/2022/09/Suburbam.png',
                capacity: '8 pasajeros',
                features: ['Aire acondicionado', 'GPS', 'Cajuela amplia', 'Blindaje Nivel V'],
            }
        ],
        Aeropuerto: [
            {
                name: 'Yaris',
                image: 'https://transporteejecutivo.domkard.com/wp-content/uploads/2022/09/yaris-1.png',
                capacity: '4 pasajeros',
                features: ['Aire acondicionado', 'GPS', 'Cajuela amplia'],
            },
            {
                name: 'Hiace',
                image: 'https://transporteejecutivo.domkard.com/wp-content/uploads/2022/09/hiace.png',
                capacity: '10 pasajeros',
                features: ['Aire acondicionado', 'GPS', 'Cajuela amplia'],
            }
        ],
        Blindado: [
            {
                name: 'Suburban',
                image: 'https://transporteejecutivo.domkard.com/wp-content/uploads/2022/09/Suburbam.png',
                capacity: '8 pasajeros',
                features: ['Aire acondicionado', 'GPS', 'Cajuela amplia', 'Blindaje Nivel V'],
            }
        ]
    };
    
    // Show default category
    showFleetCategory('All');
}

function showFleetCategory(category) {
    console.log('showFleetCategory called with:', category);
    const fleetTabs = document.querySelectorAll('.fleet-tab');
    const fleetGrid = document.getElementById('fleetGrid');
    
    console.log('fleetTabs found:', fleetTabs.length);
    console.log('fleetGrid found:', fleetGrid);
    
    // Update active tab
    fleetTabs.forEach(tab => {
        tab.classList.remove('active');
        const tabText = tab.textContent.toLowerCase().trim();
        const categoryLower = category.toLowerCase();
        
        console.log('Tab text:', tabText, 'Category:', categoryLower);
        
        // Map button text to category
        if ((tabText === 'todos' && categoryLower === 'all') ||
            (tabText === 'aeropuerto' && categoryLower === 'aeropuerto') ||
            (tabText === 'blindado' && categoryLower === 'blindado')) {
            tab.classList.add('active');
            console.log('Tab activated:', tabText);
        }
    });
    
    // Clear current fleet display
    fleetGrid.innerHTML = '';
    
    // Display fleet items
    const vehicles = fleetData[category] || [];
    console.log('Vehicles found for category', category, ':', vehicles.length);
    
    vehicles.forEach((vehicle, index) => {
        const vehicleCard = createVehicleCard(vehicle, index);
        fleetGrid.appendChild(vehicleCard);
    });
    
    // Re-initialize AOS for new elements
    AOS.refresh();
}

function createVehicleCard(vehicle, index) {
    const card = document.createElement('div');
    card.className = 'fleet-card glass-card hover-lift';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', `${index * 100}`);
    
    card.innerHTML = `
        <div class="fleet-image">
            <img src="${vehicle.image}" alt="${vehicle.name}" loading="lazy">
            <div class="fleet-overlay">
                <button class="btn-primary" onclick="openBookingModal('${vehicle.name}')">
                    <i class="fas fa-calendar-alt"></i>
                    Reservar
                </button>
            </div>
        </div>
        <div class="fleet-info">
            <h3>${vehicle.name}</h3>
            <p class="fleet-capacity">
                <i class="fas fa-users"></i>
                ${vehicle.capacity}
            </p>
            <ul class="fleet-features">
                ${vehicle.features.map(feature => `
                    <li><i class="fas fa-check"></i> ${feature}</li>
                `).join('')}
            </ul>
            <div class="fleet-price">${vehicle.price}</div>
        </div>
    `;
    
    return card;
}

// ========================================
// SMOOTH SCROLLING
// ========================================

function initializeSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const offsetTop = section.offsetTop - 80; // Account for fixed nav
    
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
}

// ========================================
// FORM HANDLING
// ========================================

// Forms functionality removed - replaced with TaxiCaller components

// ========================================
// BOOKING MODAL
// ========================================

function openBookingModal(vehicleName = '') {
    // Create modal HTML
    const modalHTML = `
        <div class="booking-modal" id="bookingModal">
            <div class="modal-overlay" onclick="closeBookingModal()"></div>
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h2><i class="fas fa-calendar-alt"></i> Reservar Servicio</h2>
                    <button class="modal-close" onclick="closeBookingModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form class="booking-modal-form" onsubmit="handleModalBooking(event)">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Nombre completo *</label>
                                <input type="text" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label>Teléfono *</label>
                                <input type="tel" class="form-input" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" class="form-input">
                            </div>
                            <div class="form-group">
                                <label>Vehículo</label>
                                <input type="text" class="form-input" value="${vehicleName}" readonly>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Fecha *</label>
                                <input type="date" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label>Hora *</label>
                                <input type="time" class="form-input" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Desde *</label>
                                <select class="form-input" required>
                                    <option value="">Seleccionar origen</option>
                                    <option>Aeropuerto MTY</option>
                                    <option>Hotel</option>
                                    <option>Domicilio</option>
                                    <option>Empresa</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Hacia *</label>
                                <select class="form-input" required>
                                    <option value="">Seleccionar destino</option>
                                    <option>Aeropuerto MTY</option>
                                    <option>Hotel</option>
                                    <option>Domicilio</option>
                                    <option>Empresa</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Comentarios adicionales</label>
                            <textarea class="form-input" rows="3" placeholder="Número de vuelo, dirección exacta, solicitudes especiales..."></textarea>
                        </div>
                        <button type="submit" class="btn-primary btn-full">
                            <i class="fas fa-paper-plane"></i>
                            Confirmar Reserva
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    
    // Show modal with animation
    setTimeout(() => {
        document.getElementById('bookingModal').classList.add('active');
    }, 10);
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = 'visible';
        }, 300);
    }
}

function handleModalBooking(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('¡Reserva confirmada! Te llamaremos para confirmar los detalles.', 'success');
        closeBookingModal();
    }, 2000);
}

// ========================================
// NOTIFICATIONS
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ========================================
// SCROLL EFFECTS
// ========================================

function initializeScrollEffects() {
    window.addEventListener('scroll', handleScroll);
}

function handleScroll() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    // Parallax effect
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
    
    // Progress indicator (if exists)
    updateScrollProgress();
    
    // Update active navigation link
    updateActiveNavLink();
}

function updateScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;
    
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    progressBar.style.width = scrolled + '%';
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function handleResize() {
    // Handle responsive changes
    if (window.innerWidth > 768 && isMenuOpen) {
        toggleMobileMenu();
    }
    
    // Refresh AOS
    AOS.refresh();
}

function debounce(func, wait, immediate) {
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
}

function throttle(func, limit) {
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
}

// Performance optimized scroll handler (60fps = 16ms, optimized to 20ms for better performance)
const optimizedScrollHandler = throttle(handleScroll, 20);
window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// ========================================
// FLOATING ACTION BUTTON (FAB)
// ========================================

function initializeFloatingActionButton() {
    const fabMain = document.getElementById('fabMain');
    const fabSubmenu = document.getElementById('fabSubmenu');
    const fabItems = document.querySelectorAll('.fab-item');
    
    if (!fabMain || !fabSubmenu) return;
    
    let isOpen = false;
    
    // Toggle FAB menu
    fabMain.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFABMenu();
    });
    
    // Handle FAB item clicks
    fabItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = item.dataset.action;
            handleFABAction(action);
            toggleFABMenu(); // Close menu after action
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isOpen && !fabMain.contains(e.target) && !fabSubmenu.contains(e.target)) {
            toggleFABMenu();
        }
    });
    
    function toggleFABMenu() {
        isOpen = !isOpen;
        
        if (isOpen) {
            fabMain.classList.add('active');
            fabSubmenu.classList.add('active');
        } else {
            fabMain.classList.remove('active');
            fabSubmenu.classList.remove('active');
        }
    }
    
    function handleFABAction(action) {
        const whatsappNumber = '528114148863'; // Número con código de país (52 para México)
        let message = '';
        
        switch(action) {
            case 'customer-service':
                message = 'Solicito servicio al cliente desde la página web';
                break;
            case 'lost-objects':
                message = 'Solicito ayuda para un objeto extraviado';
                break;
            default:
                message = 'Hola, necesito información sobre sus servicios';
        }
        
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
        
        // Show success notification
        showNotification('Redirigiendo a WhatsApp...', 'success');
    }
}