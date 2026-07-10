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

// Ensure the DOM is fully loaded before attaching the event listener
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
});
