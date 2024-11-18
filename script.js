document.addEventListener('DOMContentLoaded', () => {
    // Debug log to verify script is running
    console.log('Script loaded');

    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    // Debug log to verify elements are found
    console.log('Hamburger:', hamburger);
    console.log('Nav:', nav);

    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Hamburger clicked'); // Debug log
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        console.log('Menu state:', nav.classList.contains('active')); // Debug log
    });

    // Close menu when clicking links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Add email copy functionality
    const copyBtn = document.querySelector('.copy-btn');
    const emailElement = document.querySelector('.email');

    copyBtn.addEventListener('click', async () => {
        const email = emailElement.textContent;
        
        try {
            await navigator.clipboard.writeText(email);
            
            // Change button text temporarily to show success
            const originalContent = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
            
            // Revert button text after 2 seconds
            setTimeout(() => {
                copyBtn.innerHTML = originalContent;
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy email:', err);
            
            // Show error state
            const originalContent = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-times"></i><span>Failed to copy</span>';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalContent;
            }, 2000);
        }
    });
});