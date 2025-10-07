// script.js - Bright Wash interactivity + EmailJS integration
document.addEventListener('DOMContentLoaded', function () {

  // 🟢 Set year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // 🟢 Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // 🟢 Book buttons scroll to booking form
  const bookNow = document.getElementById('bookNow');
  const ctaBook = document.getElementById('cta-book');
  [bookNow, ctaBook].forEach(btn => {
    if (btn) btn.addEventListener('click', () =>
      document.querySelector('#book').scrollIntoView({ behavior: 'smooth' })
    );
  });

  // 🟢 Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  menuToggle && menuToggle.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
  });

  // 🟢 Booking form logic
  const form = document.getElementById('bookingForm');
  const msg = document.getElementById('formMsg');
  const clearBtn = document.getElementById('clearForm');

  function validatePhone(p) {
    return /^\d{10}$/.test(p.trim());
  }

  // ✅ Initialize EmailJS once page loaded
  emailjs.init("mnDWveJBmtWQFUj6f"); // <-- your public key

  // 🟢 Handle form submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.textContent = '';

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const date = document.getElementById('date').value;
    const items = document.getElementById('items').value.trim();

    // Validation
    if (!name || !address || !date) {
      msg.textContent = 'Kripya name, address aur pickup date zaroor bharein.';
      msg.style.color = 'crimson';
      return;
    }
    if (!validatePhone(phone)) {
      msg.textContent = 'Invalid phone number. 10 digits dijiye.';
      msg.style.color = 'crimson';
      return;
    }
    const pickup = new Date(date);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (pickup < today) {
      msg.textContent = 'Pickup date aaj ya future ki honi chahiye.';
      msg.style.color = 'crimson';
      return;
    }

    // 🟢 Send email via EmailJS
    const params = { name, phone, address, date, items };

    emailjs.send("service_44fe9jr", "template_l3vbxmv", params)
      .then(function (response) {
        alert("Email sent successfully!");
        msg.textContent = 'Pickup booked successfully! Hum aapse jaldi contact karenge.';
        msg.style.color = 'green';
        form.reset();
        console.log("SUCCESS", response.status, response.text);
      })
      .catch(function (error) {
        alert("Error sending email. Please try again.");
        msg.textContent = 'Email bhejne mein dikkat hui.';
        msg.style.color = 'crimson';
        console.error("FAILED", error);
      });

    // 🟢 Optionally save locally
    const booking = { name, phone, address, date, items, created: new Date().toISOString() };
    let bookings = [];
    try { bookings = JSON.parse(localStorage.getItem('ff_bookings') || '[]'); } catch (_) { }
    bookings.push(booking);
    localStorage.setItem('ff_bookings', JSON.stringify(bookings));
  });

  // 🟢 Clear form
  clearBtn && clearBtn.addEventListener('click', function () {
    form.reset();
    msg.textContent = '';
  });
});
