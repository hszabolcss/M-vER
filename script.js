/* ============================================================
   MÁV – script.js  (auth + tickets + ui helpers)
   Route planner logic lives in routes.js
   ============================================================ */

const API = 'api/';
let currentUser = null;
let selectedProduct = null;

const products = [
  { id:1, type:'jegy',   name:'Budapest – Győr',      price:2450,  desc:'2. osztály, teljes árú menetjegy' },
  { id:2, type:'jegy',   name:'InterCity pótjegy',    price:950,   desc:'Helyjeggyel együtt érvényes' },
  { id:3, type:'jegy',   name:'Budapest – Pécs',      price:3200,  desc:'2. osztály, teljes árú menetjegy' },
  { id:4, type:'jegy',   name:'Budapest – Debrecen',  price:3650,  desc:'2. osztály, teljes árú menetjegy' },
  { id:5, type:'berlet', name:'Országbérlet',          price:18900, desc:'30 napos, minden MÁV vonatra' },
  { id:6, type:'berlet', name:'Pest Vármegyebérlet',  price:9450,  desc:'30 napos, vármegyei érvényességgel' },
  { id:7, type:'berlet', name:'Budapest Heti bérlet', price:4200,  desc:'7 napos, Bp. agglomeráció' },
];

/* ── SESSION ── */
async function checkSession() {
  try {
    const res  = await fetch(API+'session.php', {credentials:'same-origin'});
    const data = await res.json();
    if (data.loggedIn) { currentUser={nev:data.nev,email:data.email}; renderLoggedIn(); }
    else renderLoggedOut();
  } catch { renderLoggedOut(); }
}

function renderLoggedIn() {
  const e = id => document.getElementById(id);
  if(e('nav-username'))  { e('nav-username').textContent=currentUser.nev; e('nav-username').style.display='inline'; }
  if(e('login-trigger')) e('login-trigger').style.display='none';
  if(e('avatar-btn'))    { e('avatar-btn').textContent=currentUser.nev.charAt(0).toUpperCase(); e('avatar-btn').style.display='flex'; }
  if(e('drop-auth'))     e('drop-auth').style.display='none';
  if(e('drop-user'))     {
    e('drop-user').style.display='block';
    if(e('drop-username')) e('drop-username').textContent=currentUser.nev;
    if(e('drop-email'))    e('drop-email').textContent=currentUser.email;
  }
}

function renderLoggedOut() {
  const e = id => document.getElementById(id);
  if(e('nav-username'))  e('nav-username').style.display='none';
  if(e('login-trigger')) e('login-trigger').style.display='flex';
  if(e('avatar-btn'))    e('avatar-btn').style.display='none';
  if(e('drop-auth'))     e('drop-auth').style.display='block';
  if(e('drop-user'))     e('drop-user').style.display='none';
  currentUser = null;
}

/* ── AUTH ── */
async function doLogin() {
  const email  = (document.getElementById('login-email')?.value||'').trim();
  const jelszo = document.getElementById('login-pass')?.value||'';
  const msgEl  = document.getElementById('login-msg');
  clearMsg(msgEl);
  if(!email||!jelszo){showMsg(msgEl,'Töltsd ki az összes mezőt.','error');return;}
  try {
    const data = await postJSON('login.php',{email,jelszo});
    if(data.success){currentUser={nev:data.nev,email};renderLoggedIn();closeDropdown();}
    else showMsg(msgEl,data.message,'error');
  } catch { showMsg(msgEl,'Kapcsolódási hiba.','error'); }
}

async function doRegister() {
  const nev    = (document.getElementById('reg-nev')?.value||'').trim();
  const email  = (document.getElementById('reg-email')?.value||'').trim();
  const jelszo = document.getElementById('reg-pass')?.value||'';
  const msgEl  = document.getElementById('reg-msg');
  clearMsg(msgEl);
  if(!nev||!email||!jelszo){showMsg(msgEl,'Töltsd ki az összes mezőt.','error');return;}
  try {
    const data = await postJSON('register.php',{nev,email,jelszo});
    if(data.success){currentUser={nev:data.nev,email};renderLoggedIn();closeDropdown();}
    else showMsg(msgEl,data.message,'error');
  } catch { showMsg(msgEl,'Kapcsolódási hiba.','error'); }
}

