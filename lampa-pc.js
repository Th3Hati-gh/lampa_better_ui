/**
 * Lampa PC Plugin
 * Полноценная поддержка мыши, колёсика и клавиатуры для ПК
 * 
 * GitHub: your-repo/lampa-pc
 * Version: 1.0.0
 */

(function () {
    'use strict';

    var VERSION = '1.0.0';
    var TAG = '[LampaPC]';

    // ─────────────────────────────────────────────
    //  MANIFEST — обязательно для Lampa
    // ─────────────────────────────────────────────

    if (window.Lampa && Lampa.Plugin) {
        Lampa.Plugin.add({
            name:        'PC Controls',
            version:     VERSION,
            description: 'Поддержка мыши, колёсика и клавиатуры для ПК',
            type:        'other'
        });
    }

    // ─────────────────────────────────────────────
    //  UTILS
    // ─────────────────────────────────────────────

    function log(msg) {
        console.log(TAG + ' ' + msg);
    }

    /**
     * Симулировать нажатие клавиши (для Lampa Controller)
     */
    function simulateKey(keyName, keyCode) {
        var e = new KeyboardEvent('keydown', {
            key: keyName,
            code: keyName,
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(e);
    }

    /**
     * Найти ближайший focusable-предок
     */
    function findFocusable(el) {
        var SELECTORS = [
            '.selector',
            '.card',
            '.item--result',
            '.button--player',
            '.settings--input',
            '.settings--check',
            '.settings--select',
            '.files--item',
            '.feed--item',
            '.source--item',
            '.menu--item',
            '.select--p',
            '.modal--close',
            '.head--logo',
            '.player-panel',
        ];

        var current = el;
        while (current && current !== document.body) {
            for (var i = 0; i < SELECTORS.length; i++) {
                if (current.matches && current.matches(SELECTORS[i])) {
                    return current;
                }
            }
            current = current.parentElement;
        }
        return null;
    }

    /**
     * Показать OSD-подсказку (поверх плеера)
     */
    var osdTimer = null;
    function showOSD(text) {
        var osd = document.getElementById('pc-osd');
        if (!osd) {
            osd = document.createElement('div');
            osd.id = 'pc-osd';
            osd.style.cssText = [
                'position:fixed',
                'top:24px',
                'right:28px',
                'background:rgba(0,0,0,0.72)',
                'color:#fff',
                'padding:7px 18px',
                'border-radius:8px',
                'font-size:15px',
                'font-family:sans-serif',
                'z-index:99999',
                'pointer-events:none',
                'transition:opacity .25s',
                'opacity:0',
            ].join(';');
            document.body.appendChild(osd);
        }
        osd.textContent = text;
        osd.style.opacity = '1';
        clearTimeout(osdTimer);
        osdTimer = setTimeout(function () {
            osd.style.opacity = '0';
        }, 1800);
    }

    // ─────────────────────────────────────────────
    //  1. КУРСОР — не прятать
    // ─────────────────────────────────────────────

    function initCursor() {
        // Добавляем глобальный CSS
        var style = document.createElement('style');
        style.id = 'pc-plugin-style';
        style.textContent = [
            '* { cursor: default !important; }',
            'a, button, .selector, .card, .item--result,',
            '.button--player, .settings--input, .settings--check,',
            '.settings--select, .files--item, .feed--item,',
            '.source--item, .menu--item, .select--p,',
            '.modal--close, .head--logo { cursor: pointer !important; }',
            'input, textarea { cursor: text !important; }',
        ].join('\n');
        document.head.appendChild(style);

        // Lampa иногда ставит cursor:none на body через style
        var obs = new MutationObserver(function () {
            if (document.body.style.cursor === 'none') {
                document.body.style.removeProperty('cursor');
            }
        });
        obs.observe(document.body, { attributes: true, attributeFilter: ['style'] });

        log('Cursor fix applied');
    }

    // ─────────────────────────────────────────────
    //  2. МЫШЬ → ФОКУС + КЛИК
    // ─────────────────────────────────────────────

    function initMouseFocus() {
        var lastFocused = null;

        // Hover → focus
        document.addEventListener('mousemove', function (e) {
            var focusable = findFocusable(e.target);
            if (!focusable || focusable === lastFocused) return;

            lastFocused = focusable;

            // Убираем старый фокус
            var prev = document.querySelector('.selector.focused');
            if (prev && prev !== focusable) {
                prev.classList.remove('focused');
            }

            // Ставим новый
            focusable.classList.add('focused');
            if (focusable.focus) focusable.focus({ preventScroll: true });

            // Пробуждаем события Lampa
            focusable.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        }, true);

        // Клик → Enter
        document.addEventListener('click', function (e) {
            var focusable = findFocusable(e.target);
            if (!focusable) return;

            // Если уже в фокусе — симулируем Enter для Lampa
            focusable.classList.add('focused');
            simulateKey('Enter', 13);
        }, true);

        // ПКМ → Back (Escape)
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            simulateKey('Backspace', 8);
        }, true);

        log('Mouse focus applied');
    }

    // ─────────────────────────────────────────────
    //  3. СКРОЛЛ КОЛЁСИКОМ
    // ─────────────────────────────────────────────

    function initMouseWheel() {
        var wheelThrottle = null;

        document.addEventListener('wheel', function (e) {
            e.preventDefault();

            // Плеер открыт — колёсико управляет громкостью
            if (isPlayerOpen()) {
                var video = getVideo();
                if (video) {
                    var delta = e.deltaY > 0 ? -0.1 : 0.1;
                    video.volume = Math.min(1, Math.max(0, video.volume + delta));
                    showOSD('Громкость: ' + Math.round(video.volume * 100) + '%');
                }
                return;
            }

            // Обычный режим — стрелки вверх/вниз с троттлингом
            if (wheelThrottle) return;
            wheelThrottle = setTimeout(function () { wheelThrottle = null; }, 120);

            if (e.deltaY > 0) {
                simulateKey('ArrowDown', 40);
            } else {
                simulateKey('ArrowUp', 38);
            }

            // Горизонтальный скролл
            if (e.deltaX > 30) {
                simulateKey('ArrowRight', 39);
            } else if (e.deltaX < -30) {
                simulateKey('ArrowLeft', 37);
            }

        }, { passive: false });

        log('Mouse wheel applied');
    }

    // ─────────────────────────────────────────────
    //  4. ПЛЕЕР — управление
    // ─────────────────────────────────────────────

    function isPlayerOpen() {
        return !!(
            document.querySelector('.player-video') ||
            document.querySelector('video')
        );
    }

    function getVideo() {
        return document.querySelector('video');
    }

    var controlsHideTimer = null;

    function initPlayerMouse() {
        // Показывать панель управления при движении мыши
        document.addEventListener('mousemove', function () {
            if (!isPlayerOpen()) return;

            var panel = document.querySelector('.player-panel, .player--panel');
            if (panel) {
                panel.style.opacity = '1';
                panel.style.pointerEvents = 'all';
                clearTimeout(controlsHideTimer);
                controlsHideTimer = setTimeout(function () {
                    panel.style.opacity = '';
                    panel.style.pointerEvents = '';
                }, 3000);
            }
        });
    }

    function initPlayerKeys() {
        document.addEventListener('keydown', function (e) {
            if (!isPlayerOpen()) return;

            var video = getVideo();
            if (!video) return;

            // Не перехватываем если фокус в input
            if (document.activeElement &&
                (document.activeElement.tagName === 'INPUT' ||
                 document.activeElement.tagName === 'TEXTAREA')) return;

            switch (e.code) {
                // Пауза / Play
                case 'Space':
                case 'KeyK':
                    e.preventDefault();
                    e.stopPropagation();
                    if (video.paused) {
                        video.play();
                        showOSD('▶ Воспроизведение');
                    } else {
                        video.pause();
                        showOSD('⏸ Пауза');
                    }
                    break;

                // Перемотка ←10s / →10s
                case 'ArrowLeft':
                    e.preventDefault();
                    e.stopPropagation();
                    video.currentTime = Math.max(0, video.currentTime - 10);
                    showOSD('⏪ -10 сек');
                    break;

                case 'ArrowRight':
                    e.preventDefault();
                    e.stopPropagation();
                    video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
                    showOSD('⏩ +10 сек');
                    break;

                // J/L — быстрая перемотка ±30s (как на YouTube)
                case 'KeyJ':
                    e.preventDefault();
                    video.currentTime = Math.max(0, video.currentTime - 30);
                    showOSD('⏪ -30 сек');
                    break;

                case 'KeyL':
                    e.preventDefault();
                    video.currentTime = Math.min(video.duration || 0, video.currentTime + 30);
                    showOSD('⏩ +30 сек');
                    break;

                // Громкость ↑↓
                case 'ArrowUp':
                    e.preventDefault();
                    e.stopPropagation();
                    video.volume = Math.min(1, video.volume + 0.1);
                    showOSD('🔊 ' + Math.round(video.volume * 100) + '%');
                    break;

                case 'ArrowDown':
                    e.preventDefault();
                    e.stopPropagation();
                    video.volume = Math.max(0, video.volume - 0.1);
                    showOSD('🔉 ' + Math.round(video.volume * 100) + '%');
                    break;

                // Mute
                case 'KeyM':
                    e.preventDefault();
                    video.muted = !video.muted;
                    showOSD(video.muted ? '🔇 Без звука' : '🔊 Звук');
                    break;

                // Полный экран
                case 'KeyF':
                    e.preventDefault();
                    toggleFullscreen();
                    break;

                // 0-9 — перепрыгнуть на %
                default:
                    var numKey = parseInt(e.key, 10);
                    if (!isNaN(numKey) && numKey >= 0 && numKey <= 9) {
                        e.preventDefault();
                        var percent = numKey / 10;
                        video.currentTime = (video.duration || 0) * percent;
                        showOSD('⏭ ' + (numKey * 10) + '%');
                    }
                    break;
            }
        }, true);

        log('Player keyboard shortcuts applied');
    }

    // ─────────────────────────────────────────────
    //  5. ПОЛНЫЙ ЭКРАН
    // ─────────────────────────────────────────────

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(function (err) {
                log('Fullscreen error: ' + err.message);
            });
            showOSD('⛶ Полный экран');
        } else {
            document.exitFullscreen();
            showOSD('⛶ Оконный режим');
        }
    }

    // Кнопка F вне плеера тоже работает
    document.addEventListener('keydown', function (e) {
        if (e.code === 'KeyF' && !isPlayerOpen()) {
            toggleFullscreen();
        }
    });

    // ─────────────────────────────────────────────
    //  INIT
    // ─────────────────────────────────────────────

    function init() {
        log('Initializing v' + VERSION);

        initCursor();
        initMouseFocus();
        initMouseWheel();
        initPlayerMouse();
        initPlayerKeys();

        log('Ready ✓');
    }

    // Ждём готовности Lampa
    if (window.appready) {
        init();
    } else {
        document.addEventListener('appready', init);
    }

})();
