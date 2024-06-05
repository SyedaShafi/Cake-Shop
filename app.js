let btn = document.getElementById('toggleBtn');
let navbar = document.getElementById('navToggle');
btn.addEventListener('click', () => {
  navbar.classList.toggle('hidden');
});

