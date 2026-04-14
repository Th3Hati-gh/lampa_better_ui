(function () {
    'use strict';

    function initDesktopControls() {
        console.log('Lampa PC Controls: Запущен');

        // 1. АДАПТАЦИЯ МЫШИ (Mouse Hover Support)
        // Заставляем элементы получать фокус Lampa при наведении курсора
        $('body').on('mouseenter', '.focusable, .card, .selector, .button', function() {
            // Снимаем фокус с предыдущего элемента
            $('.focus').removeClass('focus');
            // Добавляем фокус на элемент под курсором мыши
            $(this).addClass('focus');
        });

        // Снимаем фокус при уходе курсора
        $('body').on('mouseleave', '.focusable, .card, .selector, .button', function() {
            $(this).removeClass('focus');
        });

        // 2. ГОРЯЧИЕ КЛАВИШИ КЛАВИАТУРЫ
        window.addEventListener('keydown', function(e) {
            // Если пользователь печатает в поиске, не перехватываем клавиши
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch(e.code) {
                case 'Escape': 
                    // Esc = Кнопка "Назад" (закрытие окон, возврат в меню)
                    e.preventDefault();
                    Lampa.Controller.toggle('back');
                    break;
                
                case 'Space': 
                    // Пробел = Пауза/Плей в плеере
                    e.preventDefault();
                    if (window.Lampa && Lampa.Player && Lampa.Player.opened) {
                        Lampa.Player.playpause();
                    }
                    break;

                case 'KeyF': 
                    // F = Полный экран в плеере
                    e.preventDefault();
                    if (window.Lampa && Lampa.Player && Lampa.Player.opened) {
                        Lampa.Player.fullscreen();
                    }
                    break;

                case 'KeyS': 
                    // S = Быстрый вызов поиска
                    e.preventDefault();
                    Lampa.Search.open();
                    break;
            }
        });

        // 3. ОТКЛЮЧЕНИЕ СТАРОГО ПУЛЬТА (если нужно жестко убрать стрелки)
        // Раскомментируй блок ниже, чтобы полностью убить управление с пульта/стрелочек
        /*
        window.addEventListener('keydown', function(e) {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.stopPropagation(); 
            }
        }, true);
        */

        // 4. СТИЛИ ДЛЯ КУРСОРА И ИНТЕРФЕЙСА
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            /* Принудительно показываем курсор везде */
            body, html { cursor: default !important; }
            /* Делаем "палец" при наведении на кликабельные элементы */
            .focusable, .card, .selector, .button { cursor: pointer !important; }
        `;
        document.head.appendChild(style);
    }

    // Запуск после загрузки ядра
    if (window.appready) {
        initDesktopControls();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') initDesktopControls();
        });
    }
})();
