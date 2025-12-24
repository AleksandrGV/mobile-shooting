// Анимация появления секций при скролле
document.addEventListener('DOMContentLoaded', function() {
    // Функция для проверки видимости элемента
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Функция для обработки скролла
    function handleScrollAnimation() {
        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            if (isElementInViewport(section)) {
                section.classList.add('visible');
            }
        });
    }
    
    // Инициализация анимации при загрузке
    handleScrollAnimation();
    
    // Добавление обработчика скролла
    window.addEventListener('scroll', handleScrollAnimation);
    
    // Бургер меню для мобильных
    const burger = document.querySelector('.nav__burger');
    const navList = document.querySelector('.nav__list');

    burger.addEventListener('click', function() {
        burger.classList.toggle('active');
        navList.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            burger.classList.remove('active');
            navList.classList.remove('active');
        });
    });
    
    // Изменение header при скролле
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // // Модальное окно
    // const modal = document.getElementById('modal');
    // const modalClose = document.getElementById('modal-close');
    // const modalTitle = document.getElementById('modal-title');
    // // const modalForm = document.getElementById('modal-form');
    // const tariffInput = document.getElementById('tariff');
    
    // // Кнопки для открытия модального окна
    // const signupButtons = document.querySelectorAll('.tariff-card__btn');
    // const preorderButton = document.getElementById('preorder-btn');
    // const creatorLink = document.getElementById('creator-link');
    
    // // Открытие модального окна для записи на тариф
    // signupButtons.forEach(button => {
    //     button.addEventListener('click', function() {
    //         const tariff = this.getAttribute('data-tariff');
    //         modalTitle.textContent = 'Запись на курс';
    //         tariffInput.value = tariff;
    //         modal.classList.add('active');
    //         document.body.style.overflow = 'hidden';
    //     });
    // });
    
    // // Открытие модального окна для предзаписи
    // preorderButton.addEventListener('click', function() {
    //     const tariff = this.getAttribute('data-tariff');
    //     modalTitle.textContent = 'Предзапись на курс';
    //     tariffInput.value = tariff;
    //     modal.classList.add('active');
    //     document.body.style.overflow = 'hidden';
    // });
    
    // // // Открытие модального окна для связи с создателем
    // // creatorLink.addEventListener('click', function(e) {
    // //     e.preventDefault();
    // //     modalTitle.textContent = 'Связь с создателем сайта';
    // //     tariffInput.value = 'Вопрос к создателю сайта';
    // //     modal.classList.add('active');
    // //     document.body.style.overflow = 'hidden';
    // // });
    
    // // Закрытие модального окна
    // modalClose.addEventListener('click', function() {
    //     modal.classList.remove('active');
    //     document.body.style.overflow = 'auto';
    // });
    
    // // Закрытие модального окна при клике вне его
    // modal.addEventListener('click', function(e) {
    //     if (e.target === modal) {
    //         modal.classList.remove('active');
    //         document.body.style.overflow = 'auto';
    //     }
    // });
    
    // // Обработка отправки формы
    // modalForm.addEventListener('submit', function(e) {
    //     e.preventDefault();
        
    //     // В реальном проекте здесь был бы AJAX запрос к серверу
    //     const formData = {
    //         name: document.getElementById('name').value,
    //         email: document.getElementById('email').value,
    //         phone: document.getElementById('phone').value,
    //         tariff: tariffInput.value
    //     };
        
    //     console.log('Отправлены данные формы:', formData);
        
    //     // Показ сообщения об успешной отправке
    //     alert(`Спасибо, ${formData.name}! Ваша заявка на "${formData.tariff}" успешно отправлена. Мы свяжемся с вами в ближайшее время.`);
        
    //     // Закрытие модального окна и сброс формы
    //     modal.classList.remove('active');
    //     document.body.style.overflow = 'auto';
    //     modalForm.reset();
    // });
    
    // Плавная прокрутка к секциям
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Для ссылок на внешние страницы (политика) не применяем плавную прокрутку
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});