document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated in
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements to animate
    const animateElements = document.querySelectorAll('.fade-in, .fade-up');
    
    // Fallback for devices with reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    animateElements.forEach(el => {
        if (prefersReducedMotion) {
            el.classList.add('visible');
            el.style.transition = 'none';
            el.style.transform = 'none';
        } else {
            observer.observe(el);
        }
    });

    // Simple hero parallax effect
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg && !prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
        }, { passive: true }); // Passive listener for performance
    }
});
