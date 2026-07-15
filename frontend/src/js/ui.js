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
        
        const sidebarDisplay = document.getElementById('mobile-lang-display');
        if (sidebarDisplay) {
            sidebarDisplay.innerText = lang.toUpperCase();
        }

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

// Event Delegation for Dropdown toggle logic
function closeLangDropdown() {
    const menus = [
        document.getElementById('language-dropdown-menu'),
        document.getElementById('mobile-lang-menu')
    ];
    menus.forEach(menu => {
        if (menu && !menu.classList.contains('opacity-0')) {
            menu.classList.add('opacity-0', 'invisible', 'scale-95');
            menu.classList.remove('opacity-100', 'visible', 'scale-100');
        }
    });
}

document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Desktop Nav Language Dropdown
    const desktopBtn = target.closest('#language-dropdown-btn');
    if (desktopBtn) {
        const menu = document.getElementById('language-dropdown-menu');
        if (menu) {
            menu.classList.toggle('opacity-0');
            menu.classList.toggle('invisible');
            menu.classList.toggle('scale-95');
            menu.classList.toggle('opacity-100');
            menu.classList.toggle('visible');
            menu.classList.toggle('scale-100');
        }
        e.stopPropagation();
        return;
    }

    // Mobile Language Dropdown
    const sidebarBtn = target.closest('#mobile-lang-btn');
    if (sidebarBtn) {
        const menu = document.getElementById('mobile-lang-menu');
        if (menu) {
            menu.classList.toggle('opacity-0');
            menu.classList.toggle('invisible');
            menu.classList.toggle('scale-95');
            menu.classList.toggle('opacity-100');
            menu.classList.toggle('visible');
            menu.classList.toggle('scale-100');
        }
        e.stopPropagation();
        return;
    }

    // Close when clicking outside
    closeLangDropdown();
});

// Initialize active state on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { // slight delay to let i18n logic pick up first
        const lang = localStorage.getItem('language') || 'en';
        setLang(lang);
    }, 50);
});
