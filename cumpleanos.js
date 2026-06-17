/* =========================================================
   ¡Feliz Cumpleaños, Padrino! · cumpleanos.js
   Movimiento: navegación, confeti, carrusel y fuegos artificiales
   ========================================================= */

/* ---- Respaldo de imagen (si una foto no existe, queda el dibujo) ---- */
function respaldo(img){ img.style.display = "none"; }

/* =========================================================
   1) NAVEGACIÓN ENTRE SECCIONES (con movimiento)
   ========================================================= */
const pantallas = document.querySelectorAll(".pantalla");
const botones   = document.querySelectorAll(".nav-btn");

function irA(sec){
  pantallas.forEach(p => p.classList.remove("activa"));
  const destino = document.getElementById("sec-" + sec);
  if(destino) destino.classList.add("activa");

  botones.forEach(b => b.classList.toggle("activo", b.dataset.sec === sec));
  window.scrollTo({ top:0, behavior:"smooth" });
  document.getElementById("menu").classList.remove("abierto");

  if(sec === "felicitacion"){ iniciarFuegos(); }
  else { detenerFuegos(); }
}

botones.forEach(b => b.addEventListener("click", () => irA(b.dataset.sec)));
document.querySelectorAll("[data-ir]").forEach(f =>
  f.addEventListener("click", () => irA(f.dataset.ir)));
document.getElementById("hamburguesa").addEventListener("click", () =>
  document.getElementById("menu").classList.toggle("abierto"));

/* =========================================================
   2) CONFETI GLOBAL (movimiento continuo)
   ========================================================= */
const cCanvas = document.getElementById("confeti");
const cCtx = cCanvas.getContext("2d");
let confetis = [];
const COLORES = ["#f2b417","#ffd24a","#ffffff","#e0231a","#222222"];

function tamConfeti(){ cCanvas.width = innerWidth; cCanvas.height = innerHeight; }
tamConfeti(); addEventListener("resize", tamConfeti);

function crearConfeti(n){
  for(let i=0;i<n;i++){
    confetis.push({
      x:Math.random()*cCanvas.width,
      y:Math.random()*-cCanvas.height,
      s:4+Math.random()*6,
      vel:1+Math.random()*2.5,
      ang:Math.random()*Math.PI*2,
      giro:(Math.random()-.5)*0.2,
      color:COLORES[Math.floor(Math.random()*COLORES.length)]
    });
  }
}
crearConfeti(120);

function animarConfeti(){
  cCtx.clearRect(0,0,cCanvas.width,cCanvas.height);
  confetis.forEach(c=>{
    c.y += c.vel;
    c.ang += c.giro;
    c.x += Math.sin(c.ang)*0.8;
    if(c.y > cCanvas.height + 20){ c.y = -20; c.x = Math.random()*cCanvas.width; }
    cCtx.save();
    cCtx.translate(c.x,c.y);
    cCtx.rotate(c.ang);
    cCtx.fillStyle = c.color;
    cCtx.fillRect(-c.s/2,-c.s/2,c.s,c.s*0.6);
    cCtx.restore();
  });
  requestAnimationFrame(animarConfeti);
}
animarConfeti();

/* =========================================================
   3) CARRUSEL DE MOMENTOS (desplazamiento con scroll real)
   ========================================================= */
const pista = document.getElementById("carPista");
if(pista){
  const tarjetas = pista.querySelectorAll(".momento");
  function paso(){
    const t = tarjetas[0];
    if(!t) return 280;
    const gap = parseFloat(getComputedStyle(pista).columnGap) || 18;
    return t.getBoundingClientRect().width + gap;
  }
  document.getElementById("carNext").addEventListener("click", ()=>{
    pista.scrollBy({ left: paso(), behavior:"smooth" });
  });
  document.getElementById("carPrev").addEventListener("click", ()=>{
    pista.scrollBy({ left: -paso(), behavior:"smooth" });
  });
}

/* =========================================================
   4) FUEGOS ARTIFICIALES (sección de felicitación)
   ========================================================= */
const fCanvas = document.getElementById("fuegos");
const fCtx = fCanvas.getContext("2d");
let particulas = [];
let fuegosActivo = false;
let lanzador = null;

function tamFuegos(){
  const sec = document.getElementById("sec-felicitacion");
  fCanvas.width = sec.offsetWidth;
  fCanvas.height = sec.offsetHeight;
}

function explotar(x, y){
  const n = 60 + Math.floor(Math.random()*40);
  const tono = COLORES[Math.floor(Math.random()*3)]; // dorados / blanco
  for(let i=0;i<n;i++){
    const ang = (Math.PI*2*i)/n;
    const vel = 2 + Math.random()*4;
    particulas.push({
      x, y,
      vx:Math.cos(ang)*vel,
      vy:Math.sin(ang)*vel,
      vida:60+Math.random()*30,
      edad:0,
      color: Math.random()<0.5 ? tono : COLORES[Math.floor(Math.random()*COLORES.length)]
    });
  }
}

function animarFuegos(){
  if(!fuegosActivo) return;
  fCtx.clearRect(0,0,fCanvas.width,fCanvas.height);
  particulas.forEach(p=>{
    p.edad++;
    p.vx *= 0.985;
    p.vy = p.vy*0.985 + 0.05;  // gravedad
    p.x += p.vx;
    p.y += p.vy;
    const alpha = Math.max(0, 1 - p.edad/p.vida);
    fCtx.globalAlpha = alpha;
    fCtx.fillStyle = p.color;
    fCtx.beginPath();
    fCtx.arc(p.x, p.y, 2.4, 0, Math.PI*2);
    fCtx.fill();
  });
  fCtx.globalAlpha = 1;
  particulas = particulas.filter(p => p.edad < p.vida);
  requestAnimationFrame(animarFuegos);
}

function iniciarFuegos(){
  tamFuegos();
  if(fuegosActivo) return;
  fuegosActivo = true;
  animarFuegos();
  // lanzar automáticamente cada cierto tiempo
  lanzador = setInterval(()=>{
    explotar(Math.random()*fCanvas.width, fCanvas.height*(0.2+Math.random()*0.4));
  }, 800);
  // ráfaga inicial
  for(let i=0;i<3;i++) setTimeout(()=>explotar(Math.random()*fCanvas.width, fCanvas.height*0.3), i*250);
}
function detenerFuegos(){
  fuegosActivo = false;
  clearInterval(lanzador);
  particulas = [];
}

// Botón "Gracias por inspirarnos" -> ráfaga de fuegos
const btn = document.getElementById("btnFuegos");
if(btn) btn.addEventListener("click", ()=>{
  tamFuegos();
  if(!fuegosActivo) iniciarFuegos();
  for(let i=0;i<6;i++)
    setTimeout(()=>explotar(Math.random()*fCanvas.width, fCanvas.height*(0.2+Math.random()*0.4)), i*150);
});
addEventListener("resize", ()=>{ if(fuegosActivo) tamFuegos(); });
