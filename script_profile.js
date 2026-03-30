/* ── CURSOR ── */
const co=document.getElementById('cur-o'), ci=document.getElementById('cur-i');
let mx=0,my=0,ox=0,oy=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  ci.style.left=mx+'px'; ci.style.top=my+'px';
});
function aC(){
  ox+=(mx-ox)*.1; oy+=(my-oy)*.1;
  co.style.left=ox+'px'; co.style.top=oy+'px';
  requestAnimationFrame(aC);
}
aC();

document.querySelectorAll('a,button,.obj-card,.comp-card,.proj-card,.cert-item,.int-card,.social-link,.edu-card,.skill-box').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ co.style.width='50px'; co.style.height='50px'; });
  el.addEventListener('mouseleave',()=>{ co.style.width='32px'; co.style.height='32px'; });
});

/* ── BG CANVAS ── */
const bc=document.getElementById('bgCanvas');
const bctx=bc.getContext('2d');
function resizeBC(){ bc.width=window.innerWidth; bc.height=window.innerHeight; }
resizeBC(); window.addEventListener('resize',resizeBC);

const pts=Array.from({length:50},()=>({
  x:Math.random()*bc.width, y:Math.random()*bc.height,
  vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25,
  r:Math.random()*1.2+.4, op:Math.random()*.3+.05
}));

function drawBG(){
  bctx.clearRect(0,0,bc.width,bc.height);
  pts.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0)p.x=bc.width; if(p.x>bc.width)p.x=0;
    if(p.y<0)p.y=bc.height; if(p.y>bc.height)p.y=0;
    bctx.beginPath(); bctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    bctx.fillStyle=`rgba(81,232,255,${p.op})`; bctx.fill();
    pts.forEach(p2=>{
      const dx=p.x-p2.x,dy=p.y-p2.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<100){
        bctx.beginPath(); bctx.moveTo(p.x,p.y); bctx.lineTo(p2.x,p2.y);
        bctx.strokeStyle=`rgba(81,232,255,${(1-d/100)*0.04})`; bctx.stroke();
      }
    });
  });
  requestAnimationFrame(drawBG);
}
drawBG();

/* ── MOBILE NAV ── */
function toggleMenu(){
  document.getElementById('ham').classList.toggle('open');
  document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{
  document.getElementById('ham').classList.remove('open');
  document.getElementById('navLinks').classList.remove('open');
}));

/* ── REVEAL ON SCROLL ── */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

/* ── SKILL BARS ── */
const skillObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.skill-fill').forEach(bar=>{
        bar.style.width=bar.dataset.w+'%';
      });
      skillObs.unobserve(e.target);
    }
  });
},{threshold:.2});
document.querySelectorAll('.skills-grid').forEach(el=>skillObs.observe(el));

/* ── YEAR ── */
document.getElementById('yr').textContent=new Date().getFullYear();

/* ── CONTACT TOGGLE ── */
function toggleContact(){
  const p=document.getElementById('contactPopup');
  p.style.display=p.style.display==='block'?'none':'block';
}
document.getElementById('contactBtn').addEventListener('click',toggleContact);

/* ── BACK TO TOP ── */
const btt=document.getElementById('backTop');
window.addEventListener('scroll',()=>{
  btt.style.display=window.scrollY>400?'flex':'none';
});

/* ── BIRTHDAY POPUP ── */
(function(){
  const d=new Date(), m=d.getMonth(), dt=d.getDate(), y=d.getFullYear();
  if(m===2 && dt===5 && !localStorage.getItem('bday-'+y)){
    const age=y-2005;
    const ov=document.createElement('div');
    ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:99999;font-family:Rajdhani,sans-serif;';
    ov.innerHTML=`<div style="background:rgba(5,8,12,0.97);border:1px solid rgba(81,232,255,0.35);border-radius:4px;padding:40px;text-align:center;color:#fff;max-width:400px;width:90%;animation:popIn .8s ease">
      <div style="font-size:2rem;margin-bottom:10px">🎉</div>
      <h2 style="font-family:Orbitron,monospace;color:#51e8ff;letter-spacing:2px;margin-bottom:12px;font-size:1.1rem">HAPPY ${age}TH BIRTHDAY YASAS!</h2>
      <p style="color:rgba(255,255,255,0.6);margin-bottom:24px;line-height:1.7">Wishing you another year of growth, success &amp; awesome code 🚀</p>
      <button onclick="this.closest('div').parentElement.remove();localStorage.setItem('bday-${y}',1)"
        style="font-family:Orbitron,monospace;font-size:.7rem;letter-spacing:2px;background:#51e8ff;color:#000;border:none;border-radius:2px;padding:12px 24px;cursor:pointer">THANK YOU ❤️</button>
    </div>`;
    document.body.appendChild(ov);
  }
})();

/* touch fallback */
window.addEventListener('touchstart',()=>{ co.style.display='none'; ci.style.display='none'; },{once:true});