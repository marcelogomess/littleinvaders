/**
 * Little Invaders Landing Page - JavaScript
 * Handles smooth scrolling, scroll animations, and interactive elements
 */

// ============================================
// Mobile Menu Toggle
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            const isActive = navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isActive);
        });
        
        // Close menu when clicking on a link (mobile)
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside (mobile)
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

// ============================================
// Smooth Scrolling for Navigation Links
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just '#'
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerOffset = 80; // Account for fixed header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.addEventListener('DOMContentLoaded', function() {
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(el => observer.observe(el));
});

// Also observe sections for fade-in effect
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// ============================================
// Animated Invader Enhancement
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const invader = document.querySelector('.invader-sprite');
    
    if (invader) {
        // Add subtle rotation animation on scroll
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            const scrollDelta = scrollY - lastScrollY;
            
            // Subtle rotation based on scroll direction
            if (Math.abs(scrollDelta) > 0) {
                const rotation = scrollDelta * 0.1;
                invader.style.transform = `translateY(0) rotate(${rotation}deg)`;
                
                setTimeout(() => {
                    invader.style.transform = '';
                }, 100);
            }
            
            lastScrollY = scrollY;
        });
    }
});

// ============================================
// Copy Address to Clipboard (Contract & Wallet Addresses)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(function(copyBtn) {
        copyBtn.addEventListener('click', function() {
            let address;
            
            // Check if button has data-address attribute (wallet addresses)
            if (this.hasAttribute('data-address')) {
                address = this.getAttribute('data-address');
            } else {
                // Fallback to finding the code element nearby (contract address)
                const codeElement = this.closest('.contract-address')?.querySelector('code') || 
                                   this.closest('.wallet-address')?.querySelector('code');
                if (codeElement) {
                    address = codeElement.textContent;
                }
            }
            
            if (!address) {
                console.error('No address found to copy');
                return;
            }
            
            // Use Clipboard API if available
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(address).then(function() {
                    // Visual feedback
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = '✓';
                    copyBtn.style.background = 'var(--accent-green)';
                    copyBtn.style.color = 'var(--bg-primary)';
                    
                    setTimeout(function() {
                        copyBtn.textContent = originalText;
                        copyBtn.style.background = '';
                        copyBtn.style.color = '';
                    }, 2000);
                }).catch(function(err) {
                    console.error('Failed to copy:', err);
                    fallbackCopy(address, copyBtn);
                });
            } else {
                // Fallback for older browsers
                fallbackCopy(address, copyBtn);
            }
        });
    });
});

// Fallback copy method for older browsers
function fallbackCopy(text, copyBtn) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓';
            copyBtn.style.background = 'var(--accent-green)';
            copyBtn.style.color = 'var(--bg-primary)';
            
            setTimeout(function() {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
                copyBtn.style.color = '';
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textArea);
}

// ============================================
// Button Click Tracking (Placeholder)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn, .social-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Placeholder for analytics tracking
            const buttonText = this.textContent.trim();
            const buttonHref = this.getAttribute('href');
            
            // Log for debugging (remove in production or replace with actual analytics)
            console.log('Button clicked:', buttonText, buttonHref);
            
            // Example: Google Analytics event
            // if (typeof gtag !== 'undefined') {
            //     gtag('event', 'click', {
            //         'event_category': 'Button',
            //         'event_label': buttonText
            //     });
            // }
        });
    });
});

// ============================================
// Parallax Effect for Hero Background
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelector('.stars-background');
    
    if (stars) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero');
            
            if (heroSection) {
                const heroHeight = heroSection.offsetHeight;
                
                if (scrolled < heroHeight) {
                    const parallaxSpeed = 0.5;
                    stars.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                }
            }
        });
    }
});

// ============================================
// Header Background on Scroll
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(0, 0, 0, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0, 255, 255, 0.2)';
            } else {
                header.style.background = 'rgba(0, 0, 0, 0.8)';
                header.style.boxShadow = 'none';
            }
        });
    }
});

// ============================================
// Carousel Functionality
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!carouselTrack || !carouselSlides.length) return;
    
    let currentSlide = 0;
    let autoplayInterval;
    const totalSlides = carouselSlides.length;
    const slidesPerView = 1;
    
    // Create dot indicators
    function createDots() {
        if (!dotsContainer) return;
        
        // Limit dots to visible slides or max 10 for performance
        const maxDots = Math.min(totalSlides, 10);
        for (let i = 0; i < maxDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update carousel position
    function updateCarousel() {
        const translateX = -currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            if (index === Math.floor(currentSlide % dots.length)) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index % totalSlides;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        updateCarousel();
        resetAutoplay();
    }
    
    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        resetAutoplay();
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        resetAutoplay();
    }
    
    // Autoplay functionality
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            nextSlide();
        }, 4000); // Change slide every 4 seconds
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    
    // Button event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Pause autoplay on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoplay);
        carouselContainer.addEventListener('mouseleave', startAutoplay);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (carouselContainer && document.activeElement !== carouselContainer) return;
        
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carouselTrack) {
        carouselTrack.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carouselTrack.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left - next
            } else {
                prevSlide(); // Swipe right - previous
            }
        }
    }
    
    // Initialize
    createDots();
    updateCarousel();
    startAutoplay();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', stopAutoplay);
});

// ============================================
// Keyboard Navigation Enhancement
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Skip to main content for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#hero';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--accent-cyan);
        color: var(--bg-primary);
        padding: 8px;
        text-decoration: none;
        z-index: 100;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
});
