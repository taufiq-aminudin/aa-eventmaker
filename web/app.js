/* AA : Event Maker — shared app logic. Prototype uses localStorage; a real backend can replace these functions 1:1. */
const LS = {
  projects: 'aaEventMakerProjects',
  current: 'aaEventMakerCurrentProject',
  guests: 'aaEventMakerGuests',
  planner: 'aaEventMakerPlanner',
  budget: 'aaEventMakerBudget',
  invitation: 'aaEventMakerInvitation',
  location: 'aaEventMakerLocation',
  template: 'aaEventMakerTemplate',
  memories: 'aaEventMakerMemories',
  analytics: 'aaEventMakerAnalytics',
  accounts: 'aaEventMakerAccounts',
  session: 'aaEventMakerSession'
};

function readLS(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback }catch(e){ return fallback } }
function writeLS(key, value){ localStorage.setItem(key, JSON.stringify(value)) }

/* Project */
function getProjects(){ return readLS(LS.projects, []) }
function saveProjects(list){ writeLS(LS.projects, list) }
function getProject(){ return readLS(LS.current, null) }
function saveProject(p){
  writeLS(LS.current, p);
  const list = getProjects();
  const idx = list.findIndex(x=>x.id===p.id);
  if(idx>=0) list[idx]=p; else list.push(p);
  saveProjects(list);
}
function createProject(){
  const name=(document.getElementById('eventName')?.value||'').trim();
  const type=document.getElementById('eventType')?.value||'Custom';
  const date=document.getElementById('eventDate')?.value||'';
  const time=document.getElementById('eventTime')?.value||'';
  const venue=document.getElementById('eventVenue')?.value||'';
  if(!name){ toast('Masukkan nama event terlebih dahulu'); return }
  saveProject({
    id: crypto.randomUUID?crypto.randomUUID():String(Date.now()),
    name, type, date, time, venue,
    status:'Planning',
    createdAt:new Date().toISOString()
  });
  toast('Project created');
  setTimeout(()=>location.href='dashboard.html',350);
}

/* Invitation */
function getInvitation(){ return readLS(LS.invitation, null) }
function saveInvitationData(d){ writeLS(LS.invitation, d) }
function chooseTemplate(name){ writeLS(LS.template, name); location.href='invitation-editor.html' }

/* Guests */
function getGuests(){ return readLS(LS.guests, []) }
function saveGuests(list){ writeLS(LS.guests, list) }

/* Planner */
function getPlanner(){ return readLS(LS.planner, []) }
function savePlanner(list){ writeLS(LS.planner, list) }

/* Budget */
function getBudget(){ return readLS(LS.budget, []) }
function saveBudget(list){ writeLS(LS.budget, list) }

/* Location */
function getLocationData(){ return readLS(LS.location, []) }
function saveLocationData(list){ writeLS(LS.location, list) }

/* Memories */
function getMemories(){ return readLS(LS.memories, []) }
function saveMemories(list){ writeLS(LS.memories, list) }

/* UI helpers */
function setText(id,value){ const e=document.getElementById(id); if(e) e.textContent=value }
function toast(msg){
  let e=document.getElementById('toast');
  if(!e){ e=document.createElement('div'); e.id='toast'; e.style.cssText='position:fixed;right:18px;bottom:18px;z-index:99;background:#111827;color:#fff;padding:12px 16px;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.2)'; document.body.appendChild(e) }
  e.textContent=msg; e.style.display='block';
  clearTimeout(window.__toast); window.__toast=setTimeout(()=>e.style.display='none',2500);
}
function copyLink(){
  navigator.clipboard?.writeText(location.href).then(()=>toast('Link berhasil disalin')).catch(()=>toast('Salin URL dari address bar'));
}

/* Accounts — local-device only, no real backend (matches README: "Accounts and projects are stored separately on the device") */
function getAccounts(){ return readLS(LS.accounts, []) }
function saveAccounts(list){ writeLS(LS.accounts, list) }
function currentUser(){ return readLS(LS.session, null) }
function setSession(email){ writeLS(LS.session, email) }

function hashPass(pw){ // simple non-cryptographic local check, not real security
  let h=0; for(let i=0;i<pw.length;i++){ h=(h*31 + pw.charCodeAt(i))|0 } return String(h)
}

