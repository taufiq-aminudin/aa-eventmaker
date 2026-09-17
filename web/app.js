const toastEl=document.getElementById("toast");
function toast(msg){toastEl.textContent=msg;toastEl.classList.add("show");setTimeout(()=>toastEl.classList.remove("show"),2600)}
function openCreate(){document.getElementById("create").scrollIntoView({behavior:"smooth"});setTimeout(()=>document.getElementById("eventName").focus(),500)}
function useTemplate(name){document.getElementById("eventName").value="My "+name+" Event";openCreate();toast(name+" selected")}
function createProject(){const name=document.getElementById("eventName").value.trim();const type=document.getElementById("eventType").value;const date=document.getElementById("eventDate").value;if(!name){toast("Please enter an event name");return}const project={id:crypto.randomUUID?crypto.randomUUID():Date.now().toString(),name,type,date,createdAt:new Date().toISOString()};localStorage.setItem("aaem_project",JSON.stringify(project));location.href="dashboard.html"}
const saved=localStorage.getItem("aaem_project");
if(saved){const p=JSON.parse(saved);document.getElementById("projectResult").textContent=`Last project: ${p.name} · ${p.type}`;}
