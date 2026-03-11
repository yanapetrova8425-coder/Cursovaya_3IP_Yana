











// Здесь еще не все подкаректированно!!!   <====только набросок













// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const header = document.getElementById('header');
const bookingModal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('bookingForm');
const scrollTopBtn = document.getElementById('scrollTop');
const floatingBooking = document.getElementById('floatingBooking');
const quickBooking = document.getElementById('quickBooking');
const footerBooking = document.getElementById('footerBooking');
const closeModalBtn = document.querySelector('.close-modal');

// ===== ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ =====
function init() {
    setupEventListeners();
    setupNavigation();
    setupBookingForm();
    setupScrollAnimations();
    setTodayAsMinDate();
}

// =====  СОБЫТИЯ =====
function setupEventListeners() {
  
    window.addEventListener('scroll', handleScroll);
    
    // Обработчики для модального окна записи
    floatingBooking.addEventListener('click', openBookingModal);
    quickBooking.addEventListener('click', openBookingModal);
    footerBooking.addEventListener('click', openBookingModal);
    closeModalBtn.addEventListener('click', closeBookingModal);
    bookingModal.addEventListener('click', function(e) {
        if (e.target === bookingModal) closeBookingModal();
    });
    
    // Обработчик кнопки "Наверх"
    scrollTopBtn.addEventListener('click', scrollToTop);
    
    // Закрытие модального окна по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
            closeBookingModal();
        }
    });
}

// ===== НАВИГАЦИЯ =====
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Удаляем активный класс у всех ссылок
            navLinks.forEach(l => l.classList.remove('active'));
            // Добавляем активный класс текущей ссылке
            this.classList.add('active');
            
            // Плавный скролл к якорю
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

// ===== ОБРАБОТКА ФОРМЫ ЗАПИСИ =====
function setupBookingForm() {
    bookingForm.addEventListener('submit', handleBookingSubmit);
    
    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
        }
        
        e.target.value = value;
    });
}

// ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
function setupScrollAnimations() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature, .photo-card');
        elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            }
        });
    };
    
    // Инициализация начального состояния
    document.querySelectorAll('.feature, .photo-card').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Запуск при загрузке
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
function handleScroll() {
    // Добавление класса при скролле для шапки
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Показ/скрытие кнопки "Наверх"
    if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = "1";
        scrollTopBtn.style.visibility = "visible";
    } else {
        scrollTopBtn.style.opacity = "0";
        scrollTopBtn.style.visibility = "hidden";
    }
}

function openBookingModal() {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
}

function closeBookingModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Восстанавливаем скролл
}

async function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Получаем данные формы
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value
    };
    
    // Валидация
    if (!validateFormData(formData)) {
        return;
    }
    
 
    showNotification('Заявка успешно отправлена! Мы свяжемся с вами в течение 15 минут.', 'success');
    
    // Закрываем модальное окно
    closeBookingModal();
    
    // Сбрасываю форму
    bookingForm.reset();
}

function validateFormData(data) {
    // Проверка имени
    if (data.name.length < 2) {
        showNotification('Введите корректное имя (минимум 2 символа)', 'error');
        return false;
    }
    
    //проверка телефона
  if (!data.phone || !data.phone.includes('+7')) {
    showNotification('Введите телефон с +7', 'error');
    return false;
}

    
    // Проверка выбранной услуги
    if (!data.service) {
        showNotification('Выберите услугу', 'error');
        return false;
    }
    
    // Проверка даты
    if (!data.date) {
        showNotification('Выберите дату', 'error');
        return false;
    }
    
    // Проверка времени
    if (!data.time) {
        showNotification('Выберите время', 'error');
        return false;
    }
    
    return true;
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function showNotification(message, type) {
    // Создаю элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Добавляюстили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    // Стили для контента уведомления
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    // Добавляем на страницу
    document.body.appendChild(notification);
    
    // Удаляю через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Добавляю  ключевые кадры для анимации
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function setTodayAsMinDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Если поле пустое, устанавливаем сегодняшнюю дату
        if (!dateInput.value) {
            dateInput.value = today;
        }
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =====
document.addEventListener('DOMContentLoaded', init);

// ===== ДОПОЛНИТЕЛЬНЫЕ ВЗАИМОДЕЙСТВИЯ =====
// Обработка наведения на элементы с анимацией
document.querySelectorAll('.feature, .photo-card, .service-item').forEach(el => {
    el.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    el.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Обработка нажатия на кнопки в футере
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Переход в социальные сети', 'info');
    });
});

// Автоматическое обновление года в футере
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = yearElement.textContent.replace('2024', currentYear);
    }
});

// Анимация для плавающих элементов на фоне
function animateBackgroundElements() {
    const elements = document.querySelectorAll('.bg-element');
    elements.forEach((el, index) => {
        const delay = index * 0.5;
        el.style.animationDelay = `${delay}s`;
    });
}

animateBackgroundElements();