async function doRegisterPage() {
  const nev    = (document.getElementById('reg-nev')?.value||'').trim();
  const email  = (document.getElementById('reg-email')?.value||'').trim();
  const jelszo = document.getElementById('reg-pass')?.value||'';
  const jelszo2= document.getElementById('reg-pass2')?.value||'';
  const terms  = document.getElementById('reg-terms')?.checked;
  const msgEl  = document.getElementById('reg-msg');
  const btn    = document.getElementById('reg-submit-btn');
  clearMsg(msgEl);
  if(!nev||!email||!jelszo){showMsg(msgEl,'Töltsd ki az összes mezőt.','error');return;}
  if(jelszo!==jelszo2){showMsg(msgEl,'A két jelszó nem egyezik.','error');return;}
  if(!terms){showMsg(msgEl,'El kell fogadnod az ÁSZF-et.','error');return;}
  if(btn){btn.disabled=true;btn.textContent='Feldolgozás...';}
  try {
    const data = await postJSON('register.php',{nev,email,jelszo});
    if(data.success){showMsg(msgEl,'Sikeres regisztráció! Átirányítás...','ok');setTimeout(()=>{window.location.href='jegyek.html';},1400);}
    else {showMsg(msgEl,data.message,'error');if(btn){btn.disabled=false;btn.textContent='Regisztráció';}}
  } catch {showMsg(msgEl,'Kapcsolódási hiba.','error');if(btn){btn.disabled=false;btn.textContent='Regisztráció';}}
}

async function doLogout() {
  try{await fetch(API+'logout.php',{credentials:'same-origin'});}catch{}
  renderLoggedOut(); closeDropdown();
  if(document.getElementById('selection-section')) showSection('selection-section');
}

async function postJSON(endpoint, body) {
  const res = await fetch(API+endpoint,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify(body)});
  return res.json();
}

/* ── DROPDOWN ── */
function closeDropdown(){document.getElementById('login-dropdown')?.classList.remove('open');}
function switchTab(tab){
  document.getElementById('panel-login')?.classList.toggle('active',tab==='login');
  document.getElementById('panel-reg')?.classList.toggle('active',tab==='reg');
  document.getElementById('tab-login')?.classList.toggle('active',tab==='login');
  document.getElementById('tab-reg')?.classList.toggle('active',tab==='reg');
}

/* ── MSG ── */
function showMsg(el,text,type){if(!el)return;el.textContent=text;el.className='msg '+type;el.style.display='block';}
function clearMsg(el){if(!el)return;el.textContent='';el.className='msg';el.style.display='none';}

/* ── SECTIONS ── */
function showSection(id){
  document.querySelectorAll('.page-step').forEach(s=>s.classList.add('hidden'));
  document.getElementById(id)?.classList.remove('hidden');
  if(id==='account-section') loadMyTickets();
}

/* ── PRODUCTS ── */
function filterProducts(type, btn) {
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  const list = document.getElementById('default-product-list');
  if(!list) return;
  list.innerHTML = products.filter(p=>p.type===type).map(p=>`
    <div class="product-card">
      <div><h3>${p.name}</h3><p class="pdesc">${p.desc}</p></div>
      <div><span class="price">${p.price.toLocaleString('hu-HU')} Ft</span>
      <button class="buy-btn" onclick="startCheckout(${p.id})">Kiválasztom →</button></div>
    </div>`).join('');
}

function swapStations(){
  const f=document.getElementById('from-station');
  const t=document.getElementById('to-station');
  if(f&&t){const tmp=f.value;f.value=t.value;t.value=tmp;}
}

/* ── CHECKOUT ── */
function startCheckoutById(id) {
  if(window._rp && window._rp[id]) {
    startCheckout(window._rp[id]);
  }
}

function startCheckout(idOrObj){
  if(typeof idOrObj==='number') selectedProduct=products.find(p=>p.id===idOrObj);
  else if(typeof idOrObj==='object') selectedProduct=idOrObj;
  if(!selectedProduct) return;
  const info=document.getElementById('selected-item-info');
  if(info) info.innerHTML=`
    <div class="sum-label">Kiválasztott termék</div>
    <h4>${selectedProduct.name}</h4>
    <p>${selectedProduct.desc}</p>
    <div class="sum-price">${Number(selectedProduct.price).toLocaleString('hu-HU')} Ft</div>`;
  showSection('checkout-section');
}

