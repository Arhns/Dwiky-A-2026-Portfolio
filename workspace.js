const desktop=document.querySelector('#workspace'),desktopMain=document.querySelector('#desktopMain'),desktopContent=document.querySelector('.desktop-content');
let activeFilter='All';
let activeCategory='product',zoomAnimation=null,desktopBusy=false,returnFocus=null,workspaceOrigin='product',roomZoom='none',previousOverflow='';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
function workspaceMotion(){return {duration:motionPreference.matches?1:980,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}}
function panelOrigin(){
 const r=room.getBoundingClientRect(),p=workspaceOrigin==='about'?[.30,.49]:[.38,.37],d=desktopContent.getBoundingClientRect();
 return `translate(${r.left+r.width*p[0]-d.left-d.width/2}px,${r.top+r.height*p[1]-d.top-d.height/2}px) scale(.12)`;
}
let panelStart='none';
async function enterWorkspace(category='product'){
 if(desktopBusy||desktop.open)return;
 desktopBusy=true;returnFocus=document.activeElement;workspaceOrigin=category;activeCategory=category;activeFilter='All';renderWorkspace();
 const r=room.getBoundingClientRect(),point=category==='about'?[.30,.49]:[.38,.37];
 previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';desktop.showModal();desktop.classList.add('ready');panelStart=panelOrigin();
 room.style.transformOrigin=`${point[0]*100}% ${point[1]*100}%`;
 roomZoom=motionPreference.matches?'none':`translate(${innerWidth/2-r.left-r.width*point[0]}px,${innerHeight/2-r.top-r.height*point[1]}px) scale(3.8)`;
 room.classList.add('workspace-away');desktop.classList.add('in-motion');
 const options=workspaceMotion();
 zoomAnimation=room.animate([{transform:'none',opacity:1},{transform:roomZoom,opacity:.35}],options);
 const panel=desktopContent.animate([{transform:motionPreference.matches?'none':panelStart,opacity:0},{transform:'none',opacity:1}],options);
 const veil=desktop.animate([{opacity:0},{opacity:1}],options);
 await Promise.all([zoomAnimation.finished,panel.finished,veil.finished]);panel.cancel();veil.cancel();desktop.classList.remove('in-motion');desktopBusy=false;document.querySelector('#backRoom').focus({preventScroll:true});
}
async function leaveWorkspace(){
 if(desktopBusy||!desktop.open)return;desktopBusy=true;desktop.classList.add('in-motion');
 const options=workspaceMotion();zoomAnimation?.cancel();
 const camera=room.animate([{transform:roomZoom,opacity:.35},{transform:'none',opacity:1}],options);
 const panel=desktopContent.animate([{transform:'none',opacity:1},{transform:motionPreference.matches?'none':panelStart,opacity:0}],options);
 const veil=desktop.animate([{opacity:1},{opacity:0}],options);
 await Promise.all([camera.finished,panel.finished,veil.finished]);desktop.close();[camera,panel,veil].forEach(a=>a.cancel());zoomAnimation=null;
 desktop.classList.remove('ready','in-motion');room.classList.remove('workspace-away');room.style.transformOrigin='';document.body.style.overflow=previousOverflow;desktopBusy=false;returnFocus?.focus({preventScroll:true});
}
document.querySelector('#backRoom').onclick=leaveWorkspace;document.querySelector('#closeDesktop').onclick=leaveWorkspace;desktop.addEventListener('cancel',e=>{e.preventDefault();leaveWorkspace()});
document.querySelectorAll('[data-worktab]').forEach(b=>b.onclick=()=>{activeCategory=b.dataset.worktab;renderWorkspace()});document.querySelectorAll('[data-enter-workspace]').forEach(b=>b.onclick=()=>enterWorkspace(b.dataset.enterWorkspace));
function projectMockup(p,hero=false){
 const kind=[0,2,3,7].includes(p.id)?'phone':([1,4,5,6,9,10,11,100,101,102].includes(p.id)?'browser':'brand');
 const family=p.filter==='Pina'?'pina':p.filter==='Bananas'?'bananas':p.filter==='Tokopedia'?'tokopedia':'graphic';
 return '<span class="mockup-stage mockup-'+kind+' family-'+family+'"><span class="mockup-orbit" aria-hidden="true"></span><span class="mockup-device">'+(kind==='browser'?'<span class="mockup-browserbar" aria-hidden="true"><i></i><i></i><i></i><span></span></span>':'')+'<span class="mockup-screen"><img src="'+esc(p.cover)+'" alt="'+esc(p.title)+' project preview" '+(hero?'loading="eager"':'loading="lazy"')+'></span></span></span>';
}
function renderWorkspace(){desktop.classList.toggle('book-mode',activeCategory==='about');desktopContent.scrollTop=0;const graphic=activeCategory==='graphic';document.querySelector('.window-controls').src=graphic?'assets/figma/20681-6078-10.svg':'assets/figma/20681-6015-8.svg';document.querySelector('.window-tab').textContent=activeCategory==='about'?'cv.pix':'projects.pix';if(activeCategory==='about'){renderAbout();return}const all=window.PROJECTS.filter(p=>p.category===activeCategory&&!p.archived).sort((a,b)=>(a.designOrder??a.id)-(b.designOrder??b.id));const projects=all.filter(p=>activeFilter==='All'||p.filter===activeFilter);const filters=graphic?['All','Logo','Website','Branding']:['All','Pina','Bananas','Tokopedia'];desktopMain.innerHTML=`<div class="showcase-heading"><nav class="workspace-tabs" aria-label="Project categories"><button data-cat="product" aria-pressed="${!graphic}">UI/UX</button><button data-cat="graphic" aria-pressed="${graphic}">GRAPHIC DESIGN</button></nav><span class="showcase-count">${graphic?'GRAPHIC':'UI/UX'} · ${projects.length} PROJECTS</span></div><div class="project-filters" aria-label="Project filters">${filters.map(f=>'<button data-filter="'+f+'" aria-pressed="'+(f===activeFilter)+'">'+f+'</button>').join('')}</div><section class="project-grid" aria-label="Projects">${projects.map(p=>'<button class="project-card" data-project="'+p.id+'"><span class="project-cover">'+projectMockup(p)+'</span><h3>'+esc(p.cardTitle||p.title)+'</h3><p>'+esc(p.cardSubtitle||p.tag)+'</p></button>').join('')}</section>`;desktopMain.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{activeCategory=b.dataset.cat;activeFilter='All';renderWorkspace()});desktopMain.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{activeFilter=b.dataset.filter;renderWorkspace()});desktopMain.querySelectorAll('[data-project]').forEach(b=>b.onclick=()=>showProject(Number(b.dataset.project)));handleImages()}
async function transitionCase(render,back=false){
 if(desktopBusy)return;desktopBusy=true;
 const reduced=motionPreference.matches,direction=back?-1:1,animations=[];
 desktopMain.style.pointerEvents='none';
 try{
  const out=desktopMain.animate([{opacity:1,transform:'none'},{opacity:0,transform:reduced?'none':`translateX(${-direction*22}px) scale(.99)`}],{duration:reduced?1:180,easing:'cubic-bezier(.4,0,1,1)',fill:'both'});animations.push(out);
  await out.finished;render();
  // Hold the replacement hidden while its hero decodes, avoiding a blank-image pop.
  const hero=desktopMain.querySelector('.case-hero img');
  if(hero&&!hero.complete)await Promise.race([hero.decode().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,450))]);
  const root=desktopMain.animate([{opacity:0,transform:reduced?'none':`translateX(${direction*30}px)`},{opacity:1,transform:'none'}],{duration:reduced?1:640,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});animations.push(root);out.cancel();
  const targets=desktopMain.querySelectorAll('.case-heading,.case-metadata,.case-hero,.case-context,.case-facts>section,.case-result,.project-card');
  targets.forEach((el,i)=>{animations.push(el.animate([{opacity:0,transform:reduced?'none':'translateY(18px)'},{opacity:1,transform:'none'}],{duration:reduced?1:620,delay:reduced?0:Math.min(i,6)*45,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}))});
  await Promise.all(animations.slice(1).map(a=>a.finished));
 }finally{
  animations.forEach(a=>a.cancel());desktopMain.style.pointerEvents='';desktopBusy=false;desktopMain.querySelector('button')?.focus({preventScroll:true});
 }
}
function showProject(id){return transitionCase(()=>renderProject(id))}
function renderProject(id){
 const p=PROJECTS.find(p=>p.id===id),c=CASE_CONTENT[id]||{},list=PROJECTS.filter(x=>x.category===p.category&&!x.archived).sort((a,b)=>(a.designOrder??a.id)-(b.designOrder??b.id)),ix=list.indexOf(p),prev=list[ix-1],next=list[(ix+1)%list.length];
 const nav=()=>`<nav class="case-pager" aria-label="Project navigation"><div class="case-pager-start">${prev?'<button data-case-back>← Back</button>':''}<button data-case-all>All projects</button></div><button data-case-next><small>Next project</small>${esc(next.title)} →</button></nav>`;
 const highlights=t=>esc(t).replace(/(~?\d+(?:[–-]\d+)?%)/g,'<mark>$1</mark>').replace(/(went up|understood the features better|liked being able to reorder their homepage|positive feedback|more responsive|drained less battery)/g,'<mark>$1</mark>');
 const shots=c.shots?.length?c.shots:p.gallery.map((src,i)=>({src,cap:p.title+' — design '+(i+1)}));
 desktopMain.innerHTML=nav()+`<div class="case-layout"><aside class="case-meta"><section class="case-heading"><h2><strong>${esc((c.name||p.title).toUpperCase())}</strong>${c.sub?`<span>${esc(c.sub)}</span>`:""}</h2></section>${caseMetadata(c)}</aside><div class="case-body"><button class="case-image case-hero" data-preview="${esc(p.cover)}" aria-label="Enlarge project thumbnail">${projectMockup(p,true)}</button>${renderCaseSections(p)}${c.stats?.length||c.outcome?.length?`<section class="case-result"><h3>Result</h3><div class="case-stats">${(c.stats||[]).map(([n,t])=>`<div><strong>${esc(n)}</strong><span>${esc(t)}</span></div>`).join('')}</div>${(c.outcome||[]).map(t=>'<p>'+highlights(t)+'</p>').join('')}${c.note?'<small>'+esc(c.note)+'</small>':''}</section>`:''}<section class="case-gallery">${shots.map(x=>`<figure><button class="case-image" data-preview="${esc(x.src)}" aria-label="Enlarge ${esc(x.cap)}"><img loading="lazy" src="${esc(x.src)}" alt="${esc(x.cap)}"></button><figcaption>${esc(x.cap)} · Click to enlarge</figcaption></figure>`).join('')}</section></div></div>`+nav();
 desktopMain.querySelectorAll('[data-case-all]').forEach(b=>b.onclick=()=>transitionCase(()=>{activeFilter='All';renderWorkspace()},true));desktopMain.querySelectorAll('[data-case-back]').forEach(b=>b.onclick=()=>transitionCase(()=>prev?renderProject(prev.id):renderWorkspace(),true));desktopMain.querySelectorAll('[data-case-next]').forEach(b=>b.onclick=()=>showProject(next.id));desktopMain.querySelectorAll('[data-preview]').forEach(b=>b.onclick=()=>{const d=document.createElement('dialog');d.className='image-preview';d.innerHTML=`<button aria-label="Close image preview">×</button><img src="${esc(b.dataset.preview)}" alt="${esc(b.getAttribute('aria-label'))}">`;if(b.classList.contains('case-hero')){d.classList.add('mockup-preview');d.innerHTML='<button aria-label="Close image preview">×</button>'+projectMockup(p,true)}document.body.append(d);d.querySelector('button').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d)d.close()});d.addEventListener('close',()=>{d.remove();b.focus()});d.showModal()});desktopContent.scrollTop=0;handleImages();
}

