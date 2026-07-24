/**
 * ==========================================================
 * KV SecureTech Innovations
 * Main JavaScript
 * Version: 1.1
 * ==========================================================
 */

"use strict";

/* ==========================================================
   Utility Functions
========================================================== */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

/* ==========================================================
   Loading State
========================================================== */

window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

/* ==========================================================
   Sticky Header
========================================================== */

const header = $(".site-header");

if (header) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

/* ==========================================================
   Mobile Navigation
========================================================== */

const navToggle = $(".nav-toggle");
const navMenu = $(".nav-links");

if (navToggle && navMenu) {

    navToggle.addEventListener("click", () => {

        navToggle.classList.toggle("active");
        navMenu.classList.toggle("active");

        const expanded =
            navToggle.getAttribute("aria-expanded") === "true";

        navToggle.setAttribute("aria-expanded", !expanded);

    });

    $$(".nav-links a").forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");
            navToggle.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");

        });

    });

}

/* ==========================================================
   Active Navigation Highlight
========================================================== */

const currentPage = location.pathname.split("/").pop();

$$(".nav-links a").forEach(link => {

    const href = link.getAttribute("href");

    if (
        href === currentPage ||
        (href === "index.html" && currentPage === "")
    ) {
        link.classList.add("active");
    }

});

/* ==========================================================
   Smooth Scroll
========================================================== */

$$('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const target = $(this.getAttribute("href"));

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});

/* ==========================================================
   Reveal on Scroll
========================================================== */

const revealElements = $$(".reveal");

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => observer.observe(el));

} else {

    revealElements.forEach(el => el.classList.add("visible"));

}

/* ==========================================================
   Counter Animation
   (Add elements with class="counter" data-target="123" to
   activate — none are present in the markup yet.)
========================================================== */

const counters = $$(".counter");

const animateCounter = counter => {

    const target = +counter.dataset.target;
    const duration = 1500;

    let current = 0;

    const increment = target / (duration / 16);

    const update = () => {

        current += increment;

        if (current < target) {

            counter.textContent = Math.floor(current);

            requestAnimationFrame(update);

        } else {

            counter.textContent = target;

        }

    };

    update();

};

if (counters.length) {

    const counterObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.4
    });

    counters.forEach(counter => counterObserver.observe(counter));

}

/* ==========================================================
   Contact Form Validation
========================================================== */

const form = $("#contactForm");

if (form) {

    form.addEventListener("submit", e => {

        e.preventDefault();

        const name = $("#name");
        const email = $("#email");
        const message = $("#message");

        if (
            !name.value.trim() ||
            !email.value.trim() ||
            !message.value.trim()
        ) {

            alert("Please complete all required fields.");
            return;

        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.value)) {

            alert("Please enter a valid email address.");
            email.focus();
            return;

        }

        alert(
            "Thank you! Your message has been received. We will contact you shortly."
        );

        form.reset();

    });

}

/* ==========================================================
   Back To Top Button
========================================================== */

const backToTop = $("#backToTop");

if (backToTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    });

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

/* ==========================================================
   Current Year
========================================================== */

const year = $("#year");

if (year) {

    year.textContent = new Date().getFullYear();

}

/* ==========================================================
   Reduce Motion Support
========================================================== */

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)");

if (prefersReducedMotion.matches) {

    document.documentElement.classList.add("reduced-motion");

}

/* ==========================================================
   Keyboard Accessibility
========================================================== */

document.addEventListener("keyup", e => {

    if (e.key === "Escape") {

        if (navMenu) navMenu.classList.remove("active");

        if (navToggle) {

            navToggle.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");

        }

    }

});

/* ==========================================================
   Console Message
========================================================== */

console.log(
    "%cKV SecureTech Innovations",
    "color:#0057B8;font-size:18px;font-weight:bold;"
);

console.log(
    "Website developed with HTML5, CSS3 & Vanilla JavaScript."
);
