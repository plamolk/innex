/**
 * theme.js
 * ============================================================
 * Standalone theme toggle for pages that DON'T use app.js
 * (login.html, regis.html).
 * 
 * For client/ pages (index, community, profile, etc.), theme
 * toggling is handled by app.js via .theme-toggle-btn class.
 * ============================================================
 */

function toggleTheme() {
    const htmlEl = document.documentElement;
    const isDark = htmlEl.classList.contains('dark');
    
    if (isDark) {
        htmlEl.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        htmlEl.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

/**
 * Sync moon/sun icons for standalone pages (login, regis).
 * Uses getElementById for #icon-moon / #icon-sun (the IDs used in those pages).
 */
function syncThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    const moonIcon = document.getElementById('icon-moon');
    const sunIcon = document.getElementById('icon-sun');
    if (moonIcon && sunIcon) {
        moonIcon.classList.toggle('hidden', isDark);
        sunIcon.classList.toggle('hidden', !isDark);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    syncThemeIcons();
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            toggleTheme();
            syncThemeIcons();
        });
    }
    
    // Keep icons in sync if another script also toggles dark class
    const observer = new MutationObserver(syncThemeIcons);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

