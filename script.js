// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Back to top button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .feature-item, .testimonial-card').forEach(el => {
    observer.observe(el);
});

// Contact form handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Simple validation
    const requiredFields = ['name', 'email', 'phone', 'service', 'message'];
    const emptyFields = requiredFields.filter(field => !formObject[field] || formObject[field].trim() === '');
    
    if (emptyFields.length > 0) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formObject.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formObject.phone)) {
        showNotification('Please enter a valid phone number.', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Thank you for your message! We will get back to you soon.', 'success');
    contactForm.reset();
    
    // Log the form data (in a real application, you would send this to a server)
    console.log('Form submission:', formObject);
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles for notification
    const style = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease-out;
            overflow: hidden;
        }
        
        .notification-success {
            background: linear-gradient(135deg, #7ED321, #4A90E2);
            color: white;
        }
        
        .notification-error {
            background: linear-gradient(135deg, #e53e3e, #c53030);
            color: white;
        }
        
        .notification-info {
            background: linear-gradient(135deg, #4A90E2, #7ED321);
            color: white;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            padding: 15px 20px;
            gap: 10px;
        }
        
        .notification-icon {
            font-size: 18px;
            font-weight: bold;
        }
        
        .notification-message {
            flex: 1;
            font-weight: 500;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
        }
        
        .notification-close:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    // Add styles to document if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'notification-styles';
        styleElement.textContent = style;
        document.head.appendChild(styleElement);
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Add loading animation to service cards
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Add hover effect to testimonial cards
document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Counter animation for stats (if we had stats)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Initialize tooltips for service icons
document.querySelectorAll('.service-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Lazy loading for images (if we had more images)
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Hero Image Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');

function nextSlide() {
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Auto slide every 4 seconds for more dynamic experience
if (slides.length > 0) {
    setInterval(nextSlide, 4000);
}

// Page Hero Image Slider
let currentPageSlide = 0;
const pageSlides = document.querySelectorAll('.page-hero-slide');

function nextPageSlide() {
    if (pageSlides.length === 0) return;
    
    pageSlides[currentPageSlide].classList.remove('active');
    currentPageSlide = (currentPageSlide + 1) % pageSlides.length;
    pageSlides[currentPageSlide].classList.add('active');
}

// Auto slide every 5 seconds for page heroes
if (pageSlides.length > 0) {
    setInterval(nextPageSlide, 5000);
}

// Seamless section fade on scroll
function handleScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;
        
        // Calculate if section is in viewport
        const isInViewport = (scrollPosition + windowHeight > sectionTop) && 
                           (scrollPosition < sectionBottom);
        
        // Add fade effect when scrolling up past section
        if (scrollPosition > sectionBottom + 100) {
            section.classList.add('fade-out');
        } else {
            section.classList.remove('fade-out');
        }
        
        // Add entrance animation
        if (isInViewport && !section.classList.contains('animated')) {
            section.classList.add('fade-in-up', 'animated');
        }
    });
}

// Throttled scroll event listener
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            handleScrollAnimations();
            scrollTimeout = null;
        }, 16); // ~60fps
    }
});

// Date handling for any future forms
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// Initialize today's date for any forms that need it
const today = getTodayDate();

// Smooth scroll snap behavior
function initScrollSnap() {
    // Disable default scroll snap on mobile for better performance
    if (window.innerWidth <= 768) {
        document.documentElement.style.scrollSnapType = 'none';
        document.body.style.scrollSnapType = 'none';
    } else {
        document.documentElement.style.scrollSnapType = 'y mandatory';
        document.body.style.scrollSnapType = 'y mandatory';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in class to elements that should animate on load
    document.querySelectorAll('.hero-content, .section-header').forEach(el => {
        el.classList.add('fade-in-up');
    });
    
    // Initialize hero slider
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }
    
    // Initialize scroll snap
    initScrollSnap();
    
    // Re-initialize on window resize
    window.addEventListener('resize', initScrollSnap);
    
    // Initialize any other features
    console.log('SN.SP Limited website loaded successfully!');
});

// Form field focus effects
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    field.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    field.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Add additional CSS for form focus effects
const additionalCSS = `
.form-group.focused {
    transform: translateY(-2px);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    transform: translateY(-1px);
}
`;

const additionalStyleElement = document.createElement('style');
additionalStyleElement.textContent = additionalCSS;
document.head.appendChild(additionalStyleElement);

