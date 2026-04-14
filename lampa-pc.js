(function () {
    'use strict';

    function initPCControls() {
        if (window.pcControlsLoaded) return;
        window.pcControlsLoaded = true;

        console.log('>>> Lampa PC Controls: Точечный фикс главного скролла <<<');

        // 1. Убиваем слушатели Lampa на колесико мыши
        window.addEventListener('wheel', function(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
        }, { capture: true, passive: true }); 

        // 2. Взаимодействие с мышью (подсветка при наведении)
        $('body').on('mouseenter', '.focusable, .card, .button, .selector, .menu__item, .settings__item', function() {
            $('.focus').removeClass('focus');
            $(this).addClass('focus');
        });

        // Горячие клавиши
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

        // 3. ХИРУРГИЧЕСКИЙ CSS-ПЕРЕХВАТ СКРОЛЛА
        var css = `
            /* Включаем вертикальный скролл ТОЛЬКО для главных оболочек */
            .activity__body > .scroll > .scroll__body,
            .menu__body,
            .settings__body,
            .category-menu {
                overflow-y: auto !important;
                overflow-x: hidden !important;
                height: 100% !important;
            }

            /* Отключаем виртуальный сдвиг Lampa ТОЛЬКО для основного контента */
            .activity__body > .scroll > .scroll__body > .scroll__content,
            .menu__body > .menu__list,
            .settings__body > .settings__list {
                transform: none !important; 
                transition: none !important;
            }

            /* Прячем родные ползунки Lampa */
            .scroll__track { display: none !important; }

            /* Рисуем свой красивый скроллбар для страницы */
            ::-webkit-scrollbar { width: 8px; background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5); }

            /* Курсоры */
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

})();ф
