/* ═══════════════════════════════════════════════════════════════
   YASAS BANDARA — Portfolio Script
   Physics & Mathematics Background Engine v3.0
═══════════════════════════════════════════════════════════════ */

/* ── CURSOR ── */
const co = document.getElementById('cur-o'), ci = document.getElementById('cur-i');
let mx = 0, my = 0, ox = 0, oy = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  ci.style.left = mx + 'px'; ci.style.top = my + 'px';
});
function aC() {
  ox += (mx - ox) * .1; oy += (my - oy) * .1;
  co.style.left = ox + 'px'; co.style.top = oy + 'px';
  requestAnimationFrame(aC);
}
aC();
document.querySelectorAll('a,button,.obj-card,.comp-card,.proj-card,.cert-item,.int-card,.social-link,.edu-card,.skill-box').forEach(el => {
  el.addEventListener('mouseenter', () => { co.style.width = '50px'; co.style.height = '50px'; });
  el.addEventListener('mouseleave', () => { co.style.width = '32px'; co.style.height = '32px'; });
});

/* ── MOBILE NAV ── */
function toggleMenu() {
  document.getElementById('ham').classList.toggle('open');
  document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  document.getElementById('ham').classList.remove('open');
  document.getElementById('navLinks').classList.remove('open');
}));

/* ── REVEAL ON SCROLL ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ── SKILL BARS ── */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => { bar.style.width = bar.dataset.w + '%'; });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: .2 });
document.querySelectorAll('.skills-grid').forEach(el => skillObs.observe(el));

/* ── YEAR ── */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ── CONTACT TOGGLE ── */
function toggleContact() {
  const p = document.getElementById('contactPopup');
  p.style.display = p.style.display === 'block' ? 'none' : 'block';
}
document.getElementById('contactBtn').addEventListener('click', toggleContact);

/* ── BACK TO TOP ── */
const btt = document.getElementById('backTop');
window.addEventListener('scroll', () => { btt.style.display = window.scrollY > 400 ? 'flex' : 'none'; });

/* touch fallback */
window.addEventListener('touchstart', () => { co.style.display = 'none'; ci.style.display = 'none'; }, { once: true });

/* ── BIRTHDAY POPUP ── */
(function () {
  const d = new Date(), m = d.getMonth(), dt = d.getDate(), y = d.getFullYear();
  if (m === 2 && dt === 5 && !localStorage.getItem('bday-' + y)) {
    const age = y - 2005;
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:99999;font-family:Rajdhani,sans-serif;';
    ov.innerHTML = `<div style="background:rgba(5,8,12,0.97);border:1px solid rgba(81,232,255,0.35);border-radius:4px;padding:40px;text-align:center;color:#fff;max-width:400px;width:90%;animation:popIn .8s ease">
      <div style="font-size:2rem;margin-bottom:10px">🎉</div>
      <h2 style="font-family:Orbitron,monospace;color:#51e8ff;letter-spacing:2px;margin-bottom:12px;font-size:1.1rem">HAPPY ${age}TH BIRTHDAY YASAS!</h2>
      <p style="color:rgba(255,255,255,0.6);margin-bottom:24px;line-height:1.7">Wishing you another year of growth, success &amp; awesome code 🚀</p>
      <button onclick="this.closest('div').parentElement.remove();localStorage.setItem('bday-${y}',1)"
        style="font-family:Orbitron,monospace;font-size:.7rem;letter-spacing:2px;background:#51e8ff;color:#000;border:none;border-radius:2px;padding:12px 24px;cursor:pointer">THANK YOU ❤️</button>
    </div>`;
    document.body.appendChild(ov);
  }
})();


/* ═══════════════════════════════════════════════════════════════
   PHYSICS & MATHEMATICS BACKGROUND ENGINE
═══════════════════════════════════════════════════════════════ */

const bc = document.getElementById('bgCanvas');
const ctx = bc.getContext('2d');
let W, H;

