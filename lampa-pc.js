/**
 * Lampa PC — Complete UI Overhaul + PC Controls
 * Modern desktop interface: mouse, keyboard, scroll, player
 *
 * Version: 2.0.0
 */

(function () {
    'use strict';

    var VERSION = '2.0.0';
    var TAG = '[LampaPC]';

    function log(msg) { console.log(TAG + ' ' + msg); }

    // ─────────────────────────────────────────────
    //  MANIFEST
    // ─────────────────────────────────────────────

    if (window.Lampa && Lampa.Plugin) {
        Lampa.Plugin.add({
            name:        'PC Controls',
            version:     VERSION,
            description: 'Современный UI + полная поддержка мыши и клавиатуры для ПК',
            type:        'other'
        });
    }

    // ─────────────────────────────────────────────
    //  UI OVERHAUL — CSS
    // ─────────────────────────────────────────────

    function injectStyles() {
        var fontLink = document.createElement('link');
        fontLink.rel  = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap';
        document.head.appendChild(fontLink);

        var css = document.createElement('style');
        css.id  = 'lampa-pc-styles';
        css.textContent = `

/* ══════════════════════════════════════════════
   VARIABLES
══════════════════════════════════════════════ */
:root {
  --c-bg:          #07070f;
  --c-bg-2:        #0d0d1c;
  --c-surface:     #10101e;
  --c-surface-2:   #17172e;
  --c-surface-3:   #1e1e3a;
  --c-accent:      #6272ea;
  --c-accent-dim:  rgba(98,114,234,0.16);
  --c-accent-glow: rgba(98,114,234,0.42);
  --c-accent-2:    #a78bfa;
  --c-text:        #e2e2f0;
  --c-text-2:      #8888b0;
  --c-text-3:      #4e4e72;
  --c-border:      rgba(255,255,255,0.065);
  --c-border-2:    rgba(255,255,255,0.13);
  --c-red:         #f06292;
  --c-gold:        #f7c948;
  --r-card:        10px;
  --r-ui:          8px;
  --r-pill:        100px;
  --t-fast:        140ms cubic-bezier(.4,0,.2,1);
  --t-mid:         220ms cubic-bezier(.4,0,.2,1);
  --font:          'DM Sans','Segoe UI',system-ui,sans-serif;
  --font-mono:     'DM Mono','Cascadia Code',monospace;
}

/* ══════════════════════════════════════════════
   GLOBAL
══════════════════════════════════════════════ */
*, *::before, *::after { box-sizing: border-box !important; }

html, body {
  background: var(--c-bg) !important;
  color: var(--c-text) !important;
  font-family: var(--font) !important;
  font-size: 15px !important;
  line-height: 1.6 !important;
  -webkit-font-smoothing: antialiased !important;
}

/* Grain texture */
body::after {
  content: '';
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.022; pointer-events: none; z-index: 9998;
}

/* ══════════════════════════════════════════════
   SCROLLBARS
══════════════════════════════════════════════ */
::-webkit-scrollbar              { width: 5px; height: 5px; }
::-webkit-scrollbar-track        { background: transparent; }
::-webkit-scrollbar-thumb        { background: var(--c-surface-3); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover  { background: var(--c-accent); }
::-webkit-scrollbar-corner       { background: transparent; }

/* ══════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════ */
.head {
  background: linear-gradient(180deg, rgba(7,7,15,.97) 0%, rgba(7,7,15,0) 100%) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-bottom: none !important;
  padding: 0 32px !important;
  height: 62px !important;
  position: sticky !important; top: 0 !important;
  z-index: 900 !important;
}

.head--logo {
  font-family: var(--font) !important;
  font-weight: 600 !important; font-size: 20px !important;
  letter-spacing: -.3px !important; color: var(--c-text) !important;
  transition: color var(--t-fast) !important;
}
.head--logo:hover, .head--logo.focused { color: var(--c-accent) !important; }

/* ══════════════════════════════════════════════
   MENU / SIDEBAR
══════════════════════════════════════════════ */
.menu {
  background: var(--c-surface) !important;
  border-right: 1px solid var(--c-border) !important;
  padding: 16px 10px !important;
}

.menu--item {
  display: flex !important; align-items: center !important; gap: 12px !important;
  padding: 10px 14px !important; border-radius: var(--r-ui) !important;
  color: var(--c-text-2) !important; font-size: 14px !important;
  font-weight: 500 !important; cursor: pointer !important;
  transition: all var(--t-fast) !important; margin-bottom: 2px !important;
  border: 1px solid transparent !important;
  position: relative !important; overflow: hidden !important;
}
.menu--item::before {
  content: ''; position: absolute; left: 0; top: 25%; bottom: 25%;
  width: 3px; border-radius: 99px; background: var(--c-accent);
  transform: scaleY(0); transition: transform var(--t-fast);
}
.menu--item:hover, .menu--item.focused {
  background: var(--c-surface-2) !important; color: var(--c-text) !important;
  border-color: var(--c-border) !important;
}
.menu--item.active, .menu--item.selected {
  background: var(--c-accent-dim) !important; color: var(--c-accent) !important;
  border-color: rgba(98,114,234,.22) !important;
}
.menu--item.active::before, .menu--item.selected::before { transform: scaleY(1) !important; }

/* ══════════════════════════════════════════════
   CARDS
══════════════════════════════════════════════ */
.card {
  border-radius: var(--r-card) !important; overflow: hidden !important;
  background: var(--c-surface) !important;
  transition: transform var(--t-mid), box-shadow var(--t-mid) !important;
  cursor: pointer !important; position: relative !important;
  outline: 2px solid transparent !important; outline-offset: 0 !important;
}
.card:hover, .card.focused {
  transform: scale(1.05) translateY(-4px) !important;
  box-shadow: 0 14px 44px rgba(0,0,0,.55),
              0 0 0 2px var(--c-accent),
              0 0 22px var(--c-accent-glow) !important;
  z-index: 10 !important;
}
.card--cover {
  width: 100% !important; object-fit: cover !important;
  display: block !important; transition: filter var(--t-mid) !important;
}
.card:hover .card--cover, .card.focused .card--cover {
  filter: brightness(.65) !important;
}
.card--title {
  position: absolute !important; bottom: 0 !important; left: 0; right: 0 !important;
  padding: 32px 12px 12px !important;
  background: linear-gradient(0deg, rgba(0,0,0,.94) 0%, transparent 100%) !important;
  font-size: 12.5px !important; font-weight: 500 !important; color: #fff !important;
  line-height: 1.35 !important; transform: translateY(5px) !important;
  opacity: 0 !important; transition: all var(--t-mid) !important;
}
.card:hover .card--title, .card.focused .card--title {
  opacity: 1 !important; transform: translateY(0) !important;
}
.card--age, .card--rate {
  position: absolute !important; top: 8px !important; right: 8px !important;
  background: rgba(0,0,0,.72) !important; backdrop-filter: blur(8px) !important;
  color: var(--c-gold) !important; font-size: 11px !important;
  font-weight: 600 !important; font-family: var(--font-mono) !important;
  padding: 3px 8px !important; border-radius: var(--r-pill) !important;
}

/* ══════════════════════════════════════════════
   FOCUS (PC-style — ring, не TV-block)
══════════════════════════════════════════════ */
.selector.focused:not(.card) {
  outline: 2px solid var(--c-accent) !important;
  outline-offset: 2px !important;
  box-shadow: 0 0 0 5px var(--c-accent-dim) !important;
}
.selector.selected:not(.card) {
  background: var(--c-accent-dim) !important;
  color: var(--c-accent) !important;
}

/* ══════════════════════════════════════════════
   BUTTONS
══════════════════════════════════════════════ */
.button, [class*="button--"] {
  border-radius: var(--r-ui) !important; font-family: var(--font) !important;
  font-size: 14px !important; font-weight: 500 !important;
  cursor: pointer !important; transition: all var(--t-fast) !important;
  border: 1px solid var(--c-border) !important;
}
.button--main, .full--start, .full--play {
  background: var(--c-accent) !important; color: #fff !important;
  border-color: transparent !important; padding: 10px 24px !important;
  box-shadow: 0 4px 18px var(--c-accent-glow) !important;
}
.button--main:hover, .full--start:hover, .full--play:hover,
.button--main.focused, .full--start.focused, .full--play.focused {
  background: #7083f0 !important; transform: translateY(-1px) !important;
  box-shadow: 0 6px 24px var(--c-accent-glow) !important;
}
.button--second {
  background: var(--c-surface-2) !important; color: var(--c-text) !important;
}
.button--second:hover, .button--second.focused {
  background: var(--c-surface-3) !important; border-color: var(--c-border-2) !important;
}

/* ══════════════════════════════════════════════
   PLAYER
══════════════════════════════════════════════ */
.player-panel, .player--panel {
  background: linear-gradient(0deg, rgba(7,7,15,.97) 0%, transparent 100%) !important;
  backdrop-filter: blur(14px) !important; -webkit-backdrop-filter: blur(14px) !important;
  padding: 28px 36px 22px !important; border-top: none !important;
}
.player--timeline, .timeline {
  height: 4px !important; background: rgba(255,255,255,.14) !important;
  border-radius: 99px !important; cursor: pointer !important;
  transition: height var(--t-fast) !important; position: relative !important;
}
.player--timeline:hover, .timeline:hover { height: 7px !important; }
.player--timeline-progress, .timeline--filled, .timeline-filled {
  background: linear-gradient(90deg, var(--c-accent), var(--c-accent-2)) !important;
  border-radius: 99px !important; height: 100% !important; position: relative !important;
}
.player--timeline-progress::after, .timeline--filled::after {
  content: ''; position: absolute; right: -5px; top: 50%;
  transform: translateY(-50%); width: 12px; height: 12px;
  background: #fff; border-radius: 50%;
  box-shadow: 0 0 10px var(--c-accent-glow);
  opacity: 0; transition: opacity var(--t-fast);
}
.player--timeline:hover .player--timeline-progress::after,
.timeline:hover .timeline--filled::after { opacity: 1 !important; }

.player--time, .player-time {
  font-family: var(--font-mono) !important; font-size: 13px !important;
  color: var(--c-text-2) !important; letter-spacing: .5px !important;
}
.player--panel .button, .player-panel .button,
[class*="player--btn"],
.player--buttons-left > *, .player--buttons-right > * {
  background: transparent !important; border: none !important;
  color: rgba(255,255,255,.72) !important;
  width: 40px !important; height: 40px !important;
  display: flex !important; align-items: center !important;
  justify-content: center !important; border-radius: 50% !important;
  transition: all var(--t-fast) !important;
}
.player--panel .button:hover, .player-panel .button:hover,
[class*="player--btn"]:hover, .player--panel .button.focused {
  background: rgba(255,255,255,.11) !important; color: #fff !important;
  transform: scale(1.12) !important; box-shadow: none !important;
}

/* ══════════════════════════════════════════════
   MODALS
══════════════════════════════════════════════ */
.modal, .layer--popup {
  background: rgba(7,7,15,.82) !important;
  backdrop-filter: blur(18px) !important; -webkit-backdrop-filter: blur(18px) !important;
}
.modal--content, .popup--body {
  background: var(--c-surface) !important;
  border: 1px solid var(--c-border) !important; border-radius: 16px !important;
  box-shadow: 0 32px 80px rgba(0,0,0,.6) !important; overflow: hidden !important;
}
.modal--head, .popup--head {
  padding: 20px 24px 16px !important;
  border-bottom: 1px solid var(--c-border) !important;
  font-size: 16px !important; font-weight: 600 !important;
}
.modal--body, .popup--list { padding: 12px !important; }
.modal--close {
  background: var(--c-surface-2) !important; border: 1px solid var(--c-border) !important;
  border-radius: 50% !important; width: 30px !important; height: 30px !important;
  cursor: pointer !important; color: var(--c-text-2) !important;
  display: flex !important; align-items: center !important;
  justify-content: center !important; transition: all var(--t-fast) !important;
}
.modal--close:hover, .modal--close.focused {
  background: rgba(240,98,146,.14) !important;
  border-color: rgba(240,98,146,.28) !important; color: var(--c-red) !important;
}

/* ══════════════════════════════════════════════
   SELECT / DROPDOWN
══════════════════════════════════════════════ */
.select--body {
  background: var(--c-surface-2) !important;
  border: 1px solid var(--c-border-2) !important; border-radius: 12px !important;
  box-shadow: 0 16px 48px rgba(0,0,0,.5) !important;
  overflow: hidden !important; padding: 6px !important;
}
.select--p {
  padding: 9px 14px !important; border-radius: var(--r-ui) !important;
  font-size: 14px !important; color: var(--c-text-2) !important;
  cursor: pointer !important; transition: all var(--t-fast) !important;
}
.select--p:hover, .select--p.focused {
  background: var(--c-surface-3) !important; color: var(--c-text) !important;
}
.select--p.active {
  background: var(--c-accent-dim) !important; color: var(--c-accent) !important;
}

/* ══════════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════════ */
.settings--input, .settings--check, .settings--select {
  padding: 11px 16px !important; border-radius: var(--r-ui) !important;
  border: 1px solid transparent !important; font-size: 14px !important;
  cursor: pointer !important; transition: all var(--t-fast) !important;
  margin-bottom: 2px !important;
}
.settings--input:hover, .settings--check:hover, .settings--select:hover,
.settings--input.focused, .settings--check.focused, .settings--select.focused {
  background: var(--c-surface-2) !important; border-color: var(--c-border) !important;
}
.settings--check.checked, .settings--check.active {
  background: var(--c-accent-dim) !important;
  border-color: rgba(98,114,234,.24) !important; color: var(--c-accent) !important;
}

/* ══════════════════════════════════════════════
   INFO / MOVIE PAGE
══════════════════════════════════════════════ */
.info--title, .full--title {
  font-size: 28px !important; font-weight: 600 !important;
  letter-spacing: -.5px !important; line-height: 1.2 !important;
}
.info--rate, .full--rate {
  font-family: var(--font-mono) !important; font-size: 13px !important;
  color: var(--c-gold) !important; background: rgba(247,201,72,.12) !important;
  padding: 3px 10px !important; border-radius: var(--r-pill) !important;
  display: inline-flex !important; align-items: center !important;
}
.info--description, .full--description {
  font-size: 14px !important; color: var(--c-text-2) !important;
  line-height: 1.75 !important; max-width: 640px !important;
}

/* ══════════════════════════════════════════════
   TABS / FILTERS
══════════════════════════════════════════════ */
.filter--item, .tabs--item, .category--item {
  padding: 6px 16px !important; border-radius: var(--r-pill) !important;
  font-size: 13.5px !important; font-weight: 500 !important;
  color: var(--c-text-2) !important; cursor: pointer !important;
  border: 1px solid transparent !important; transition: all var(--t-fast) !important;
}
.filter--item:hover, .tabs--item:hover,
.filter--item.focused, .tabs--item.focused {
  background: var(--c-surface-2) !important; color: var(--c-text) !important;
  border-color: var(--c-border) !important;
}
.filter--item.active, .tabs--item.active,
.filter--item.selected, .tabs--item.selected {
  background: var(--c-accent-dim) !important; color: var(--c-accent) !important;
  border-color: rgba(98,114,234,.28) !important;
}

/* ══════════════════════════════════════════════
   SOURCE / FILE LIST
══════════════════════════════════════════════ */
.source--item, .files--item {
  padding: 10px 14px !important; border-radius: var(--r-ui) !important;
  border: 1px solid transparent !important; cursor: pointer !important;
  transition: all var(--t-fast) !important; font-size: 13.5px !important;
  color: var(--c-text-2) !important;
}
.source--item:hover, .files--item:hover,
.source--item.focused, .files--item.focused {
  background: var(--c-surface-2) !important;
  border-color: var(--c-border) !important; color: var(--c-text) !important;
}

/* ══════════════════════════════════════════════
   INPUTS
══════════════════════════════════════════════ */
input[type="text"], input[type="search"], textarea {
  background: var(--c-surface-2) !important; border: 1px solid var(--c-border) !important;
  border-radius: var(--r-ui) !important; color: var(--c-text) !important;
  font-family: var(--font) !important; font-size: 14px !important;
  padding: 9px 14px !important; transition: all var(--t-fast) !important;
  outline: none !important;
}
input:focus, textarea:focus {
  border-color: var(--c-accent) !important;
  box-shadow: 0 0 0 3px var(--c-accent-dim) !important;
}

/* ══════════════════════════════════════════════
   NOTICES
══════════════════════════════════════════════ */
.notice--item {
  background: var(--c-surface-2) !important; border: 1px solid var(--c-border) !important;
  border-radius: 10px !important; box-shadow: 0 8px 24px rgba(0,0,0,.35) !important;
  font-size: 14px !important; padding: 12px 18px !important;
  backdrop-filter: blur(12px) !important;
}

/* ══════════════════════════════════════════════
   SECTION TITLES
══════════════════════════════════════════════ */
.title, .section--title, .slider--title {
  font-size: 18px !important; font-weight: 600 !important;
  letter-spacing: -.2px !important; margin-bottom: 14px !important;
}

/* ══════════════════════════════════════════════
   ANIMATIONS
══════════════════════════════════════════════ */
@keyframes pc-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card { animation: pc-in 240ms ease both; }

/* ══════════════════════════════════════════════
   CURSOR
══════════════════════════════════════════════ */
* { cursor: default !important; }
a, button, .selector, .card, .menu--item, .filter--item, .tabs--item,
.source--item, .files--item, .select--p, .settings--input, .settings--check,
.settings--select, .modal--close, .button, [class*="button--"],
[class*="player--btn"], .full--start, .full--play { cursor: pointer !important; }
input, textarea { cursor: text !important; }

/* OSD */
#pc-osd {
  font-family: var(--font-mono) !important; font-size: 13px !important;
  letter-spacing: .3px !important;
  background: rgba(13,13,28,.9) !important; border: 1px solid var(--c-border-2) !important;
  backdrop-filter: blur(16px) !important; box-shadow: 0 8px 24px rgba(0,0,0,.4) !important;
  color: var(--c-text) !important;
}

        `;
        document.head.appendChild(css);
        log('Styles injected');
    }

    // ─────────────────────────────────────────────
    //  UTILS (JS)
    // ─────────────────────────────────────────────

    function simulateKey(keyName, keyCode) {
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: keyName, code: keyName, keyCode: keyCode, which: keyCode,
            bubbles: true, cancelable: true
        }));
    }

    function findFocusable(el) {
        var SEL = [
            '.selector', '.card', '.item--result', '.button',
            '.settings--input', '.settings--check', '.settings--select',
            '.files--item', '.feed--item', '.source--item', '.menu--item',
            '.select--p', '.modal--close', '.filter--item', '.tabs--item',
            '.full--start', '.full--play', '[class*="player--btn"]'
        ].join(',');

        var cur = el;
        while (cur && cur !== document.body) {
            if (cur.matches && cur.matches(SEL)) return cur;
            cur = cur.parentElement;
        }
        return null;
    }

    var osdTimer = null;
    function showOSD(text) {
        var osd = document.getElementById('pc-osd');
        if (!osd) {
            osd = document.createElement('div');
            osd.id = 'pc-osd';
            osd.style.cssText = 'position:fixed;top:22px;right:26px;padding:7px 16px;border-radius:8px;z-index:99999;pointer-events:none;transition:opacity .22s;opacity:0';
            document.body.appendChild(osd);
        }
        osd.textContent = text;
        osd.style.opacity = '1';
        clearTimeout(osdTimer);
        osdTimer = setTimeout(function () { osd.style.opacity = '0'; }, 1800);
    }

    // ─────────────────────────────────────────────
    //  CURSOR PROTECT
    // ─────────────────────────────────────────────

    function initCursor() {
        new MutationObserver(function () {
            if (document.body.style.cursor === 'none')
                document.body.style.removeProperty('cursor');
        }).observe(document.body, { attributes: true, attributeFilter: ['style'] });
    }

    // ─────────────────────────────────────────────
    //  MOUSE FOCUS + CLICK
    // ─────────────────────────────────────────────

    function initMouseFocus() {
        var lastFocused = null;

        document.addEventListener('mousemove', function (e) {
            var el = findFocusable(e.target);
            if (!el || el === lastFocused) return;
            lastFocused = el;

            var prev = document.querySelector('.selector.focused');
            if (prev && prev !== el) prev.classList.remove('focused');
            el.classList.add('focused');
            if (el.focus) el.focus({ preventScroll: true });
            el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        }, true);

        document.addEventListener('click', function (e) {
            var el = findFocusable(e.target);
            if (!el) return;
            el.classList.add('focused');
            simulateKey('Enter', 13);
        }, true);

        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            simulateKey('Backspace', 8);
        }, true);
    }

    // ─────────────────────────────────────────────
    //  MOUSE WHEEL
    // ─────────────────────────────────────────────

    function initMouseWheel() {
        var throttle = null;
        document.addEventListener('wheel', function (e) {
            e.preventDefault();
            if (isPlayerOpen()) {
                var v = getVideo();
                if (v) {
                    v.volume = Math.min(1, Math.max(0, v.volume + (e.deltaY > 0 ? -0.08 : 0.08)));
                    showOSD('🔊 ' + Math.round(v.volume * 100) + '%');
                }
                return;
            }
            if (throttle) return;
            throttle = setTimeout(function () { throttle = null; }, 110);
            simulateKey(e.deltaY > 0 ? 'ArrowDown' : 'ArrowUp', e.deltaY > 0 ? 40 : 38);
            if (e.deltaX > 30)       simulateKey('ArrowRight', 39);
            else if (e.deltaX < -30) simulateKey('ArrowLeft',  37);
        }, { passive: false });
    }

    // ─────────────────────────────────────────────
    //  PLAYER
    // ─────────────────────────────────────────────

    function isPlayerOpen() {
        return !!(document.querySelector('.player-video') || document.querySelector('video'));
    }
    function getVideo() { return document.querySelector('video'); }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            showOSD('⛶ Полный экран');
        } else {
            document.exitFullscreen();
            showOSD('⛶ Оконный режим');
        }
    }

    function initPlayerMouse() {
        var hideTimer = null;
        document.addEventListener('mousemove', function () {
            if (!isPlayerOpen()) return;
            var panel = document.querySelector('.player-panel, .player--panel');
            if (!panel) return;
            panel.style.opacity = '1';
            panel.style.pointerEvents = 'all';
            clearTimeout(hideTimer);
            hideTimer = setTimeout(function () {
                panel.style.opacity = '';
                panel.style.pointerEvents = '';
            }, 3200);
        });
    }

    function initPlayerKeys() {
        document.addEventListener('keydown', function (e) {
            if (!isPlayerOpen()) return;
            var v = getVideo(); if (!v) return;
            var tag = document.activeElement && document.activeElement.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;

            switch (e.code) {
                case 'Space': case 'KeyK':
                    e.preventDefault(); e.stopPropagation();
                    v.paused ? (v.play(), showOSD('▶ Воспроизведение'))
                             : (v.pause(), showOSD('⏸ Пауза')); break;
                case 'ArrowLeft':
                    e.preventDefault(); e.stopPropagation();
                    v.currentTime = Math.max(0, v.currentTime - 10);
                    showOSD('⏪ −10 сек'); break;
                case 'ArrowRight':
                    e.preventDefault(); e.stopPropagation();
                    v.currentTime = Math.min(v.duration || 0, v.currentTime + 10);
                    showOSD('⏩ +10 сек'); break;
                case 'KeyJ':
                    e.preventDefault();
                    v.currentTime = Math.max(0, v.currentTime - 30);
                    showOSD('⏪ −30 сек'); break;
                case 'KeyL':
                    e.preventDefault();
                    v.currentTime = Math.min(v.duration || 0, v.currentTime + 30);
                    showOSD('⏩ +30 сек'); break;
                case 'ArrowUp':
                    e.preventDefault(); e.stopPropagation();
                    v.volume = Math.min(1, v.volume + 0.1);
                    showOSD('🔊 ' + Math.round(v.volume * 100) + '%'); break;
                case 'ArrowDown':
                    e.preventDefault(); e.stopPropagation();
                    v.volume = Math.max(0, v.volume - 0.1);
                    showOSD('🔉 ' + Math.round(v.volume * 100) + '%'); break;
                case 'KeyM':
                    e.preventDefault();
                    v.muted = !v.muted;
                    showOSD(v.muted ? '🔇 Без звука' : '🔊 Звук'); break;
                case 'KeyF':
                    e.preventDefault(); toggleFullscreen(); break;
                default:
                    var n = parseInt(e.key, 10);
                    if (!isNaN(n) && n >= 0 && n <= 9) {
                        e.preventDefault();
                        v.currentTime = (v.duration || 0) * (n / 10);
                        showOSD('⏭ ' + n * 10 + '%');
                    }
            }
        }, true);
    }

    document.addEventListener('keydown', function (e) {
        if (e.code === 'KeyF' && !isPlayerOpen()) toggleFullscreen();
    });

    // ─────────────────────────────────────────────
    //  INIT
    // ─────────────────────────────────────────────

    function init() {
        log('Starting v' + VERSION);
        injectStyles();
        initCursor();
        initMouseFocus();
        initMouseWheel();
        initPlayerMouse();
        initPlayerKeys();
        log('Ready ✓');
    }

    if (window.appready) { init(); }
    else { document.addEventListener('appready', init); }

})();
