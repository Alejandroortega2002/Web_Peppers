// PARALLAX

const container = document.querySelector('.container');

document.addEventListener('mousemove', e => {

  if(!container) return;

  const x = (e.clientX / window.innerWidth - 0.5) * 8;
  const y = (e.clientY / window.innerHeight - 0.5) * 8;

  container.style.transform = `translate(${x}px,${y}px)`;
});


// PAGE TRANSITIONS

document.addEventListener('DOMContentLoaded', () => {

  const body = document.body;


  /* ==========================
     ANIMACIÓN DE ENTRADA
  =========================== */

  // Si viene de "volver"
  if(sessionStorage.getItem('backTransition')){

    body.classList.add('page-enter-left');
    sessionStorage.removeItem('backTransition');

  } else {

    // Entrada normal
    body.classList.add('page-enter');
  }


  requestAnimationFrame(() => {
    body.classList.remove('page-enter','page-enter-left');
  });


  /* ==========================
     LINKS
  =========================== */

  document.querySelectorAll('a').forEach(link => {

    const url = link.getAttribute('href');

    if(!url) return;


    /* ----- BOTÓN VOLVER ----- */

    if(link.classList.contains('back-btn')){

      link.addEventListener('click', e => {

        e.preventDefault();

        sessionStorage.setItem('backTransition','true');

        body.classList.add('page-exit-right');

        setTimeout(() => {
          window.location.href = url;
        }, 150);

      });

      return;
    }


    /* ----- LINKS NORMALES ----- */

    if(
      !url.startsWith('http') &&
      !url.startsWith('mailto:')
    ){

      link.addEventListener('click', e => {

        e.preventDefault();

        body.classList.add('page-exit');

        setTimeout(() => {
          window.location.href = url;
        }, 150);

      });

    }

  });

});


// CONTACT FORM (EMAILJS)

const form = document.getElementById('contact-form');

if(form){

  form.addEventListener('submit', function(e){

    e.preventDefault();

    const status = document.querySelector('.form-status');

    status.textContent = "Enviando...";

    emailjs.sendForm(
      "TU_SERVICE_ID",
      "TU_TEMPLATE_ID",
      this
    )
    .then(() => {

      status.textContent = "Mensaje enviado ✅";
      form.reset();

    })
    .catch(() => {

      status.textContent = "Error al enviar ❌";

    });

  });

}