function signup(){
  const name=(document.getElementById('signupName')?.value||'').trim();
  const email=(document.getElementById('signupEmail')?.value||'').trim().toLowerCase();
  const pass=document.getElementById('signupPassword')?.value||'';
  const confirm=document.getElementById('signupConfirm')?.value||'';
  if(!name||!email){ toast('Lengkapi nama dan email'); return }
  if(pass.length<6){ toast('Password minimal 6 karakter'); return }
  if(pass!==confirm){ toast('Konfirmasi password tidak cocok'); return }
  const accounts=getAccounts();
  if(accounts.some(a=>a.email===email)){ toast('Email sudah terdaftar, silakan login'); return }
  accounts.push({ email, name, pass:hashPass(pass), createdAt:new Date().toISOString() });
  saveAccounts(accounts);
  setSession(email);
  toast('Akun berhasil dibuat');
  setTimeout(()=>location.href='profile.html',350);
}

function login(){
  const email=(document.getElementById('loginEmail')?.value||'').trim().toLowerCase();
  const pass=document.getElementById('loginPassword')?.value||'';
  const account=getAccounts().find(a=>a.email===email);
  if(!account || account.pass!==hashPass(pass)){ toast('Email atau password salah'); return }
  setSession(email);
  toast('Berhasil login');
  setTimeout(()=>location.href='dashboard.html',350);
}

function logout(){
  setSession(null);
  toast('Berhasil logout');
  setTimeout(()=>location.href='index.html',350);
}

function saveProfile(){
  const email=currentUser();
  if(!email){ location.href='login.html'; return }
  const accounts=getAccounts();
  const idx=accounts.findIndex(a=>a.email===email);
  if(idx<0) return;
  accounts[idx].name=(document.getElementById('profileName')?.value||accounts[idx].name).trim();
  saveAccounts(accounts);
  toast('Profil tersimpan');
}

function handleAvatar(input){
  const file=input.files?.[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=()=>{
    const email=currentUser();
    if(email){
      const accounts=getAccounts();
      const idx=accounts.findIndex(a=>a.email===email);
      if(idx>=0){ accounts[idx].avatar=reader.result; saveAccounts(accounts) }
    }
    updateAvatarUI();
  };
  reader.readAsDataURL(file);
}

function updateAvatarUI(){
  const email=currentUser();
  const account=email ? getAccounts().find(a=>a.email===email) : null;
  const img=document.getElementById('profileAvatar');
  const fallback=document.getElementById('profileAvatarFallback');
  if(account?.avatar && img){ img.src=account.avatar; img.style.display='block'; if(fallback) fallback.style.display='none' }
  else if(fallback && account){ fallback.textContent=(account.name||'A').charAt(0).toUpperCase() }
}

document.addEventListener('DOMContentLoaded',()=>{
  const link=document.getElementById('navProfileLink');
  if(link){ link.textContent = currentUser() ? 'Profile' : 'Login'; if(!currentUser()) link.setAttribute('href','login.html') }
});

/* Mobile navigation — turns the header's <nav> into a hamburger menu below ~850px */
function initMobileNav(){
  const header=document.querySelector('header.topbar');
  const nav=header?.querySelector('nav');
  if(!header||!nav||header.querySelector('.nav-toggle')) return;

  const btn=document.createElement('button');
  btn.type='button';
  btn.className='nav-toggle';
  btn.setAttribute('aria-label','Buka menu');
  btn.setAttribute('aria-expanded','false');
  btn.innerHTML='<span></span><span></span><span></span>';
  header.insertBefore(btn, nav);

  function closeNav(){ header.classList.remove('nav-open'); btn.setAttribute('aria-expanded','false') }
  function openNav(){ header.classList.add('nav-open'); btn.setAttribute('aria-expanded','true') }

  btn.addEventListener('click',()=> header.classList.contains('nav-open') ? closeNav() : openNav());
  nav.addEventListener('click', e=>{ if(e.target.tagName==='A') closeNav() });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeNav() });
  document.addEventListener('click', e=>{ if(header.classList.contains('nav-open') && !header.contains(e.target)) closeNav() });
}
document.addEventListener('DOMContentLoaded', initMobileNav);
