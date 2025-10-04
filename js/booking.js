/* ========================================
   BOOKING SYSTEM
   Sistema avanzado de reservas y cotizaciones
======================================== */

const BookingSystem = {
    currentStep: 1,
    totalSteps: 4,
    bookingData: {},
    pricing: {},
    
    init() {
        this.initPricing();
        this.bindEvents();
        console.log('📅 Sistema de reservas inicializado');
    },
    
    // ========================================
    // PRICING CONFIGURATION
    // ========================================
    
    initPricing() {
        this.pricing = {
            ejecutivo: {
                base: 350,
                perKm: 12,
                hourly: 280,
                airport: 380
            },
            premium: {
                base: 650,
                perKm: 18,
                hourly: 450,
                airport: 680
            },
            lujo: {
                base: 1200,
                perKm: 25,
                hourly: 800,
                airport: 1250
            }
        };
    },
    
    // ========================================
    // EVENT BINDING
    // ========================================
    
    bindEvents() {
        // Quick booking form
        const quickForm = document.querySelector('.quick-booking-form');
        if (quickForm) {
            quickForm.addEventListener('change', this.handleQuickFormChange.bind(this));
        }
        
        // Advanced booking triggers
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-booking-action]')) {
                const action = e.target.getAttribute('data-booking-action');
                this.handleBookingAction(action, e.target);
            }
        });
    },
    
    // ========================================
    // QUICK BOOKING HANDLER
    // ========================================
    
    handleQuickFormChange(e) {
        const form = e.target.closest('form');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Update pricing in real-time
        this.updatePricing(data);
    },
    
    updatePricing(data) {
        const { desde, hacia, fecha, hora } = data;
        
        if (!desde || !hacia || !fecha || !hora) return;
        
        // Calculate estimated price
        let category = 'ejecutivo';
        let basePrice = this.pricing[category].base;
        
        // Airport surcharge
        if (desde.includes('Aeropuerto') || hacia.includes('Aeropuerto')) {
            basePrice = this.pricing[category].airport;
        }
        
        // Time-based pricing
        const bookingTime = new Date(`${fecha}T${hora}`);
        const hour = bookingTime.getHours();
        
        if (hour < 6 || hour > 22) {
            basePrice *= 1.3; // Night surcharge
        }
        
        // Weekend surcharge
        const dayOfWeek = bookingTime.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            basePrice *= 1.2;
        }
        
        this.showPriceEstimate(basePrice, category);
    },
    
    showPriceEstimate(price, category) {
        let priceDisplay = document.querySelector('.price-estimate');
        
        if (!priceDisplay) {
            priceDisplay = document.createElement('div');
            priceDisplay.className = 'price-estimate';
            
            const form = document.querySelector('.quick-booking-form');
            if (form) {
                form.appendChild(priceDisplay);
            }
        }
        
        priceDisplay.innerHTML = `
            <div class="price-estimate-content">
                <div class="price-label">Precio estimado (${category})</div>
                <div class="price-amount">$${Math.round(price)} MXN</div>
                <div class="price-note">*Precio aproximado, sujeto a confirmación</div>
            </div>
        `;
        
        priceDisplay.classList.add('show');
    },
    
    // ========================================
    // ADVANCED BOOKING FLOW
    // ========================================
    
    startAdvancedBooking(vehicleType = null) {
        this.currentStep = 1;
        this.bookingData = {
            vehicleType: vehicleType,
            timestamp: new Date().toISOString()
        };
        
        this.showBookingModal();
    },
    
    showBookingModal() {
        const modalHTML = this.generateModalHTML();
        
        // Remove existing modal
        const existingModal = document.getElementById('advancedBookingModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
        
        // Initialize modal
        setTimeout(() => {
            const modal = document.getElementById('advancedBookingModal');
            modal.classList.add('active');
            this.initializeModalStep();
        }, 10);
    },
    
    generateModalHTML() {
        return `
            <div class="booking-modal advanced-booking" id="advancedBookingModal">
                <div class="modal-overlay" onclick="BookingSystem.closeModal()"></div>
                <div class="modal-content glass-card">
                    <div class="modal-header">
                        <h2>
                            <i class="fas fa-calendar-alt"></i>
                            Reserva tu Transporte
                        </h2>
                        <div class="step-indicator">
                            <div class="step ${this.currentStep >= 1 ? 'active' : ''}" data-step="1">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Ruta</span>
                            </div>
                            <div class="step ${this.currentStep >= 2 ? 'active' : ''}" data-step="2">
                                <i class="fas fa-calendar"></i>
                                <span>Fecha</span>
                            </div>
                            <div class="step ${this.currentStep >= 3 ? 'active' : ''}" data-step="3">
                                <i class="fas fa-car"></i>
                                <span>Vehículo</span>
                            </div>
                            <div class="step ${this.currentStep >= 4 ? 'active' : ''}" data-step="4">
                                <i class="fas fa-user"></i>
                                <span>Datos</span>
                            </div>
                        </div>
                        <button class="modal-close" onclick="BookingSystem.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="booking-step-content">
                            <!-- Content will be populated by JavaScript -->
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn-secondary" onclick="BookingSystem.previousStep()" ${this.currentStep === 1 ? 'style="display:none"' : ''}>
                                <i class="fas fa-arrow-left"></i>
                                Anterior
                            </button>
                            <button type="button" class="btn-primary" onclick="BookingSystem.nextStep()">
                                ${this.currentStep === this.totalSteps ? 'Confirmar Reserva' : 'Siguiente'}
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    initializeModalStep() {
        const stepContent = document.getElementById('booking-step-content');
        
        switch (this.currentStep) {
            case 1:
                stepContent.innerHTML = this.generateStep1HTML();
                this.initializeStep1();
                break;
            case 2:
                stepContent.innerHTML = this.generateStep2HTML();
                this.initializeStep2();
                break;
            case 3:
                stepContent.innerHTML = this.generateStep3HTML();
                this.initializeStep3();
                break;
            case 4:
                stepContent.innerHTML = this.generateStep4HTML();
                this.initializeStep4();
                break;
        }
    },
    
    // ========================================
    // STEP 1: ROUTE SELECTION
    // ========================================
    
    generateStep1HTML() {
        return `
            <div class="booking-step step-1">
                <div class="step-header">
                    <h3><i class="fas fa-route"></i> Selecciona tu Ruta</h3>
                    <p>¿Desde dónde y hacia dónde necesitas el transporte?</p>
                </div>
                <div class="route-selection">
                    <div class="route-input-group">
                        <div class="form-group">
                            <label><i class="fas fa-map-marker-alt text-success"></i> Punto de origen</label>
                            <select class="form-input" id="origen" required>
                                <option value="">Seleccionar origen...</option>
                                <option value="aeropuerto">Aeropuerto Internacional de Monterrey (MTY)</option>
                                <option value="hotel">Hotel</option>
                                <option value="domicilio">Domicilio</option>
                                <option value="empresa">Empresa/Oficina</option>
                                <option value="centro">Centro de Monterrey</option>
                                <option value="otro">Otro lugar</option>
                            </select>
                        </div>
                        <div class="route-swap">
                            <button type="button" class="btn-swap" onclick="BookingSystem.swapRoute()">
                                <i class="fas fa-exchange-alt"></i>
                            </button>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-map-marker-alt text-danger"></i> Punto de destino</label>
                            <select class="form-input" id="destino" required>
                                <option value="">Seleccionar destino...</option>
                                <option value="aeropuerto">Aeropuerto Internacional de Monterrey (MTY)</option>
                                <option value="hotel">Hotel</option>
                                <option value="domicilio">Domicilio</option>
                                <option value="empresa">Empresa/Oficina</option>
                                <option value="centro">Centro de Monterrey</option>
                                <option value="otro">Otro lugar</option>
                            </select>
                        </div>
                    </div>
                    <div class="address-details" style="display: none;">
                        <div class="form-group">
                            <label>Dirección específica del origen</label>
                            <textarea class="form-input" id="direccion-origen" rows="2" placeholder="Proporciona la dirección completa..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Dirección específica del destino</label>
                            <textarea class="form-input" id="direccion-destino" rows="2" placeholder="Proporciona la dirección completa..."></textarea>
                        </div>
                    </div>
                    <div class="route-options">
                        <div class="option-card">
                            <input type="radio" id="ida" name="trip-type" value="ida" checked>
                            <label for="ida">
                                <i class="fas fa-arrow-right"></i>
                                <strong>Solo ida</strong>
                                <span>Viaje único al destino</span>
                            </label>
                        </div>
                        <div class="option-card">
                            <input type="radio" id="redondo" name="trip-type" value="redondo">
                            <label for="redondo">
                                <i class="fas fa-exchange-alt"></i>
                                <strong>Viaje redondo</strong>
                                <span>Ida y vuelta (descuento aplicado)</span>
                            </label>
                        </div>
                        <div class="option-card">
                            <input type="radio" id="horas" name="trip-type" value="horas">
                            <label for="horas">
                                <i class="fas fa-clock"></i>
                                <strong>Por horas</strong>
                                <span>Servicio disponible por tiempo</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    initializeStep1() {
        const origenSelect = document.getElementById('origen');
        const destinoSelect = document.getElementById('destino');
        const addressDetails = document.querySelector('.address-details');
        
        // Show address details when needed
        [origenSelect, destinoSelect].forEach(select => {
            select.addEventListener('change', () => {
                const needsAddress = origenSelect.value === 'otro' || 
                                   destinoSelect.value === 'otro' ||
                                   origenSelect.value === 'domicilio' || 
                                   destinoSelect.value === 'domicilio' ||
                                   origenSelect.value === 'hotel' || 
                                   destinoSelect.value === 'hotel';
                
                if (needsAddress) {
                    addressDetails.style.display = 'block';
                } else {
                    addressDetails.style.display = 'none';
                }
            });
        });
    },
    
    swapRoute() {
        const origen = document.getElementById('origen');
        const destino = document.getElementById('destino');
        
        const tempValue = origen.value;
        origen.value = destino.value;
        destino.value = tempValue;
        
        // Trigger change events
        origen.dispatchEvent(new Event('change'));
        destino.dispatchEvent(new Event('change'));
    },
    
    // ========================================
    // STEP 2: DATE & TIME SELECTION
    // ========================================
    
    generateStep2HTML() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const minDate = today.toISOString().split('T')[0];
        const maxDate = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
        
        return `
            <div class="booking-step step-2">
                <div class="step-header">
                    <h3><i class="fas fa-calendar-alt"></i> Fecha y Hora del Servicio</h3>
                    <p>¿Cuándo necesitas el transporte?</p>
                </div>
                <div class="datetime-selection">
                    <div class="date-picker-section">
                        <div class="form-group">
                            <label>Fecha del servicio</label>
                            <input type="date" class="form-input date-input" id="fecha-servicio" 
                                   min="${minDate}" max="${maxDate}" required>
                        </div>
                        <div class="quick-dates">
                            <button type="button" class="quick-date-btn" onclick="BookingSystem.setQuickDate(0)">Hoy</button>
                            <button type="button" class="quick-date-btn" onclick="BookingSystem.setQuickDate(1)">Mañana</button>
                            <button type="button" class="quick-date-btn" onclick="BookingSystem.setQuickDate(7)">En una semana</button>
                        </div>
                    </div>
                    <div class="time-picker-section">
                        <div class="form-group">
                            <label>Hora del servicio</label>
                            <input type="time" class="form-input time-input" id="hora-servicio" required>
                        </div>
                        <div class="quick-times">
                            <button type="button" class="quick-time-btn" onclick="BookingSystem.setQuickTime('06:00')">6:00 AM</button>
                            <button type="button" class="quick-time-btn" onclick="BookingSystem.setQuickTime('12:00')">12:00 PM</button>
                            <button type="button" class="quick-time-btn" onclick="BookingSystem.setQuickTime('18:00')">6:00 PM</button>
                            <button type="button" class="quick-time-btn" onclick="BookingSystem.setQuickTime('22:00')">10:00 PM</button>
                        </div>
                    </div>
                </div>
                <div class="additional-options">
                    <div class="option-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="vuelo-tracking">
                            <span class="checkmark"></span>
                            <strong>Seguimiento de vuelo</strong>
                            <small>Ajustaremos el horario según retrasos del vuelo</small>
                        </label>
                    </div>
                    <div class="flight-details" style="display: none;">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Número de vuelo</label>
                                <input type="text" class="form-input" id="numero-vuelo" placeholder="Ej: AM 2405">
                            </div>
                            <div class="form-group">
                                <label>Aerolínea</label>
                                <select class="form-input" id="aerolinea">
                                    <option value="">Seleccionar...</option>
                                    <option value="aeromexico">Aeroméxico</option>
                                    <option value="volaris">Volaris</option>
                                    <option value="vivaaerobus">VivaAerobus</option>
                                    <option value="interjet">Interjet</option>
                                    <option value="united">United</option>
                                    <option value="american">American Airlines</option>
                                    <option value="delta">Delta</option>
                                    <option value="otro">Otra</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    initializeStep2() {
        const flightTracking = document.getElementById('vuelo-tracking');
        const flightDetails = document.querySelector('.flight-details');
        
        flightTracking.addEventListener('change', () => {
            flightDetails.style.display = flightTracking.checked ? 'block' : 'none';
        });
        
        // Set default time
        const now = new Date();
        const currentHour = now.getHours();
        let suggestedHour = currentHour + 2;
        
        if (suggestedHour >= 24) suggestedHour = 8;
        
        const timeInput = document.getElementById('hora-servicio');
        timeInput.value = `${suggestedHour.toString().padStart(2, '0')}:00`;
    },
    
    setQuickDate(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        
        const dateInput = document.getElementById('fecha-servicio');
        dateInput.value = date.toISOString().split('T')[0];
    },
    
    setQuickTime(time) {
        const timeInput = document.getElementById('hora-servicio');
        timeInput.value = time;
    },
    
    // ========================================
    // STEP NAVIGATION
    // ========================================
    
    nextStep() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        this.saveCurrentStepData();
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateModal();
        } else {
            this.submitBooking();
        }
    },
    
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateModal();
        }
    },
    
    validateCurrentStep() {
        const stepContent = document.getElementById('booking-step-content');
        const requiredFields = stepContent.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        if (!isValid) {
            this.showNotification('Por favor completa todos los campos obligatorios', 'error');
        }
        
        return isValid;
    },
    
    saveCurrentStepData() {
        const stepContent = document.getElementById('booking-step-content');
        const inputs = stepContent.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                if (input.checked) {
                    this.bookingData[input.name || input.id] = input.value;
                }
            } else {
                this.bookingData[input.id] = input.value;
            }
        });
    },
    
    updateModal() {
        // Update step indicator
        const steps = document.querySelectorAll('.step-indicator .step');
        steps.forEach((step, index) => {
            if (index + 1 <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update content
        this.initializeModalStep();
        
        // Update buttons
        const prevBtn = document.querySelector('.modal-actions .btn-secondary');
        const nextBtn = document.querySelector('.modal-actions .btn-primary');
        
        prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-flex';
        nextBtn.innerHTML = this.currentStep === this.totalSteps ? 
            'Confirmar Reserva <i class="fas fa-check"></i>' : 
            'Siguiente <i class="fas fa-arrow-right"></i>';
    },
    
    // ========================================
    // BOOKING SUBMISSION
    // ========================================
    
    submitBooking() {
        const submitBtn = document.querySelector('.modal-actions .btn-primary');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.handleBookingSuccess();
        }, 2000);
    },
    
    handleBookingSuccess() {
        const bookingId = 'TE-' + Date.now().toString().slice(-6);
        
        this.showNotification(`¡Reserva confirmada! ID: ${bookingId}`, 'success');
        
        // Send confirmation data
        this.sendConfirmationEmail(bookingId);
        
        this.closeModal();
        
        // Optional: redirect to confirmation page
        // window.location.href = `/confirmacion?id=${bookingId}`;
    },
    
    sendConfirmationEmail(bookingId) {
        // Here you would integrate with your email service
        console.log('Enviando confirmación:', {
            bookingId,
            data: this.bookingData
        });
    },
    
    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
    closeModal() {
        const modal = document.getElementById('advancedBookingModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = 'visible';
            }, 300);
        }
    },
    
    showNotification(message, type = 'info') {
        // Reuse the notification system from main.js
        if (window.showNotification) {
            window.showNotification(message, type);
        }
    },
    
    handleBookingAction(action, element) {
        switch (action) {
            case 'start-booking':
                const vehicleType = element.getAttribute('data-vehicle-type');
                this.startAdvancedBooking(vehicleType);
                break;
            case 'quick-quote':
                this.showQuickQuote();
                break;
            case 'call-booking':
                window.open('tel:8144444050');
                break;
        }
    }
};

// ========================================
// ADDITIONAL CSS FOR BOOKING SYSTEM
// ========================================

const bookingCSS = `
    .price-estimate {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--gradient-accent);
        border-radius: var(--radius-md);
        color: white;
        text-align: center;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .price-estimate.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .price-amount {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0.5rem 0;
    }
    
    .price-note {
        font-size: 0.8rem;
        opacity: 0.8;
    }
    
    .advanced-booking .modal-content {
        max-width: 800px;
        width: 90%;
    }
    
    .step-indicator {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .step-indicator .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: var(--radius-sm);
        transition: all 0.3s ease;
        opacity: 0.5;
    }
    
    .step-indicator .step.active {
        opacity: 1;
        background: rgba(0, 208, 132, 0.1);
        color: var(--accent-cyan);
    }
    
    .route-input-group {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 1rem;
        align-items: end;
        margin-bottom: 2rem;
    }
    
    .btn-swap {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--gradient-accent);
        color: white;
        border: none;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .btn-swap:hover {
        transform: rotate(180deg);
    }
    
    .route-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 2rem;
    }
    
    .option-card {
        position: relative;
    }
    
    .option-card input[type="radio"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;
    }
    
    .option-card label {
        display: block;
        padding: 1rem;
        border: 2px solid var(--tertiary-color);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }
    
    .option-card input[type="radio"]:checked + label {
        border-color: var(--accent-cyan);
        background: rgba(0, 208, 132, 0.1);
    }
    
    .quick-dates, .quick-times {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
        flex-wrap: wrap;
    }
    
    .quick-date-btn, .quick-time-btn {
        padding: 0.5rem 1rem;
        background: var(--tertiary-color);
        border: none;
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }
    
    .quick-date-btn:hover, .quick-time-btn:hover {
        background: var(--accent-cyan);
        color: white;
    }
    
    .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        cursor: pointer;
        padding: 1rem;
        border-radius: var(--radius-md);
        transition: background 0.3s ease;
    }
    
    .checkbox-label:hover {
        background: var(--tertiary-color);
    }
    
    .checkmark {
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary-color);
        border-radius: 4px;
        position: relative;
        flex-shrink: 0;
        transition: all 0.3s ease;
    }
    
    input[type="checkbox"]:checked + .checkmark {
        background: var(--accent-cyan);
        border-color: var(--accent-cyan);
    }
    
    input[type="checkbox"]:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: -2px;
        left: 3px;
        color: white;
        font-weight: bold;
    }
    
    .form-input.error {
        border-color: var(--danger);
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
    
    @media (max-width: 768px) {
        .route-input-group {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .btn-swap {
            justify-self: center;
            transform: rotate(90deg);
        }
        
        .option-card label {
            padding: 0.75rem;
        }
        
        .step-indicator {
            gap: 0.5rem;
        }
        
        .step-indicator .step span {
            font-size: 0.8rem;
        }
    }
`;

// Inject booking CSS
const bookingStyleSheet = document.createElement('style');
bookingStyleSheet.textContent = bookingCSS;
document.head.appendChild(bookingStyleSheet);

// Initialize booking system
document.addEventListener('DOMContentLoaded', () => {
    BookingSystem.init();
});

// Export for global access
window.BookingSystem = BookingSystem;
window.openBookingModal = (vehicleName) => BookingSystem.startAdvancedBooking(vehicleName);