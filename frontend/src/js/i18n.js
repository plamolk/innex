/**
 * i18n.js
 * Scalable internationalization system using Vanilla JS.
 * Fetches JSON language files and updates DOM elements with data-i18n attributes.
 */

const DEFAULT_LANG = 'en';
const SUPPORTED_LANGS = ['en', 'th'];
let currentLang = localStorage.getItem('language') || DEFAULT_LANG;
let translations = {};

/**
 * Validates language and initializes the i18n system on load
 */
async function initI18n() {
    if (!SUPPORTED_LANGS.includes(currentLang)) {
        currentLang = DEFAULT_LANG;
    }

    await loadTranslations(currentLang);
    updateDOM();

    // Attach language switcher event listener (for standalone <select> if present)
    const langSelect = document.getElementById('language-switcher');
    if (langSelect) {
        langSelect.value = currentLang;
        langSelect.addEventListener('change', async (e) => {
            await switchLanguage(e.target.value);
        });
    }
}

/**
 * Fetches the translation JSON file for the given language.
 * @param {string} lang 
 */
async function loadTranslations(lang) {
    try {
        const basePath = window.location.pathname.includes('/client') ? '../locales' : './locales';
        const response = await fetch(`${basePath}/${lang}/common.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}`);
        }
        translations = await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
        console.log('Using minimal fallback translations...');
        // Minimal fallback — just enough to not break the UI
        const fallbacks = {
            'en': {
                "login": { "title": "Sign In", "submit": "Sign In" },
                "signup": { "title": "Create Account", "btnNext": "Next", "btnVerify": "Verify & Sign Up" },
                "hub": { "title": "Opportunity Hub", "navOpportunities": "Opportunities", "navTeams": "Find Teams", "navCommunity": "Community" },
                "nav": { "createTeam": "Create Team", "theme": "Theme", "language": "Language" }
            },
            'th': {
                "login": { "title": "เข้าสู่ระบบ", "submit": "เข้าสู่ระบบ" },
                "signup": { "title": "สร้างบัญชีผู้ใช้", "btnNext": "ต่อไป", "btnVerify": "ยืนยันและสมัครสมาชิก" },
                "hub": { "title": "ศูนย์รวมโอกาส", "navOpportunities": "โอกาส", "navTeams": "ค้นหาทีม", "navCommunity": "ชุมชน" },
                "nav": { "createTeam": "สร้างทีม", "theme": "ธีม", "language": "ภาษา" }
            }
        };
        translations = fallbacks[lang] || fallbacks['en'];
    }
}

/**
 * Updates all elements with the 'data-i18n' attribute without reloading the page.
 */
function updateDOM() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        // Simple dot-notation key resolution (e.g., 'header.title' -> translations['header']['title'])
        const translation = key.split('.').reduce((obj, k) => (obj || {})[k], translations);
        
        if (translation) {
            // Apply translation differently based on element type if needed
            if (el.tagName === 'INPUT') {
                el.placeholder = translation;
            } else {
                el.innerText = translation;
            }
        }
    });
    
    // Update the document language for accessibility/SEO
    document.documentElement.lang = currentLang;

    // Dispatch custom event to notify other scripts that translation is updated
    window.dispatchEvent(new Event('i18n-updated'));
}

/**
 * Switches the active language, saves to localStorage, and updates DOM.
 * @param {string} newLang 
 */
async function switchLanguage(newLang) {
    if (newLang === currentLang || !SUPPORTED_LANGS.includes(newLang)) return;
    
    currentLang = newLang;
    localStorage.setItem('language', currentLang);
    
    await loadTranslations(currentLang);
    updateDOM();
}

// Ensure globally available
window.switchLanguage = switchLanguage;
window.t = (key) => key.split('.').reduce((obj, k) => (obj || {})[k], translations) || key;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initI18n);
