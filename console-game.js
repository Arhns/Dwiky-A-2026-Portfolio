(()=>{
 const url='https://puddle-patrol-hop.arhns.chatgpt.site/?portfolio=1';
 const consoleButton=document.createElement('button');consoleButton.type='button';consoleButton.id='consoleGame';consoleButton.setAttribute('aria-label','Play Puddle Patrol from the console');consoleButton.title='Play Puddle Patrol';document.querySelector('#room').append(consoleButton);
 const dialog=document.createElement('dialog');dialog.className='console-dialog';dialog.setAttribute('aria-label','Puddle Patrol game');
 dialog.innerHTML='<div class="console-panel"><header class="console-bar"><strong>puddle-patrol.pix</strong><button type="button" class="console-close" aria-label="Close game">X</button></header><nav class="console-nav" aria-label="Game navigation"><button type="button" class="console-back">◀ ROOM</button></nav><div class="console-screen"><p class="console-loading">Loading game…</p></div></div>';
 document.body.append(dialog);let previousOverflow='',busy=false;
 const panel=dialog.querySelector('.console-panel'),screen=dialog.querySelector('.console-screen');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function animate(open){return panel.animate(open?[{opacity:0,transform:'translateY(25px) scale(.94)'},{opacity:1,transform:'none'}]:[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(20px) scale(.96)'}],{duration:reduced.matches?1:open?650:280,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'})}
 consoleButton.onclick=async()=>{
  if(dialog.open||busy)return;busy=true;document.dispatchEvent(new Event('portfolio:game-open'));
  previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();
  const frame=document.createElement('iframe');frame.src=url;frame.title='Play Puddle Patrol';frame.allow='fullscreen; gamepad';frame.referrerPolicy='strict-origin-when-cross-origin';frame.setAttribute('allowfullscreen','');
  screen.replaceChildren(frame);const anim=animate(true);await anim.finished;anim.cancel();busy=false;dialog.querySelector('.console-back').focus({preventScroll:true});
 };
 async function close(){if(!dialog.open||busy)return;busy=true;const anim=animate(false);await anim.finished;dialog.close();screen.replaceChildren();anim.cancel();document.body.style.overflow=previousOverflow;busy=false;consoleButton.focus({preventScroll:true})}
 dialog.querySelector('.console-close').onclick=close;dialog.querySelector('.console-back').onclick=close;
 dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
})();
