// Theme Toggle
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const root = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'lavender';
    root.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'lavender' : 'dark';
            
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
});

// Use Cases Filtering and Animations
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const caseCards = document.querySelectorAll('.case-card');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Filter functionality
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                
                // Filter cards
                caseCards.forEach(card => {
                    const roi = parseInt(card.dataset.roi);
                    const money = parseInt(card.dataset.money);
                    const category = card.dataset.category;
                    
                    let show = false;
                    
                    switch(filter) {
                        case 'all':
                            show = true;
                            break;
                        case 'quick-roi':
                            show = roi <= 14;
                            break;
                        case 'high-savings':
                            show = money >= 10000;
                            break;
                        case 'time-savers':
                            show = category === 'savings';
                            break;
                        case 'revenue-boosters':
                            show = category === 'revenue';
                            break;
                        default:
                            show = true;
                    }
                    
                    if (show) {
                        card.style.display = '';
                        card.classList.remove('hidden');
                        // Add entrance animation
                        card.style.animation = 'fadeInUp 0.5s ease';
                    } else {
                        card.classList.add('hidden');
                        setTimeout(() => {
                            if (card.classList.contains('hidden')) {
                                card.style.display = 'none';
                            }
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Animate statistics on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const animateValue = (element, start, end, duration) => {
        const isPercentage = element.dataset.count.includes('%');
        const isMoney = element.dataset.count.includes('.');
        const cleanEnd = parseInt(element.dataset.count.replace(/[^0-9]/g, ''));
        
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            const current = Math.floor(progress * cleanEnd);
            
            if (isMoney) {
                element.textContent = '$' + current.toLocaleString() + 'M';
            } else if (isPercentage) {
                element.textContent = current + '%';
            } else {
                element.textContent = current.toLocaleString();
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Set final value
                if (isMoney) {
                    element.textContent = '$' + element.dataset.count.replace('$', '');
                } else {
                    element.textContent = element.dataset.count;
                }
            }
        };
        window.requestAnimationFrame(step);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateValue(entry.target, 0, 100, 2000);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(num => {
        statsObserver.observe(num);
    });
    
    // Progress bar animations
    const progressBars = document.querySelectorAll('.progress-fill');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const before = parseInt(entry.target.dataset.before);
                const after = parseInt(entry.target.dataset.after);
                const percentage = ((before - after) / before) * 100;
                entry.target.style.width = percentage + '%';
            }
        });
    }, observerOptions);
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
});

// Add fadeInUp animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        // Toggle menu on button click
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
        
        // Prevent menu from closing when clicking inside it
        navMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
});

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

// Process timeline functionality
document.addEventListener('DOMContentLoaded', () => {
    const timelineSteps = document.querySelectorAll('.timeline-step');
    const timelineMarkers = document.querySelectorAll('.timeline-marker');
    const processCards = document.querySelectorAll('.process-card');
    const timelineFill = document.querySelector('.timeline-fill');
    
    function updateProcess(index) {
        // Update timeline steps
        timelineSteps.forEach((step, i) => {
            step.classList.toggle('active', i === index);
        });
        
        // Update process cards
        processCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        
        // Update progress bar
        if (timelineFill) {
            const progressPercentage = (index / (timelineSteps.length - 1)) * 100;
            timelineFill.style.width = `${progressPercentage}%`;
        }
    }
    
    // Handle timeline marker clicks
    timelineMarkers.forEach((marker, index) => {
        marker.addEventListener('click', () => {
            updateProcess(index);
        });
    });
    
    // Handle timeline step clicks (for mobile)
    timelineSteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            updateProcess(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!document.querySelector('.process')) return;
        
        const activeIndex = Array.from(timelineSteps).findIndex(step => 
            step.classList.contains('active')
        );
        
        if (e.key === 'ArrowLeft' && activeIndex > 0) {
            updateProcess(activeIndex - 1);
        } else if (e.key === 'ArrowRight' && activeIndex < timelineSteps.length - 1) {
            updateProcess(activeIndex + 1);
        }
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

// Typing effect for hero highlight text
window.addEventListener('load', () => {
    const typewriterText = document.querySelector('.highlight');
    if (typewriterText) {
        const text = typewriterText.textContent;
        typewriterText.textContent = '';
        typewriterText.style.minHeight = '1.2em'; // Prevent layout shift
        let index = 0;
        
        const typeWriter = () => {
            if (index < text.length) {
                typewriterText.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
});

// Page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

