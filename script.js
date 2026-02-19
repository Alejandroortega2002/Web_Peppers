// Parallax effect

document.addEventListener('mousemove', e => {

  const x = (e.clientX / window.innerWidth - 0.5) * 8;
  const y = (e.clientY / window.innerHeight - 0.5) * 8;

  document.querySelector('.container').style.transform =
    `translate(${x}px,${y}px)`;

});


// Form animation

const form = document.getElementById("contactForm");

form.addEventListener("submit", e => {

  e.preventDefault();

  const btn = form.querySelector("button");
  const old = btn.innerText;

  btn.innerText = "Enviando...";
  btn.disabled = true;

  setTimeout(()=>{

    btn.innerText = "Enviado ✓";
    btn.style.background = "#3cff9b";

    setTimeout(()=>{

      btn.innerText = old;
      btn.disabled = false;
      btn.style.background = "";

      form.reset();

    },2000);

  },1500);

});
