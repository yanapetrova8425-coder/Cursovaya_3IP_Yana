// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const header = document.getElementById('header');
const bookingModal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('bookingForm');
const scrollTopBtn = document.getElementById('scrollTop');
const floatingBooking = document.getElementById('floatingBooking');
const quickBooking = document.getElementById('quickBooking');
const footerBooking = document.getElementById('footerBooking');
const closeModalBtn = document.getElementById('closeModal');

// ===== ИНИЦИАЛИЗАЦИЯ =====
function init() {
    setupEventListeners();
    setupNavigation();
    setupScrollEffects();
    setupBookingForm();
    updateFooterYear();
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
function setupEventListeners() {
    // Кнопки открытия модалки
    if (floatingBooking) floatingBooking.addEventListener('click', openBookingModal);
    if (quickBooking) quickBooking.addEventListener('click', openBookingModal);
    if (footerBooking) footerBooking.addEventListener('click', openBookingModal);
    
    // Закрытие модалки
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeBookingModal);
    if (bookingModal) {
        bookingModal.addEventListener('click', function(e) {
            if (e.target === bookingModal) closeBookingModal();
        });
    }
    
    // ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
            closeBookingModal();
        }
    });
}
   // Скролл
    window.addEventListener('scroll', handleScroll);
    
    // Кнопка наверх
    if (scrollTopBtn) scrollTopBtn.addEventListener('click', scrollToTop);


// ===== НАВИГАЦИЯ =====
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ===== АНИМАЦИИ СКРОЛЛА =====
function setupScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    });
    
    document.querySelectorAll('.feature, .photo-card, .service-card').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease";
        observer.observe(el);
    });
}

// ===== СКРОЛЛ =====
function handleScroll() {
    header.classList.toggle('scrolled', window.scrollY > 50);
    
    scrollTopBtn.style.opacity = window.scrollY > 500 ? "1" : "0";
    scrollTopBtn.style.visibility = window.scrollY > 500 ? "visible" : "hidden";
}

// ===== МОДАЛЬНОЕ ОКНО =====
function openBookingModal() {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ===== ФОРМА ЗАПИСИ =====
function setupBookingForm() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = '+7 (' + value.substring(1, 4) + ') ' + 
                       value.substring(4, 7) + '-' + 
                       value.substring(7, 9) + '-' + 
                       value.substring(9, 11);
            }
            e.target.value = value.slice(0, 16);
        });
    }
    
    bookingForm.addEventListener('submit', handleBookingSubmit);
}

// ===== ОТПРАВКА ФОРМЫ =====
function handleBookingSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value
    };
    
    if (validateForm(formData)) {
        showNotification('Заявка отправлена! Позвоним через 15 минут.', 'success');
        closeBookingModal();
        bookingForm.reset();
    }
}

// ===== ВАЛИДАЦИЯ =====
function validateForm(data) {
    if (data.name.length < 2) {
        showNotification('Имя должно быть больше 2 букв!', 'error');
        return false;
    }
    if (!data.phone.includes('+7')) {
        showNotification('Нужен телефон с +7!', 'error');
        return false;
    }
    if (!data.service) {
        showNotification('Выберите услугу!', 'error');
        return false;
    }
    return true;
}

// ===== УВЕДОМЛЕНИЯ =====
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed', top: '20px', right: '20px',
        background: type === 'success' ? '#4CAF50' : '#f44336',
        color: 'white', padding: '15px 20px', 
        borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', 
        zIndex: '9999', maxWidth: '400px'
    });
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

// ===== ГОД В ФУТЕРЕ =====
function updateFooterYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

// ===== НАВЕРХ =====
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== ЗАПУСК =====
document.addEventListener('DOMContentLoaded', init);