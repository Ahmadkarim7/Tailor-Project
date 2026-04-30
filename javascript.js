//Service section
const track = document.getElementById("servicesTrack");
    const leftBtn = document.getElementById("scrollLeftBtn");
    const rightBtn = document.getElementById("scrollRightBtn");

    function getScrollAmount() {
      const card = track.querySelector(".service-slide");
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return card.offsetWidth + gap;
    }

    function updateArrows() {
      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      leftBtn.disabled = track.scrollLeft <= 5;
      rightBtn.disabled = track.scrollLeft >= maxScrollLeft - 5;
    }

    leftBtn.addEventListener("click", () => {
      track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    });

    track.addEventListener("scroll", updateArrows);
    window.addEventListener("load", updateArrows);
    window.addEventListener("resize", updateArrows);

    //Review Section
    document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".review-flip-card");

    cards.forEach((card) => {
      card.addEventListener("click", function (e) {
        if (e.target.closest("a")) return;
        this.classList.toggle("is-flipped");
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.classList.toggle("is-flipped");
        }
      });
    });
  });

 ///Form validation
 document.addEventListener("DOMContentLoaded", function () {
  const bookingForm = document.getElementById("bookingForm");
  const preferredDate = document.getElementById("preferredDate");
  const bookingSuccessAlert = document.getElementById("bookingSuccessAlert");
  const bookingFormFields = document.getElementById("bookingFormFields");
  const bookingModal = document.getElementById("bookingModal");
  const phoneInput = document.getElementById("phoneNumber");

  // Phone number formatting - auto-format as user types
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // Remove all non-digits
    
    // Limit to 10 digits
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    
    // Format as (XXX) XXX-XXXX
    let formattedValue = "";
    if (value.length > 0) {
      formattedValue = "(" + value.substring(0, 3);
    }
    if (value.length >= 4) {
      formattedValue += ") " + value.substring(3, 6);
    }
    if (value.length >= 7) {
      formattedValue += "-" + value.substring(6, 10);
    }
    
    e.target.value = formattedValue;
    
    // Clear custom validity when user types
    e.target.setCustomValidity("");
    
    // Update validation classes based on digit count
    const digitCount = value.length;
    if (digitCount === 10) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    } else if (digitCount > 0) {
      e.target.classList.remove("is-valid");
      if (bookingForm.classList.contains("was-validated")) {
        e.target.classList.add("is-invalid");
      }
    } else {
      e.target.classList.remove("is-valid", "is-invalid");
    }
  });

  // Set min date to today
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const minDate = `${year}-${month}-${day}`;
  preferredDate.min = minDate;

  bookingForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    bookingForm.classList.add("was-validated");

    // Custom phone validation - check for exactly 10 digits
    const phoneValue = phoneInput.value.replace(/\D/g, "");
    if (phoneValue.length !== 10) {
      phoneInput.setCustomValidity("Please enter a valid 10-digit US phone number.");
      phoneInput.classList.add("is-invalid");
      phoneInput.classList.remove("is-valid");
      return;
    } else {
      phoneInput.setCustomValidity("");
      phoneInput.classList.remove("is-invalid");
      phoneInput.classList.add("is-valid");
    }

    if (!bookingForm.checkValidity()) {
      bookingFormFields.classList.remove("d-none");
      bookingSuccessAlert.classList.add("d-none");
      return;
    }

    // Show loading state immediately to prevent perceived delay
    const submitBtn = document.querySelector('button[form="bookingForm"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';

    const bookingData = {
      full_name: document.getElementById("fullName").value.trim(),
      phone: document.getElementById("phoneNumber").value.replace(/\D/g, ""), // Extract digits only
      email: document.getElementById("emailAddress").value.trim(),
      service_type: document.getElementById("service").value,
      appointment_date: document.getElementById("preferredDate").value,
      appointment_time: document.getElementById("preferredTime").value.trim() + ":00",
      notes: document.getElementById("additionalNotes").value.trim()
    };

    try {
      console.log("SENDING DATA:", bookingData);

      const response = await fetch("http://localhost:4000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      bookingSuccessAlert.classList.remove("d-none", "alert-success", "alert-danger");

      if (response.ok) {
        bookingSuccessAlert.classList.add("alert-success");
        bookingSuccessAlert.textContent =
          data.message || "Appointment request received. We'll confirm within 24 hours.";

        bookingFormFields.classList.add("d-none");
        bookingForm.reset();
        bookingForm.classList.remove("was-validated");
        preferredDate.min = minDate;
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        
        // Modal will stay open - user must close it manually
      } else {
        bookingSuccessAlert.classList.add("alert-danger");
        bookingSuccessAlert.textContent =
          data.message || "Booking failed. Please try again.";

        bookingFormFields.classList.remove("d-none");
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    } catch (error) {
      console.error("Booking error:", error);

      bookingSuccessAlert.classList.remove("d-none", "alert-success");
      bookingSuccessAlert.classList.add("alert-danger");
      bookingSuccessAlert.textContent =
        "Something went wrong. Please try again later.";

      bookingFormFields.classList.remove("d-none");
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });

  bookingModal.addEventListener("hidden.bs.modal", function () {
    bookingForm.reset();
    bookingForm.classList.remove("was-validated");
    bookingFormFields.classList.remove("d-none");
    bookingSuccessAlert.classList.add("d-none");
    bookingSuccessAlert.classList.remove("alert-success", "alert-danger");
    preferredDate.min = minDate;
  });
});

// ===== SCROLL ANIMATIONS =====

// Navbar scroll effect
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.custom-navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Scroll-triggered animations
document.addEventListener('DOMContentLoaded', function() {
  // Elements to animate on scroll
  const animatedElements = [
    { selector: '.featured-services-section .section-title', animation: 'fade-in-up' },
    { selector: '.featured-services-section .services-carousel-wrap', animation: 'fade-in-up', delay: 0.2 },
    { selector: '.price-list-section .price-card', animation: 'fade-in-up' },
    { selector: '.reviews-section .reviews-title', animation: 'fade-in' },
    { selector: '.reviews-section .reviews-subtitle', animation: 'fade-in', delay: 0.1 },
    { selector: '.faq-section .faq-title', animation: 'fade-in-up' },
    { selector: '.faq-section .faq-subtitle', animation: 'fade-in-up', delay: 0.1 },
    { selector: '.faq-section .accordion', animation: 'fade-in-up', delay: 0.2 },
    { selector: '.tailor-footer', animation: 'fade-in' }
  ];

  // Add animation classes to elements
  animatedElements.forEach(item => {
    const elements = document.querySelectorAll(item.selector);
    elements.forEach(element => {
      element.classList.add('animate-on-scroll', item.animation);
      if (item.delay) {
        element.style.transitionDelay = `${item.delay}s`;
      }
    });
  });

  // Staggered animation for review cards
  const reviewCards = document.querySelectorAll('.review-flip-card');
  reviewCards.forEach((card, index) => {
    card.classList.add('animate-on-scroll', 'fade-in-up');
    card.style.transitionDelay = `${index * 0.1}s`;
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible');
        // Optional: stop observing after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just a "#" or modal trigger
      if (href === '#' || this.hasAttribute('data-bs-toggle')) {
        return;
      }
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const navbarHeight = document.querySelector('.custom-navbar').offsetHeight;
        const topBarHeight = document.querySelector('.top-bar')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - navbarHeight - topBarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});