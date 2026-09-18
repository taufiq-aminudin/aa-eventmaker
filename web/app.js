
const AUTH_KEY='aaem_auth_user', USERS_KEY='aaem_users', CURRENT_PROJECT_KEY='aaem_current_project';
const KEY={projects:'aaem_projects',invitation:'aaem_invitation',template:'aaem_template',guests:'aaem_guests',planner:'aaem_planner',budget:'aaem_budget',location:'aaem_location',design:'aaem_design',video:'aaem_video',ai:'aaem_ai'};
const DB_NAME='AAEventMakerDB', DB_VERSION=1, MEDIA_STORE='media';

const by=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const raw=(k,d=null)=>{try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch{return d}};
const rawSet=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const currentUser=()=>raw(AUTH_KEY,null);
const users=()=>raw(USERS_KEY,[]);
const currentProjectId=()=>raw(CURRENT_PROJECT_KEY,null);
function userKey(k){const u=currentUser();return u?`${k}__${u.id}`:k}
function read(k,d=null){return raw(userKey(k),d)}
function write(k,v){rawSet(userKey(k),v)}
function toast(msg){let e=by('toast');if(!e){e=document.createElement('div');e.id='toast';e.style.cssText='position:fixed;right:18px;bottom:18px;z-index:9999;background:#101828;color:#fff;padding:13px 17px;border-radius:13px;font-weight:800;box-shadow:0 16px 36px rgba(0,0,0,.22)'}e.textContent=msg;e.hidden=false;clearTimeout(window.__toast);window.__toast=setTimeout(()=>e.hidden=true,2200)}
function hashPassword(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16)}
function slugify(s){return String(s||'').toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g,'').trim().replace(/[\s_]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')||'my-event'}
function formatDate(d){if(!d)return 'Date not set';try{return new Date(d+'T00:00:00').toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}catch{return d}}

function signup(){
 const name=(by('signupName')?.value||'').trim(),email=(by('signupEmail')?.value||'').trim().toLowerCase(),pass=by('signupPassword')?.value||'',confirm=by('signupConfirm')?.value||'';
 if(!name||!email||pass.length<6||pass!==confirm){toast(!name?'Nama wajib diisi':!email?'Email wajib diisi':pass.length<6?'Password minimal 6 karakter':'Password tidak sama');return}
 const a=users();if(a.some(u=>u.email===email)){toast('Email sudah terdaftar');return}
 const u={id:crypto.randomUUID?.()||String(Date.now()),name,email,passwordHash:hashPassword(pass),createdAt:new Date().toISOString()};
 a.push(u);rawSet(USERS_KEY,a);rawSet(AUTH_KEY,{id:u.id,name:u.name,email:u.email});rawSet(CURRENT_PROJECT_KEY,null);
 location.href=new URLSearchParams(location.search).get('next')||'dashboard.html';
}
function login(){
 const email=(by('loginEmail')?.value||'').trim().toLowerCase(),pass=by('loginPassword')?.value||'',u=users().find(x=>x.email===email&&x.passwordHash===hashPassword(pass));
 if(!u){toast('Email atau password salah');return}
 rawSet(AUTH_KEY,{id:u.id,name:u.name,email:u.email});location.href=new URLSearchParams(location.search).get('next')||'dashboard.html';
}
function saveProfile(){const u=currentUser();if(!u)return;const name=(by('profileName')?.value||'').trim();if(!name){toast('Nama wajib diisi');return}const a=users(),x=a.find(v=>v.id===u.id);if(!x)return;x.name=name;rawSet(USERS_KEY,a);rawSet(AUTH_KEY,{id:x.id,name:x.name,email:x.email});toast('Profile updated');setTimeout(()=>location.reload(),250)}
function logout(){rawSet(AUTH_KEY,null);rawSet(CURRENT_PROJECT_KEY,null);localStorage.removeItem(AUTH_KEY);location.href='index.html'}
function authRequired(){if(currentUser())return true;location.href='login.html?next='+encodeURIComponent(location.pathname.split('/').pop()||'dashboard.html');return false}
function protectedPage(){return ['dashboard.html','invitation-maker.html','invitation-editor.html','invitation-detail.html','photo-maker.html','video-maker.html','design-maker.html','ai-creator.html','guest-manager.html','location.html','event-planner.html','budget.html','analytics.html','memories.html','profile.html'].includes(location.pathname.split('/').pop()||'index.html')}
function guard(){if(protectedPage()&&!currentUser()){location.href='login.html?next='+encodeURIComponent(location.pathname.split('/').pop()||'dashboard.html');return false}return true}

function projects(){return read(KEY.projects,[])}
function currentProject(){const a=projects(),id=currentProjectId();return a.find(p=>p.id===id)||a[0]||null}
function activeProjectId(){return currentProject()?.id||null}
function pkey(k,id=activeProjectId()){const u=currentUser();return u&&id?`${k}__${u.id}__${id}`:userKey(k)}
function pread(k,d=null,id=activeProjectId()){return raw(pkey(k,id),d)}
function pwrite(k,v,id=activeProjectId()){rawSet(pkey(k,id),v)}
function invitation(){return pread('invitation',null)}
function guests(){return pread('guests',[])}
function ensureProject(){if(!authRequired())return false;if(currentProject())return true;toast('Buat Project terlebih dahulu');setTimeout(()=>location.href='create.html',350);return false}

function migrateLegacy(){
 const u=currentUser();if(!u||projects().length)return;
 const lp=localStorage.getItem(`aaem_project__${u.id}`)||localStorage.getItem('aaem_project');if(!lp)return;
 try{
  const p=JSON.parse(lp);p.id=p.id||crypto.randomUUID?.()||String(Date.now());write(KEY.projects,[p]);rawSet(CURRENT_PROJECT_KEY,p.id);
  const li=localStorage.getItem(`aaem_invitation__${u.id}`)||localStorage.getItem('aaem_invitation');if(li)rawSet(pkey('invitation',p.id),JSON.parse(li));
 }catch{}
}

function createProject(){
 if(!authRequired())return;
 const name=(by('eventName')?.value||'').trim(),type=by('eventType')?.value||'Wedding',date=by('eventDate')?.value||'',time=by('eventTime')?.value||'',venue=(by('eventLocation')?.value||'').trim();
 if(!name){toast('Masukkan nama event');return}
 const p={id:crypto.randomUUID?.()||String(Date.now()),name,type,date,time,location:venue,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
 const a=projects();a.push(p);write(KEY.projects,a);rawSet(CURRENT_PROJECT_KEY,p.id);
 pwrite('invitation',{title:'Your Event',opening:'Your invitation message',date,time:time||'10:00',venue:venue||'Your Venue',slug:slugify(name),template:'International Classic',published:false,views:0,shareCount:0},p.id);
 for(const [k,v] of [['guests',[]],['planner',[]],['budget',[]],['location',{}],['design',{}],['video',{}],['ai',{}]])pwrite(k,v,p.id);
 location.href='dashboard.html';
}
function editProject(){
 if(!ensureProject())return;const p=currentProject();const name=prompt('Event name',p.name);if(name===null)return;
 p.name=name.trim()||p.name;p.type=prompt('Event type',p.type)||p.type;p.date=prompt('Date (YYYY-MM-DD)',p.date)||p.date;p.time=prompt('Time',p.time)||p.time;p.location=prompt('Venue',p.location)||p.location;p.updatedAt=new Date().toISOString();write(KEY.projects,projects().map(x=>x.id===p.id?p:x));
 const i=invitation()||{};pwrite('invitation',{...i,date:p.date,time:p.time,venue:p.location,title:i.title==='Your Event'?p.name:i.title});location.reload();
}
function selectProject(){
 const a=projects();if(!a.length){location.href='create.html';return}
 const list=a.map((p,i)=>`${i+1}. ${p.name} — ${p.type}`).join('\n');const answer=prompt(`Choose project:\n\n${list}`,String(Math.max(1,a.findIndex(p=>p.id===activeProjectId())+1)));const idx=Number(answer)-1;if(a[idx]){rawSet(CURRENT_PROJECT_KEY,a[idx].id);location.reload()}
}
function deleteProject(id){
 const p=projects().find(x=>x.id===id);if(!p||!confirm(`Hapus Project "${p.name}"?`))return;
 write(KEY.projects,projects().filter(x=>x.id!==id));const u=currentUser();if(u)Object.keys(localStorage).filter(k=>k.includes(`__${u.id}__${id}`)).forEach(k=>localStorage.removeItem(k));
 if(activeProjectId()===id)rawSet(CURRENT_PROJECT_KEY,null);location.reload();
}

function templateAsset(name){return 'assets/templates/'+slugify(name)+'.svg'}
function chooseTemplate(name){if(!ensureProject())return;const i=invitation()||{};pwrite('template',name);pwrite('invitation',{...i,template:name});location.href='invitation-editor.html'}
function saveInvitation(){
 if(!ensureProject())return;const i={...(invitation()||{}),title:(by('title')?.value||'').trim()||'Your Event',opening:(by('opening')?.value||'').trim(),date:by('date')?.value||'',time:by('time')?.value||'10:00',venue:(by('venue')?.value||'Your Venue').trim(),slug:slugify(by('slug')?.value||''),template:by('template')?.value||'International Classic'};
 pwrite('invitation',i);toast('Invitation tersimpan');setTimeout(()=>location.href='invitation-detail.html',250)
}
function publishInvitation(){if(!ensureProject())return;const i=invitation()||{};pwrite('invitation',{...i,published:true});toast('Invitation published')}
function shareInvitation(){
 if(!ensureProject())return;const i=invitation(),p=currentProject();if(!i||!p){toast('Invitation belum siap');return}
 const publicData={title:i.title||p.name,opening:i.opening||'',date:i.date||p.date,time:i.time||p.time,venue:i.venue||p.location,template:i.template||'International Classic',slug:i.slug||slugify(p.name)};
 const encoded=btoa(unescape(encodeURIComponent(JSON.stringify(publicData)))),u=new URL('public-invitation.html',location.href);u.searchParams.set('data',encoded);const inv={...i,shareCount:(i.shareCount||0)+1};pwrite('invitation',inv);
 if(navigator.share)navigator.share({title:publicData.title,text:'You are invited',url:u.href}).catch(()=>{});
 else navigator.clipboard?.writeText(u.href).then(()=>toast('Invitation link disalin')).catch(()=>prompt('Copy invitation link',u.href));
}
function copyCurrentLink(){navigator.clipboard?.writeText(location.href).then(()=>toast('Link disalin')).catch(()=>prompt('Copy link',location.href))}

function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,DB_VERSION);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(MEDIA_STORE))r.result.createObjectStore(MEDIA_STORE,{keyPath:'id'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function mediaPut(v){const db=await openDB();return new Promise((res,rej)=>{const tx=db.transaction(MEDIA_STORE,'readwrite');tx.objectStore(MEDIA_STORE).put(v);tx.oncomplete=()=>res(v.id);tx.onerror=()=>rej(tx.error)})}
async function mediaAll(scope){const db=await openDB();return new Promise((res,rej)=>{const tx=db.transaction(MEDIA_STORE,'readonly'),r=tx.objectStore(MEDIA_STORE).getAll();r.onsuccess=()=>res((r.result||[]).filter(x=>x.scope===scope));r.onerror=()=>rej(r.error)})}
function mediaScope(){const u=currentUser(),p=currentProject();return u&&p?`${u.id}__${p.id}`:''}
async function uploadMedia(input,kind,galleryId){
 if(!ensureProject())return;const files=[...(input.files||[])];if(!files.length)return;
 for(const file of files){const valid=kind==='photo'?file.type.startsWith('image/'):file.type.startsWith('video/');if(!valid)continue;await mediaPut({id:crypto.randomUUID?.()||String(Date.now()+Math.random()),scope:mediaScope(),kind,name:file.name,type:file.type,blob:file,createdAt:Date.now()})}
 await renderMedia(kind,galleryId);input.value='';toast(`${files.length} file tersimpan`);
}
async function handleMediaUpload(input,kind,galleryId){return uploadMedia(input,kind,galleryId)}
async function renderMedia(kind,galleryId){
 const e=by(galleryId);if(!e||!mediaScope())return;const items=(await mediaAll(mediaScope())).filter(x=>x.kind===kind).sort((a,b)=>b.createdAt-a.createdAt);if(!items.length){e.innerHTML='<div class="empty">Belum ada file.</div>';return}e.innerHTML='';
 items.forEach(x=>{const f=document.createElement('figure'),u=URL.createObjectURL(x.blob);f.innerHTML=kind==='photo'?`<img src="${u}" alt="${esc(x.name)}"><figcaption>${esc(x.name)}</figcaption>`:`<video src="${u}" controls playsinline></video><figcaption>${esc(x.name)}</figcaption>`;e.appendChild(f)})
}
async function handleAvatar(input){
 const u=currentUser(),file=input.files?.[0];if(!u||!file)return;if(!file.type.startsWith('image/')){toast('Avatar harus berupa gambar');return}
 await mediaPut({id:`avatar__${u.id}`,scope:`avatar__${u.id}`,kind:'avatar',name:file.name,type:file.type,blob:file,createdAt:Date.now()});await updateAvatarUI();toast('Avatar updated');input.value=''
}
async function updateAvatarUI(){
 const u=currentUser();if(!u)return;try{const db=await mediaAll(`avatar__${u.id}`),x=db[0],url=x?URL.createObjectURL(x.blob):'';const h=by('headerAvatar');if(h){h.style.backgroundImage=url?`url("${url}")`:'';h.style.backgroundSize='cover';h.style.backgroundPosition='center';h.textContent=url?'':(u.name||'A').slice(0,1).toUpperCase()}const big=by('profileAvatar'),fb=by('profileAvatarFallback');if(big&&url){big.src=url;big.style.display='block';if(fb)fb.style.display='none'}else if(fb){fb.textContent=(u.name||'A').slice(0,1).toUpperCase();fb.style.display='grid'}}catch{}}

function addGuest(){
 if(!ensureProject())return;const name=(by('guestName')?.value||'').trim();if(!name){toast('Nama guest wajib diisi');return}const a=guests();a.push({id:crypto.randomUUID?.()||String(Date.now()),name,phone:by('guestPhone')?.value||'',email:by('guestEmail')?.value||'',group:by('guestGroup')?.value||'General',rsvp:'Pending',checkedIn:false});pwrite('guests',a);renderGuests();['guestName','guestPhone','guestEmail'].forEach(id=>{if(by(id))by(id).value=''});toast('Guest ditambahkan')}
function guestPublicLink(g){const i=invitation()||{},p=currentProject();const data={title:i.title||p.name,opening:i.opening,date:i.date,time:i.time,venue:i.venue||p.location,template:i.template,guest:g.name};const u=new URL('public-invitation.html',location.href);u.searchParams.set('data',btoa(unescape(encodeURIComponent(JSON.stringify(data)))));return u.href}
function copyGuestLink(id){const g=guests().find(x=>x.id===id);if(!g)return;const u=guestPublicLink(g);navigator.clipboard?.writeText(u).then(()=>toast('Personal link disalin')).catch(()=>prompt('Copy personal link',u))}
function toggleCheckIn(id){const a=guests(),g=a.find(x=>x.id===id);if(g){g.checkedIn=!g.checkedIn;pwrite('guests',a);renderGuests()}}
function renderGuests(){const e=by('guestList');if(!e)return;const a=guests();if(by('guestTotal'))by('guestTotal').textContent=`${a.length} guests`;e.innerHTML=a.length?a.map(g=>`<div class="list-row"><span><b>${esc(g.name)}</b><small>${esc(g.group)} · ${esc(g.phone||'No phone')}</small></span><div class="actions"><button class="btn small light" onclick="copyGuestLink('${g.id}')">Personal Link</button><button class="btn small ${g.checkedIn?'dark':'light'}" onclick="toggleCheckIn('${g.id}')">${g.checkedIn?'Checked In':'Check-in'}</button><strong>${esc(g.rsvp)}</strong></div></div>`).join(''):'<div class="empty">Belum ada guest.</div>'}
function submitRsvp(){const name=(by('guest')?.value||'').trim();if(!name){toast('Masukkan nama');return}const answer=by('answer')?.value||'',status=answer.startsWith('Yes')?'Confirmed':answer.startsWith('Sorry')?'Declined':'Maybe';if(currentUser()&&currentProject()){const a=guests(),g=a.find(x=>x.name.toLowerCase()===name.toLowerCase());if(g)g.rsvp=status;else a.push({id:crypto.randomUUID?.()||String(Date.now()),name,phone:'',email:'',group:'Guest',rsvp:status,checkedIn:false});pwrite('guests',a)}if(by('r')){by('r').textContent='✓ RSVP berhasil dicatat.';by('r').className='notice'}}

function addTask(){if(!ensureProject())return;const task=(by('taskName')?.value||'').trim();if(!task){toast('Task wajib diisi');return}const a=pread('planner',[]);a.push({id:crypto.randomUUID?.()||String(Date.now()),task,date:by('taskDate')?.value||'',owner:by('taskOwner')?.value||'',status:'To do'});pwrite('planner',a);renderTasks();toast('Task ditambahkan')}
function toggleTask(id){const a=pread('planner',[]),x=a.find(v=>v.id===id);if(x){x.status=x.status==='Done'?'To do':'Done';pwrite('planner',a);renderTasks()}}
function renderTasks(){const e=by('taskList');if(!e)return;const a=pread('planner',[]);e.innerHTML=a.length?a.map(x=>`<div class="list-row"><span><b>${esc(x.task)}</b><small>${esc(x.date||'No deadline')} · ${esc(x.owner||'Unassigned')}</small></span><button class="btn small ${x.status==='Done'?'dark':'light'}" onclick="toggleTask('${x.id}')">${esc(x.status)}</button></div>`).join(''):'<div class="empty">Belum ada task.</div>'}

function addBudget(){if(!ensureProject())return;const a=pread('budget',[]);a.push({id:crypto.randomUUID?.()||String(Date.now()),category:by('budgetCat')?.value||'Other',planned:Number(by('budgetPlan')?.value||0),actual:Number(by('budgetActual')?.value||0)});pwrite('budget',a);renderBudget();toast('Budget ditambahkan')}
function renderBudget(){const e=by('budgetList');if(!e)return;const a=pread('budget',[]),p=a.reduce((s,x)=>s+Number(x.planned||0),0),r=a.reduce((s,x)=>s+Number(x.actual||0),0);e.innerHTML=a.length?a.map(x=>`<div class="list-row"><span><b>${esc(x.category)}</b><small>Planned Rp ${x.planned.toLocaleString('id-ID')}</small></span><strong>Actual Rp ${x.actual.toLocaleString('id-ID')}</strong></div>`).join(''):'<div class="empty">Belum ada budget.</div>';if(by('totalPlan'))by('totalPlan').textContent='Rp '+p.toLocaleString('id-ID');if(by('totalActual'))by('totalActual').textContent='Rp '+r.toLocaleString('id-ID');if(by('remaining'))by('remaining').textContent='Rp '+(p-r).toLocaleString('id-ID');if(by('budgetItems'))by('budgetItems').textContent=a.length}

function saveLocation(){if(!ensureProject())return;const x={type:by('locType')?.value||'Main Venue',name:(by('locName')?.value||'').trim(),address:(by('locAddress')?.value||'').trim(),url:(by('locUrl')?.value||'').trim()};pwrite('location',x);renderLocation();toast('Location tersimpan')}
function renderLocation(){const e=by('locationPreview');if(!e)return;const x=pread('location',{});e.innerHTML=x?.name?`<div class="notice">📍 <b>${esc(x.name)}</b><br>${esc(x.address)}</div><div class="actions">${x.url?`<a class="btn dark" target="_blank" rel="noopener" href="${esc(x.url)}">Open Map →</a>`:''}</div>`:'<div class="empty">Belum ada location.</div>'}

function generateConcept(){if(!ensureProject())return;const p=currentProject(),prompt=(by('aiPrompt')?.value||'').trim();if(!prompt){toast('Masukkan prompt');return}const r={prompt,eventType:p.type,theme:`${p.type} creative direction`,palette:'Primary + accent + neutral',typography:'Display + readable body',copy:'Warm, concise event message',storyboard:'Opening → Main moment → Details → RSVP → Closing'};pwrite('ai',r);if(by('aiResult'))by('aiResult').innerHTML=`<div class="notice">Creative brief saved to this Project.</div><h2>${esc(r.theme)}</h2><p class="muted">${esc(r.prompt)}</p><div class="list"><div class="list-row"><span>Palette</span><strong>${esc(r.palette)}</strong></div><div class="list-row"><span>Typography</span><strong>${esc(r.typography)}</strong></div><div class="list-row"><span>Storyboard</span><strong>${esc(r.storyboard)}</strong></div></div><div class="actions"><a class="btn primary" href="invitation-editor.html">Use in Invitation →</a></div>`}

function saveDesign(){if(!ensureProject())return;pwrite('design',{type:by('designType')?.value||'Poster',headline:by('designHeadline')?.value||'',sub:by('designSub')?.value||'',notes:by('designNotes')?.value||'',updatedAt:new Date().toISOString()});toast('Design saved to Project')}
function updateDesignPreview(){if(by('dpType'))by('dpType').textContent=(by('designType')?.value||'Poster').toUpperCase();if(by('dpHead'))by('dpHead').textContent=by('designHeadline')?.value||'YOUR EVENT';if(by('dpSub'))by('dpSub').textContent=by('designSub')?.value||'DATE · VENUE'}

function fillEditor(){if(!by('title'))return;const i=invitation()||{},p=currentProject()||{};by('title').value=i.title||p.name||'Your Event';by('opening').value=i.opening||'';by('date').value=i.date||p.date||'';by('time').value=i.time||p.time||'10:00';by('venue').value=i.venue||p.location||'Your Venue';by('slug').value=i.slug||slugify(p.name);if(by('template'))by('template').value=i.template||'International Classic';const img=by('templateVisual');if(img){img.src=templateAsset(i.template||'International Classic');img.onerror=()=>img.style.display='none'}updateEditorPreview()}
function updateEditorPreview(){if(!by('pvTitle'))return;by('pvTitle').textContent=by('title')?.value||'Your Event';by('pvOpening').textContent=by('opening')?.value||'';by('pvDate').textContent=(by('date')?.value||'Your date')+' · '+(by('time')?.value||'10:00');by('pvVenue').textContent=by('venue')?.value||'Your Venue'}
function renderDetail(){const i=invitation()||{},p=currentProject()||{};if(by('title'))by('title').textContent=i.title||p.name||'Your Event';if(by('opening'))by('opening').textContent=i.opening||'';if(by('date'))by('date').textContent=(i.date||p.date||'Your date')+' · '+(i.time||p.time||'10:00');if(by('d1'))by('d1').textContent=i.date||p.date||'Your date';if(by('d2'))by('d2').textContent=i.time||p.time||'10:00';if(by('venue'))by('venue').textContent=i.venue||p.location||'Your Venue';if(by('publishedStatus'))by('publishedStatus').textContent=i.published?'Published':'Draft';const img=by('detailTemplateVisual');if(img){img.src=templateAsset(i.template||'International Classic');img.onerror=()=>img.style.display='none'}const loc=pread('location',{});if(by('detailLocation'))by('detailLocation').innerHTML=loc?.name?`<div class="notice">📍 <b>${esc(loc.name)}</b><br>${esc(loc.address||'')}</div>${loc.url?`<a class="btn dark" href="${esc(loc.url)}" target="_blank" rel="noopener">Open Map →</a>`:''}`:'<div class="empty">Location will appear here.</div>';countdown(i.date||p.date,i.time||p.time)}
function countdown(ds,ts){const grid=by('countdownGrid');if(!grid)return;const ids=['cdDays','cdHours','cdMinutes','cdSeconds'];const tick=()=>{if(!ds){ids.forEach(id=>{if(by(id))by(id).textContent='—'});return}const sec=Math.max(0,Math.floor((new Date(ds+'T'+(ts||'00:00'))-Date.now())/1000));const v=[Math.floor(sec/86400),Math.floor(sec%86400/3600),Math.floor(sec%3600/60),sec%60];v.forEach((x,i)=>{if(by(ids[i]))by(ids[i]).textContent=x})};tick();setInterval(tick,1000)}
function renderAnalytics(){const a=guests(),i=invitation()||{},c=a.filter(x=>x.rsvp==='Confirmed').length,d=a.filter(x=>x.rsvp==='Declined').length,m=a.filter(x=>x.rsvp==='Maybe'||x.rsvp==='Pending').length;[['aViews',i.views||0],['aShares',i.shareCount||0],['aConfirmed',c],['aDeclined',d],['aPending',m],['checkins',a.filter(x=>x.checkedIn).length]].forEach(([id,v])=>{if(by(id))by(id).textContent=v});const rate=a.length?Math.round(c/a.length*100):0;if(by('rate'))by('rate').textContent=rate+'%';if(by('bar'))by('bar').style.width=rate+'%'}

function renderShell(){
 const h=by('masterHeader'),f=by('masterFooter'),u=currentUser(),active=document.body.dataset.active||'';
 const nav=[['index.html','Home','home'],['create.html','Create','create'],['templates.html','Templates','templates'],['features.html','Features','features'],['dashboard.html','Dashboard','dashboard']];
 if(h)h.innerHTML=`<header class="site-header"><div class="header-inner"><a class="brand" href="index.html"><span class="brand-mark">AA<span>:</span></span><span>Event Maker</span></a><nav class="main-nav">${nav.map(x=>`<a class="${active===x[2]?'active':''}" href="${x[0]}">${x[1]}</a>`).join('')}</nav><div class="header-actions">${u?`<a class="auth-user" href="profile.html"><span>${esc(u.name)}</span><span class="avatar" id="headerAvatar">${esc((u.name||'A').slice(0,1).toUpperCase())}</span></a><button class="btn dark" onclick="logout()">Logout</button>`:`<a class="btn light" href="login.html">Login</a><a class="btn dark" href="signup.html">Sign Up</a>`}</div></div></header>`;
 if(f)f.innerHTML=`<footer class="footer"><div class="footer-inner"><div><strong>AA : Event Maker</strong><div>Create. Celebrate. Remember.</div></div><div><a href="templates.html">Templates</a> · <a href="features.html">Features</a> · <a href="profile.html">Profile</a></div><div>© ${new Date().getFullYear()} AA : Event Maker</div></div></footer>`;
 updateAvatarUI();
}
function boot(){
 migrateLegacy();if(!guard())return;renderShell();
 const u=currentUser(),p=currentProject(),i=invitation();
 if(by('accountName'))by('accountName').textContent=u?.name||'Guest';if(by('accountEmail'))by('accountEmail').textContent=u?.email||'';
 if(by('projectName'))by('projectName').textContent=p?.name||'No project selected';if(by('projectMeta'))by('projectMeta').textContent=p?`${p.type} · ${formatDate(p.date)}${p.location?' · '+p.location:''}`:'Create your first event';
 if(by('dashTitle')&&p)by('dashTitle').textContent=p.name;if(by('views'))by('views').textContent=i?.views||0;if(by('confirmed'))by('confirmed').textContent=guests().filter(x=>x.rsvp==='Confirmed').length;if(by('guestCount'))by('guestCount').textContent=guests().length;if(by('budgetCount'))by('budgetCount').textContent=pread('budget',[]).length;
 if(by('projectCount'))by('projectCount').textContent=projects().length;if(by('profileName')&&u)by('profileName').value=u.name;if(by('profileEmail')&&u)by('profileEmail').value=u.email;
 fillEditor();renderDetail();renderGuests();renderTasks();renderBudget();renderLocation();renderAnalytics();updateDesignPreview();
 const pList=by('projectList');if(pList){const a=projects(),cur=activeProjectId();pList.innerHTML=a.length?a.map(x=>`<div class="list-row"><span><b>${esc(x.name)}</b><small>${esc(x.type)} · ${esc(formatDate(x.date))}</small></span><div class="actions"><button class="btn small ${x.id===cur?'dark':'light'}" onclick="setProject('${x.id}')">${x.id===cur?'Active':'Open'}</button><button class="btn small light" onclick="deleteProject('${x.id}')">Delete</button></div></div>`).join(''):'<div class="empty">No projects yet.</div>'}
 updateAvatarUI();
}
function setProject(id){rawSet(CURRENT_PROJECT_KEY,id);location.reload()}
document.addEventListener('DOMContentLoaded',boot);
