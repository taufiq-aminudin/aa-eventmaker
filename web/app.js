
const KEY={project:'aaem_project',invitation:'aaem_invitation',template:'aaem_template',guests:'aaem_guests',planner:'aaem_planner',budget:'aaem_budget',location:'aaem_location',assets:'aaem_assets',design:'aaem_design',video:'aaem_video'};
const read=(k,d=null)=>{try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch{return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const project=()=>read(KEY.project,null), invitation=()=>read(KEY.invitation,null);
function by(id){return document.getElementById(id)}
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function toast(msg){let e=by('toast');if(!e){e=document.createElement('div');e.id='toast';e.style.cssText='position:fixed;right:18px;bottom:18px;z-index:999;background:#111827;color:#fff;padding:12px 16px;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.2);font-weight:700';document.body.appendChild(e)}e.textContent=msg;e.style.display='block';clearTimeout(window.__toast);window.__toast=setTimeout(()=>e.style.display='none',2300)}
function requireProject(){if(project())return true;toast('Buat project terlebih dahulu');setTimeout(()=>{window.location.href='create.html'},450);return false}
function slugify(s){return String(s||'').toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g,'').trim().replace(/[\s_]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')||'my-event'}
function createProject(){
 const name=(by('eventName')?.value||'').trim(), type=by('eventType')?.value||'Wedding', date=by('eventDate')?.value||'', time=by('eventTime')?.value||'', venue=(by('eventLocation')?.value||'').trim();
 if(!name){toast('Masukkan nama event');by('eventName')?.focus();return}
 const p={id:(crypto.randomUUID?.()||String(Date.now())),name,type,date,time,location:venue,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
 write(KEY.project,p);
 const old=invitation()||{};
 write(KEY.invitation,{...old,title:name,opening:old.opening||'Together with our families, we invite you to celebrate this special moment.',date,time:time||'10:00',venue:venue||'Add your venue',slug:old.slug||slugify(name),template:old.template||'Golden Night',published:false,views:old.views||0});
 toast('Project berhasil dibuat');
 setTimeout(()=>window.location.href='dashboard.html',350);
}
function chooseTemplate(name){
 if(!requireProject())return;
 const inv=invitation()||{}; write(KEY.template,name); write(KEY.invitation,{...inv,template:name});
 window.location.href='invitation-editor.html';
}
function copyLink(){
 const url=window.location.href;
 if(navigator.clipboard) navigator.clipboard.writeText(url).then(()=>toast('Link berhasil disalin')).catch(()=>toast('Salin URL dari address bar'));
 else toast('Salin URL dari address bar');
}
function saveInvitation(){
 if(!requireProject())return;
 const data={...(invitation()||{}),title:(by('title')?.value||'').trim(),opening:(by('opening')?.value||'').trim(),date:by('date')?.value||'',time:by('time')?.value||'10:00',venue:(by('venue')?.value||'').trim(),slug:slugify(by('slug')?.value||''),template:by('template')?.value||'Golden Night'};
 if(!data.title){toast('Isi judul invitation');return}
 write(KEY.invitation,data);
 const saved=by('saved');if(saved)saved.textContent='✓ Invitation tersimpan';
 setTimeout(()=>window.location.href='invitation-detail.html',350);
}
function publishInvitation(){
 if(!requireProject())return;
 const inv=invitation();if(!inv)return;
 write(KEY.invitation,{...inv,published:true,views:(inv.views||0)+1});
 toast('Invitation published');
 setTimeout(()=>window.location.href='invitation-detail.html',400);
}
function addGuest(){
 if(!requireProject())return;
 const name=(by('guestName')?.value||'').trim();if(!name){toast('Masukkan nama tamu');return}
 const a=read(KEY.guests,[]);a.push({id:Date.now(),name,phone:by('guestPhone')?.value||'',email:by('guestEmail')?.value||'',group:by('guestGroup')?.value||'General',rsvp:'Pending'});write(KEY.guests,a);renderGuests();['guestName','guestPhone','guestEmail'].forEach(id=>{if(by(id))by(id).value=''});toast('Guest ditambahkan')
}
function renderGuests(){
 const e=by('guestList');if(!e)return;const a=read(KEY.guests,[]);
 e.innerHTML=a.length?a.map(g=>`<div class="list-row"><span><b>${esc(g.name)}</b><small>${esc(g.group)} · ${esc(g.phone||'No phone')} · ${esc(g.email||'No email')}</small></span><strong>${esc(g.rsvp)}</strong></div>`).join(''):'<div class="empty">Belum ada guest.</div>';
}
function addTask(){
 if(!requireProject())return;const task=(by('taskName')?.value||'').trim();if(!task){toast('Masukkan task');return}
 const a=read(KEY.planner,[]);a.push({id:Date.now(),task,date:by('taskDate')?.value||'',owner:by('taskOwner')?.value||'',status:'To do'});write(KEY.planner,a);renderTasks();if(by('taskName'))by('taskName').value='';toast('Task ditambahkan')
}
function renderTasks(){
 const e=by('taskList');if(!e)return;const a=read(KEY.planner,[]);
 e.innerHTML=a.length?a.map(t=>`<div class="list-row"><span><b>${esc(t.task)}</b><small>${esc(t.date||'No deadline')} · ${esc(t.owner||'Unassigned')}</small></span><strong>${esc(t.status)}</strong></div>`).join(''):'<div class="empty">Belum ada task.</div>';
}
function addBudget(){
 if(!requireProject())return;const planned=Number(by('budgetPlan')?.value||0),actual=Number(by('budgetActual')?.value||0),cat=by('budgetCat')?.value||'Other';
 const a=read(KEY.budget,[]);a.push({id:Date.now(),category:cat,planned,actual});write(KEY.budget,a);renderBudget();updateBudgetSummary();toast('Budget ditambahkan')
}
function renderBudget(){
 const e=by('budgetList');if(!e)return;const a=read(KEY.budget,[]);
 e.innerHTML=a.length?a.map(x=>`<div class="list-row"><span><b>${esc(x.category)}</b></span><strong>Rp ${Number(x.planned).toLocaleString('id-ID')} · Rp ${Number(x.actual).toLocaleString('id-ID')}</strong></div>`).join(''):'<div class="empty">Belum ada budget.</div>';
}
function updateBudgetSummary(){
 const a=read(KEY.budget,[]),p=a.reduce((s,x)=>s+Number(x.planned||0),0),r=a.reduce((s,x)=>s+Number(x.actual||0),0);
 if(by('totalPlan'))by('totalPlan').textContent='Rp '+p.toLocaleString('id-ID');if(by('totalActual'))by('totalActual').textContent='Rp '+r.toLocaleString('id-ID');if(by('remaining'))by('remaining').textContent='Rp '+(p-r).toLocaleString('id-ID');
}
function submitRsvp(){
 const name=(by('guest')?.value||'').trim();if(!name){toast('Masukkan nama');return}
 const ans=by('answer')?.value||'', status=ans.startsWith('Yes')?'Confirmed':ans.startsWith('Sorry')?'Declined':'Maybe', a=read(KEY.guests,[]);
 const found=a.find(g=>g.name.toLowerCase()===name.toLowerCase());
 if(found)found.rsvp=status;else a.push({id:Date.now(),name,phone:'',email:'',group:'Guest',rsvp:status});
 write(KEY.guests,a);if(by('r')){by('r').textContent='✓ RSVP berhasil dicatat.';by('r').className='notice'}toast('RSVP tersimpan')
}
function saveLocation(){
 if(!requireProject())return;write(KEY.location,{name:(by('locName')?.value||'').trim(),address:(by('locAddress')?.value||'').trim(),url:(by('locUrl')?.value||'').trim()});
 if(by('locSaved'))by('locSaved').textContent='✓ Location tersimpan';toast('Location tersimpan')
}
function generateConcept(){
 const p=(by('aiPrompt')?.value||'').trim();if(!p){toast('Masukkan prompt');return}
 const e=by('aiResult');if(!e)return;
 e.innerHTML=`<span class="eyebrow">AI DRAFT</span><h2>Creative direction</h2><p>${esc(p)}</p><div class="list"><div class="list-row"><span>Theme</span><strong>Elegant celebration</strong></div><div class="list-row"><span>Palette</span><strong>Plum · Rose · Ivory</strong></div><div class="list-row"><span>Typography</span><strong>Editorial Serif + Clean Sans</strong></div></div><div class="actions"><a class="btn primary" href="invitation-editor.html">Use for Invitation →</a></div>`;
}
function saveStudio(kind){
 if(!requireProject())return;
 const key=kind==='photo'?KEY.assets:kind==='video'?KEY.video:KEY.design;
 const data={...(read(key,{})||{}),updatedAt:new Date().toISOString(),notes:(by(kind+'Notes')?.value||'').trim()};
 write(key,data);toast(kind[0].toUpperCase()+kind.slice(1)+' workspace tersimpan')
}
document.addEventListener('DOMContentLoaded',()=>{
 renderGuests();renderTasks();renderBudget();updateBudgetSummary();
 const p=project();
 if(by('createCurrent')&&p){by('createCurrent').textContent=`Editing project: ${p.name}`}
});

document.addEventListener('DOMContentLoaded',()=>{
 const p=project();
 const main=document.querySelector('main.container');
 if(p && main && !document.getElementById('projectContext') && !location.pathname.endsWith('dashboard.html')){
   const bar=document.createElement('div');bar.id='projectContext';bar.className='project-bar';
   bar.innerHTML=`<div><small>ACTIVE PROJECT</small><strong>${esc(p.name)}</strong><small>${esc(p.type||'Event')} · ${esc(p.date||'Date not set')}</small></div><div class="project-actions"><a class="btn light" href="dashboard.html">Workspace</a><a class="btn primary" href="invitation-maker.html">Invitation</a></div>`;
   main.prepend(bar);
 }
 document.querySelectorAll('input[type=file][data-preview]').forEach(input=>{
   input.addEventListener('change',()=>{
     const file=input.files?.[0], target=document.getElementById(input.dataset.preview);
     if(!file||!target)return;
     const url=URL.createObjectURL(file);target.src=url;target.style.display='block';
   });
 });
});
