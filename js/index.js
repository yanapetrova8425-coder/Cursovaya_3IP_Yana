// ===== МОИ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const header = document.getElementById('header');
const bookingModal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('bookingForm');
const scrollTopBtn = document.getElementById('scrollTop');
const floatingBooking = document.getElementById('floatingBooking');
const quickBooking = document.getElementById('quickBooking');
const footerBooking = document.getElementById('footerBooking');
const closeModalBtn = document.getElementById('closeModal');

// ===== ЗАПУСК САЙТА =====
function init() {
    // Настраиваю все обработчики событий
    setupEventListeners();
    setupNavigation();
    setupScrollEffects();
    setupBookingForm();
    updateFooterYear();
}

// ===== ВСЕ ОБРАБОТЧИКИ КЛИКОВ =====
function setupEventListeners() {
    // Кнопки открытия модального окна записи
    if (floatingBooking) floatingBooking.addEventListener('click', openBookingModal);
    if (quickBooking) quickBooking.addEventListener('click', openBookingModal);
    if (footerBooking) footerBooking.addEventListener('click', openBookingModal);
    
    // Закрытие модального окна
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeBookingModal);
    if (bookingModal) {
        bookingModal.addEventListener('click', function(e) {
            if (e.target === bookingModal) closeBookingModal();
        });
    }
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('active')) {
            closeBookingModal();
        }
    });
    
    // Обработка скролла
    window.addEventListener('scroll', handleScroll);
    
    // Кнопка "Наверх"
    if (scrollTopBtn) scrollTopBtn.addEventListener('click', scrollToTop);
    
    // Форма контактов (на странице контактов)
    const quickContactForm = document.getElementById('quickContactForm');
    if (quickContactForm) {
        quickContactForm.addEventListener('submit', handleQuickContactSubmit);
    }
}

// ===== НАВИГАЦИЯ ПО СТРАНИЦЕ =====
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Убираю активный класс у всех ссылок
            navLinks.forEach(l => l.classList.remove('active'));
            // Добавляю активный класс текущей ссылке
            this.classList.add('active');
            
            // Плавный скролл для якорей на той же странице
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ===== АНИМАЦИЯ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ =====
function setupScrollEffects() {
    // Создаю наблюдатель за появлением элементов
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Показываю элемент когда он попадает в видимую область
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });
    
    // Наблюдаю за блоками с анимацией
    document.querySelectorAll('.feature, .photo-card, .service-card, .contact-item').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease";
        observer.observe(el);
    });
}

// ===== ОБРАБОТКА СОБЫТИЙ СКРОЛЛА =====
function handleScroll() {
    // Меняю стиль шапки при прокрутке
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
    
    // Показываю/скрываю кнопку "Наверх"
    if (scrollTopBtn) {
        if (window.scrollY > 500) {
            scrollTopBtn.style.opacity = "1";
            scrollTopBtn.style.visibility = "visible";
        } else {
            scrollTopBtn.style.opacity = "0";
            scrollTopBtn.style.visibility = "hidden";
        }
    }
}

// ===== ОТКРЫТИЕ МОДАЛЬНОГО ОКНА =====
function openBookingModal() {
    if (bookingModal) {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// ===== ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА =====
function closeBookingModal() {
    if (bookingModal) {
        bookingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ===== НАСТРОЙКА ФОРМЫ ЗАПИСИ =====
function setupBookingForm() {
    const phoneInput = document.getElementById('phone');
    
    // Маска для ввода телефона
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 1) {
                value = '+7 (' + value.substring(1, 4) + ') ' + 
                       value.substring(4, 7) + '-' + 
                       value.substring(7, 9) + '-' + 
                       value.substring(9, 11);
            }
            e.target.value = value.slice(0, 16);
        });
    }
    
    // Обработка отправки формы записи
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
}

// ===== ОТПРАВКА ФОРМЫ ЗАПИСИ =====
function handleBookingSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const service = document.getElementById('service')?.value || '';
    
    // Простая проверка данных
    if (name.length < 2 || !phone.includes('+7') || !service) {
        showNotification('Заполните все поля правильно!', 'error');
        return;
    }
    
    // Имитация успешной отправки
    showNotification('Заявка отправлена! Позвоним через 15 минут.', 'success');
    closeBookingModal();
    if (bookingForm) bookingForm.reset();
}

// ===== ОТПРАВКА ФОРМЫ КОНТАКТОВ =====
function handleQuickContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName')?.value || '';
    const phone = document.getElementById('contactPhone')?.value || '';
    const message = document.getElementById('contactMessage')?.value || '';
    
    if (name.length < 2 || !phone || !message) {
        showNotification('Заполните все поля!', 'error');
        return;
    }
    
    showNotification('Сообщение отправлено! Ответим скоро.', 'success');
    e.target.reset();
}

// ===== ПРОВЕРКА ФОРМЫ =====
function validateForm(data) {
    if (!data.name || data.name.length < 2) {
        showNotification('Имя слишком короткое!', 'error');
        return false;
    }
    if (!data.phone || !data.phone.includes('+7')) {
        showNotification('Введите корректный телефон!', 'error');
        return false;
    }
    if (!data.service) {
        showNotification('Выберите услугу!', 'error');
        return false;
    }
    return true;
}

// ===== ПОКАЗ УВЕДОМЛЕНИЙ =====
function showNotification(message, type = 'success') {
    // Создаю элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Применяю стили напрямую
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#4CAF50' : '#f44336',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        zIndex: '9999',
        maxWidth: '400px',
        fontFamily: 'Segoe UI, sans-serif'
    });
    
    document.body.appendChild(notification);
    
    // Удаляю через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ===== ОБНОВЛЕНИЕ ГОДА В ФУТЕРЕ =====
function updateFooterYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// ===== ПОКРУТИТЬ НАВЕРХ =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== СТАРТ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =====
document.addEventListener('DOMContentLoaded', init);