function resize() {
  W = bc.width = window.innerWidth;
  H = bc.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const CYAN = 'rgba(81,232,255,';
const PURPLE = 'rgba(160,90,255,';
const GREEN = 'rgba(57,255,120,';
const GOLD = 'rgba(255,215,80,';

let t = 0; // global time counter

/* ─────────────────────────────────────────────
   1. PHYSICS PARTICLES — gravity wells & orbits
───────────────────────────────────────────── */
const WELLS = [
  { x: 0.2, y: 0.35, mass: 60 },
  { x: 0.8, y: 0.65, mass: 50 },
  { x: 0.5, y: 0.5, mass: 30 }
];

class PhysicsParticle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - .5) * 1.2;
    this.vy = (Math.random() - .5) * 1.2;
    this.life = Math.random() * 300 + 200;
    this.age = 0;
    this.r = Math.random() * 1.2 + 0.4;
    this.trail = [];
  }
  update() {
    // Gravity wells
    WELLS.forEach(w => {
      const dx = w.x * W - this.x, dy = w.y * H - this.y;
      const dist2 = dx * dx + dy * dy;
      const dist = Math.sqrt(dist2);
      if (dist < 8) { this.reset(); return; }
      const force = w.mass / (dist2 + 200);
      this.vx += dx / dist * force * 0.015;
      this.vy += dy / dist * force * 0.015;
    });

    // Drag
    this.vx *= 0.998;
    this.vy *= 0.998;

    // Speed cap
    const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (spd > 2.5) { this.vx = this.vx / spd * 2.5; this.vy = this.vy / spd * 2.5; }

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 18) this.trail.shift();

    this.x += this.vx; this.y += this.vy;
    this.age++;

    // Wrap
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;

    if (this.age > this.life) this.reset();
  }
  draw() {
    const alpha = Math.min(1, (this.life - this.age) / 80) * 0.55;
    if (this.trail.length > 2) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) ctx.lineTo(this.trail[i].x, this.trail[i].y);
      ctx.strokeStyle = CYAN + alpha * 0.4 + ')';
      ctx.lineWidth = this.r * 0.7;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = CYAN + alpha + ')';
    ctx.fill();
  }
}

const physParts = Array.from({ length: 70 }, () => new PhysicsParticle());

/* ─────────────────────────────────────────────
   2. ORBITING ELECTRONS around nucleus points
───────────────────────────────────────────── */
const NUCLEI = [
  { x: 0.15, y: 0.2, electrons: 3, color: CYAN },
  { x: 0.85, y: 0.78, electrons: 4, color: PURPLE },
  { x: 0.5, y: 0.85, electrons: 2, color: GREEN },
];

function drawNuclei() {
  NUCLEI.forEach(n => {
    const cx = n.x * W, cy = n.y * H;
    // Nucleus glow
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 12);
    grd.addColorStop(0, n.color + '0.5)');
    grd.addColorStop(1, n.color + '0)');
    ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fillStyle = grd; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = n.color + '0.8)'; ctx.fill();

    // Orbits & electrons
    for (let e = 0; e < n.electrons; e++) {
      const orbitR = 22 + e * 16;
      const tilt = (e * Math.PI) / n.electrons;
      const speed = 0.008 + e * 0.003;
      const angle = t * speed + (e * Math.PI * 2 / n.electrons);

      // Elliptical orbit ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);
      ctx.beginPath();
      ctx.ellipse(0, 0, orbitR, orbitR * 0.4, 0, 0, Math.PI * 2);
      ctx.strokeStyle = n.color + '0.12)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();

      // Electron position on ellipse
      const ex = cx + Math.cos(angle) * orbitR;
      const ey = cy + Math.sin(angle) * orbitR * 0.4;

      ctx.beginPath(); ctx.arc(ex, ey, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = n.color + '0.9)'; ctx.fill();

      // Electron glow
      const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 6);
      eg.addColorStop(0, n.color + '0.4)');
      eg.addColorStop(1, n.color + '0)');
      ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI * 2);
      ctx.fillStyle = eg; ctx.fill();
    }
  });
}

