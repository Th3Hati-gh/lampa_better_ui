(function () {
    'use strict';

    function initPCControls() {
        if (window.pcControlsLoaded) return;
        window.pcControlsLoaded = true;

        console.log('>>> Lampa PC Controls: Агрессивный перехват скролла запущен <<<');

        // 1. ТОТАЛЬНЫЙ ПЕРЕХВАТ КОЛЕСИКА (Убиваем пульт везде)
        window.addEventListener('wheel', function(e) {
            // Жестко блокируем ВСЕ обработчики Lampa на колесико
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Пропускаем, если открыт плеер (там своя громкость/перемотка)
            if (document.body.classList.contains('player--open')) return;

            // Определяем, над каким блоком сейчас находится курсор
            // Добавлены классы меню, настроек и категорий
            let scrollTarget = e.target.closest('.scroll__body, .menu__body, .settings__body, .category-menu');
            
            if (!scrollTarget) {
                // Если курсор сбоку, крутим активный центральный экран
                scrollTarget = document.querySelector('.activity--active .scroll__body, .activity--active .settings__body');
            }

            if (scrollTarget) {
                // Отключаем дефолтный скролл браузера, чтобы избежать дерганий
                e.preventDefault();
                // Плавно крутим нужный блок
                scrollTarget.scrollTop += e.deltaY;
            }
        }, { capture: true, passive: false });

        // 2. ВЗАИМОДЕЙСТВИЕ С МЫШЬЮ
        $('body').on('mouseenter', '.focusable, .card, .button, .selector, .menu__item, .settings__item', function() {
            $('.focus').removeClass('focus');
            $(this).addClass('focus');
        });

        // 3. БАЗОВЫЕ КНОПКИ УПРАВЛЕНИЯ
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

        // 4. СТИЛИ (Нативный скролл для ВСЕХ блоков)
        var css = `
            /* Принудительно включаем нативный скролл для списков, меню и настроек */
            .scroll__body, .menu__body, .settings__body, .category-menu {
                overflow-y: auto !important;
                scroll-behavior: auto !important;
            }

            /* Прячем уродливые ползунки Lampa */
            .scroll__track { 
                display: none !important; 
            }

            /* Рисуем свой красивый скроллбар */
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

})();