function handleImages(){desktopMain.querySelectorAll('img').forEach(im=>im.onerror=()=>{const message=document.createElement('div');message.className='image-error';message.textContent='Preview unavailable. Open the original case study to see this visual.';im.replaceWith(message)})}
function renderAbout(){const c=CV_DATA;desktopMain.innerHTML=`<section class="about-layout"><div class="book-page book-profile"><div class="book-kicker">DWIKY ARHANSA <span>✦</span> PERSONAL ARCHIVE</div><p class="eyebrow">THE DESIGNER BEHIND THE ROOM</p><h2>Halo, I’m Dwiky<br>Arhansa.</h2>${c.intro.map(x=>'<p>'+esc(x)+'</p>').join('')}<h3>CONTACT INFO</h3><div class="profile-links"><a href="tel:+6281286154344">+62 812 8615 4344 ↗</a><a href="mailto:arhansadwiky@gmail.com">arhansadwiky@gmail.com ↗</a></div><h3>EDUCATION</h3><p>Universitas Bina Nusantara<br>Bachelor of Visual Communication Design</p><h3>SKILL &amp; EXPERTISE</h3><p class="skill-list">${c.skills.map(esc).join(' · ')}</p><h3>TOOLS</h3><ul class="cv-tools">${c.tools.map((name,i)=>`<li><span class="cv-tool-icons" aria-hidden="true">${[["figma"],["adobeillustrator","adobephotoshop"],["notion"],["jira"],["openai"],["claude"]][i].map(icon=>`<img src="assets/tools/${icon}.svg" alt="" width="22" height="22">`).join('')}</span><span>${esc(name)}</span></li>`).join('')}</ul><div class="profile-links"><a href="assets/cv-editorial.pdf" download="Dwiky-Arhansa-CV.pdf">Download CV ↓</a></div></div><div class="experience book-page"><div class="book-kicker">CHAPTER 02 <span>✦</span> THE JOURNEY</div><h3>EXPERIENCE</h3>${c.jobs.map(j=>`<div class="experience-row"><strong>${esc(j.company)}</strong><span>${esc(j.role)}</span><small>${esc(j.location)} · ${esc(j.date)}</small><ul>${j.points.map(x=>'<li>'+esc(x)+'</li>').join('')}</ul></div>`).join('')}</div></section>`}
function renderCaseSections(p){const c=CASE_CONTENT[p.id];if(!c)return '';const format=t=>esc(t).replace(/&lt;strong&gt;/g,'<strong>').replace(/&lt;\/strong&gt;/g,'</strong> ');const section=(title,items)=>{if(!items?.length)return '';const content=items.length===1?'<p>'+format(items[0])+'</p>':'<ul>'+items.map(t=>'<li>'+format(t)+'</li>').join('')+'</ul>';return '<section><h3>'+title+'</h3>'+content+'</section>'};return '<p class="case-context">'+esc(c.about||p.headline)+'</p><div class="case-facts">'+section('Problem',c.problem)+section('What we learned',c.finding)+section('What I did',c.proposal)+'</div>'}

function caseMetadata(c){const fact=(label,value)=>value?`<dt>${label}</dt><dd>${esc(value)}</dd>`:"";const chips=c.process||c.items||[];return `<dl class="case-metadata">${fact("Role",c.role)}${fact("Company",[c.co,c.when].filter(Boolean).join(", "))}${fact("Category",c.cat)}${chips.length?`<dt>${c.gfx?"Includes":"Process"}</dt><dd><ul>${chips.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></dd>`:""}</dl>`}
