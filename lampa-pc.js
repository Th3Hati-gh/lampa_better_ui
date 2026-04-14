(function () {
    'use strict';

    function initPCControls() {
        if (window.pcControlsLoaded) return;
        window.pcControlsLoaded = true;

        console.log('>>> Lampa PC Controls: Глобальная разблокировка скролла <<<');

        // 1. УБИВАЕМ ВМЕШАТЕЛЬСТВО LAMPA В КОЛЕСИКО МЫШИ
        const wheelEvents = ['wheel', 'mousewheel', 'DOMMouseScroll'];
        wheelEvents.forEach(evt => {
            window.addEventListener(evt, function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }, { capture: true, passive: true });
        });

        // 2. МЫШЬ (Подсветка элементов при наведении)
        $('body').on('mouseenter', '.focusable, .card, .button, .selector, .menu__item, .selectbox-item, .card-episode', function() {
            $('.focus').removeClass('focus');
            $(this).addClass('focus');
        });

        // 3. БАЗОВЫЕ ХОТКЕИ
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

        // 4. ПОЛНАЯ ПЕРЕРАБОТКА СКРОЛЛА ЧЕРЕЗ CSS
        var css = `
            /* --- ВЕРТИКАЛЬНЫЙ СКРОЛЛ (Главная, Меню, Настройки) --- */
            .activity__body > div > .scroll:not(.scroll--horizontal),
            .menu__case,
            .settings__body,
            .selectbox__body > .scroll:not(.scroll--horizontal) {
                overflow-y: auto !important;
                overflow-x: hidden !important;
            }

            /* Разрешаем контенту вытянуться вниз на свою реальную высоту */
            .activity__body > div > .scroll:not(.scroll--horizontal) > .scroll__content,
            .menu__case > .menu__list,
            .selectbox__body > .scroll:not(.scroll--horizontal) > .scroll__content {
                height: max-content !important;
                min-height: 100% !important;
            }

            /* Отключаем виртуальный сдвиг координат Lampa */
            .activity__body > div > .scroll:not(.scroll--horizontal) > .scroll__content > .scroll__body,
            .menu__case > .menu__list,
            .selectbox__body > .scroll:not(.scroll--horizontal) > .scroll__content > .scroll__body {
                transform: none !important;
                transition: none !important;
            }

            /* --- ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ (Карусели фильмов) --- */
            /* Делаем их скроллируемыми мышкой/тачпадом по горизонтали */
            .scroll--horizontal {
                overflow-x: auto !important;
                overflow-y: hidden !important;
                padding-bottom: 8px !important; /* Место под ползунок */
            }
            
            .scroll--horizontal > .scroll__content > .scroll__body {
                transform: none !important;
                transition: none !important;
                display: flex !important;
                width: max-content !important;
            }

            /* --- ВНЕШНИЙ ВИД ПОЛЗУНКОВ И КУРСОРОВ --- */
            .scroll__track { display: none !important; } /* Прячем старый мусор */
            
            /* Рисуем красивые ПК-скроллбары (и вертикальные, и горизонтальные) */
            ::-webkit-scrollbar { width: 8px; height: 8px; background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5); }

            body, html { cursor: default !important; }
            .focusable, .card, .button, .menu__item, .selectbox-item, .selector, .card-episode { cursor: pointer !important; }
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
