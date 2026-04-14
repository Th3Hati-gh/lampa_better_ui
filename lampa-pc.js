(function () {
    'use strict';

    function initPCControls() {
        if (window.pcControlsLoaded) return;
        window.pcControlsLoaded = true;

        console.log('>>> Lampa PC Controls: Ультимативный фикс скролла <<<');

        // 1. БЛОКИРУЕМ ВСЕ ВОЗМОЖНЫЕ СОБЫТИЯ КОЛЕСИКА ОТ ДВИЖКА LAMPA
        const wheelEvents = ['wheel', 'mousewheel', 'DOMMouseScroll'];
        wheelEvents.forEach(evt => {
            window.addEventListener(evt, function(e) {
                // Жестко останавливаем передачу события внутрь Lampa
                e.stopPropagation();
                e.stopImmediatePropagation();
            }, { capture: true, passive: true });
        });

        // 2. ВЗАИМОДЕЙСТВИЕ С МЫШЬЮ (Курсор и выделение)
        $('body').on('mouseenter', '.focusable, .card, .button, .selector, .menu__item, .selectbox-item, .card-episode', function() {
            $('.focus').removeClass('focus');
            $(this).addClass('focus');
        });

        // 3. ГОРЯЧИЕ КЛАВИШИ
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

        // 4. CSS ДЛЯ НАСТОЯЩЕГО БРАУЗЕРНОГО СКРОЛЛА
        var css = `
            /* Включаем нативный скролл для всех вертикальных списков */
            .scroll:not(.scroll--horizontal) {
                overflow-y: auto !important;
                overflow-x: hidden !important;
                scroll-behavior: smooth !important;
            }

            /* Заставляем внутренние контейнеры растягиваться по высоте контента */
            .scroll:not(.scroll--horizontal) > .scroll__content {
                height: max-content !important;
                min-height: 100% !important;
                overflow: visible !important;
            }

            /* Намертво отключаем виртуальный сдвиг Lampa */
            .scroll:not(.scroll--horizontal) > .scroll__content > .scroll__body {
                transform: none !important; 
                transition: none !important;
                position: static !important;
                padding-bottom: 50px !important; /* Отступ внизу, чтобы ничего не обрезалось */
            }

            /* Прячем старые фейковые ползунки Lampa */
            .scroll__track { display: none !important; }

            /* Рисуем аккуратный ПК-скроллбар */
            ::-webkit-scrollbar { width: 8px; background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5); }

            /* Возвращаем стандартный курсор ПК */
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
