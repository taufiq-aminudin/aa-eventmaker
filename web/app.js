
const KEY={project:'aaem_project',invitation:'aaem_invitation',template:'aaem_template',guests:'aaem_guests',planner:'aaem_planner',budget:'aaem_budget',location:'aaem_location',assets:'aaem_assets'};
const read=(k,d=null)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const project=()=>read(KEY.project,null);
const invitation=()=>read(KEY.invitation,null);
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function toast(msg){let e=document.getElementById('toast');if(!e){e=document.createElement('div');e.id='toast';e.style.cssText='position:fixed;right:18px;bottom:18px;z-index:99;background:#111827;color:#fff;padding:12px 16px;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.2)';document.body.appendChild(e)}e.textContent=msg;e.style.display='block';clearTimeout(window.__toast);window.__toast=setTimeout(()=>e.style.display='none',2300)}
function requireProject(){if(!project()){toast('Buat project terlebih dahulu');setTimeout(()=>location.href='create.html',500);return false}return true}
function createProject(){
 const name=(document.getElementById('eventName')?.value||'').trim();
 const type=document.getElementById('eventType')?.value||'Wedding';
 const date=document.getElementById('eventDate')?.value||'';
 const time=document.getElementById('eventTime')?.value||'';
 const location=document.getElementById('eventLocation')?.value||'';
 if(!name){toast('Masukkan nama event');return}
 const p={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,type,date,time,location,createdAt:new Date().toISOString()};
 write(KEY.project,p);
 write(KEY.invitation,{title:name,opening:'Together with our families, we invite you to celebrate this special moment.',date,time:time||'10:00',venue:location||'Add your venue',slug:name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'my-event',template:'Golden Night',published:false,views:0});
 location.href='dashboard.html';
}
function chooseTemplate(name){write(KEY.template,name);const inv=invitation()||{};inv.template=name;write(KEY.invitation,inv);location.href='invitation-editor.html'}
function copyLink(){navigator.clipboard?.writeText(location.href).then(()=>toast('Link berhasil disalin')).catch(()=>toast('Salin URL dari address bar'))}
function addGuest(){if(!requireProject())return;const name=(document.getElementById('guestName')?.value||'').trim();if(!name){toast('Masukkan nama tamu');return}const a=read(KEY.guests,[]);a.push({id:Date.now(),name,phone:document.getElementById('guestPhone')?.value||'',email:document.getElementById('guestEmail')?.value||'',group:document.getElementById('guestGroup')?.value||'General',rsvp:'Pending'});write(KEY.guests,a);renderGuests();toast('Guest ditambahkan')}
function renderGuests(){const e=document.getElementById('guestList');if(!e)return;const a=read(KEY.guests,[]);e.innerHTML=a.length?a.map((g,i)=>`<div class="list-row"><span><b>${esc(g.name)}</b><small>${esc(g.group)} · ${esc(g.phone||'No phone')}</small></span><strong>${esc(g.rsvp)}</strong></div>`).join(''):'<div class="empty">Belum ada guest.</div>'}
function addTask(){if(!requireProject())return;const task=(document.getElementById('taskName')?.value||'').trim();if(!task){toast('Masukkan task');return}const a=read(KEY.planner,[]);a.push({task,date:document.getElementById('taskDate')?.value||'',owner:document.getElementById('taskOwner')?.value||'',status:'To do'});write(KEY.planner,a);renderTasks();toast('Task ditambahkan')}
function renderTasks(){const e=document.getElementById('taskList');if(!e)return;const a=read(KEY.planner,[]);e.innerHTML=a.length?a.map(t=>`<div class="list-row"><span><b>${esc(t.task)}</b><small>${esc(t.date)} · ${esc(t.owner)}</small></span><strong>${esc(t.status)}</strong></div>`).join(''):'<div class="empty">Belum ada task.</div>'}
function addBudget(){if(!requireProject())return;const cat=document.getElementById('budgetCat')?.value||'Other';const planned=Number(document.getElementById('budgetPlan')?.value||0);const actual=Number(document.getElementById('budgetActual')?.value||0);const a=read(KEY.budget,[]);a.push({category:cat,planned,actual});write(KEY.budget,a);renderBudget();toast('Budget ditambahkan')}
function renderBudget(){const e=document.getElementById('budgetList');if(!e)return;const a=read(KEY.budget,[]);e.innerHTML=a.length?a.map(x=>`<div class="list-row"><span>${esc(x.category)}</span><strong>Rp ${x.planned.toLocaleString('id-ID')} · Rp ${x.actual.toLocaleString('id-ID')}</strong></div>`).join(''):'<div class="empty">Belum ada budget.</div>'}
function saveInvitation(){if(!requireProject())return;const data={title:title.value.trim(),opening:opening.value.trim(),date:date.value,time:time.value,venue:venue.value.trim(),slug:slug.value.trim()||'my-event',template:template.value,published:false,views:invitation()?.views||0};write(KEY.invitation,data);saved.textContent='✓ Invitation tersimpan';setTimeout(()=>location.href='invitation-detail.html',350)}
function submitRsvp(){const name=(document.getElementById('guest')?.value||'').trim();if(!name){toast('Masukkan nama');return}const ans=document.getElementById('answer').value;const a=read(KEY.guests,[]);const found=a.find(g=>g.name.toLowerCase()===name.toLowerCase());if(found)found.rsvp=ans.startsWith('Yes')?'Confirmed':'Declined';else a.push({id:Date.now(),name,phone:'',group:'Guest',rsvp:ans.startsWith('Yes')?'Confirmed':'Declined'});write(KEY.guests,a);document.getElementById('r').textContent='✓ RSVP berhasil dicatat.';document.getElementById('r').className='notice'}
function publishInvitation(){const inv=invitation();if(!inv)return;if(!inv.published){inv.published=true;inv.views=(inv.views||0)+1;write(KEY.invitation,inv)}toast('Invitation published');setTimeout(()=>location.href='invitation-detail.html',400)}
document.addEventListener('DOMContentLoaded',()=>{renderGuests();renderTasks();renderBudget()})
