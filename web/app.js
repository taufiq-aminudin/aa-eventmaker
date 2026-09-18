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
  analytics: 'aaEventMakerAnalytics'
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
