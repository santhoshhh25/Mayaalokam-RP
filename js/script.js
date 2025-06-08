// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    
    // Server status is now handled by server-status.js
    
    if (menuToggle && navMenu) {
        // Toggle menu when hamburger is clicked
        menuToggle.addEventListener('click', function(event) {
            event.preventDefault();
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Toggle overlay
            if (navOverlay) {
                navOverlay.classList.toggle('active');
            }
            
            // Toggle body scroll
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
            
            // Toggle aria-expanded attribute for accessibility
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);
        });
        
        // Close menu when clicking outside or on overlay
        document.addEventListener('click', function(event) {
            if (navOverlay && (event.target === navOverlay || (!navMenu.contains(event.target) && !menuToggle.contains(event.target))) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach((link, index) => {
            // Add delay index for animation
            link.style.setProperty('--i', index);
            
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                if (navOverlay) {
                    navOverlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            });
        });
        
        // Handle resize events to fix menu state on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 767 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                if (navOverlay) {
                    navOverlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        });
    }
    
    // Set active class for current page in navigation
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === '#home')) {
            link.classList.add('active');
        }
    });

    // Ensure membership plans are immediately visible
    if (window.location.pathname.includes('membership.html')) {
        const membershipPlans = document.querySelector('.membership-plans');
        if (membershipPlans) {
            membershipPlans.classList.add('visible');
            
            // Ensure all plan containers are visible
            const planContainers = document.querySelectorAll('.plan-container');
            planContainers.forEach(container => {
                container.classList.add('animated');
            });
            
            // Force redraw to ensure animations take effect
            setTimeout(() => {
                document.body.style.opacity = 0.99;
                setTimeout(() => {
                    document.body.style.opacity = 1;
                }, 50);
            }, 100);
        }
    }
});