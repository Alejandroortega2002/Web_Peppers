// Parallax effect

document.addEventListener('mousemove', e => {

  const x = (e.clientX / window.innerWidth - 0.5) * 8;
  const y = (e.clientY / window.innerHeight - 0.5) * 8;

  document.querySelector('.container').style.transform =
    `translate(${x}px,${y}px)`;

});
