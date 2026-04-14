(function () {
    'use strict';

    function initPCControls() {
        if (window.pcControlsLoaded) return;
        window.pcControlsLoaded = true;

        console.log('>>> Lampa PC Controls: Скролл со скоростью света <<<');

        // --- НАСТРОЙКИ СКОРОСТИ ---
        // Можешь менять эти цифры. Чем больше, тем быстрее крутится страница.
        const SCROLL_SPEED_VERTICAL = 3.5; 
        const SCROLL_SPEED_HORIZONTAL = 2.5; 

        // 1. УМНЫЙ ПЕРЕХВАТ И УСКОРЕНИЕ СКРОЛЛА
        const wheelEvents = ['wheel', 'mousewheel', 'DOMMouseScroll'];
        wheelEvents.forEach(evt => {
            window.addEventListener(evt, function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();

                // Ищем горизонтальную карусель под курсором
                let horizontalTarget = e.target.closest('.scroll--horizontal');
                // Ищем вертикальный контейнер
                let verticalTarget = e.target.closest('.activity__body > div > .scroll:not(.scroll--horizontal), .menu__case, .settings__body, .selectbox__body > .scroll:not(.scroll--horizontal)');

                if (horizontalTarget) {
                    // Ускоряем карусель и позволяем крутить ее обычным колесиком (без Shift)
                    e.preventDefault(); 
                    let delta = (e.deltaX !== 0 ? e.deltaX : e.deltaY);
                    horizontalTarget.scrollLeft += delta * SCROLL_SPEED_HORIZONTAL;
                } else if (verticalTarget) {
                    // Ускоряем вертикальный скролл сайта
                    e.preventDefault();
                    verticalTarget.scrollTop += e.deltaY * SCROLL_SPEED_VERTICAL;
                }
            }, { capture: true, passive: false }); // passive: false нужен, чтобы отключить медленный системный скролл
        });

        // 2. ВЗАИМОДЕЙСТВИЕ С МЫШЬЮ
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

        // 4. CSS (Убран scroll-behavior: smooth, чтобы не было лагов при ручном ускорении)
        var css = `
            .activity__body > div > .scroll:not(.scroll--horizontal),
            .menu__case,
            .settings__body,
            .selectbox__body > .scroll:not(.scroll--horizontal) {
                overflow-y: auto !important;
                overflow-x: hidden !important;
            }
            .activity__body > div > .scroll:not(.scroll--horizontal) > .scroll__content,
            .menu__case > .menu__list,
            .selectbox__body > .scroll:not(.scroll--horizontal) > .scroll__content {
                height: max-content !important;
                min-height: 100% !important;
            }
            .activity__body > div > .scroll:not(.scroll--horizontal) > .scroll__content > .scroll__body,
            .menu__case > .menu__list,
            .selectbox__body > .scroll:not(.scroll--horizontal) > .scroll__content > .scroll__body {
                transform: none !important;
                transition: none !important;
            }
            .scroll--horizontal {
                overflow-x: auto !important;
                overflow-y: hidden !important;
                padding-bottom: 8px !important;
            }
            .scroll--horizontal > .scroll__content > .scroll__body {
                transform: none !important;
                transition: none !important;
                display: flex !important;
                width: max-content !important;
            }
            .scroll__track { display: none !important; }
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
