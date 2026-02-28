// PARALLAX

const container = document.querySelector('.container');

document.addEventListener('mousemove', e => {

  if (!container) return;

  const x = (e.clientX / window.innerWidth - 0.5) * 8;
  const y = (e.clientY / window.innerHeight - 0.5) * 8;

  container.style.transform = `translate(${x}px,${y}px)`;
});


// PAGE TRANSITIONS

document.addEventListener('DOMContentLoaded', () => {

  const body = document.body;

  /* ==========================
     PRELOADER INTERACTIVO (CANVAS)
  =========================== */
  const preloader = document.getElementById('preloader');
  const canvas = document.getElementById('preloader-canvas');

  // Si la clase skip-preloader está presente, el preloader se habrá ocultado por CSS instantáneamente
  if (!document.documentElement.classList.contains('skip-preloader') && document.getElementById('preloader-canvas')) {

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let w, h;

    const resizeReset = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    resizeReset();
    window.addEventListener('resize', resizeReset);

    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = h + Math.random() * 200; // Empiezan por debajo de la pantalla
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 1.5;
        // Color Pepper --orange dominante #ff4b1f
        this.color = `rgba(255, ${Math.floor(Math.random() * 80) + 40}, 31, ${Math.random() * 0.5 + 0.1})`;
        this.life = true;
      }
      update() {
        this.y -= this.speedY; // Suben
        this.x += this.speedX;
        if (this.size > 0.1) this.size -= 0.015; // Se encogen
        if (this.y < 0 || this.size <= 0.2) {
          this.life = false;
        }
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, w, h);

      if (particlesArray.length < 150) {
        particlesArray.push(new Particle());
      }

      particlesArray = particlesArray.filter(p => {
        p.update();
        p.draw();
        return p.life;
      });

      // Continuar animación mientras el preloader sea visible
      if (!preloader.classList.contains('fade-out')) {
        requestAnimationFrame(animateParticles);
      }
    };

    animateParticles();

    // Ocultar preloader a los 2.8s (y terminar fade out 1s después aprox durando en torno a 3s la exp total)
    const hidePreloader = () => {
      if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
          // Guardamos en sesión que ya lo ha visto
          sessionStorage.setItem('preloaderShown', 'true');
        }, 1000); // 1000ms fadeOut CSS transition
      }
    };

    setTimeout(hidePreloader, 2800);
  }

  /* ==========================
     ANIMACIÓN DE ENTRADA
  =========================== */

  // Si viene de "volver"
  if (sessionStorage.getItem('backTransition')) {

    body.classList.add('page-enter-left');
    sessionStorage.removeItem('backTransition');

  } else {

    // Entrada normal
    body.classList.add('page-enter');
  }


  requestAnimationFrame(() => {
    body.classList.remove('page-enter', 'page-enter-left');
  });


  /* ==========================
     LINKS
  =========================== */

  document.querySelectorAll('a').forEach(link => {

    const url = link.getAttribute('href');

    if (!url) return;


    /* ----- BOTÓN VOLVER ----- */

    if (link.classList.contains('back-btn')) {

      link.addEventListener('click', e => {

        e.preventDefault();

        sessionStorage.setItem('backTransition', 'true');

        body.classList.add('page-exit-right');

        setTimeout(() => {
          window.location.href = url;
        }, 100);

      });

      return;
    }


    /* ----- LINKS NORMALES ----- */

    if (
      !url.startsWith('http') &&
      !url.startsWith('mailto:')
    ) {

      link.addEventListener('click', e => {

        e.preventDefault();

        body.classList.add('page-exit');

        setTimeout(() => {
          window.location.href = url;
        }, 100);

      });

    }

  });

});


// CONTACT FORM (EMAILJS)

const form = document.getElementById('contact-form');

if (form) {

  form.addEventListener('submit', function (e) {

    e.preventDefault();

    // Validar visualmente primero marcando la clase form
    form.classList.add('submitted');

    // Validación HTML5 del browser
    if (!form.checkValidity()) {
      return; // Detiene la acción porque hay errores de HTML5
    }

    // Comprobación de Honeypot Anti-spam
    const honey = document.getElementById('honey').value;
    if (honey !== "") {
      console.warn("Spam detectado y bloqueado.");
      return;
    }

    const status = document.querySelector('.form-status');
    const submitBtn = document.getElementById('submit-btn');

    status.textContent = "Enviando...";
    status.className = "form-status"; // Reset status classes

    // Deshabilitar botón para envíos dobles
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
    submitBtn.style.cursor = "not-allowed";

    emailjs.sendForm(
      "service_hai08t9",
      "template_leykc3e",
      this,
      {
        publicKey: "iZZFtl1_SIXVJNqBQ"
      }
    )
      .then(() => {

        status.textContent = "Mensaje enviado con éxito ✅";
        status.classList.add("status-success");

        form.reset();
        form.classList.remove('submitted');
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.style.cursor = "pointer";

      })
      .catch((error) => {

        console.error("Error EmailJS:", error);

        status.textContent = "Error al enviar el mensaje. Inténtalo más tarde ❌";
        status.classList.add("status-error");

        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.style.cursor = "pointer";

      });

  });

}