/* ─────────────────────────────────────────────
   3. FLOATING MATH & PHYSICS EQUATIONS
───────────────────────────────────────────── */
const EQUATIONS = [
  'E = mc²', 'F = ma', '∇·E = ρ/ε₀', 'i² = −1',
  'e^(iπ) + 1 = 0', 'Δx·Δp ≥ ℏ/2', 'H|ψ⟩ = E|ψ⟩',
  '∮ B·dA = 0', 'ds² = −c²dt²+dx²', '∫e^x dx = e^x + C',
  'P(A|B) = P(B|A)P(A)/P(B)', 'SHA-256(m)', 'RSA: m^e mod n',
  '∂ψ/∂t = iℏ∇²ψ', 'f(x) = sin(x)/x', 'det(A) = Σ sgn(σ)∏aᵢσ(ᵢ)',
  'AES-256', 'XOR cipher', '0x51E8FF', '01010011 01000101 01000011',
  'lim→∞ (1+1/n)^n = e', '∑n = n(n+1)/2', 'φ=(1+√5)/2',
];

class FloatingEq {
  constructor() { this.init(); }
  init() {
    this.text = EQUATIONS[Math.floor(Math.random() * EQUATIONS.length)];
    this.x = Math.random() * W;
    this.y = H + 30;
    this.targetY = Math.random() * H * 0.85;
    this.vy = -(Math.random() * 0.15 + 0.05);
    this.opacity = 0;
    this.maxOpacity = Math.random() * 0.13 + 0.04;
    this.size = Math.floor(Math.random() * 5 + 9);
    this.drift = (Math.random() - .5) * 0.2;
    this.phase = Math.random() * Math.PI * 2;
    this.life = Math.random() * 400 + 300;
    this.age = 0;
    this.color = [CYAN, PURPLE, GREEN, GOLD][Math.floor(Math.random() * 4)];
  }
  update() {
    this.y += this.vy;
    this.x += Math.sin(t * 0.01 + this.phase) * this.drift;
    this.age++;
    // Fade in/out
    if (this.age < 60) this.opacity = (this.age / 60) * this.maxOpacity;
    else if (this.age > this.life - 60) this.opacity = ((this.life - this.age) / 60) * this.maxOpacity;
    else this.opacity = this.maxOpacity;
    if (this.y < -30 || this.age > this.life) this.init();
  }
  draw() {
    ctx.font = `${this.size}px 'Share Tech Mono', monospace`;
    ctx.fillStyle = this.color + this.opacity + ')';
    ctx.fillText(this.text, this.x, this.y);
  }
}

const equations = Array.from({ length: 22 }, () => {
  const eq = new FloatingEq();
  eq.y = Math.random() * H; // start scattered
  eq.age = Math.random() * eq.life;
  return eq;
});

