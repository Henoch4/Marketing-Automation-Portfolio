/* FormSubmit — no account signup required, sends straight to your inbox.
   IMPORTANT: your very first submission triggers a one-time confirmation
   email from FormSubmit — click the link in it once, and every submission
   after that lands in your inbox automatically. */
const FORMSUBMIT_EMAIL = 'okumagbeenoch4@gmail.com';

const progressBar = document.getElementById('scroll-progress');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
  progressBar.style.transform = `scaleX(${scrolled})`;
}

const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const sections = [...navLinks].map(a => document.getElementById(a.dataset.section)).filter(Boolean);
function updateActiveNav(){
  let current = null;
  const scrollPos = window.scrollY + 140;
  sections.forEach(sec => { if (sec.offsetTop <= scrollPos) current = sec.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === current));
}

const statEls = document.querySelectorAll('.stat-val[data-count]');
function animateCount(el){
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  let start = null;
  function step(ts){
    if(!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if(progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ animateCount(e.target); statObs.unobserve(e.target); } });
}, { threshold: 0.6 });
statEls.forEach(el => statObs.observe(el));

const reveals = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); revObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(el => revObs.observe(el));

const canvasJobs = [];
let masterT = 0;

const clayCanvas = document.getElementById('clayCanvas');
if(clayCanvas){
  const cc = clayCanvas.getContext('2d');
  let W = 0, H = 0;
  function sizeClay(){
    const rect = clayCanvas.parentElement.getBoundingClientRect();
    W = clayCanvas.width = rect.width;
    H = clayCanvas.height = rect.height;
  }
  sizeClay();
  new ResizeObserver(sizeClay).observe(clayCanvas.parentElement);

  const shapes = [
    {x:.15,y:.15,r:34,color:'52,211,153',phase:0},
    {x:.85,y:.20,r:24,color:'251,146,60',phase:1},
    {x:.88,y:.82,r:30,color:'52,211,153',phase:2},
    {x:.12,y:.86,r:20,color:'52,211,153',phase:3},
    {x:.48,y:.08,r:15,color:'251,146,60',phase:4},
    {x:.08,y:.48,r:17,color:'52,211,153',phase:5},
  ];
  function drawClayShape(x,y,r,colorRgb,t){
    const wobble = Math.sin(t*.8)*3;
    const pts=6, rad=r+wobble;
    cc.beginPath();
    for(let i=0;i<=pts;i++){
      const a=(i/pts)*Math.PI*2;
      const nr = rad + (Math.sin(a*2+t)*.15 + Math.cos(a*3+t*.7)*.1)*rad;
      const px = x+Math.cos(a)*nr, py = y+Math.sin(a)*nr;
      if(i===0) cc.moveTo(px,py); else cc.lineTo(px,py);
    }
    cc.closePath();
    const gr = cc.createRadialGradient(x-r*.3,y-r*.3,r*.1,x,y,r+wobble);
    gr.addColorStop(0, `rgba(${colorRgb},0.95)`);
    gr.addColorStop(.6, `rgba(${colorRgb},0.65)`);
    gr.addColorStop(1, `rgba(${colorRgb},0.15)`);
    cc.fillStyle = gr;
    cc.fill();
  }
  canvasJobs.push(function(t){
    if(!W || !H) return;
    cc.clearRect(0,0,W,H);
    shapes.forEach(s=>{
      const cx = s.x*W + Math.sin(t*.4+s.phase)*10;
      const cy = s.y*H + Math.cos(t*.35+s.phase*.7)*10;
      drawClayShape(cx,cy,s.r,s.color,t+s.phase);
    });
  });
}

document.querySelectorAll('.sc-canvas').forEach(canvas=>{
  const ctx = canvas.getContext('2d');
  let W=0,H=0;
  function size(){
    const rect = canvas.getBoundingClientRect();
    W = canvas.width = rect.width;
    H = canvas.height = rect.height || 76;
  }
  size();
  new ResizeObserver(size).observe(canvas);

  const N=14;
  const particles = Array.from({length:N},()=>({
    x:Math.random(), y:Math.random(),
    r:Math.random()*3.5+1.8,
    vx:0, vy:0,
    phase:Math.random()*Math.PI*2,
    alpha:Math.random()*.5+.25,
  }));

  canvasJobs.push(function(t){
    if(!W || !H) return;
    ctx.clearRect(0,0,W,H);
    const ax1=.3+Math.cos(t)*.2, ay1=.5+Math.sin(t*.7)*.35;
    const ax2=.7+Math.cos(t*.8+1)*.15, ay2=.5+Math.sin(t+2)*.3;
    particles.forEach(p=>{
      const useAx = p.phase<Math.PI ? ax1 : ax2;
      const useAy = p.phase<Math.PI ? ay1 : ay2;
      const dx=(useAx-p.x)*W, dy=(useAy-p.y)*H;
      const dist=Math.sqrt(dx*dx+dy*dy)||1;
      const force=Math.min(0.0006,0.012/dist);
      p.vx += dx*force; p.vy += dy*force;
      p.vx*=0.94; p.vy*=0.94;
      p.x += p.vx/W; p.y += p.vy/H;
      if(p.x<0)p.x=1; if(p.x>1)p.x=0;
      if(p.y<0)p.y=1; if(p.y>1)p.y=0;
      const pulse = Math.sin(t*2+p.phase)*.2+.8;
      ctx.beginPath();
      ctx.arc(p.x*W, p.y*H, p.r*pulse, 0, Math.PI*2);
      ctx.fillStyle = `rgba(52,211,153,${p.alpha*pulse})`;
      ctx.fill();
    });
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=(particles[i].x-particles[j].x)*W;
        const dy=(particles[i].y-particles[j].y)*H;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<44){
          ctx.beginPath();
          ctx.moveTo(particles[i].x*W, particles[i].y*H);
          ctx.lineTo(particles[j].x*W, particles[j].y*H);
          ctx.strokeStyle = `rgba(52,211,153,${(1-d/44)*.15})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    }
  });
});

function masterTick(ts){
  masterT += 0.016;
  updateProgress();
  updateActiveNav();
  canvasJobs.forEach(job => job(masterT));
  requestAnimationFrame(masterTick);
}
requestAnimationFrame(masterTick);

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if(t) t.scrollIntoView({ behavior:'smooth' });
  });
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
contactForm.addEventListener('submit', async function(e){
  e.preventDefault();
  const btn = this.querySelector('.form-submit');
  const originalText = btn.textContent;

  btn.textContent = 'Sending...'; btn.disabled = true;
  const data = new FormData(this);
  const payload = Object.fromEntries(data.entries());
  try{
    const res = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', Accept:'application/json' },
      body: JSON.stringify(payload)
    });

    let bodyText = '';
    try{ bodyText = (await res.clone().text()).toLowerCase(); } catch{}
    const looksLikeActivationPending = bodyText.includes('activat') || bodyText.includes('confirm');

    if(res.ok){
      btn.textContent = 'Message Sent ✓';
      this.reset();
    } else if(looksLikeActivationPending){
      btn.textContent = 'Almost — check email for a one-time activation link ↗';
    } else {
      btn.textContent = 'Something went wrong — email me directly';
    }
  } catch{
    btn.textContent = 'First time only: check email for a FormSubmit activation link ↗';
  } finally {
    setTimeout(()=>{ btn.textContent = originalText; btn.disabled = false; }, 6000);
  }
});
}
