// ==========================================================================
// 1. IMAGE SLIDER LOGIC
// ==========================================================================
const slides = document.querySelectorAll('.slide');
let currentSlideIndex = 0;
const slideIntervalTime = 4000; 

function nextSlide() {
    if (slides.length === 0) return;
    slides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    slides[currentSlideIndex].classList.add('active');
}

if (slides.length > 0) {
    setInterval(nextSlide, slideIntervalTime);
}

// This main wrapper ensures the browser fully loads the webpage elements before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    
    /* ==========================================================================
       2. INTERACTIVE HAMBURGER MOBILE MENU LOGIC
       ========================================================================== */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            console.log("Navigation menu toggled successfully!");
        });
    } else {
        console.warn("Hamburger elements not found on this specific page template.");
    }


    /* ==========================================================================
       3. SCROLL FADE-IN ANIMATION LOGIC (INTERSECTION OBSERVER)
       ========================================================================== */
    const fadeElements = document.querySelectorAll('.scroll-fade-in');
    
    if (!('IntersectionObserver' in window)) {
        fadeElements.forEach(element => element.classList.add('appear'));
    } else {
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                    observer.unobserve(entry.target); 
                    console.log("Element smoothly faded in!");
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: "0px 0px -40px 0px"
        });
        
        fadeElements.forEach(element => {
            scrollObserver.observe(element);
        });
    }


    /* ==========================================================================
       4. BACK TO TOP ARROW INTERACTION UTILITY
       ========================================================================== */
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    /* ============
       5. CONNECTED EXPRESS BACKEND CODE (UPDATED FOR ULTRA-FAST VERCEL HOSTING)
       ============ */
    const BACKEND_URL = "https://vercel.app";


    // A. Newsletter Form Submission Handling
    const newsletterForm = document.getElementById('newsletter-form'); 
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletter-email').value; 

            try {
                const response = await fetch(`${BACKEND_URL}/api/newsletter`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailInput })
                });
                
                const data = await response.json();
                if (data.success || response.ok) {
                    window.location.href = "thank-you.html"; 
                } else {
                    alert('Error: ' + (data.error || 'Submission failed'));
                }
            } catch (error) {
                console.error('Newsletter submission failed:', error);
                alert('Submission failed. Please check your internet connection and try again.');
            }
        });
    }

    // B. Contact / Complaint Form Submission Handling
    const contactForm = document.getElementById('contact-form'); 
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('contact-name').value;
            const emailInput = document.getElementById('contact-email').value;
            const messageInput = document.getElementById('contact-message').value;

            try {
                const response = await fetch(`${BACKEND_URL}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        name: nameInput, 
                        email: emailInput, 
                        message: messageInput 
                    })
                });
                
                const data = await response.json();
                if (data.success || response.ok) {
                    window.location.href = "thank-you.html"; 
                } else {
                    alert('Error: ' + (data.error || 'Submission failed'));
                }
            } catch (error) {
                console.error('Contact form submission failed:', error);
                alert('Could not send message. Please confirm your connection and try again.');
            }
        });
    }

        // C. Admission Form Submission (PERFECTLY MAPPED TO YOUR INPUTS)
    ["primaryForm", "secondaryForm"].forEach(formId => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Auto-loads html2pdf library if missing
            if (typeof html2pdf === 'undefined') {
                console.log("Loading PDF generation library...");
                await new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = "https://cloudflare.com";
                    script.onload = () => resolve();
                    document.head.appendChild(script);
                });
            }

            // PDF output layout configurations
            const options = {
                margin:       12,
                filename:     `${formId}_Registration_Receipt.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            try {
                // 1. Instantly trigger the local PDF download copy for the parent
                await html2pdf().set(options).from(form).save();

                // 2. Map fields using the exact name="..." attributes visible in your sidebar search
                const childNameValue = form.querySelector('[name="childName"]')?.value || "Applicant";
                const fatherNameValue = form.querySelector('[name="fatherName"]')?.value || "Not Provided";
                const motherNameValue = form.querySelector('[name="motherName"]')?.value || "Not Provided";
                const sexValue = form.querySelector('[name="childSex"]')?.value || "Not Provided";

                // 3. Compile summary text to pass cleanly to your active backend notification email
                const summaryPayload = {
                    studentName: childNameValue,
                    studentEmail: `${formId.toUpperCase()} Registration Submission`, // Descriptive string placeholder
                    studentPhone: `Father: ${fatherNameValue} | Mother: ${motherNameValue}`, // Bundled text
                    course: `Sex: ${sexValue}` // Contextual text slot
                };

                // 4. Post the data payload securely across the network to your Vercel Node API 
                const response = await fetch(`${BACKEND_URL}/api/admission`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(summaryPayload)
                });

                const result = await response.json();

                if (result.success) {
                    alert("Admission application submitted successfully and your form PDF copy has been downloaded!");
                    form.reset();
                } else {
                    alert(result.error || "Form printed locally, but backend sync failed.");
                }

            } catch (err) {
                console.error("Admission script error details:", err);
                alert("An error occurred while compiling your receipt PDF data. Check network status.");
            }
        });
    });

    /* ==========================================================================
       6. ENTRANCE ADMISSION MODAL ANNOUNCEMENT POPUP LOGIC
       ========================================================================== */
    const announcementPopup = document.getElementById('announcementPopup');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const popupApplyBtn = document.getElementById('popupApplyBtn');

    if (announcementPopup && closePopupBtn) {
        // Triggers popup entry precisely 1 second after visitor arrives
        setTimeout(() => {
            announcementPopup.classList.add('show-popup');
        }, 1000);

        // Click event listener dismisses the modal layout
        closePopupBtn.addEventListener('click', () => {
            announcementPopup.classList.remove('show-popup');
        });

        // Auto-closes the popup modal whenever they click the external Apply link
        if (popupApplyBtn) {
            popupApplyBtn.addEventListener('click', () => {
                announcementPopup.classList.remove('show-popup');
            });
        }

        // Dismisses modal layout layer if backdrop area is clicked
        announcementPopup.addEventListener('click', (e) => {
            if (e.target === announcementPopup) {
                announcementPopup.classList.remove('show-popup');
            }
        });
    }

});

// ==========================================================================
// 7. MULTI-TAB REGISTRATION FORM VIEW TOGGLE
// ==========================================================================
function switchForm(formId) {
    // 1. Hide all registration form sections
    document.querySelectorAll('.registration-form').forEach(form => {
        form.classList.remove('active');
    });

    // 2. Take away the highlighted "active" styling from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Show the specific form section that was clicked
    document.getElementById(formId).classList.add('active');

    // 4. Highlight the button that was just clicked
    const clickedButton = Array.from(document.querySelectorAll('.tab-btn')).find(btn => 
        btn.getAttribute('onclick').includes(formId)
    );
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}


// ==========================================================================
// 8. DOUBLE CLICK REDIRECTION CARDS FRAMEWORK
// ==========================================================================
document.querySelectorAll('.hallel-card').forEach(card => {
    card.addEventListener('dblclick', function() {
        const destinationUrl = this.getAttribute('data-url');
        if (destinationUrl) {
            window.location.href = destinationUrl;
        }
    });
});
