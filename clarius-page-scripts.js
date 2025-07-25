// clarius-page-scripts.js (Modified)

// Function to initialize all your page's JavaScript
function initializeClariusPageScripts() {
    gsap.registerPlugin(ScrollTrigger);

    // --- Ultrasound for Everyone Animation ---
    if (window.innerWidth > 768) {
        const everyoneTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: "#everyone-section",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
            }
        });
        everyoneTimeline.to(".image-one", { x: "-30vw", ease: "none" }, 0);
        everyoneTimeline.to(".image-two", { x: "30vw", ease: "none" }, 0);
        everyoneTimeline.to(".everyone-content", { opacity: 1, duration: 0.2 }, 0.2);
        everyoneTimeline.to(".everyone-content", { opacity: 0, duration: 0.2 }, 0.8);
    } else {
        const everyoneTimelineMobile = gsap.timeline({
            scrollTrigger: {
                trigger: "#everyone-section",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
            }
        });
        everyoneTimelineMobile.to(".image-one", { y: "-50vh", ease: "none" }, 0);
        everyoneTimelineMobile.to(".image-two", { y: "50vh", ease: "none" }, 0);
        everyoneTimelineMobile.to(".everyone-content", { opacity: 1, duration: 0.2 }, 0.2);
        everyoneTimelineMobile.to(".everyone-content", { opacity: 0, duration: 0.2 }, 0.8);
    }

    // --- T-Mode Simulator Logic ---
    const tModeControls = document.querySelector('.t-mode-controls');
    if (tModeControls) {
        const tModeOnImg = document.getElementById('t-mode-on');
        const tModeOffImg = document.getElementById('t-mode-off');
        tModeControls.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON') {
                const mode = e.target.dataset.mode;
                tModeControls.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                tModeOnImg.classList.toggle('hidden', mode === 'off');
                tModeOffImg.classList.toggle('hidden', mode === 'on');
            }
        });
    }

    // --- Experience Level Changer (Desktop) ---
    const experienceLevels = document.querySelectorAll('.experience-level');
    const experienceImages = document.querySelectorAll('.experience-ipad-screen img');

    // Initialize GSAP animations for experience levels
    // Note: The original had a timeline here that might cause issues if not paused/managed correctly.
    // For simplicity, we'll ensure the images are shown/hidden with CSS classes and direct opacity changes.
    // The previous GSAP timeline setup for images might be overkill for simple opacity toggles.
    // We'll proceed with the direct opacity/class change as in your original click listener.

    experienceLevels.forEach((level, index) => {
        level.addEventListener('click', () => {
            const targetLevel = level.dataset.level;

            // Update active class for levels
            experienceLevels.forEach(l => l.classList.remove('active'));
            level.classList.add('active');

            // Animate the image transition
            gsap.to(experienceImages, {
                opacity: 0,
                duration: 0.3,
                ease: "power1.inOut",
                onComplete: () => {
                    // Hide all images first
                    experienceImages.forEach(img => img.classList.remove('active'));

                    // Show the target image
                    const targetImage = document.querySelector(`.experience-ipad-screen img[data-level="${targetLevel}"]`);
                    if (targetImage) {
                        targetImage.classList.add('active');
                        gsap.to(targetImage, {
                            opacity: 1,
                            duration: 0.3,
                            ease: "power1.inOut"
                        });
                    }
                }
            });
        });
    });

    // --- Experience Slider (Mobile) ---
    if (window.innerWidth <= 768) {
        const slider = document.querySelector('.experience-slides');
        const slides = document.querySelectorAll('.experience-slide');
        const dots = document.querySelectorAll('.slider-dot');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');

        let currentSlide = 0;
        const slideCount = slides.length;

        function goToSlide(index) {
            if (index < 0) index = slideCount - 1;
            if (index >= slideCount) index = 0;

            currentSlide = index;
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });

            // Update active image in mobile slider
            slides.forEach((slide, i) => {
                const ipadScreen = slide.querySelector('.experience-ipad-screen');
                const imagesInSlide = ipadScreen ? ipadScreen.querySelectorAll('img') : [];
                imagesInSlide.forEach(img => img.classList.remove('active')); // Hide all in this slide
                if (i === currentSlide && imagesInSlide.length > 0) {
                    imagesInSlide[0].classList.add('active'); // Show first image in active slide
                }
            });
        }

        // Dot navigation
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.dataset.slide);
                goToSlide(slideIndex);
            });
        });

        // Button navigation
        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

        // Initialize mobile slider images
        slides.forEach((slide, i) => {
            const ipadScreen = slide.querySelector('.experience-ipad-screen');
            const imagesInSlide = ipadScreen ? ipadScreen.querySelectorAll('img') : [];
            imagesInSlide.forEach(img => img.classList.remove('active'));
            if (i === 0 && imagesInSlide.length > 0) { // Only the first slide's image should be active initially
                imagesInSlide[0].classList.add('active');
            }
        });
        goToSlide(0); // Ensure initial state is correct for slider
    }

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.counter-stat');

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        let start = 0;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;

        const updateCount = () => {
            start += increment;
            if (start < target) {
                counter.innerText = Math.ceil(start).toLocaleString();
                setTimeout(updateCount, stepTime);
            } else {
                if (target >= 1000000) {
                     counter.innerText = (target/1000000).toLocaleString() + 'M';
                } else if (target >= 1000) {
                     counter.innerText = (target/1000).toLocaleString() + 'k';
                } else {
                    counter.innerText = target.toLocaleString();
                }
            }
        };
        updateCount();
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                   animateCounter(counter);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const benefitsSection = document.querySelector('#benefits-section');
    if (benefitsSection) {
        observer.observe(benefitsSection);
    }

    // --- Sticky Sidebar Active State on Scroll ---
    const sections = document.querySelectorAll('.content-section, #learning-workflow-wrapper > div[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav-item a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');

                        // On mobile, scroll the active link into view
                        if (window.innerWidth <= 768) {
                            link.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest',
                                inline: 'center'
                            });
                        }
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -60% 0px' });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Button Ripple Effect ---
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            // Position the ripple
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;

            // Add and remove ripple
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// This listener will call the initialization function once the HTML is loaded
// and the custom 'clariusHtmlLoaded' event is dispatched.
window.addEventListener('clariusHtmlLoaded', initializeClariusPageScripts);
