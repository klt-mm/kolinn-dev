/* ============================================
   INITIALIZATION - Wait for DOM + Lucide
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons after DOM is ready
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        // Fallback: wait for Lucide to load
        const checkLucide = setInterval(() => {
            if (typeof lucide !== 'undefined') {
                clearInterval(checkLucide);
                lucide.createIcons();
            }
        }, 50);
    }

    /* ============================================
       THEME MANAGEMENT
       ============================================ */
    const themeToggle = document.getElementById('themeToggle');
    const themes = ['dark', 'auto', 'light'];
    const iconMap = { dark: 'moon', light: 'sun', auto: 'sparkles' };
    
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function updateToggleIcon(theme) {
        const toggleIcon = themeToggle.querySelector('.theme-toggle-knob i');
        if (toggleIcon && typeof lucide !== 'undefined') {
            toggleIcon.setAttribute('data-lucide', iconMap[theme]);
            lucide.createIcons();
        }
    }

    function applyTheme(theme) {
        const effectiveTheme = theme === 'auto' ? getSystemTheme() : theme;
        document.documentElement.setAttribute('data-theme', effectiveTheme);
        localStorage.setItem('theme', theme);
        updateToggleIcon(theme);
    }

    function cycleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        applyTheme(themes[nextIndex]);
    }

    themeToggle.addEventListener('click', cycleTheme);
    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { 
            e.preventDefault(); 
            cycleTheme(); 
        }
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (localStorage.getItem('theme') === 'auto') applyTheme('auto');
    });

    applyTheme(localStorage.getItem('theme') || 'dark');

    /* ============================================
       NAVIGATION SCROLL EFFECT
       ============================================ */
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    /* ============================================
       MOBILE MENU
       ============================================ */
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-menu-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* ============================================
       INTERSECTION OBSERVER - SCROLL ANIMATIONS
       ============================================ */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px' 
    });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    /* ============================================
       GLASS CARD MOUSE TRACKING
       ============================================ */
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    /* ============================================
       SMOOTH SCROLL
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ 
                    top: target.offsetTop - 80, 
                    behavior: 'smooth' 
                });
            }
        });
    });

    /* ============================================
       FORM HANDLING
       ============================================ */
    document.querySelector('.contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalHTML = btn.innerHTML;
        
        btn.innerHTML = '<span>Sending...</span>';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = '<span>✓ Message Sent!</span>';
            btn.style.background = 'var(--accent-green)';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
                btn.style.background = '';
                e.target.reset();
                
                // Re-render icons if needed
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 2500);
        }, 1500);
    });

    /* ============================================
       KEYBOARD NAVIGATION
       ============================================ */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});