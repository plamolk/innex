/**
 * theme.js
 * Handles the Dark/Light Mode toggle.
 * Note: Initial theme loading (FOUC prevention) is handled inline in the <head> of index.html.
 */

function toggleTheme() {
    const htmlEl = document.documentElement;
    const isDark = htmlEl.classList.contains('dark');
    
    // Toggle the 'dark' class and save user preference to localStorage
    if (isDark) {
        htmlEl.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        htmlEl.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

function syncThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    const moonIcon = document.getElementById('icon-moon');
    const sunIcon = document.getElementById('icon-sun');
    if (moonIcon && sunIcon) {
        moonIcon.classList.toggle('hidden', isDark);
        sunIcon.classList.toggle('hidden', !isDark);
    }
}

// Ensure the DOM is fully loaded before attaching the event listener
document.addEventListener('DOMContentLoaded', () => {
    syncThemeIcons();
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            toggleTheme();
            syncThemeIcons();
        });
    }
    
    // Also use mutation observer just in case there are other things triggering it
    const observer = new MutationObserver(syncThemeIcons);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});