/* ─────────────────────────────────────────────
   4. LISSAJOUS CURVES (animated, fading)
───────────────────────────────────────────── */
class LissajousCurve {
  constructor() { this.reset(); }
  reset() {
    this.cx = Math.random() * W;
    this.cy = Math.random() * H;
    this.a = Math.floor(Math.random() * 3 + 1);
    this.b = Math.floor(Math.random() * 3 + 1);
    this.delta = Math.random() * Math.PI;
    this.rx = Math.random() * 45 + 20;
    this.ry = Math.random() * 45 + 20;
    this.opacity = 0;
    this.maxOpacity = Math.random() * 0.09 + 0.03;
    this.life = Math.random() * 500 + 400;
    this.age = 0;
    this.color = [CYAN, PURPLE, GREEN][Math.floor(Math.random() * 3)];
  }
  update() {
    this.age++;
    if (this.age < 80) this.opacity = (this.age / 80) * this.maxOpacity;
    else if (this.age > this.life - 80) this.opacity = ((this.life - this.age) / 80) * this.maxOpacity;
    else this.opacity = this.maxOpacity;
    if (this.age > this.life) this.reset();
  }
  draw() {
    ctx.beginPath();
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      const x = this.cx + this.rx * Math.sin(this.a * theta + this.delta + t * 0.002);
      const y = this.cy + this.ry * Math.sin(this.b * theta + t * 0.001);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = this.color + this.opacity + ')';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
}

const lissajous = Array.from({ length: 6 }, () => {
  const l = new LissajousCurve();
  l.age = Math.random() * l.life;
  return l;
});

/* ─────────────────────────────────────────────
   5. SINE / WAVE SWEEPERS
───────────────────────────────────────────── */
const WAVES = [
  { freq: 0.012, amp: 28, speed: 0.4, y: 0.25, color: CYAN, op: 0.07 },
  { freq: 0.008, amp: 18, speed: 0.25, y: 0.5, color: PURPLE, op: 0.05 },
  { freq: 0.015, amp: 22, speed: 0.55, y: 0.75, color: GREEN, op: 0.045 },
  { freq: 0.009, amp: 35, speed: 0.3, y: 0.15, color: GOLD, op: 0.04 },
];

function drawWaves() {
  WAVES.forEach(w => {
    const baseY = w.y * H;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 2) {
      const y = baseY + Math.sin(x * w.freq + t * w.speed * 0.05) * w.amp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = w.color + w.op + ')';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}

/* ─────────────────────────────────────────────
   6. BINARY / HEX FALLING RAIN (sparse)
───────────────────────────────────────────── */
const RAIN_COLS = Math.floor(W / 28);
const rainDrops = Array.from({ length: RAIN_COLS }, () => Math.random() * H / 14);
const rainChars = '01ABCDEFxor+−∫∑∏∇λψφΔ';

function drawRain() {
  ctx.font = '12px Share Tech Mono, monospace';
  for (let i = 0; i < rainDrops.length; i++) {
    const ch = rainChars[Math.floor(Math.random() * rainChars.length)];
    const x = i * 28;
    const y = rainDrops[i] * 14;
    ctx.fillStyle = CYAN + (Math.random() * 0.06 + 0.02) + ')';
    ctx.fillText(ch, x, y);
    if (y > H && Math.random() > 0.975) rainDrops[i] = 0;
    rainDrops[i] += 0.12;
  }
}

/* ─────────────────────────────────────────────
   7. GRID — perspective / hex dots
───────────────────────────────────────────── */
function drawGrid() {
  const spacing = 55;
  const pulse = Math.sin(t * 0.018) * 0.5 + 0.5;
  ctx.fillStyle = CYAN + (0.025 + pulse * 0.015) + ')';
  for (let x = 0; x < W; x += spacing) {
    for (let y = 0; y < H; y += spacing) {
      const wobX = x + Math.sin((y * 0.04) + t * 0.012) * 3;
      const wobY = y + Math.cos((x * 0.04) + t * 0.009) * 3;
      const distMouse = Math.sqrt((wobX - mx) ** 2 + (wobY - my) ** 2);
      const influence = Math.max(0, 1 - distMouse / 160);
      const r = 1 + influence * 3;
      ctx.beginPath();
      ctx.arc(wobX, wobY, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/* ─────────────────────────────────────────────
   8. PENDULUM WAVE VISUALIZER
───────────────────────────────────────────── */
const PENDULUMS = 12;
const pendAnchorX = W * 0.5;
const pendAnchorY = -30;

function drawPendulumWave() {
  const anchorX = W * 0.5;
  for (let i = 0; i < PENDULUMS; i++) {
    const L = 80 + i * 14;
    const freq = 1 / (2 * Math.PI * Math.sqrt(L / 980));
    const angle = 0.38 * Math.sin(freq * t * 0.06 + i * 0.1);
    const px = anchorX + Math.sin(angle) * L;
    const py = pendAnchorY + Math.cos(angle) * L;

    // String
    ctx.beginPath();
    ctx.moveTo(anchorX, pendAnchorY);
    ctx.lineTo(px, py);
    ctx.strokeStyle = CYAN + '0.04)';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // Bob
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fillStyle = CYAN + '0.2)';
    ctx.fill();
  }
}

/* ─────────────────────────────────────────────
   9. GRAVITY WELL VISUALIZERS (field lines)
───────────────────────────────────────────── */
function drawGravityFields() {
  WELLS.forEach((w, wi) => {
    const cx = w.x * W, cy = w.y * H;
    const rings = 4;
    for (let r = 0; r < rings; r++) {
      const radius = (r + 1) * 30 + Math.sin(t * 0.02 + wi) * 8;
      const alpha = (rings - r) / rings * 0.06;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = CYAN + alpha + ')';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    // Cross-hair
    const s = 10;
    ctx.strokeStyle = CYAN + '0.12)';
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(cx - s, cy); ctx.lineTo(cx + s, cy);
    ctx.moveTo(cx, cy - s); ctx.lineTo(cx, cy + s);
    ctx.stroke();
  });
}

/* ─────────────────────────────────────────────
   10. FOURIER CIRCLES (epic epicycles)
───────────────────────────────────────────── */
const fourierCx = W * 0.88, fourierCy = H * 0.35;
const FOURIER_TERMS = [
  { amp: 28, freq: 1, phase: 0 },
  { amp: 9.3, freq: 3, phase: 0 },
  { amp: 5.6, freq: 5, phase: 0 },
  { amp: 4, freq: 7, phase: 0 },
];
let fourierPath = [];

function drawFourier() {
  let x = fourierCx, y = fourierCy;
  const baseAngle = t * 0.022;

  FOURIER_TERMS.forEach((term, i) => {
    const angle = term.freq * baseAngle + term.phase;
    const nx = x + term.amp * Math.cos(angle);
    const ny = y + term.amp * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, term.amp, 0, Math.PI * 2);
    ctx.strokeStyle = PURPLE + (0.08 - i * 0.015) + ')';
    ctx.lineWidth = 0.7;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(nx, ny);
    ctx.strokeStyle = CYAN + '0.2)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    x = nx; y = ny;
  });

  fourierPath.push({ x, y });
  if (fourierPath.length > 200) fourierPath.shift();

  if (fourierPath.length > 2) {
    ctx.beginPath();
    ctx.moveTo(fourierPath[0].x, fourierPath[0].y);
    for (let i = 1; i < fourierPath.length; i++) ctx.lineTo(fourierPath[i].x, fourierPath[i].y);
    ctx.strokeStyle = CYAN + '0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

/* ─────────────────────────────────────────────
   11. PARTICLE CONNECTIONS (original style, enhanced)
───────────────────────────────────────────── */
function drawConnections() {
  physParts.forEach((p, i) => {
    physParts.slice(i + 1, i + 6).forEach(p2 => {
      const dx = p.x - p2.x, dy = p.y - p2.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 90) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = CYAN + (1 - d / 90) * 0.04 + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  });
}

/* ─────────────────────────────────────────────
   12. MOUSE REPULSOR — particles glow near mouse
───────────────────────────────────────────── */
function drawMouseHalo() {
  const r = 80;
  const grd = ctx.createRadialGradient(mx, my, 0, mx, my, r);
  grd.addColorStop(0, CYAN + '0.04)');
  grd.addColorStop(1, CYAN + '0)');
  ctx.beginPath();
  ctx.arc(mx, my, r, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();
}

/* ─────────────────────────────────────────────
   MASTER RENDER LOOP
───────────────────────────────────────────── */
function render() {
  ctx.clearRect(0, 0, W, H);

  // Layer order (back → front)
  drawGrid();
  drawRain();
  drawWaves();
  drawGravityFields();
  drawNuclei();
  drawPendulumWave();

  lissajous.forEach(l => { l.update(); l.draw(); });

  physParts.forEach(p => p.update());
  drawConnections();
  physParts.forEach(p => p.draw());

  equations.forEach(eq => { eq.update(); eq.draw(); });

  drawFourier();
  drawMouseHalo();

  t++;
  requestAnimationFrame(render);
}

// Stagger eq start times
equations.forEach((eq, i) => { eq.age = i * 22; });

render();
