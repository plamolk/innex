/**
 * ui.js
 * ============================================================
 * Lightweight UI bootstrap — only handles AOS initialization.
 * 
 * Language switching (setLang, closeLangDropdown) and dropdown
 * logic are handled exclusively by app.js (for client/ pages)
 * or inline handlers (for login/regis pages).
 * ============================================================
 */

// AOS Initialization (with guard in case CDN fails to load)
if (typeof AOS !== 'undefined') {
    AOS.init({
        once: true,
        offset: 50,
        duration: 800,
        easing: 'ease-out-cubic',
    });
}

