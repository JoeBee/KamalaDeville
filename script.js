// Wait for the DOM to be fully loaded
import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; // Import Firestore functions

document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a, .footer-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Only process links that point to an ID on the page
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for the fixed header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Form validation and submission
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Simple form validation
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            let isValid = true;

            if (!nameInput.value.trim()) {
                isValid = false;
                showError(nameInput, 'Please enter your name');
            } else {
                clearError(nameInput);
            }

            if (!emailInput.value.trim()) {
                isValid = false;
                showError(emailInput, 'Please enter your email');
            } else if (!isValidEmail(emailInput.value)) {
                isValid = false;
                showError(emailInput, 'Please enter a valid email address');
            } else {
                clearError(emailInput);
            }

            if (!messageInput.value.trim()) {
                isValid = false;
                showError(messageInput, 'Please enter your message');
            } else {
                clearError(messageInput);
            }

            if (isValid) {
                // Prepare data to send to Firestore
                const data = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    message: messageInput.value.trim(),
                    submittedAt: serverTimestamp() // Add a server timestamp
                };

                // Show loading state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;

                // Add data to Firestore
                try {
                    const docRef = await addDoc(collection(db, "contactMessages"), data);
                    console.log("Message stored with ID: ", docRef.id);
                    contactForm.innerHTML = '<div class="success-message"><h3>Thank you for your message!</h3><p>We have received your submission.</p></div>';
                } catch (error) {
                    console.error("Error adding document: ", error);
                    // Restore button and show error message
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                    const errorDiv = document.createElement('div');
                    errorDiv.style.color = 'red';
                    errorDiv.style.marginTop = '10px';
                    errorDiv.textContent = 'Error sending message. Please try again later.';
                    contactForm.appendChild(errorDiv);
                    setTimeout(() => errorDiv.remove(), 5000);
                }
            }
        });
    }

    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('.about-content, .contact-container');

    // Check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    // Function to check elements and animate them
    function checkAnimations() {
        animateElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
                element.style.opacity = 1;
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Set initial styles for animation
    animateElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    // Check elements on load and scroll
    window.addEventListener('load', checkAnimations);
    window.addEventListener('scroll', checkAnimations);

    // Helper functions for form validation
    function showError(input, message) {
        // Clear any existing error
        clearError(input);

        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '5px';

        // Add error styling to input
        input.style.borderColor = 'red';

        // Insert error message after the input
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }

    function clearError(input) {
        // Remove error styling
        input.style.borderColor = '';

        // Remove any existing error message
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.className === 'error-message') {
            errorElement.remove();
        }
    }

    function isValidEmail(email) {
        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}); 