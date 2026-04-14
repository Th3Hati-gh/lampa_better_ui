(function () {
    'use strict';

    function initPCControls() {
        // Защита от двойного запуска
        if (window.pcControlsLoaded) return;
        window.pcControlsLoaded = true;

        console.log('>>> Lampa PC Controls: Запуск ядра управления <<<');

        // 1. ИСТИННЫЙ НАТИВНЫЙ СКРОЛЛ (Без смены фокуса)
        // Перехватываем событие ДО того, как оно попадет в Lampa
        window.addEventListener('wheel', function(e) {
            // Блокируем логику пульта Lampa (фокус больше не прыгает)
            e.stopPropagation();
            
            // Если пытаемся скроллить саму страницу (например, плеер), отменяем
            if (document.body.classList.contains('player--open')) return;

            // Ищем активный контейнер со списками (фильмы, меню, настройки)
            let scrollBody = e.target.closest('.scroll__body');
            if (!scrollBody) {
                // Если мышка где-то сбоку, берем просто активный экран
                scrollBody = document.querySelector('.activity--active .scroll__body');
            }

            if (scrollBody) {
                // Принудительно прокручиваем сайт
                scrollBody.scrollTop += e.deltaY;
            }
        }, true);

        // 2. ВЗАИМОДЕЙСТВИЕ С МЫШЬЮ
        // Элемент выделяется при наведении, но колесико мыши за него больше не цепляется
        $('body').on('mouseenter', '.focusable, .card, .button, .selector', function() {
            $('.focus').removeClass('focus');
            $(this).addClass('focus');
        });

        // 3. БАЗОВЫЕ КНОПКИ УПРАВЛЕНИЯ
        window.addEventListener('keydown', function(e) {
            // Не перехватываем кнопки, если ты печатаешь в поиске
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.code === 'Escape') {
                e.preventDefault();
                // Шаг назад или закрытие окна
                if (window.Lampa && Lampa.Controller) Lampa.Controller.toggle('back');
            }
            if (e.code === 'Space') {
                e.preventDefault();
                // Пауза/Плей, если открыт плеер
                if (window.Lampa && Lampa.Player && Lampa.Player.opened) Lampa.Player.playpause();
            }
        });

        // 4. СТИЛИ ДЛЯ СКРОЛЛБАРА И КУРСОРА
        var css = `
            /* Включаем возможность нативной прокрутки */
            .scroll__body {
                overflow-y: auto !important;
                scroll-behavior: auto !important;
            }

            /* Прячем уродливую дефолтную полосу прокрутки Lampa */
            .scroll__track { 
                display: none !important; 
            }

            /* Рисуем свой минималистичный скроллбар для ПК */
            .scroll__body::-webkit-scrollbar { 
                width: 8px; 
                background: transparent; 
            }
            .scroll__body::-webkit-scrollbar-thumb { 
                background: rgba(255, 255, 255, 0.2); 
                border-radius: 4px; 
            }
            .scroll__body::-webkit-scrollbar-thumb:hover { 
                background: rgba(255, 255, 255, 0.5); 
            }

            /* Убираем скрытие курсора мыши и меняем его на палец при наведении */
            body, html { cursor: default !important; }
            .focusable, .card, .button { cursor: pointer !important; }
        `;

        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    // Жесткий контроль запуска (ждем ядро Lampa)
    function checkAppReady() {
        if (window.appready) {
            initPCControls();
        } else {
            setTimeout(checkAppReady, 500);
        }
    }

    checkAppReady();

})();
