document.addEventListener('DOMContentLoaded', () => {
    init();

    const elems = document.querySelectorAll('.feature, .photo-card');
    const scrollBtn = document.getElementById('scrollTop');

    function handleScroll() {
        if (window.scrollY > 50) document.querySelector('#header').classList.add('scrolled');
        else document.querySelector('#header').classList.remove('scrolled');

        // Показ кнопки "наверх"
        if (scrollBtn) {
            if (window.scrollY > 500) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        }

        // Анимация элементов
        elems.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                el.classList.add('animate-visible');
            }
        });
    }

    function init() {
        window.addEventListener('scroll', handleScroll);
        document.getElementById('scrollTop')?.addEventListener('click', () => {
            window.scrollTo({ top:0, behavior:'smooth' });
        });
        
        handleScroll();
    }
});