/* ========================================
   FACTURACIÓN - PÁGINA ESPECÍFICA
   Sistema de selección de ciudades
======================================== */

// Variables globales
let selectedCity = null;

// URLs de facturación (se actualizarán cuando estén disponibles)
const facturacionUrls = {
    monterrey: '#', // URL pendiente
    guadalajara: '#' // URL pendiente
};

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Facturación page loaded');
    
    // Inicializar componentes
    initializeLoadingScreen();
    initializeNavigation();
    initializeCitySelection();
    initializeAnimations();
    
    // Inicializar AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });
});

// ========================================
// LOADING SCREEN
// ========================================

function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simular carga
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 2000);
}

// ========================================
// NAVEGACIÓN
// ========================================

function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// SELECCIÓN DE CIUDADES
// ========================================

function initializeCitySelection() {
    const cityCards = document.querySelectorAll('.city-card');
    
    cityCards.forEach(card => {
        // Animación hover
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-20px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
        
        // Efecto de clic
        card.addEventListener('click', function() {
            // Efecto de pulso
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-15px)';
            }, 150);
        });
    });
}

// Función principal para seleccionar ciudad
function selectCity(city) {
    selectedCity = city;
    
    console.log(`Ciudad seleccionada: ${city}`);
    
    // Mostrar notificación
    showNotification(`Has seleccionado ${city.charAt(0).toUpperCase() + city.slice(1)}`, 'info');
    
    // Animación de selección
    const selectedCard = document.querySelector(`[onclick="selectCity('${city}')"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        
        // Efectos visuales
        selectedCard.style.background = 'rgba(230, 166, 13, 0.3)';
        selectedCard.style.borderColor = '#e6a60d';
        selectedCard.style.transform = 'scale(1.05)';
    }
    
    // Simular redirección (aquí irán las URLs reales)
    setTimeout(() => {
        if (facturacionUrls[city] && facturacionUrls[city] !== '#') {
            window.location.href = facturacionUrls[city];
        } else {
            // Mensaje temporal hasta tener las URLs
            showNotification(
                `Redirigiendo al sistema de facturación de ${city.charAt(0).toUpperCase() + city.slice(1)}...`, 
                'warning'
            );
            
            // Por ahora, mostrar modal informativo
            showUrlPendingModal(city);
        }
    }, 1000);
}

// ========================================
// ANIMACIONES Y EFECTOS
// ========================================

function initializeAnimations() {
    // Partículas flotantes en el hero
    createFloatingTaxis();
    
    // Animaciones de entrada
    animateOnScroll();
}

function createFloatingTaxis() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    
    const taxiIcons = [
        'fas fa-taxi',
        'fas fa-car',
        'fas fa-car-side'
    ];
    
    for (let i = 0; i < 8; i++) {
        const taxi = document.createElement('div');
        const randomIcon = taxiIcons[Math.floor(Math.random() * taxiIcons.length)];
        
        taxi.innerHTML = `<i class="${randomIcon}"></i>`;
        taxi.className = 'floating-background-taxi';
        
        // Posición y animación aleatoria
        taxi.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 15}px;
            color: rgba(230, 166, 13, 0.3);
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatTaxi ${Math.random() * 10 + 15}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        container.appendChild(taxi);
    }
}

function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.city-card, .info-card').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// NOTIFICACIONES
// ========================================

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        closeNotification(notification.querySelector('.notification-close'));
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'info': 'info-circle',
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'times-circle'
    };
    return icons[type] || 'info-circle';
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    if (notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// ========================================
// MODAL INFORMATIVO (TEMPORAL)
// ========================================

function showUrlPendingModal(city) {
    const modal = document.createElement('div');
    modal.className = 'temp-modal';
    
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeTempModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-construction"></i> En Desarrollo</h3>
                <button class="modal-close" onclick="closeTempModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>El sistema de facturación para <strong>${city.charAt(0).toUpperCase() + city.slice(1)}</strong> estará disponible próximamente.</p>
                <p>Por ahora, puedes contactarnos directamente para solicitar tu factura:</p>
                <div class="temp-contact-options">
                    <a href="tel:8144444050" class="temp-contact-btn">
                        <i class="fas fa-phone"></i> (81) 4444-4050
                    </a>
                    <a href="mailto:reservaciones2@transporte-ejecutivo.mx" class="temp-contact-btn">
                        <i class="fas fa-envelope"></i> Enviar Email
                    </a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Mostrar modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
}

function closeTempModal() {
    const modal = document.querySelector('.temp-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// ========================================
// UTILIDADES
// ========================================

// Función para actualizar URLs cuando estén disponibles
function updateFacturacionUrls(monterreyUrl, guadalajaraUrl) {
    facturacionUrls.monterrey = monterreyUrl;
    facturacionUrls.guadalajara = guadalajaraUrl;
    console.log('URLs de facturación actualizadas:', facturacionUrls);
}

// Función para obtener información de la ciudad seleccionada
function getSelectedCity() {
    return selectedCity;
}

// ========================================
// CSS DINÁMICO PARA ELEMENTOS TEMPORALES
// ========================================

// Inyectar estilos para modal temporal
const tempStyles = `
<style>
.temp-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.temp-modal.show {
    opacity: 1;
    visibility: visible;
}

.temp-modal .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
}

.temp-modal .modal-content {
    position: relative;
    background: #000000;
    border: 2px solid #e6a60d;
    border-radius: 20px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.temp-modal .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(230, 166, 13, 0.3);
}

.temp-modal .modal-header h3 {
    color: #e6a60d;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.temp-modal .modal-close {
    background: none;
    border: none;
    color: #f5f5f5;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background 0.3s;
}

.temp-modal .modal-close:hover {
    background: rgba(230, 166, 13, 0.2);
}

.temp-modal .modal-body {
    padding: 1.5rem;
}

.temp-modal .modal-body p {
    color: #f5f5f5;
    line-height: 1.6;
    margin-bottom: 1rem;
}

.temp-contact-options {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1.5rem;
}

.temp-contact-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #e6a60d 0%, #f4c430 100%);
    color: #000000;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 600;
    transition: transform 0.3s;
    flex: 1;
    justify-content: center;
}

.temp-contact-btn:hover {
    transform: translateY(-2px);
}

@keyframes floatTaxi {
    0% { transform: translateX(-10px) translateY(0px) rotate(0deg); }
    25% { transform: translateX(10px) translateY(-10px) rotate(90deg); }
    50% { transform: translateX(20px) translateY(0px) rotate(180deg); }
    75% { transform: translateX(10px) translateY(10px) rotate(270deg); }
    100% { transform: translateX(-10px) translateY(0px) rotate(360deg); }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', tempStyles);