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

    // Attach language switcher event listener
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
 * In a large-scale app, you can extend this to load page-specific namespaces.
 * @param {string} lang 
 */
async function loadTranslations(lang) {
    try {
        const response = await fetch(`./locales/${lang}/common.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}`);
        }
        translations = await response.json();
    } catch (error) {
        console.error('Error loading translations via fetch (might be file:// protocol CORS issue):', error);
        console.log('Using fallback translations...');
        // Fallback translations in case fetch fails
        const fallbacks = {
            'en': {
                "header": { "title": "Welcome to our Web App", "subtitle": "A scalable boilerplate for your large-scale applications." },
                "controls": { "toggleTheme": "Toggle Theme", "selectLanguage": "Select Language:" },
                "content": { "description": "This setup features an optimized Dark/Light mode and a robust i18n strategy, completely written in Vanilla JS for a solid foundation." },
                "login": {
                    "title": "Sign In", "subtitle": "Please sign in to continue to your account", "google": "Sign in with Google",
                    "or": "Or sign in with email", "email": "Email", "emailPlaceholder": "name@company.com",
                    "password": "Password", "passwordPlaceholder": "••••••••", "forgot": "Forgot?", "submit": "Sign In",
                    "noAccount": "Don't have an account?", "signup": "Sign up"
                },
                "signup": {
                    "title": "Create Account", "subtitle": "Join us today.", "google": "Sign up with Google",
                    "or": "Or sign up with email", "firstName": "First Name", "firstNamePlaceholder": "John",
                    "lastName": "Last Name", "lastNamePlaceholder": "Doe", "dob": "Date of Birth",
                    "email": "Email Address", "emailPlaceholder": "name@company.com", "password": "Password",
                    "passwordPlaceholder": "••••••••", "confirmPassword": "Confirm Password",
                    "otp": "Enter the 6-digit code", "otpPlaceholder": "000000", "btnBack": "Back",
                    "btnNext": "Next", "btnVerify": "Verify & Sign Up", "haveAccount": "Already have an account?",
                    "signin": "Sign in",
                    "steps": {
                        "title0": "What's your name?", "subtitle0": "Please enter your real name.",
                        "title1": "When were you born?", "subtitle1": "We need this to verify your age.",
                        "title2": "What's your email?", "subtitle2": "You'll use this to log in.",
                        "title3": "Create a password", "subtitle3": "Make sure it's secure and unique.",
                        "title4": "Verify your email", "subtitle4": "We sent a 6-digit code to your email."
                    }
                }
            },
            'th': {
                "header": { "title": "ยินดีต้อนรับสู่เว็บแอปพลิเคชันของเรา", "subtitle": "ต้นแบบที่ปรับขนาดได้สำหรับแอปพลิเคชันขนาดใหญ่ของคุณ" },
                "controls": { "toggleTheme": "สลับธีม", "selectLanguage": "เลือกภาษา:" },
                "content": { "description": "การตั้งค่านี้มีระบบโหมดมืด/สว่างที่ปรับให้เหมาะสมและกลยุทธ์การทำให้เป็นสากลที่แข็งแกร่ง ซึ่งเขียนด้วย Vanilla JS ทั้งหมดเพื่อเป็นรากฐานที่แข็งแกร่งสำหรับโปรเจ็กต์ของคุณ" },
                "login": {
                    "title": "เข้าสู่ระบบ", "subtitle": "โปรดเข้าสู่ระบบเพื่อใช้งานบัญชีของคุณ", "google": "เข้าสู่ระบบด้วย Google",
                    "or": "หรือ เข้าสู่ระบบด้วยอีเมล", "email": "อีเมล", "emailPlaceholder": "name@company.com",
                    "password": "รหัสผ่าน", "passwordPlaceholder": "••••••••", "forgot": "ลืมรหัสผ่าน?", "submit": "เข้าสู่ระบบ",
                    "noAccount": "ยังไม่มีบัญชีใช่หรือไม่?", "signup": "สมัครสมาชิก"
                },
                "signup": {
                    "title": "สร้างบัญชีผู้ใช้", "subtitle": "เข้าร่วมกับเราวันนี้", "google": "สมัครสมาชิกด้วย Google",
                    "or": "หรือ สมัครด้วยอีเมล", "firstName": "ชื่อ", "firstNamePlaceholder": "สมชาย",
                    "lastName": "นามสกุล", "lastNamePlaceholder": "ใจดี", "dob": "วัน/เดือน/ปี เกิด",
                    "email": "อีเมล", "emailPlaceholder": "name@company.com", "password": "รหัสผ่าน",
                    "passwordPlaceholder": "••••••••", "confirmPassword": "ยืนยันรหัสผ่าน",
                    "otp": "ยืนยันรหัส OTP 6 หลัก", "otpPlaceholder": "000000", "btnBack": "ย้อนกลับ",
                    "btnNext": "ต่อไป", "btnVerify": "ยืนยันและสมัครสมาชิก", "haveAccount": "มีบัญชีอยู่แล้วใช่หรือไม่?",
                    "signin": "เข้าสู่ระบบ",
                    "steps": {
                        "title0": "คุณชื่ออะไร?", "subtitle0": "โปรดระบุชื่อ-นามสกุลจริงของคุณ",
                        "title1": "คุณเกิดวันที่เท่าไหร่?", "subtitle1": "เราจำเป็นต้องใช้ข้อมูลนี้เพื่อยืนยันอายุของคุณ",
                        "title2": "อีเมลของคุณคืออะไร?", "subtitle2": "คุณจะใช้อีเมลนี้ในการเข้าสู่ระบบ",
                        "title3": "สร้างรหัสผ่าน", "subtitle3": "โปรดตั้งรหัสผ่านที่ปลอดภัยและไม่ซ้ำใคร",
                        "title4": "ยืนยันอีเมลของคุณ", "subtitle4": "เราได้ส่งรหัส 6 หลักไปยังอีเมลของคุณแล้ว"
                    }
                }
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

// Ensure it's globally available
window.switchLanguage = switchLanguage;
window.t = (key) => key.split('.').reduce((obj, k) => (obj || {})[k], translations) || key;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initI18n);
