document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const book = document.getElementById('book');
  const page1 = document.getElementById('page1');
  const page2 = document.getElementById('page2');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageIndicator = document.getElementById('pageIndicator');
  const celebrateBtn = document.getElementById('celebrateBtn');
  const resetBookBtn = document.getElementById('resetBookBtn');

  // Input Fields
  const teacherInput = document.getElementById('teacherInput');
  const subjectInput = document.getElementById('subjectInput');
  const studentInput = document.getElementById('studentInput');
  const messageInput = document.getElementById('messageInput');

  // Display Elements
  const displayTeacherCover = document.getElementById('displayTeacherCover');
  const displaySubjectCover = document.getElementById('displaySubjectCover');
  const displaySubjectInside = document.getElementById('displaySubjectInside');
  const displayTeacherLetter = document.getElementById('displayTeacherLetter');
  const displayMessage = document.getElementById('displayMessage');
  const displayStudent = document.getElementById('displayStudent');

  // State Variable: 0 = Closed Cover, 1 = Opened Page (Left/Right), 2 = Closed Back Cover
  let currentPage = 0;

  // --- Real-Time Customization Handlers ---
  teacherInput.addEventListener('input', (e) => {
    const val = e.target.value || "[Teacher's Name]";
    displayTeacherCover.textContent = val;
    displayTeacherLetter.textContent = val;
  });

  subjectInput.addEventListener('input', (e) => {
    const val = e.target.value || "[Subject]";
    displaySubjectCover.textContent = val;
    displaySubjectInside.textContent = val;
  });

  studentInput.addEventListener('input', (e) => {
    displayStudent.textContent = e.target.value || "[Your Name]";
  });

  messageInput.addEventListener('input', (e) => {
    displayMessage.textContent = e.target.value || "Your message will appear here...";
  });

  // --- 3D Book Page Flip Navigation ---
  function updateBookState() {
    if (currentPage === 0) {
      // Cover View
      page1.classList.remove('page-flipped');
      page2.classList.remove('page-flipped');
      book.style.transform = 'translateX(0%)';
      
      prevBtn.disabled = true;
      nextBtn.disabled = false;
      pageIndicator.textContent = 'Cover';
    } else if (currentPage === 1) {
      // Inside Open View
      page1.classList.add('page-flipped');
      page2.classList.remove('page-flipped');
      book.style.transform = 'translateX(25%)';
      
      prevBtn.disabled = false;
      nextBtn.disabled = false;
      pageIndicator.textContent = 'Page 1 & 2';
    } else if (currentPage === 2) {
      // Back Cover View
      page1.classList.add('page-flipped');
      page2.classList.add('page-flipped');
      book.style.transform = 'translateX(50%)';
      
      prevBtn.disabled = false;
      nextBtn.disabled = true;
      pageIndicator.textContent = 'Back Cover';
    }
  }

  function nextPage() {
    if (currentPage < 2) {
      currentPage++;
      updateBookState();
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      updateBookState();
    }
  }

  // Event Listeners for Navigation
  nextBtn.addEventListener('click', nextPage);
  prevBtn.addEventListener('click', prevPage);

  page1.addEventListener('click', (e) => {
    if (currentPage === 0) nextPage();
    else if (currentPage === 1) prevPage();
  });

  page2.addEventListener('click', (e) => {
    if (currentPage === 1) nextPage();
    else if (currentPage === 2) prevPage();
  });

  resetBookBtn.addEventListener('click', () => {
    currentPage = 0;
    updateBookState();
  });

  // Keyboard Arrow Controls
  document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
  });

  // --- Background Particle Canvas ---
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 20;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.color = `hsla(${Math.random() * 60 + 35}, 100%, 70%, ${this.opacity})`;
    }

    update() {
      this.y -= this.speedY;
      if (this.y < -10) this.reset();
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 40; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // --- Confetti Effect on Celebrate Button ---
  celebrateBtn.addEventListener('click', () => {
    createConfettiBurst();
    if (currentPage === 0) {
      nextPage();
    }
  });

  function createConfettiBurst() {
    const confettiCount = 60;
    const colors = ['#f59e0b', '#3b82f6', '#ec4899', '#10b981', '#8b5cf6'];

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = '50%';
      confetti.style.top = '50%';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '2px';
      confetti.style.zIndex = '1000';
      confetti.style.pointerEvents = 'none';

      document.body.appendChild(confetti);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 300 + 100;
      const x = Math.cos(angle) * velocity;
      const y = Math.sin(angle) * velocity;

      confetti.animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${x}px, ${y + 150}px) scale(0)`, opacity: 0 }
        ],
        {
          duration: 1200 + Math.random() * 600,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        }
      ).onfinish = () => confetti.remove();
    }
  }
});