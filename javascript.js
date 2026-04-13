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

  //Form Section
   document.addEventListener('DOMContentLoaded', function () {
    const bookingForm = document.getElementById('bookingForm');
    const preferredDate = document.getElementById('preferredDate');
    const bookingSuccessAlert = document.getElementById('bookingSuccessAlert');
    const bookingFormFields = document.getElementById('bookingFormFields');

    // Set min date to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    preferredDate.min = `${year}-${month}-${day}`;

    bookingForm.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (bookingForm.checkValidity()) {
        bookingForm.classList.add('was-validated');
        bookingFormFields.classList.add('d-none');
        bookingSuccessAlert.classList.remove('d-none');
      } else {
        bookingForm.classList.add('was-validated');
        bookingFormFields.classList.remove('d-none');
        bookingSuccessAlert.classList.add('d-none');
      }
    });

    // Optional reset when modal closes so form is fresh next time
    const bookingModal = document.getElementById('bookingModal');
    bookingModal.addEventListener('hidden.bs.modal', function () {
      bookingForm.reset();
      bookingForm.classList.remove('was-validated');
      bookingFormFields.classList.remove('d-none');
      bookingSuccessAlert.classList.add('d-none');
      preferredDate.min = `${year}-${month}-${day}`;
    });
  });