document.addEventListener('DOMContentLoaded', function() {
        // Модальное окно
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    // const modalForm = document.getElementById('modal-form');
    const tariffInput = document.getElementById('tariff');
    
    // Кнопки для открытия модального окна
    const signupButtons = document.querySelectorAll('.tariff-card__btn');
    const preorderButton = document.getElementById('preorder-btn');
    // const creatorLink = document.getElementById('creator-link');
    
    // Открытие модального окна для записи на тариф
    signupButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tariff = this.getAttribute('data-tariff');
            modalTitle.textContent = 'Запись на курс';
            tariffInput.value = tariff;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Открытие модального окна для предзаписи
    preorderButton.addEventListener('click', function() {
        const tariff = this.getAttribute('data-tariff');
        modalTitle.textContent = 'Предзапись на курс';
        tariffInput.value = tariff;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // // Открытие модального окна для связи с создателем
    // creatorLink.addEventListener('click', function(e) {
    //     e.preventDefault();
    //     modalTitle.textContent = 'Связь с создателем сайта';
    //     tariffInput.value = 'Вопрос к создателю сайта';
    //     modal.classList.add('active');
    //     document.body.style.overflow = 'hidden';
    // });
    
    // Закрытие модального окна
    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Закрытие модального окна при клике вне его
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });



    const IS_DEV_MODE = false; // В продакшене установите false

    // Создайте функции для логирования:
    function logDebug(...args) {
        if (IS_DEV_MODE) {
            console.log(...args);
        }
    }

    logDebug('🔄 Страница загружена, инициализируем форму...');
    
    // 🔥 ВАЖНО: Проверяем, что элементы существуют
    const form = document.getElementById('modal-form');
    const submitBtn = document.getElementById('submit-btn');
    const message = document.getElementById('form-message');
    
    logDebug('Элементы найдены:', {
        form: !!form,
        submitBtn: !!submitBtn,
        message: !!message
    });
    
    if (!form) {
        console.error('❌ ОШИБКА: Форма не найдена! Проверьте ID "application-form"');
        return;
    }
    
    if (!submitBtn) {
        console.error('❌ ОШИБКА: Кнопка не найдена! Проверьте ID "submit-btn"');
        return;
    }
    
    // 🔥 ЗАМЕНИТЕ НА ВАШ URL GOOGLE APPS SCRIPT
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxyZiRQUn1UMyRgL28AJiFpfFdQ4KZJ41QSO4-43bl9stvOJ3Pl_rT1uCosuwDfh2nI/exec';
    
    let isSubmitting = false;
    
    // ======================
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // ======================
    
    /**
     * Показ сообщения
     */
    function showMessage(text, type = 'info', duration = 0) {
        if (!message) {
            console.error('❌ Элемент для сообщений не найден');
            return;
        }
        
        message.textContent = text;
        message.className = `modal__message ${type}`;
        message.style.display = 'block';
        
        if (duration > 0) {
            setTimeout(() => {
                message.style.display = 'none';
            }, duration);
        }
    }
    
    /**
     * Форматирование телефона
     */
    function formatPhone(phone) {
        // Удаляем все, кроме цифр
        let digits = phone.replace(/\D/g,'');
        
        // if (digits.length > 0) {
            // Если начинается с 7 или 8, убираем первую цифру
            if (digits.startsWith('7') || digits.startsWith('8')) {
                digits = digits.substring(1);
            }

            // Форматируем согласно шаблону
            if (digits.length === 0) {
                return '+7';
            }
            if (digits.length <= 3) {
                return `+7 (${digits}`;
            }
            if (digits.length <= 6) {
                return `+7 (${digits.substring(0,3)}) ${digits.substring(3)}`;
            }
            if (digits.length <= 8) {
                return `+7 (${digits.substring(0,3)}) ${digits.substring(3,6)}-${digits.substring(6)}`;
            }

            return `+7 (${digits.substring(0,3)}) ${digits.substring(3,6)}-${digits.substring(6,8)}-${digits.substring(8,10)}`;
            
    }
    
    /**
     * Валидация формы
     */
    function validateForm(name, email, phone, privacyAgreed, social) {
        if (!name || !email || !phone) {
            return 'Заполните все обязательные поля';
        }
        
        if (name.length < 2 || name.length > 100) {
            return 'Имя должно быть от 2 до 100 символов';
        }

        if (!privacyAgreed) {
            return 'Необходимо согласие на обработку персональных данных';
        }
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return 'Введите корректный email';
        }
        
        const digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length < 10) {
            return 'Телефон должен содержать не менее 10 цифр';
        }

        if (social) {
            // Проверка максимальной длины
            if (social.length > 200) {
                return 'Ссылка на соцсеть слишком длинная (макс. 200 символов)';
            }
            
            // Проверку формата (опционально)
            const telegramRegex = /^@[a-zA-Z0-9_]{5,32}$/;
            const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
            
            if (!telegramRegex.test(social) && !urlRegex.test(social)) {
                return 'Введите корректную ссылку или @username для Telegram';
            }
        }
        
        return null;
    }
    
    // ======================
    // ОБРАБОТЧИКИ СОБЫТИЙ
    // ======================
    
    // Автоформатирование телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {

        phoneInput.addEventListener('input', function(e) {
            // Запоминаем количество цифр ДО курсора
            const cursorPosition = this.selectionStart;
            const digitsBeforeCursor = this.value.substring(0, cursorPosition).replace(/\D/g, '').length;

            // Форматируем
            const formatted = formatPhone(this.value);
            this.value = formatted;
            
            // Восстанавливаем позицию курсора
            let newCursorPos = 0;
            let digitsCount = 0;
            
            for (let i = 0; i < formatted.length; i++) {
                if (/\d/.test(formatted[i])) {
                    digitsCount++;
                }
                if (digitsCount >= digitsBeforeCursor) {
                    newCursorPos = i + 1;
                    break;
                }
            }
            
            this.setSelectionRange(newCursorPos, newCursorPos);

        });
        
        // Устанавливаем placeholder при фокусе
        phoneInput.addEventListener('focus', function() {
            if (!this.value.trim() || this.value === '+7') {
                this.value = '+7';
                this.setSelectionRange(2, 2);
            }
        });
    }
    
    // Обработчик отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        logDebug('📝 Отправка формы...');
        
        if (isSubmitting) {
            console.log('⚠️ Форма уже отправляется');
            return;
        }
        
        isSubmitting = true;
        
        // Получаем данные формы
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const phone = document.getElementById('phone').value.trim();
        const tariff = document.getElementById('tariff').value;
        const social = document.getElementById('modal-social').value.trim();
        const privacyAgreed = document.getElementById('privacy-agreement').checked;
        
        logDebug('📊 Данные формы:', { name, email, phone, tariff, social, privacyAgreed });
        
        // Валидация
        const validationError = validateForm(name, email, phone, privacyAgreed, social);
        if (validationError) {
            showMessage(validationError, 'error', 5000);
            isSubmitting = false;
            return;
        }
        
        // Показываем состояние загрузки
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span>Отправка...';
        
        // Подготавливаем данные
        const formData = {
            name: name,
            email: email,
            phone: phone,
            tariff: tariff,
            social: social || '',
            source: window.location.hostname || 'Заявка с сайта',
            timestamp: new Date().toISOString()
        };
        
        logDebug('📤 Отправка данных на сервер:', { 
            ...formData, 
            email: email.substring(0, 3) + '***',
            phone: phone.substring(0, 4) + '***',
            social: social ? social.substring(0, 3) + '***' : 'не указано'
        });
        
        try {
            // 🔥 Метод отправки, который работает с Google Apps Script
            // Используем no-cors для обхода CORS
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Важно для обхода CORS
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            // В режиме no-cors мы не можем прочитать ответ,
            // но если запрос ушел - считаем успешным
            logDebug('✅ Запрос отправлен (режим no-cors)');
            
            // Показываем сообщение об успехе
            showMessage(
                `🎉 Спасибо, ${name}! Ваша заявка отправлена. Мы свяжемся с вами в течение 24 часов.`,
                'success',
                10000
            );
            
            // Очищаем форму через 3 секунды
            setTimeout(() => {
                form.reset();
                message.style.display = 'none';
            }, 3000);
            
        } catch (error) {
            console.error('❌ Ошибка отправки:', error);
            
            // Показываем сообщение об ошибке
            let errorMessage = 'Ошибка отправки заявки. ';
            
            if (error.message.includes('network') || error.message.includes('Network')) {
                errorMessage += 'Проверьте подключение к интернету.';
            } else {
                errorMessage += 'Попробуйте еще раз или свяжитесь с нами другим способом.';
            }
            
            showMessage(errorMessage, 'error', 8000);
            
        } finally {
            // Восстанавливаем кнопку
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заявку';
            isSubmitting = false;
        }
    });
    
    // ======================
    // ПРОВЕРКА API
    // ======================
    
    /**
     * Проверка доступности API
     */
    async function checkApiHealth() {
        try {
            logDebug('🩺 Проверяем доступность API...');
            const response = await fetch(SCRIPT_URL + '?action=health');
            
            if (response.ok) {
                const data = await response.json();
                logDebug('✅ API доступен:', data);
                
                // Показываем статус в консоли
                if (data.status === 'healthy') {
                    logDebug('🎉 Все системы работают нормально');
                } else {
                    console.warn('⚠️ Проблемы с API:', data);
                }
            } else {
                console.warn('⚠️ API ответил с ошибкой:', response.status);
            }
        } catch (error) {
            console.warn('⚠️ Не удалось подключиться к API:', error);
            // Не показываем ошибку пользователю при загрузке
        }
    }
    
    // Запускаем проверку
    checkApiHealth();
    
    logDebug('✅ Форма успешно инициализирована');
});