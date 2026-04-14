(function () {
    'use strict';

    function initPCPlugin() {
        // Защита от двойного запуска
        if (window.pcPluginLoaded) return;
        window.pcPluginLoaded = true;

        console.log('>>> Lampa PC Plugin: Начинаю установку ПК-управления <<<');

        // 1. ПОДДЕРЖКА МЫШИ (Ховер)
        $('body').on('mouseenter', '.focusable, .card, .button, .selector', function() {
            $('.focus').removeClass('focus');
            $(this).addClass('focus');
        });

        // 2. ГОРЯЧИЕ КЛАВИШИ
        window.addEventListener('keydown', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.code === 'Escape') {
                e.preventDefault();
                if (window.Lampa && Lampa.Controller) Lampa.Controller.toggle('back');
            }
            if (e.code === 'Space') {
                e.preventDefault();
                if (window.Lampa && Lampa.Player && Lampa.Player.opened) Lampa.Player.playpause();
            }
        });

        // 3. СКРОЛЛ КОЛЕСИКОМ (Эмуляция D-pad)
        let lastScrollTime = 0;
        window.addEventListener('wheel', function(e) {
            if (e.target.closest('.scrollable, .lampa-scroll-allowed, .layer--witsout-background')) return;
            
            e.preventDefault();

            let now = Date.now();
            if (now - lastScrollTime < 150) return; // Защита от сумасшедшего скролла
            lastScrollTime = now;

            let keyCode = e.deltaY > 0 ? 40 : 38; // 40 - вниз, 38 - вверх

            // Создаем событие, которое Lampa воспримет как пульт
            let keyboardEvent = new KeyboardEvent('keydown', {
                bubbles: true, 
                cancelable: true, 
                keyCode: keyCode, 
                which: keyCode
            });
            window.dispatchEvent(keyboardEvent);
            
            console.log('>>> Lampa PC Plugin: Колесико мыши -> Клавиша ' + keyCode);
        }, { passive: false });

        // 4. СТИЛИ (Курсор)
        $('<style>body, html { cursor: default !important; } .focusable, .card, .button { cursor: pointer !important; }</style>').appendTo('head');

        console.log('>>> Lampa PC Plugin: Успешно загружен и работает! <<<');
    }

    // Жесткий контроль загрузки плагина
    function checkAppReady() {
        if (window.appready) {
            initPCPlugin();
        } else {
            setTimeout(checkAppReady, 500);
        }
    }

    // Запускаем проверку
    checkAppReady();

})();
