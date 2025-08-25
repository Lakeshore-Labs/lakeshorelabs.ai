// Tab functionality for Solutions section
const tabs = document.querySelectorAll('.tab');
const tabPanels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Remove active class from all tabs and panels
        tabs.forEach(t => t.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding panel
        tab.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Process tabs functionality
const processTabs = document.querySelectorAll('.process-tab');
const processPanels = document.querySelectorAll('.process-panel');

processTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetProcess = tab.dataset.process;
        
        // Remove active class from all tabs and panels
        processTabs.forEach(t => t.classList.remove('active'));
        processPanels.forEach(panel => panel.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding panel
        tab.classList.add('active');
        document.getElementById(targetProcess).classList.add('active');
    });
});

// FAQ accordion functionality
const faqItems = document.querySelectorAll('.faq-question');

faqItems.forEach(item => {
    item.addEventListener('click', () => {
        const faqItem = item.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        nav.style.background = 'rgba(10, 10, 10, 0.8)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe process tabs
document.querySelectorAll('.process-tab').forEach(tab => {
    tab.style.opacity = '0';
    tab.style.transform = 'translateY(20px)';
    tab.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(tab);
});

// Carousel pause on hover
const carousel = document.querySelector('.carousel-track');
if (carousel) {
    carousel.addEventListener('mouseenter', () => {
        carousel.style.animationPlayState = 'paused';
    });
    
    carousel.addEventListener('mouseleave', () => {
        carousel.style.animationPlayState = 'running';
    });
}

// Add hover effect to CTA cards
const ctaCards = document.querySelectorAll('.cta-card');
ctaCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Typing effect for hero title (optional)
const typewriterText = document.querySelector('.text-gradient');
if (typewriterText && false) { // Disabled by default, set to true to enable
    const text = typewriterText.textContent;
    typewriterText.textContent = '';
    let index = 0;
    
    const typeWriter = () => {
        if (index < text.length) {
            typewriterText.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Start typing effect after page load
    window.addEventListener('load', () => {
        setTimeout(typeWriter, 500);
    });
}

// Mobile menu toggle (for future mobile menu implementation)
const mobileMenuToggle = () => {
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    
    if (window.innerWidth <= 768) {
        // Mobile menu logic here
    }
};

// Performance optimization: Throttle scroll events
let scrollTimeout;
const throttledScroll = (callback, delay) => {
    if (scrollTimeout) return;
    
    scrollTimeout = setTimeout(() => {
        callback();
        scrollTimeout = null;
    }, delay);
};

// Console message
console.log(
    '%c⚡ Welcome to Lakeshore Labs',
    'color: #FF5722; font-size: 20px; font-weight: bold;'
);
console.log(
    '%cEnterprise AI Implementation Partner',
    'color: #FFA726; font-size: 14px;'
);

// Page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});