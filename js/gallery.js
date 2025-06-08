// Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    let filteredItems = [...galleryItems];

    // Filter gallery items
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    
                    // Add animation effect
                    item.style.animation = 'none';
                    item.offsetHeight; // Trigger reflow
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Update filtered items array for lightbox navigation
            filteredItems = [...galleryItems].filter(item => {
                return filterValue === 'all' || item.getAttribute('data-category') === filterValue;
            });
        });
    });

    // Open lightbox
    galleryItems.forEach((item, index) => {
        const viewFullBtn = item.querySelector('.view-full');
        
        viewFullBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openLightbox(index);
        });
        
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });

    // Function to open lightbox
    function openLightbox(index) {
        // Find the index in the filtered items array
        currentIndex = filteredItems.indexOf(galleryItems[index]);
        
        const imgSrc = galleryItems[index].querySelector('img').getAttribute('src');
        const title = galleryItems[index].querySelector('h3').textContent;
        const desc = galleryItems[index].querySelector('p').textContent;
        
        lightboxImg.setAttribute('src', imgSrc);
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Function to close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Navigate through lightbox
    lightboxPrev.addEventListener('click', function() {
        navigateLightbox('prev');
    });
    
    lightboxNext.addEventListener('click', function() {
        navigateLightbox('next');
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox('prev');
        } else if (e.key === 'ArrowRight') {
            navigateLightbox('next');
        }
    });

    // Function to navigate lightbox
    function navigateLightbox(direction) {
        if (direction === 'prev') {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : filteredItems.length - 1;
        } else {
            currentIndex = (currentIndex < filteredItems.length - 1) ? currentIndex + 1 : 0;
        }
        
        const currentItem = filteredItems[currentIndex];
        const imgSrc = currentItem.querySelector('img').getAttribute('src');
        const title = currentItem.querySelector('h3').textContent;
        const desc = currentItem.querySelector('p').textContent;
        
        // Create new image to ensure smooth transition
        const newImg = new Image();
        newImg.src = imgSrc;
        
        newImg.onload = function() {
            lightboxImg.setAttribute('src', imgSrc);
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = desc;
        };
    }

    // Add animation to gallery items
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});