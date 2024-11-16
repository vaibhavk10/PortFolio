function copyEmail() {
    const email = document.querySelector('.email').textContent;
    navigator.clipboard.writeText(email);
    
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.innerHTML;
    
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
    }, 2000);
} 

document.querySelector('nav a[href="#"]').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Intersection Observer for section animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        // Add a small delay for the animation
        setTimeout(() => {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 200);
    });
});

// Additional animations for project cards
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
    observer.observe(card);
});

// Skill category animations
document.querySelectorAll('.skill-category').forEach((category, index) => {
    category.style.animationDelay = `${index * 0.15}s`;
    observer.observe(category);
});

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${progress}%`;
});

// Email copy functionality
document.querySelector('.copy-btn').addEventListener('click', async function() {
    const email = 'vaibhavkumawat1003@gmail.com';
    
    try {
        await navigator.clipboard.writeText(email);
        
        // Change button text temporarily to show feedback
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        // Reset button text after 2 seconds
        setTimeout(() => {
            this.innerHTML = originalText;
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy email:', err);
        this.innerHTML = '<i class="fas fa-times"></i> Failed to copy';
        
        setTimeout(() => {
            this.innerHTML = originalText;
        }, 2000);
    }
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const body = document.body;

    if (!hamburger || !nav) {
        console.error('Menu elements not found');
        return;
    }

    // Toggle menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
        
        // Debug log
        console.log('Menu clicked', {
            hamburgerActive: hamburger.classList.contains('active'),
            navActive: nav.classList.contains('active')
        });
    });

    // Close menu when clicking links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            body.style.overflow = 'auto';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });
});
