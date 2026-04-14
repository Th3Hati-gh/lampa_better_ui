(function () {
    'use strict';

    function nukeLampaEngine() {
        if (window.pcNukeLoaded) return;
        window.pcNukeLoaded = true;

        console.log('>>> Lampa PC: Ядерный режим скролла активирован <<<');

        // 1. Блокируем реакцию движка на колесико мыши
        window.addEventListener('wheel', function(e) {
            e.stopPropagation();
        }, { capture: true });

        // 2. ВЗАИМОДЕЙСТВИЕ С МЫШЬЮ
        $('body').on('mouseenter', '.focusable, .card, .button, .selector, .menu__item', function() {
            $('.focus').removeClass('focus');
            $(this).addClass('focus');
        });

        // 3. ТОТАЛЬНАЯ ПЕРЕПИСЬ CSS АРХИТЕКТУРЫ
        var css = `
            /* Снимаем жесткие замки по высоте со всей цепочки блоков Lampa */
            html, body, #app, .wrap, .wrap__content, .activitys, .activity, .activity__body, .scroll:not(.scroll--horizontal) {
                height: auto !important;
                max-height: none !important;
                overflow: visible !important;
            }

            /* Включаем системный скролл на уровне всего браузера */
            body {
                overflow-y: auto !important;
                overflow-x: hidden !important;
            }

            /* Убиваем искусственный сдвиг координат */
            .scroll__body {
                transform: none !important;
                transition: none !important;
                position: static !important;
            }

            /* Чиним горизонтальные строки фильмов (возвращаем их в ряд) */
            .scroll--horizontal {
                overflow-x: auto !important;
                overflow-y: hidden !important;
                width: 100% !important;
                display: block !important;
                white-space: nowrap !important;
                padding-bottom: 10px !important;
            }
            .scroll--horizontal .scroll__content, 
            .scroll--horizontal .scroll__body {
                display: inline-flex !important;
                width: auto !important;
            }

            /* Прячем мусор от старого движка */
            .scroll__track { display: none !important; }
            
            /* Делаем классический ПК-ползунок */
            ::-webkit-scrollbar { width: 12px; height: 12px; background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 6px; border: 2px solid #1d1f20; }
            ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5); }

            body, html { cursor: default !important; }
            .focusable, .card, .button, .menu__item, .selector { cursor: pointer !important; }
        `;

        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    if (window.appready) {
        nukeLampaEngine();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') nukeLampaEngine();
        });
    }

})();
