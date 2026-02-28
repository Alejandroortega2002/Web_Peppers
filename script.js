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
     PRELOADER
  =========================== */
  const preloader = document.getElementById('preloader');
  const mainVideo = document.getElementById('main-bg-video');

  // Si la clase skip-preloader está presente, el preloader se habrá ocultado por CSS instantáneamente
  // por lo que salimos de la lógica y no hacemos nada más.
  if (!document.documentElement.classList.contains('skip-preloader')) {

    // Ocultar preloader cuando el video de fondo puede reproducirse o tras un tiempo de seguridad.
    const hidePreloader = () => {
      if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
          // Guardamos en sesión que ya lo ha visto
          sessionStorage.setItem('preloaderShown', 'true');
        }, 800); // 800ms fadeOut CSS transition
      }
    };

    // Esperar 5 segundos fijos para dar tiempo a la carga de la página
    setTimeout(hidePreloader, 5000);
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
      "TU_SERVICE_ID",
      "TU_TEMPLATE_ID",
      this
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
      .catch(() => {

        status.textContent = "Error al enviar el mensaje. Inténtalo más tarde ❌";
        status.classList.add("status-error");

        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.style.cursor = "pointer";

      });

  });

}