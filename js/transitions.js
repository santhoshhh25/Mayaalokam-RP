// Smooth transitions between pages and elements
document.addEventListener('DOMContentLoaded', function() {
    // Add page transition class to body
    document.body.classList.add('page-transition');
    
    // Initialize section transitions on scroll
    initSectionTransitions();
    
    // Add animate-on-scroll class to section dividers for animation
    document.querySelectorAll('.section-divider').forEach(divider => {
        divider.classList.add('animate-on-scroll');
    });
    
    // Add animate-on-scroll class to features
    document.querySelectorAll('.feature-container').forEach(feature => {
        feature.classList.add('animate-on-scroll');
    });
    
    // Add smooth transitions when clicking links
    setupLinkTransitions();
});

// Initialize section transitions based on scroll position
function initSectionTransitions() {
    const sections = document.querySelectorAll('section, .section-divider');
    
    // Check if sections are in viewport and add visible class
    function checkSectionsInView() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // If section is in viewport
            if (sectionTop < windowHeight * 0.85) {
                section.classList.add('visible');
            }
        });
    }
    
    // Initial check on page load
    setTimeout(() => {
        checkSectionsInView();
    }, 100);
    
    // Check on scroll
    window.addEventListener('scroll', checkSectionsInView);
}

// Setup smooth transitions when clicking links
function setupLinkTransitions() {
    // Get all internal links
    const links = document.querySelectorAll('a[href^="/"]:not([target]), a[href^="./"]:not([target]), a[href^="../"]:not([target]), a[href^="index.html"]:not([target]), a[href^="whitelist.html"]:not([target]), a[href^="rules.html"]:not([target]), a[href^="duty-tracker.html"]:not([target]), a[href^="membership.html"]:not([target])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Skip if modifier keys are pressed or it's an anchor link
            if (e.metaKey || e.ctrlKey || e.shiftKey || this.getAttribute('href').includes('#')) {
                return;
            }
            
            e.preventDefault();
            const targetUrl = this.getAttribute('href');
            
            // Add transitioning class to enable animation
            document.body.classList.add('transitioning');
            
            // After transition completes, navigate to the new page
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 400);
        });
    });
}

// Add animation to section when it becomes visible
window.addEventListener('scroll', function() {
    const animElements = document.querySelectorAll('.animate-on-scroll');
    
    animElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight * 0.85) {
            element.classList.add('animated');
        }
    });
}, { passive: true });