async function doPurchase(){
  const msgEl=document.getElementById('purchase-msg');
  clearMsg(msgEl);
  if(!currentUser){showMsg(msgEl,'A vásárláshoz be kell jelentkezned.','error');return;}
  const name  =(document.getElementById('cust-name')?.value||'').trim();
  const idCard=(document.getElementById('cust-id')?.value||'').trim();
  const cvc   =(document.getElementById('card-cvc')?.value||'');
  const expiry=(document.getElementById('card-expiry')?.value||'');
  const cardNo=(document.getElementById('card-number')?.value||'').replace(/\s/g,'');
  if(!name||!idCard){showMsg(msgEl,'Töltsd ki a személyes adatokat.','error');return;}
  if(cardNo.length<16){showMsg(msgEl,'Érvénytelen kártyaszám.','error');return;}
  if(!/^\d{2}\/\d{2}$/.test(expiry)){showMsg(msgEl,'Érvénytelen lejárat (MM/ÉÉ).','error');return;}
  if(cvc.length!==3){showMsg(msgEl,'A CVC 3 számjegyű.','error');return;}

  const qrData=`MAV|${selectedProduct.name}|${name}|${idCard}|${Date.now()}`;
  const qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`;
  try {
    const data=await postJSON('tickets.php',{termekNev:selectedProduct.name,termekLeiras:selectedProduct.desc,ar:selectedProduct.price,utasNev:name,okmanySzam:idCard,qrUrl});
    if(data.success) showSection('account-section');
    else showMsg(msgEl,data.message||'Hiba a mentésnél.','error');
  } catch {showMsg(msgEl,'Kapcsolódási hiba. Próbálja újra.','error');}
}

/* ── MY TICKETS ── */
async function loadMyTickets(){
  const c=document.getElementById('my-tickets');
  if(!c) return;
  if(!currentUser){c.innerHTML='<div class="empty-state"><div style="font-size:3rem;margin-bottom:16px;">🔒</div><p style="font-weight:600;">Bejelentkezés szükséges</p></div>';return;}
  c.innerHTML='<div class="empty-state">Betöltés...</div>';
  try{
    const res=await fetch(API+'tickets.php',{credentials:'same-origin'});
    const data=await res.json();
    const tickets=data.tickets||[];
    if(!tickets.length){c.innerHTML='<div class="empty-state"><div style="font-size:3rem;margin-bottom:16px;">🎫</div><p style="font-weight:600;">Még nincs jegyed</p></div>';return;}
    c.innerHTML=tickets.map(t=>`
      <div class="ticket-item">
        <div class="t-details">
          <span class="t-badge">E-JEGY</span>
          <h4>${t.termek_nev}</h4>
          <p>Utas: <strong>${t.utas_nev}</strong></p>
          <p>Okmány: ${t.okmany_szam} &nbsp;|&nbsp; ${t.vasarlas_datum}</p>
          <p style="font-size:1.1rem;font-weight:800;margin-top:8px;">${Number(t.ar).toLocaleString('hu-HU')} Ft</p>
        </div>
        <div class="t-qr"><img src="${t.qr_url}" alt="QR" loading="lazy"/></div>
      </div>`).join('');
  }catch{c.innerHTML='<div class="empty-state">Betöltési hiba.</div>';}
}

/* ── FAQ ── */
function toggleFaq(qEl){qEl.closest('.faq-item').classList.toggle('open');}

/* ── MODAL ── */
const newsContent={
  0:{title:'Tavaszi menetrendi változások',img:'https://picsum.photos/id/1033/600/280',text:'Március 1-től a Budapest–Győr vonalon reggelente sűrűbben járnak a vonatok.'},
  1:{title:'Pályakarbantartás a Nyugati vonalán',img:'https://picsum.photos/id/1070/600/280',text:'A hétvégi karbantartás érinti a Nyugati pályaudvarról induló vonatokat.'},
  2:{title:'Megújult a MÁV applikáció',img:'https://picsum.photos/id/119/600/280',text:'Az új 2.0-ás verzióban elérhető Apple Pay, Google Pay és élő térkép.'}
};
const offerContent={
  0:{title:'Országbérlet',img:'https://picsum.photos/id/15/600/280',text:'Korlátlan utazás havi fix áron. Diákok 90% kedvezménnyel.'},
  1:{title:'Kerékpárszállítás',img:'https://picsum.photos/id/250/600/280',text:'Kerékpár csak kijelölt kocsikban szállítható. Ár: 500 Ft.'},
  2:{title:'Kisállat szállítás',img:'https://picsum.photos/id/237/600/280',text:'Kistestű állatok zárt hordozóban díjmentesen utazhatnak.'}
};

function openModal(data){
  const modal=document.getElementById('news-modal');
  const body=document.getElementById('modal-body');
  if(!modal||!body) return;
  body.innerHTML=`<img src="${data.img}" alt="${data.title}"/><h2>${data.title}</h2><p>${data.text}</p><button class="btn btn-primary" style="margin-top:20px;width:100%;" onclick="closeModal()">Bezárás</button>`;
  modal.classList.add('open');
}
function closeModal(){document.getElementById('news-modal')?.classList.remove('open');}
function openOffer(i){openModal(offerContent[i]);}
function sendContact(){
  const msgEl=document.getElementById('contact-msg');
  showMsg(msgEl,'Köszönjük üzenetét! Hamarosan felvesszük Önnel a kapcsolatot.','ok');
  ['contact-name','contact-email','contact-msg-text'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
}

/* ── INPUT MASKS ── */
function initInputMasks(){
  // Card number: format as groups of 4
  const cardNo=document.getElementById('card-number');
  if(cardNo) cardNo.addEventListener('input',function(){
    let v=this.value.replace(/\D/g,'').substring(0,16);
    this.value=v.replace(/(.{4})/g,'$1 ').trim();
  });
  // Expiry: auto-add slash
  const exp=document.getElementById('card-expiry');
  if(exp) exp.addEventListener('input',function(){
    let v=this.value.replace(/\D/g,'').substring(0,4);
    if(v.length>=3) v=v.substring(0,2)+'/'+v.substring(2);
    this.value=v;
  });
  // CVC: digits only
  const cvc=document.getElementById('card-cvc');
  if(cvc) cvc.addEventListener('input',function(){
    this.value=this.value.replace(/\D/g,'').substring(0,3);
  });
  // ID card: uppercase
  const custId=document.getElementById('cust-id');
  if(custId) custId.addEventListener('input',function(){
    this.value=this.value.toUpperCase().replace(/[^0-9A-Z]/g,'').substring(0,8);
  });
  // Set today as min date for travel date
  const tDate=document.getElementById('travel-date');
  if(tDate){
    const today=new Date().toISOString().split('T')[0];
    tDate.min=today; tDate.value=today;
  }
}

/* ── BOOTSTRAP ── */
document.addEventListener('DOMContentLoaded',()=>{
  checkSession();
  initInputMasks();

  // Dropdown toggle
  const trigger  =document.getElementById('login-trigger');
  const avatarBtn=document.getElementById('avatar-btn');
  const dropdown =document.getElementById('login-dropdown');
  const toggle   =e=>{e.stopPropagation();dropdown?.classList.toggle('open');};
  trigger?.addEventListener('click',toggle);
  avatarBtn?.addEventListener('click',toggle);
  document.addEventListener('click',e=>{
    if(dropdown&&!dropdown.contains(e.target)&&e.target!==trigger&&e.target!==avatarBtn)
      dropdown.classList.remove('open');
  });

  // News modals
  document.querySelectorAll('.read-more').forEach((btn,i)=>{
    btn.addEventListener('click',e=>{e.preventDefault();openModal(newsContent[i]);});
  });
  document.getElementById('news-modal')?.addEventListener('click',e=>{
    if(e.target===e.currentTarget) closeModal();
  });

  // Default product list on jegyek.html
  if(document.getElementById('default-product-list'))
    filterProducts('jegy',document.getElementById('tab-jegy'));
});