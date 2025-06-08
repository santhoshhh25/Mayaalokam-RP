/**
 * Form Handler for GitHub Pages
 * Handles form submissions for static hosting with various fallback methods
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find all forms that should use this handler
    const forms = document.querySelectorAll('form[data-static-form]');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleStaticFormSubmit);
    });
    
    /**
     * Handles form submissions for static hosting
     * @param {Event} event - The form submit event
     */
    function handleStaticFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        const formValues = {};
        
        // Convert FormData to object
        for (const [key, value] of formData.entries()) {
            formValues[key] = value;
        }
        
        // Store submission in localStorage for demo purposes
        storeSubmission(formValues);
        
        // Show loading state
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            // Simulate processing delay
            setTimeout(() => {
                // Show success message
                showFormMessage(form, 'success', 'Your application has been submitted successfully!');
                
                // Reset form
                form.reset();
                
                // Restore button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Show toast if function exists
                if (typeof showToast === 'function') {
                    showToast('Form submitted successfully! This is a demo mode for GitHub Pages.', 5000);
                }
                
                // Scroll to top of form
                form.scrollIntoView({ behavior: 'smooth' });
            }, 2000);
        }
    }
    
    /**
     * Stores form submission in localStorage
     * @param {Object} data - Form data
     */
    function storeSubmission(data) {
        // Get existing submissions or initialize empty array
        const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        
        // Add timestamp
        data.timestamp = new Date().toISOString();
        
        // Add to submissions
        submissions.push(data);
        
        // Store back in localStorage
        localStorage.setItem('formSubmissions', JSON.stringify(submissions));
        
        // Log to console for debugging
        console.log('Form submission stored:', data);
    }
    
    /**
     * Shows a message in the form
     * @param {Element} form - The form element
     * @param {string} type - Message type (success, error)
     * @param {string} message - Message text
     */
    function showFormMessage(form, type, message) {
        // Find or create message container
        let messageContainer = form.querySelector('.form-message');
        
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.className = 'form-message';
            form.prepend(messageContainer);
        }
        
        // Set message content and style
        messageContainer.textContent = message;
        messageContainer.className = `form-message ${type}`;
        
        // Add some basic styles if not already present
        const style = document.createElement('style');
        style.textContent = `
            .form-message {
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 5px;
                text-align: center;
            }
            .form-message.success {
                background-color: rgba(16, 185, 129, 0.2);
                border: 1px solid rgba(16, 185, 129, 0.3);
                color: #10b981;
            }
            .form-message.error {
                background-color: rgba(239, 68, 68, 0.2);
                border: 1px solid rgba(239, 68, 68, 0.3);
                color: #ef4444;
            }
        `;
        
        // Check if style already exists
        if (!document.querySelector('style[data-form-styles]')) {
            style.setAttribute('data-form-styles', 'true');
            document.head.appendChild(style);
        }
        
        // Auto-hide message after 8 seconds
        setTimeout(() => {
            messageContainer.style.opacity = '0';
            setTimeout(() => {
                messageContainer.remove();
            }, 500);
        }, 8000);
    }
    
    // Toast notification function
    function showToast(message, duration = 3000) {
        // Check if toast container exists, if not create it
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .toast-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                }
                .toast {
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 4px;
                    margin-top: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    animation: fadeIn 0.3s, fadeOut 0.3s var(--duration) forwards;
                    max-width: 300px;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.setProperty('--duration', `${duration/1000}s`);
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Remove after duration
        setTimeout(() => {
            toast.remove();
        }, duration);
    }
    
    // Make toast function globally available
    window.showToast = showToast;
});