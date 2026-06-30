// Smooth scrolling and page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get cover element
    const cover = document.getElementById('cover');
    
    // ===== CONFETTI & PARTICLES =====
    createConfetti();
    
    // Lazy load images for better performance
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply fade-in to sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        fadeInObserver.observe(section);
    });

    // ===== ANIMATE TEXT ON SCROLL =====
    animateTextOnScroll();

    // ===== COUNTER ANIMATION =====
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-counted')) {
                entry.target.setAttribute('data-counted', 'true');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => {
        counterObserver.observe(el);
    });

    // Handle responsive iframe sizing
    const resizeIframes = () => {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            const container = iframe.parentElement;
            if (container) {
                const width = container.offsetWidth;
                iframe.style.width = width > 0 ? '100%' : '100%';
            }
        });
    };

    // Call on load and resize
    resizeIframes();
    window.addEventListener('resize', resizeIframes);

    // Prevent image drag on mobile
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    });

    // ===== PHOTO LIGHTBOX/EXPANSION =====
    setupPhotoExpansion();

    // ===== FLOATING ANIMATION =====
    addFloatingAnimation();

    // ===== BIRTHDAY ICON ANIMATIONS =====
    animateBirthdayIcons();

    // Log page load for analytics (optional)
    console.log('🎉 Birthday page loaded successfully!');
});

// ===== CONFETTI CREATION =====
function createConfetti() {
    const confetti = document.createElement('div');
    confetti.id = 'confetti-container';
    confetti.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    document.body.appendChild(confetti);

    const emojis = ['🎉', '🎊', '❤️', '✨', '🎂', '👑', '💝', '⭐', '🎈'];
    
    for (let i = 0; i < 40; i++) {
        const piece = document.createElement('div');
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        piece.textContent = emoji;
        piece.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: -10px;
            font-size: ${Math.random() * 20 + 20}px;
            opacity: 0.7;
            animation: fall ${Math.random() * 5 + 8}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        confetti.appendChild(piece);
    }
}

// ===== TEXT ANIMATION ON SCROLL =====
function animateTextOnScroll() {
    const textElements = document.querySelectorAll('h1, .message-p, #section3 p, .final-message');
    
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                entry.target.setAttribute('data-animated', 'true');
                entry.target.style.animation = 'slideInLeft 0.8s ease-out forwards';
            }
        });
    }, { threshold: 0.3 });

    textElements.forEach(el => textObserver.observe(el));
}

// ===== COUNTER ANIMATION =====
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const start = Date.now();

    const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        const current = Math.floor(progress * target);
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target;
        }
    };

    requestAnimationFrame(updateCount);
}

// ===== PHOTO EXPANSION/LIGHTBOX =====
function setupPhotoExpansion() {
    const photoContainers = document.querySelectorAll('.photos > div, .photos2 > div');
    
    photoContainers.forEach(container => {
        const img = container.querySelector('img');
        if (img) {
            container.style.cursor = 'pointer';
            container.addEventListener('click', () => {
                openLightbox(img.src, img.alt);
            });
        }
    });
}

function openLightbox(imageSrc, imageAlt) {
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
        cursor: pointer;
    `;

    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = imageAlt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 15px;
        box-shadow: 0 0 50px rgba(255, 255, 255, 0.3);
        animation: zoomIn 0.4s ease;
        object-fit: contain;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        background: none;
        border: none;
        color: white;
        font-size: 40px;
        cursor: pointer;
        z-index: 10000;
        transition: transform 0.2s;
    `;
    closeBtn.addEventListener('mouseover', () => closeBtn.style.transform = 'scale(1.2)');
    closeBtn.addEventListener('mouseout', () => closeBtn.style.transform = 'scale(1)');

    const closeLightbox = () => {
        lightbox.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => lightbox.remove(), 300);
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// ===== FLOATING ANIMATION =====
function addFloatingAnimation() {
    const cards = document.querySelectorAll('.intro-card, .message-img, .message2-img');
    
    cards.forEach(card => {
        card.style.animation = 'float 3s ease-in-out infinite';
        card.style.animationDelay = `${Math.random() * 2}s`;
    });
}

// ===== BIRTHDAY ICON ANIMATIONS =====
function animateBirthdayIcons() {
    const icons = document.querySelectorAll('.BirthDay i, .info i, .firnds i');
    
    icons.forEach((icon, index) => {
        icon.style.animation = `pulse 2s ease-in-out infinite`;
        icon.style.animationDelay = `${index * 0.3}s`;
    });
}

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible - Welcome back! 💝');
    }
});

// Mouse parallax effect for intro card
document.addEventListener('mousemove', (e) => {
    const introCard = document.querySelector('.intro-card');
    if (introCard) {
        const x = (e.clientX / window.innerWidth) * 10 - 5;
        const y = (e.clientY / window.innerHeight) * 10 - 5;
        introCard.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
    }
});

// Reset on mouse leave
document.addEventListener('mouseleave', () => {
    const introCard = document.querySelector('.intro-card');
    if (introCard) {
        introCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
});
