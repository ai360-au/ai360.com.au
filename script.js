/**
 * AI360 Website Scripts
 * Handles contact form submission via Ajax
 */

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

/**
 * Contact Form with Ajax submission
 * Uses FormSubmit.co for serverless form handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const formStatus = document.getElementById('formStatus');

    // Form fields
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const newsletterInput = document.getElementById('newsletter');

    // Error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // Real-time validation
    if (firstNameInput) {
        firstNameInput.addEventListener('blur', () => validateName());
    }
    if (lastNameInput) {
        lastNameInput.addEventListener('blur', () => validateName());
    }
    if (emailInput) {
        emailInput.addEventListener('blur', () => validateEmail(emailInput, emailError));
    }
    if (messageInput) {
        messageInput.addEventListener('blur', () => validateField(messageInput, messageError, 'Please enter a message'));
    }

    // Clear errors on input
    [firstNameInput, lastNameInput, emailInput, messageInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                input.classList.remove('error');
            });
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Reset status
        formStatus.className = 'form-status';
        formStatus.textContent = '';

        // Validate all fields
        const isNameValid = validateName();
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
                name: `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`,
                email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                newsletter: newsletterInput ? newsletterInput.checked : false,
                _subject: 'New Contact Form Submission - AI360',
                _captcha: 'false',
                _template: 'table'
            };

            // Send to FormSubmit.co
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
     * Validate name fields
     */
    function validateName() {
        const firstName = firstNameInput ? firstNameInput.value.trim() : '';
        const lastName = lastNameInput ? lastNameInput.value.trim() : '';

        if (!firstName || !lastName) {
            if (!firstName && firstNameInput) firstNameInput.classList.add('error');
            if (!lastName && lastNameInput) lastNameInput.classList.add('error');
            if (nameError) nameError.textContent = 'Please enter your full name';
            return false;
        }

        if (firstNameInput) firstNameInput.classList.remove('error');
        if (lastNameInput) lastNameInput.classList.remove('error');
        if (nameError) nameError.textContent = '';
        return true;
    }

    /**
     * Validate a required field
     */
    function validateField(input, errorEl, errorMessage) {
        if (!input) return true;
        const value = input.value.trim();
        if (!value) {
            input.classList.add('error');
            if (errorEl) errorEl.textContent = errorMessage;
            return false;
        }
        input.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
        return true;
    }

    /**
     * Validate email format
     */
    function validateEmail(input, errorEl) {
        if (!input) return true;
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) {
            input.classList.add('error');
            if (errorEl) errorEl.textContent = 'Please enter your email';
            return false;
        }

        if (!emailRegex.test(value)) {
            input.classList.add('error');
            if (errorEl) errorEl.textContent = 'Please enter a valid email address';
            return false;
        }

        input.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
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
