/**
 * AI360 Website Scripts
 * Handles contact form submission via Ajax and UI interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initHeaderScroll();
    initContactForm();
});

/**
 * Header scroll effect - adds background when scrolled
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');

    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
}

/**
 * Contact Form with Ajax submission
 * Uses FormSubmit.co for serverless form handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const formStatus = document.getElementById('formStatus');

    // Form fields
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // Real-time validation
    nameInput.addEventListener('blur', () => validateField(nameInput, nameError, 'Please enter your name'));
    emailInput.addEventListener('blur', () => validateEmail(emailInput, emailError));
    messageInput.addEventListener('blur', () => validateField(messageInput, messageError, 'Please enter a message'));

    // Clear errors on input
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorEl = document.getElementById(input.id + 'Error');
            if (errorEl) errorEl.textContent = '';
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Reset status
        formStatus.className = 'form-status';
        formStatus.textContent = '';

        // Validate all fields
        const isNameValid = validateField(nameInput, nameError, 'Please enter your name');
        const isEmailValid = validateEmail(emailInput, emailError);
        const isMessageValid = validateField(messageInput, messageError, 'Please enter a message');

        if (!isNameValid || !isEmailValid || !isMessageValid) {
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            // Prepare form data
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                _subject: 'New Contact Form Submission - AI360',
                _captcha: 'false',
                _template: 'table'
            };

            // Send to FormSubmit.co (replace with your email)
            const response = await fetch('https://formsubmit.co/ajax/pranay@ai360.com.au', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Success
                showStatus('success', 'Thank you! We will reach out to you via Email.');
                form.reset();
            } else {
                // Error from service
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showStatus('error', 'Sorry, there was an error sending your message. Please try again or email us directly at pranay@ai360.com.au');
        } finally {
            setLoadingState(false);
        }
    });

    /**
     * Validate a required field
     */
    function validateField(input, errorEl, errorMessage) {
        const value = input.value.trim();
        if (!value) {
            input.classList.add('error');
            errorEl.textContent = errorMessage;
            return false;
        }
        input.classList.remove('error');
        errorEl.textContent = '';
        return true;
    }

    /**
     * Validate email format
     */
    function validateEmail(input, errorEl) {
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) {
            input.classList.add('error');
            errorEl.textContent = 'Please enter your email';
            return false;
        }

        if (!emailRegex.test(value)) {
            input.classList.add('error');
            errorEl.textContent = 'Please enter a valid email address';
            return false;
        }

        input.classList.remove('error');
        errorEl.textContent = '';
        return true;
    }

    /**
     * Toggle loading state
     */
    function setLoadingState(loading) {
        submitBtn.disabled = loading;
        btnText.style.display = loading ? 'none' : 'inline';
        btnLoading.style.display = loading ? 'inline' : 'none';
    }

    /**
     * Show form status message
     */
    function showStatus(type, message) {
        formStatus.className = 'form-status ' + type;
        formStatus.textContent = message;

        // Scroll to status message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-hide success message after 10 seconds
        if (type === 'success') {
            setTimeout(() => {
                formStatus.className = 'form-status';
                formStatus.textContent = '';
            }, 10000);
        }
    }
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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
