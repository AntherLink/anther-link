const form = document.getElementById('waitlist-form');

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const response = await fetch('https://formspree.io/f/xdaqwwjy', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new FormData(form)
  });

  const data = await response.json();

  if (response.ok) {
    alert("Thanks! We'll be in touch.");
    form.reset();
  } else {
    console.error('Formspree error:', data);
    alert("Something went wrong — try again?");
  }
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}