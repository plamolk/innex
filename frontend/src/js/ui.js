// AOS Initialization
AOS.init({
    once: true,
    offset: 50,
    duration: 800,
    easing: 'ease-out-cubic',
});

// Custom Language Dropdown Logic
function setLang(lang) {
    try {
        // Update display text
        const display = document.getElementById('current-lang-display');
        if (display) display.innerText = lang.toUpperCase();

        // Reset styles
        const enBtn = document.getElementById('lang-btn-en');
        const thBtn = document.getElementById('lang-btn-th');

        if (enBtn && thBtn) {
            enBtn.className = "w-full text-left px-4 py-2.5 text-sm font-bold text-darkblue dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors";
            thBtn.className = "w-full text-left px-4 py-2.5 text-sm font-bold text-darkblue dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700";
        }

        // Set active styles
        const activeBtn = document.getElementById('lang-btn-' + lang);
        if (activeBtn) {
            activeBtn.classList.remove('text-darkblue', 'dark:text-white', 'hover:bg-gray-50', 'dark:hover:bg-gray-700');
            activeBtn.classList.add('bg-royalblue', 'text-white', 'hover:bg-darkblue');
        }

        // Trigger actual language switch
        if (typeof window.switchLanguage === 'function') {
            window.switchLanguage(lang);
        } else if (typeof switchLanguage === 'function') {
            switchLanguage(lang);
        } else {
            console.error("switchLanguage function not found");
        }
    } catch (e) {
        console.error("Error setting language: ", e);
    } finally {
        // Close dropdown after selection
        closeLangDropdown();
    }
}

// Dropdown toggle logic
const langBtn = document.getElementById('language-dropdown-btn');
const langMenu = document.getElementById('language-dropdown-menu');

function toggleLangDropdown(e) {
    if (langMenu.classList.contains('opacity-0')) {
        // Open
        langMenu.classList.remove('opacity-0', 'invisible', 'scale-95');
        langMenu.classList.add('opacity-100', 'visible', 'scale-100');
    } else {
        closeLangDropdown();
    }
    e.stopPropagation();
}

function closeLangDropdown() {
    if (langMenu) {
        langMenu.classList.add('opacity-0', 'invisible', 'scale-95');
        langMenu.classList.remove('opacity-100', 'visible', 'scale-100');
    }
}

if (langBtn) {
    langBtn.addEventListener('click', toggleLangDropdown);
}

// Close when clicking outside
document.addEventListener('click', (e) => {
    if (langMenu && !langMenu.classList.contains('opacity-0') && !langMenu.contains(e.target) && !langBtn.contains(e.target)) {
        closeLangDropdown();
    }
})

// Initialize active state on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { // slight delay to let i18n logic pick up first
        const lang = localStorage.getItem('language') || 'en';
        setLang(lang);
    }, 50);
});
