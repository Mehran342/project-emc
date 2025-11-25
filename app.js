let user = null;
let currentProjectId = null;

async function login() {
  const email = document.getElementById('email').value;
  if (!email) return alert('ایمیل وارد شود');
  const res = await fetch('http://localhost:4000/api/login', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email})
  });
  user = (await res.json()).email;
  document.getElementById('login').style.display='none';
  document.getElementById('chatApp').style.display='block';
  loadProjects();
}

async function loadProjects() {
  const res = await fetch('http://localhost:4000/api/projects');
  const projects = await res.json();
  const ul = document.getElementById('projects');
  ul.innerHTML='';
  projects.forEach(p=>{
    const li=document.createElement('li');
    li.textContent = p.title;
    li.style.cursor='pointer';
    li.onclick=()=>openProject(p);
    ul.appendChild(li);
  });
}

async function openProject(p) {
  currentProjectId = p.id;
  document.getElementById('projects').style.display='none';
  document.getElementById('messagesContainer').style.display='block';
  document.getElementById('projectTitle').textContent = p.title;
  loadMessages();
}

async function loadMessages() {
  const res = await fetch(`http://localhost:4000/api/messages/${currentProjectId}`);
  const messages = await res.json();
  const container = document.getElementById('messages');
  container.innerHTML='';
  messages.forEach(m=>{
    const div=document.createElement('div');
    div.className='message';
    div.textContent=`${m.author}: ${m.text}`;
    container.appendChild(div);
  });
}

async function sendMessage() {
  const text = document.getElementById('msgInput').value;
  if(!text) return;
  await fetch(`http://localhost:4000/api/messages/${currentProjectId}`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({author:user, text})
  });
  document.getElementById('msgInput').value='';
  loadMessages();
}

function backProjects() {
  document.getElementById('messagesContainer').style.display='none';
  document.getElementById('projects').style.display='block';
}
