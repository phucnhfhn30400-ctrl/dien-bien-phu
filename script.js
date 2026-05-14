const LABELS = ["Bìa", "Trang 1", "Trang 2", "Trang 3", "Trang 4", "Trang 5", "Trang 6", "Trang 7", "Trang 8", "Trang 9", "Trang 10", "Trang 11", "Trang 12", "Trang 13", "Trang 14", "Kết"];
const IMGS = Array.from({length: 16}, (_, i) => `img/${i+1}.png`);

let current = 0;
let isAnimating = false;
const book = document.getElementById('book');
const audio = document.getElementById('bgMusic');
const audioToggle = document.getElementById('audioToggle');
const musicContainer = document.getElementById('musicContainer');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');

// Initialize Book Pages
function initBook() {
  IMGS.forEach((src, idx) => {
    const page = document.createElement('div');
    page.className = `page ${idx === 0 ? 'active' : ''}`;
    page.style.zIndex = IMGS.length - idx;
    
    page.innerHTML = `
      <div class="page-face front">
        <img src="${src}" alt="${LABELS[idx]}">
      </div>
      <div class="page-face back"></div>
    `;
    book.appendChild(page);
  });
  
  // Create dots
  const dotsNav = document.getElementById('dotsNav');
  IMGS.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `dot ${idx === 0 ? 'active' : ''}`;
    dot.onclick = () => goToPage(idx);
    dotsNav.appendChild(dot);
  });
  
  updateUI();
}

function updateUI() {
  // Update text
  document.getElementById('currPage').textContent = current + 1;
  document.getElementById('totalIdx').textContent = IMGS.length;

  // Update Buttons
  document.getElementById('prevBtn').disabled = current === 0;
  document.getElementById('nextBtn').disabled = current === IMGS.length - 1;

  // Update Dots
  const dots = document.querySelectorAll('.dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === current));

  // Update Progress Ring
  const circle = document.getElementById('progressRing');
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((current + 1) / IMGS.length) * circumference;
  circle.style.strokeDashoffset = offset;
}

function flipPage(direction) {
  if (isAnimating) return;
  
  const pages = document.querySelectorAll('.page');
  
  if (direction === 1 && current < IMGS.length - 1) {
    isAnimating = true;
    const page = pages[current];
    page.classList.add('flipped');
    current++;
    setTimeout(() => { isAnimating = false; }, 800);
  } else if (direction === -1 && current > 0) {
    isAnimating = true;
    current--;
    const page = pages[current];
    page.classList.remove('flipped');
    setTimeout(() => { isAnimating = false; }, 800);
  }
  
  updateUI();
}

function goToPage(target) {
  if (isAnimating || target === current) return;
  isAnimating = true;
  
  const pages = document.querySelectorAll('.page');
  const diff = Math.abs(target - current);
  const delay = 100;
  
  if (target > current) {
    for (let i = current; i < target; i++) {
      setTimeout(() => { 
        pages[i].classList.add('flipped');
      }, (i - current) * delay);
    }
  } else {
    for (let i = current - 1; i >= target; i--) {
      setTimeout(() => { 
        pages[i].classList.remove('flipped');
      }, (current - 1 - i) * delay);
    }
  }
  
  current = target;
  setTimeout(() => { isAnimating = false; }, diff * delay + 800);
  updateUI();
}

// Audio Control
audioToggle.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    musicContainer.classList.add('playing');
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  } else {
    audio.pause();
    musicContainer.classList.remove('playing');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }
});

// Navigation
document.getElementById('nextBtn').addEventListener('click', () => flipPage(1));
document.getElementById('prevBtn').addEventListener('click', () => flipPage(-1));

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') flipPage(1);
  if (e.key === 'ArrowLeft') flipPage(-1);
});

// Custom Cursor
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
});

document.addEventListener('mousedown', () => cursor.style.transform += ' scale(0.8)');
document.addEventListener('mouseup', () => cursor.style.transform = cursor.style.transform.replace(' scale(0.8)', ''));

// Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loadProgress');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    bar.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(interval);
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 1000);
    }
  }, 50);
});

initBook();
