// ============================================
// ТАЙМЕР ОБРАТНОГО ОТСЧЕТА ДЛЯ СТАРТА КУРСА
// ============================================

class CountdownTimer {
    constructor() {
        // ⚠️ ЗАДАЙТЕ ДАТУ СТАРТА КУРСА
        this.endDate = new Date('January 12, 2026 00:00:00').getTime();
        
        // Элементы DOM
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.countdownBtn = document.getElementById('countdown-btn');
        this.countdownMessage = document.getElementById('countdown-message');
        this.timerElement = document.querySelector('.countdown__timer');
        
        // Стартовые значения
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        
        // Форматирование даты для отображения
        this.startDateElement = document.getElementById('start-date');
        this.formatStartDate();
        
        // Инициализация
        this.init();
    }

    // Создайте функции для логирования:
    logDebug(...args) {
        if (IS_DEV_MODE) {
            console.log(...args);
        }
    }
    

    /**
     * Форматирование даты старта для отображения
     */
    formatStartDate() {
        const options = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        };
        const date = new Date(this.endDate);
        const formattedDate = date.toLocaleDateString('ru-RU', options);
        
        if (this.startDateElement) {
            this.startDateElement.textContent = formattedDate;
        }
    }
    
    /**
     * Инициализация таймера
     */
    init() {
        // Проверяем, не закончился ли уже таймер
        if (this.isCountdownFinished()) {
            this.showFinishedMessage();
            return;
        }
        
        // Запускаем таймер
        this.updateTimer();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
        
        // Добавляем обработчик клика на кнопку
        if (this.countdownBtn) {
            this.countdownBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTariffs();
            });
        }
    }

    /**
     * Проверка осталось ли меньше 24 часов
     */
    checkWarningState() {
        const totalHours = (this.days * 24) + this.hours;
        
        if (totalHours <= 24 && totalHours > 0) {
            // Добавляем класс предупреждения всем элементам
            document.querySelectorAll('.countdown__item').forEach(item => {
                item.classList.add('countdown__item--warning');
            });
            
            // Меняем цвет заголовка
            const title = document.querySelector('.countdown__title');
            if (title) {
                title.style.color = '#e53935';
            }
            
            // Обновляем текст кнопки
            if (this.countdownBtn) {
                this.countdownBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 16C11.3137 16 14 14 14 10.5C14 9 13.5 6.5 11.5 4.5C11.75 6 10.25 6.5 10.25 6.5C11 4 9 0.5 6 0C6.35714 2 6.5 4 4 6C2.75 7 2 8.72893 2 10.5C2 14 4.68629 16 8 16ZM8 15C6.34315 15 5 14 5 12.25C5 11.5 5.25 10.25 6.25 9.25C6.125 10 7 10.5 7 10.5C6.625 9.25 7.5 7.25 9 7C8.82143 8 8.75 9 10 10C10.625 10.5 11 11.3645 11 12.25C11 14 9.65685 15 8 15Z" fill="currentColor"/>
</svg> Последний шанс записаться!`;
                this.countdownBtn.style.animation = 'pulse 1s infinite';
            }
            
            // Обновляем примечание
            const note = document.querySelector('.countdown__note');
            if (note) {
                note.textContent = '🔥 Осталось меньше 24 часов! Цена увеличится совсем скоро!';
                note.style.color = '#e53935';
                note.style.fontWeight = 'bold';
            }
        }
    }
    
    /**
     * Проверка, закончился ли обратный отсчет
     */
    isCountdownFinished() {
        const now = new Date().getTime();
        return now >= this.endDate;
    }
    
    /**
     * Обновление таймера
     */
    updateTimer() {
        const now = new Date().getTime();
        const timeLeft = this.endDate - now;
        this.checkWarningState();
        
        // Если время вышло
        if (timeLeft <= 0) {
            this.stopTimer();
            this.showFinishedMessage();
            return;
        }
        
        // Рассчитываем дни, часы, минуты, секунды
        this.days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Обновляем отображение
        this.updateDisplay();
        
        // Добавляем эффект "тик-так" для секунд
        this.addTickEffect();
    }
    
    /**
     * Обновление отображения таймера
     */
    updateDisplay() {
        if (this.daysElement) {
            this.daysElement.textContent = this.formatTime(this.days);
            // Добавляем анимацию изменения
            if (this.daysElement.textContent !== this.daysElement.dataset.lastValue) {
                this.daysElement.style.animation = 'none';
                setTimeout(() => {
                    this.daysElement.style.animation = 'pulse 0.5s';
                }, 10);
                this.daysElement.dataset.lastValue = this.daysElement.textContent;
            }
        }
        
        if (this.hoursElement) {
            this.hoursElement.textContent = this.formatTime(this.hours);
        }
        
        if (this.minutesElement) {
            this.minutesElement.textContent = this.formatTime(this.minutes);
        }
        
        if (this.secondsElement) {
            this.secondsElement.textContent = this.formatTime(this.seconds);
            // Эффект для секунд
            this.secondsElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.secondsElement.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    /**
     * Форматирование времени (добавление ведущего нуля)
     */
    formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }
    
    /**
     * Эффект "тик-так" для секунд
     */
    addTickEffect() {
        // Изменяем цвет секунд каждую секунду
        if (this.seconds % 2 === 0) {
            this.secondsElement.style.color = '#fff';
        } else {
            this.secondsElement.style.color = '#e53935';
        }
        
        // Вибрация для мобильных устройств (опционально)
        if (this.seconds === 0 && this.minutes === 0 && this.hours === 0 && this.days === 0) {
            // Последний день - усиленная анимация
            this.daysElement.style.color = '#e53935';
            this.daysElement.style.fontSize = '4rem';
        }
    }
    
    /**
     * Остановка таймера
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Устанавливаем нули
        if (this.daysElement) this.daysElement.textContent = '00';
        if (this.hoursElement) this.hoursElement.textContent = '00';
        if (this.minutesElement) this.minutesElement.textContent = '00';
        if (this.secondsElement) this.secondsElement.textContent = '00';
    }
    
    /**
     * Показать сообщение о завершении таймера
     */
    showFinishedMessage() {
        // Останавливаем таймер
        this.stopTimer();
        
        // Скрываем таймер и кнопку
        if (this.timerElement) {
            this.timerElement.style.display = 'none';
        }
        
        if (this.countdownBtn) {
            this.countdownBtn.style.display = 'none';
        }
        
        // Показываем сообщение
        if (this.countdownMessage) {
            this.countdownMessage.style.display = 'block';
            
            // Анимация появления
            setTimeout(() => {
                this.countdownMessage.style.opacity = '1';
                this.countdownMessage.style.transform = 'translateY(0)';
            }, 100);
        }
        
        // Меняем текст заголовка
        const title = document.querySelector('.countdown__title');
        if (title) {
            title.textContent = 'Курс уже начался!';
            title.style.color = '#ffc107';
        }
        
        // Меняем подзаголовок
        const subtitle = document.querySelector('.countdown__subtitle');
        if (subtitle) {
            subtitle.textContent = 'Присоединяйтесь сейчас - еще есть возможность!';
            subtitle.style.color = '#ffc107';
        }
        
        // Логируем в консоль
        logDebug('🎉 Таймер завершен! Курс начался.');
    }
    
    /**
     * Прокрутка к разделу с тарифами
     */
    scrollToTariffs() {
        const tariffsSection = document.getElementById('tariffs');
        if (tariffsSection) {
            tariffsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Подсвечиваем раздел
            tariffsSection.style.boxShadow = '0 0 0 5px rgba(229, 57, 53, 0.5)';
            setTimeout(() => {
                tariffsSection.style.boxShadow = '';
            }, 2000);
        }
    }
    
    /**
     * Метод для тестирования таймера
     */
    testTimer() {
        logDebug('🧪 Тестирование таймера...');
        logDebug('Дата окончания:', new Date(this.endDate));
        logDebug('Осталось дней:', this.days);
        logDebug('Осталось часов:', this.hours);
        logDebug('Осталось минут:', this.minutes);
        logDebug('Осталось секунд:', this.seconds);
        
        // Быстрая проверка завершения
        if (this.isCountdownFinished()) {
            logDebug('✅ Таймер завершен');
            this.showFinishedMessage();
        } else {
            logDebug('⏱️ Таймер работает');
        }
    }
    
    /**
     * Сброс таймера на другую дату (для тестирования)
     */
    resetTimer(newDate) {
        this.endDate = new Date(newDate).getTime();
        this.stopTimer();
        this.formatStartDate();
        this.init();
        logDebug('🔄 Таймер сброшен на:', newDate);
    }
}

// Инициализация таймера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Создаем экземпляр таймера
    window.countdownTimer = new CountdownTimer();
    
    // Для отладки - выводим в консоль
    // console.log('⏰ Таймер обратного отсчета инициализирован');
    
    // Для тестирования можно раскомментировать:
    // window.countdownTimer.testTimer();
    
    // Для тестирования завершения таймера:
    // window.countdownTimer.resetTimer('December 30, 2025 23:59:59');
});

// Добавляем глобальную функцию для управления таймером
window.manageCountdown = {
    // Показать/скрыть таймер
    toggle: function() {
        const countdownSection = document.getElementById('countdown');
        if (countdownSection) {
            const isVisible = countdownSection.style.display !== 'none';
            countdownSection.style.display = isVisible ? 'none' : 'block';
        }
    },
    
    // Обновить дату окончания
    updateEndDate: function(dateString) {
        if (window.countdownTimer) {
            window.countdownTimer.resetTimer(dateString);
        }
    },
    
    // Получить оставшееся время
    getTimeLeft: function() {
        if (window.countdownTimer) {
            return {
                days: window.countdownTimer.days,
                hours: window.countdownTimer.hours,
                minutes: window.countdownTimer.minutes,
                seconds: window.countdownTimer.seconds
            };
        }
        return null;
    }
};