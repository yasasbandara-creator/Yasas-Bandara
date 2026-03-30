/* ── CURSOR ── */
const outer = document.getElementById('cursor-outer');
const inner = document.getElementById('cursor-inner');
const cross = document.getElementById('cursor-crosshair');
let mx=0, my=0, ox=0, oy=0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  inner.style.left = mx+'px'; inner.style.top = my+'px';
  cross.style.left = mx+'px'; cross.style.top = my+'px';
});
function animateCursor() {
  ox += (mx - ox) * 0.12;
  oy += (my - oy) * 0.12;
  outer.style.left = ox+'px'; outer.style.top = oy+'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('button, a').forEach(el => {
  el.addEventListener('mouseenter', () => {
    outer.style.width='56px'; outer.style.height='56px';
    outer.style.borderColor='rgba(81,232,255,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    outer.style.width='36px'; outer.style.height='36px';
    outer.style.borderColor='var(--cyan)';
  });
});

/* ── LIVE TIME ── */
function updateTime() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');
  document.getElementById('liveTime').textContent = h+':'+m+':'+s;
}
setInterval(updateTime, 1000); updateTime();

/* ── TYPING EFFECT ── */
const phrases = [
  'ETHICAL HACKER IN TRAINING',
  'MATHEMATICS',
  'PHYSICS EXPLORER',
  'NETWORK DEFENDER',
  'PROBLEM SOLVER',
];
let pi=0, ci=0, deleting=false;
function type() {
  const txt = phrases[pi];
  const el  = document.getElementById('typeTarget');
  if (!deleting) {
    el.textContent = txt.slice(0, ++ci);
    if (ci === txt.length) { deleting=true; setTimeout(type,2000); return; }
    setTimeout(type, 80);
  } else {
    el.textContent = txt.slice(0, --ci);
    if (ci === 0) { deleting=false; pi=(pi+1)%phrases.length; setTimeout(type,500); return; }
    setTimeout(type, 40);
  }
}
type();

/* ── MATRIX RAIN ── */
const mc = document.getElementById('matrixCanvas');
const mctx = mc.getContext('2d');
function resizeMatrix() {
  mc.width  = window.innerWidth;
  mc.height = window.innerHeight;
}
resizeMatrix();
window.addEventListener('resize', resizeMatrix);

const chars = 'アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワン0123456789ABCDEF<>{}[]|\\/*!#@$%^&';
const cArr = chars.split('');
const fs = 13;
let cols = Math.floor(mc.width/fs);
let drops = Array(cols).fill(1);
const colOpacity = Array(cols).fill(0).map(()=>Math.random());

function drawMatrix() {
  mctx.fillStyle = 'rgba(0,0,0,0.05)';
  mctx.fillRect(0,0,mc.width,mc.height);
  for (let i=0;i<drops.length;i++) {
    const c = cArr[Math.floor(Math.random()*cArr.length)];
    const bright = Math.random() > 0.95;
    mctx.fillStyle = bright
      ? `rgba(255,255,255,${colOpacity[i]})`
      : `rgba(81,232,255,${colOpacity[i]*0.7})`;
    mctx.font = fs+'px monospace';
    mctx.fillText(c, i*fs, drops[i]*fs);
    if(drops[i]*fs > mc.height && Math.random()>.975) drops[i]=0;
    drops[i]++;
  }
}
setInterval(drawMatrix, 55);

/* ── PARTICLE FIELD ── */
const pc = document.getElementById('particleCanvas');
const pctx = pc.getContext('2d');
pc.width = window.innerWidth; pc.height = window.innerHeight;
window.addEventListener('resize',()=>{pc.width=window.innerWidth;pc.height=window.innerHeight;});

const particles = Array.from({length:60},()=>({
  x: Math.random()*pc.width, y: Math.random()*pc.height,
  vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
  r: Math.random()*1.5+.5,
  op: Math.random()*.5+.1
}));

function drawParticles() {
  pctx.clearRect(0,0,pc.width,pc.height);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0)p.x=pc.width; if(p.x>pc.width)p.x=0;
    if(p.y<0)p.y=pc.height; if(p.y>pc.height)p.y=0;
    pctx.beginPath();
    pctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    pctx.fillStyle=`rgba(81,232,255,${p.op})`;
    pctx.fill();

    // draw lines to nearby
    particles.forEach(p2=>{
      const dx=p.x-p2.x, dy=p.y-p2.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<120){
        pctx.beginPath();
        pctx.moveTo(p.x,p.y); pctx.lineTo(p2.x,p2.y);
        pctx.strokeStyle=`rgba(81,232,255,${(1-dist/120)*0.06})`;
        pctx.stroke();
      }
    });
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ── ENTER / LOADER ── */
function enterSite() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('progressFill');
  const pct    = document.getElementById('progressPct');
  const log    = document.getElementById('loaderLog');
  loader.style.display = 'flex';

  const msgs = [
    'Authenticating credentials...',
    'Establishing secure tunnel...',
    'Decrypting RSA-4096 keys...',
    'Bypassing firewall rules...',
    'Mapping network topology...',
    'Loading portfolio modules...',
  ];
  let p=0, mi=0;
  const iv = setInterval(()=>{
    p++;
    fill.style.width = p+'%';
    pct.textContent  = p+'%';
    if(p % 17 === 0 && mi < msgs.length) {
      log.textContent = msgs[mi++];
    }
    if(p>=100){
      clearInterval(iv);
      log.textContent='Access granted.';
      setTimeout(()=>{ window.location.href='Profile.html'; }, 600);
    }
  }, 22);
}

/* Touch support: show default cursor on touch */
window.addEventListener('touchstart', ()=>{
  outer.style.display='none';
  inner.style.display='none';
  cross.style.display='none';
});