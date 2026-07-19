/**
 * app.js
 * ============================================================
 * INNEX Shared Application Bootstrap
 * 
 * รวม logic ที่ใช้ร่วมกันทุกหน้า:
 *   1. loadComponents(pageKey)  — fetch navbar.html + sidebar.html
 *   2. initPageNav(pageKey)     — highlight nav item ตาม page ปัจจุบัน
 *   3. initThemeToggle()        — bind .theme-toggle-btn ทุกตัว
 *   4. initMobileNavScroll()    — ซ่อน mobile navbar เมื่อ scroll ลง
 *   5. initFAB()                — hamburger popup logic
 *   6. initMobileLangMenu()     — mobile language dropdown
 * 
 * วิธีใช้ในแต่ละ page (เรียกหลัง AOS/i18n):
 *   INNEX.loadComponents('opportunities');  // index.html
 *   INNEX.loadComponents('community');      // community.html
 *   INNEX.loadComponents('event-detail');   // event-detail.html
 * 
 * จากนั้นใน callback ที่ต้องการ init logic เฉพาะหน้า ให้ใช้:
 *   INNEX.onReady(function() { /* page-specific logic *\/ });
 * ============================================================
 */

(function (global) {
    'use strict';

    /* ----------------------------------------------------------
       NAV MAP: pageKey → data-nav-key ที่ต้อง highlight
    ---------------------------------------------------------- */
    const NAV_KEY_MAP = {
        'opportunities': 'opportunities',
        'community': 'community',
        'event-detail': 'opportunities', // event detail ยังอยู่ใต้ Opportunities
        'teams': 'teams',
        // Auto-detect maps based on filename
        'index.html': 'opportunities',
        'community.html': 'community',
        'event-detail.html': 'opportunities',
        'create.html': 'create'
    };

    /* ----------------------------------------------------------
       Active nav CSS classes
    ---------------------------------------------------------- */
    const ACTIVE_CLASSES = ['bg-royalblue/10', 'dark:bg-royalblue/20', 'text-royalblue', 'dark:text-lightblue', 'font-bold'];
    const INACTIVE_CLASSES = ['text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-100', 'dark:hover:bg-gray-800', 'font-medium'];

    const ACTIVE_DESKTOP_CLASSES = ['text-royalblue', 'dark:text-lightblue', 'border-b-2', 'border-royalblue', 'dark:border-lightblue', 'pb-0.5'];
    const INACTIVE_DESKTOP_CLASSES = ['text-gray-500', 'dark:text-gray-400', 'hover:text-royalblue', 'dark:hover:text-lightblue', 'transition-colors'];

    /* ----------------------------------------------------------
       1. LOAD COMPONENTS (navbar + sidebar)
    ---------------------------------------------------------- */
    async function loadComponents(pageKey) {
        try {
            const [navRes, sideRes] = await Promise.all([
                fetch('navbar.html'),
                fetch('sidebar.html'),
            ]);

            if (!navRes.ok || !sideRes.ok) throw new Error('Components not found');

            document.getElementById('navbar-placeholder').innerHTML = await navRes.text();
            document.getElementById('sidebar-placeholder').innerHTML = await sideRes.text();

            // Init all shared UI after components are in DOM
            initThemeToggle();
            initMobileNavScroll();
            initFAB();
            initLangMenus();
            initPageNav(pageKey);

            // Re-run i18n updateDOM so injected component text also gets translated
            if (typeof updateDOM === 'function') {
                updateDOM();
            }

            // Fire onReady callbacks
            _readyCallbacks.forEach(fn => fn());
            _readyCallbacks = [];

        } catch (err) {
            console.warn('[INNEX app.js] loadComponents failed — use a local server, not file:///:', err.message);

            // Minimal fallback navbar so page doesn't break
            const nb = document.getElementById('navbar-placeholder');
            if (nb) {
                nb.innerHTML = `
                    <header class="fixed top-0 left-0 right-0 w-full px-6 py-3.5 flex justify-between items-center z-50 bg-white/80 dark:bg-gray-900/85 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
                        <a href="index.html" class="flex items-center space-x-3 group">
                            <div class="w-10 h-10 bg-darkblue dark:bg-white rounded-tl-full rounded-bl-full rounded-tr-lg rounded-br-sm shadow-lg"></div>
                            <span class="font-bold text-lg tracking-wide text-darkblue dark:text-white">INNEX</span>
                        </a>
                    </header>`;
            }
        }
    }

    /* ----------------------------------------------------------
       2. NAV HIGHLIGHT — ตรวจ data-nav-key แล้วเพิ่ม active class
    ---------------------------------------------------------- */
    function initPageNav(pageKey) {
        let targetKey = pageKey ? (NAV_KEY_MAP[pageKey] || pageKey) : null;

        // ถ้าไม่ส่ง pageKey มา ให้ดึงชื่อไฟล์จาก URL (Auto-detect)
        if (!targetKey) {
            const currentFile = window.location.pathname.split('/').pop() || 'index.html';
            targetKey = NAV_KEY_MAP[currentFile] || currentFile.replace('.html', '');
        }

        // ── Mobile sidebar links (data-nav-key)
        document.querySelectorAll('[data-nav-key]').forEach(link => {
            const key = link.getAttribute('data-nav-key');
            const isActive = key === targetKey;

            if (isActive) {
                INACTIVE_CLASSES.forEach(c => link.classList.remove(c));
                ACTIVE_CLASSES.forEach(c => link.classList.add(c));
            } else {
                ACTIVE_CLASSES.forEach(c => link.classList.remove(c));
                INACTIVE_CLASSES.forEach(c => link.classList.add(c));
            }
        });

        // ── Desktop navbar links (data-nav-desktop-key)
        document.querySelectorAll('[data-nav-desktop-key]').forEach(link => {
            const key = link.getAttribute('data-nav-desktop-key');
            const isActive = key === targetKey;

            if (isActive) {
                INACTIVE_DESKTOP_CLASSES.forEach(c => link.classList.remove(c));
                ACTIVE_DESKTOP_CLASSES.forEach(c => link.classList.add(c));
            } else {
                ACTIVE_DESKTOP_CLASSES.forEach(c => link.classList.remove(c));
                INACTIVE_DESKTOP_CLASSES.forEach(c => link.classList.add(c));
            }
        });
    }

    /* ----------------------------------------------------------
       3. THEME TOGGLE — bind .theme-toggle-btn + sync icons
    ---------------------------------------------------------- */
    function syncThemeIcons() {
        const isDark = document.documentElement.classList.contains('dark');
        document.querySelectorAll('.icon-moon').forEach(el => el.classList.toggle('hidden', isDark));
        document.querySelectorAll('.icon-sun').forEach(el => el.classList.toggle('hidden', !isDark));
    }

    function initThemeToggle() {
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            // Prevent duplicate listeners by cloning
            const fresh = btn.cloneNode(true);
            btn.parentNode.replaceChild(fresh, btn);
            fresh.addEventListener('click', () => {
                const isDark = document.documentElement.classList.toggle('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                syncThemeIcons();
            });
        });
        syncThemeIcons();
        // Keep icons in sync if another script also toggles dark class
        new MutationObserver(syncThemeIcons).observe(
            document.documentElement,
            { attributes: true, attributeFilter: ['class'] }
        );
    }

    /* ----------------------------------------------------------
       4. MOBILE NAV SCROLL HIDE
    ---------------------------------------------------------- */
    function initMobileNavScroll() {
        const mobileNavbar = document.getElementById('mobile-navbar');
        if (!mobileNavbar) return;

        let lastScrollY = window.scrollY || 0;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (window.innerWidth >= 1280) {
                        mobileNavbar.classList.remove('-translate-y-full');
                        ticking = false;
                        return;
                    }
                    const currentY = window.scrollY;
                    const delta = currentY - lastScrollY;
                    if (delta > 8 && currentY > 80) {
                        mobileNavbar.classList.add('-translate-y-full');
                    } else if (delta < -5 || currentY <= 10) {
                        mobileNavbar.classList.remove('-translate-y-full');
                    }
                    lastScrollY = currentY;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ----------------------------------------------------------
       5. MOBILE FAB HAMBURGER MENU
    ---------------------------------------------------------- */
    function initFAB() {
        const fabMenuBtn = document.getElementById('fab-menu-btn');
        const fabPopoverMenu = document.getElementById('fab-popover-menu');
        const fabIconMenu = document.getElementById('fab-icon-menu');
        const fabIconClose = document.getElementById('fab-icon-close');

        if (!fabMenuBtn || !fabPopoverMenu) return;

        let isFabOpen = false;

        function toggleFab() {
            isFabOpen = !isFabOpen;
            if (isFabOpen) {
                fabPopoverMenu.classList.remove('opacity-0', 'invisible', 'scale-95');
                fabPopoverMenu.classList.add('opacity-100', 'scale-100');
                if (fabIconMenu) fabIconMenu.classList.add('hidden');
                if (fabIconClose) fabIconClose.classList.remove('hidden');
            } else {
                fabPopoverMenu.classList.add('opacity-0', 'invisible', 'scale-95');
                fabPopoverMenu.classList.remove('opacity-100', 'scale-100');
                if (fabIconMenu) fabIconMenu.classList.remove('hidden');
                if (fabIconClose) fabIconClose.classList.add('hidden');
                // Close mobile lang menu if open
                const mobileLangMenu = document.getElementById('mobile-lang-menu');
                if (mobileLangMenu) {
                    mobileLangMenu.classList.add('opacity-0', 'invisible', 'scale-95');
                    mobileLangMenu.classList.remove('opacity-100', 'scale-100');
                }
            }
        }

        fabMenuBtn.addEventListener('click', e => {
            e.stopPropagation();
            toggleFab();
        });

        document.addEventListener('click', e => {
            if (isFabOpen && !fabMenuBtn.contains(e.target) && !fabPopoverMenu.contains(e.target)) {
                toggleFab();
            }
        });

        // Expose so page-level Escape key handlers can close it
        global.INNEX = global.INNEX || {};
        global.INNEX._toggleFab = toggleFab;
        global.INNEX._isFabOpen = () => isFabOpen;
    }

    /* ----------------------------------------------------------
       6. LANGUAGE DROPDOWN LOGIC (Desktop & Mobile)
    ---------------------------------------------------------- */
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

    function initLangMenus() {
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

            // Mobile Nav Language Dropdown
            const mobileBtn = target.closest('#mobile-lang-btn');
            if (mobileBtn) {
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

        setTimeout(() => { // slight delay to let i18n logic pick up first
            const lang = localStorage.getItem('language') || 'en';
            if (typeof global.setLang === 'function') {
                global.setLang(lang);
            }
        }, 50);
    }

    global.setLang = function(lang) {
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
            }
        } catch (e) {
            console.error("Error setting language: ", e);
        } finally {
            closeLangDropdown();
        }
    };

    /* ----------------------------------------------------------
       7. onReady — queue callbacks until loadComponents() done
    ---------------------------------------------------------- */
    let _readyCallbacks = [];
    function onReady(fn) {
        _readyCallbacks.push(fn);
    }

    /* ----------------------------------------------------------
       EXPOSE PUBLIC API on window.INNEX
    ---------------------------------------------------------- */
    global.INNEX = global.INNEX || {};
    Object.assign(global.INNEX, {
        loadComponents,
        initPageNav,
        syncThemeIcons,
        onReady,
    });

})(window);
