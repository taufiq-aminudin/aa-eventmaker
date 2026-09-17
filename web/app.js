function getProject(){return JSON.parse(localStorage.getItem('aaem_project')||'null')}
function getInvitation(){return JSON.parse(localStorage.getItem('aaem_invitation')||'null')}
function setText(id,value){const e=document.getElementById(id);if(e)e.textContent=value}
function toast(msg){let e=document.getElementById('toast');if(!e){e=document.createElement('div');e.id='toast';e.style.cssText='position:fixed;right:18px;bottom:18px;z-index:99;background:#111827;color:#fff;padding:12px 16px;border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.2)';document.body.appendChild(e)}e.textContent=msg;e.style.display='block';clearTimeout(window.__toast);window.__toast=setTimeout(()=>e.style.display='none',2500)}
function saveProject(p){localStorage.setItem('aaem_project',JSON.stringify(p))}
function createProject(){const name=(document.getElementById('eventName')?.value||'').trim();const type=document.getElementById('eventType')?.value||'Custom Event';const date=document.getElementById('eventDate')?.value||'';if(!name){toast('Masukkan nama event terlebih dahulu');return}saveProject({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,type,date,createdAt:new Date().toISOString()});location.href='dashboard.html'}
function chooseTemplate(name){localStorage.setItem('aaem_template',name);location.href='invitation-maker.html'}
function copyLink(){navigator.clipboard?.writeText(location.href).then(()=>toast('Link berhasil disalin')).catch(()=>toast('Salin URL dari address bar'))}
