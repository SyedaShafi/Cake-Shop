let btn = document.getElementById('toggleBtn');
let navbar = document.getElementById('navToggle');
btn.addEventListener('click', () => {
  navbar.classList.toggle('hidden');
});

var loader = document.getElementById('preloader');

window.addEventListener('load', function () {
  loader.style.display = 'none';
  var mainContent = document.getElementById('main-content');
  mainContent.classList.remove('hidden');
});
