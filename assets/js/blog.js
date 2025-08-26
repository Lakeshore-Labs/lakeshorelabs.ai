// Blog-specific JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all blog features
    initScrollProgress();
    initBlogAnimations();
    initBlogCardInteractions();
});

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    if (progressBar) {
        function updateScrollProgress() {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            
            progressBar.style.width = scrollPercentage + '%';
        }
        
        // Update on scroll with throttling for performance
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    updateScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Initial update
        updateScrollProgress();
    }
}

// Blog Animations
function initBlogAnimations() {
    // Fade in animation for elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe blog content elements
    const elementsToAnimate = document.querySelectorAll('.blog-content p, .blog-content h2, .blog-content h3, .blog-content blockquote, .blog-content ul, .blog-content ol');
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });
}

// Blog Card Interactions
function initBlogCardInteractions() {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        // Add click handler for the entire card
        card.addEventListener('click', function(e) {
            // Only trigger if not clicking on a specific link
            if (e.target.tagName !== 'A') {
                const link = card.querySelector('.blog-card-title a');
                if (link) {
                    link.click();
                }
            }
        });
        
        // Add parallax effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
}

// Additional CSS for animations
const animationCSS = `
<style>
.animate-ready {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
}

.animate-in {
    opacity: 1;
    transform: translateY(0);
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
    .animate-ready,
    .animate-in {
        transition: none;
        transform: none;
        opacity: 1;
    }
    
    .blog-card {
        transform: none !important;
    }
    
    .blog-tag:hover,
    .blog-card:hover .blog-card-tag {
        transform: none;
    }
}

/* Enhanced focus states for accessibility */
.blog-card:focus-within {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
}

.blog-tag:focus,
.blog-card-title a:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
    border-radius: 4px;
}
</style>
`;

// Inject the CSS
document.head.insertAdjacentHTML('beforeend', animationCSS);

// Smooth scroll for internal links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Dark theme support for blog elements
function updateBlogTheme() {
    const isDarkTheme = document.documentElement.hasAttribute('data-theme') && 
                       document.documentElement.getAttribute('data-theme') === 'dark';
    
    const blogCards = document.querySelectorAll('.blog-card');
    const categoryBadges = document.querySelectorAll('.category-badge, .blog-card-category');
    
    if (isDarkTheme) {
        blogCards.forEach(card => card.classList.add('dark-theme'));
        categoryBadges.forEach(badge => badge.classList.add('dark-theme'));
    } else {
        blogCards.forEach(card => card.classList.remove('dark-theme'));
        categoryBadges.forEach(badge => badge.classList.remove('dark-theme'));
    }
}

// Watch for theme changes
const themeObserver = new MutationObserver(updateBlogTheme);
themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});

// Initial theme update
updateBlogTheme();