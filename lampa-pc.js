(function () {
    'use strict';

    function initPCControls() {
        if (window.pcControlsLoaded) return;
        window.pcControlsLoaded = true;

        console.log('>>> Lampa PC Controls: Включен чистый нативный скролл <<<');

        // 1. БЛОКИРОВКА ПУЛЬТА, НО РАЗРЕШЕНИЕ БРАУЗЕРНОГО СКРОЛЛА
        window.addEventListener('wheel', function(e) {
            // Убиваем слушатели Lampa, чтобы фокус не прыгал
            e.stopPropagation();
            e.stopImmediatePropagation();
            // e.preventDefault() ЗДЕСЬ БОЛЬШЕ НЕТ, чтобы браузер мог крутить сам
        }, { capture: true, passive: true }); 

        // 2. ВЗАИМОДЕЙСТВИЕ С МЫШЬЮ
        $('body').on('mouseenter', '.focusable, .card, .button, .selector, .menu__item, .settings__item', function() {
            $('.focus').removeClass('focus');
            $(this).addClass('focus');
        });

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

        // 3. ЖЕСТКИЙ CSS-ПЕРЕХВАТ СКРОЛЛА
        var css = `
            /* 1. Заставляем контейнеры скроллиться по-настоящему */
            .scroll__body, .menu__body, .settings__body, .category-menu, .scrollable {
                overflow-y: auto !important;
                scroll-behavior: smooth !important;
            }

            /* 2. УБИВАЕМ ДВИЖОК LAMPA */
            /* Отключаем его попытки сдвигать контент невидимыми координатами */
            .scroll__content, .menu__list, .settings__list, .category-menu__list {
                transform: none !important; 
                transition: none !important;
            }

            /* 3. Убираем старые ползунки и рисуем новые для ПК */
            .scroll__track { display: none !important; }

            .scroll__body::-webkit-scrollbar, 
            .menu__body::-webkit-scrollbar, 
            .settings__body::-webkit-scrollbar { 
                width: 8px; 
                background: transparent; 
            }
            .scroll__body::-webkit-scrollbar-thumb,
            .menu__body::-webkit-scrollbar-thumb,
            .settings__body::-webkit-scrollbar-thumb { 
                background: rgba(255, 255, 255, 0.2); 
                border-radius: 4px; 
            }
            .scroll__body::-webkit-scrollbar-thumb:hover,
            .menu__body::-webkit-scrollbar-thumb:hover,
            .settings__body::-webkit-scrollbar-thumb:hover { 
                background: rgba(255, 255, 255, 0.5); 
            }

            body, html { cursor: default !important; }
            .focusable, .card, .button, .menu__item, .settings__item { cursor: pointer !important; }
        `;

        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    function checkAppReady() {
        if (window.appready) {
            initPCControls();
        } else {
            setTimeout(checkAppReady, 500);
        }
    }

    checkAppReady();

})();
