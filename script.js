document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. THEME ENGINE --- */
    const toggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';

    htmlEl.setAttribute('data-theme', savedTheme);
    updateIcons(savedTheme);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';

            htmlEl.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcons(newTheme);
        });
    }

    function updateIcons(theme) {
        if (!toggleBtn) return;
        const icon = toggleBtn.querySelector('i');
        toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }


    /* --- MOBILE MENU TOGGLE --- */
    const mobileBtn = document.getElementById('mobile-menu-trigger');
    const navMenu = document.getElementById('nav-menu');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isOpen = navMenu.classList.contains('active');
            mobileBtn.setAttribute('aria-expanded', String(isOpen));
            mobileBtn.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
            const menuIcon = mobileBtn.querySelector('i');
            if (menuIcon) {
                menuIcon.classList.toggle('fa-bars', !isOpen);
                menuIcon.classList.toggle('fa-xmark', isOpen);
            }
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
                mobileBtn.setAttribute('aria-label', 'Open navigation');
                const menuIcon = mobileBtn.querySelector('i');
                if (menuIcon) {
                    menuIcon.classList.add('fa-bars');
                    menuIcon.classList.remove('fa-xmark');
                }
            });
        });
    }

    /* --- 2. SUBTLE SCROLL REVEAL --- */
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve if you want re-trigger (optional, leaving unobserve for performance)
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // Trigger earlier

    document.querySelectorAll('.reveal-text, .reveal-card, .reveal-scale').forEach(el => {
        observer.observe(el);
    });

});
