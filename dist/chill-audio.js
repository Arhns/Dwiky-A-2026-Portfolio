(()=>{
 const controls=document.createElement('div');controls.className='chill-controls';
 controls.innerHTML='<button type="button" aria-pressed="false" aria-label="Play relaxing music" title="Play music"><svg class="music-icon" aria-hidden="true" viewBox="0 0 16 16" width="18" height="18" fill="currentColor"><path d="M6 2h8v9h-2V5H8v8H6V2ZM2 12h4v3H2v-3Zm8-2h4v3h-4v-3Z"/></svg><span>CHILL RADIO</span><span class="audio-state" aria-hidden="true">▶</span></button><label><span class="sr-only">Music volume</span><input aria-label="Music volume" type="range" min="0" max="100" value="30"></label>';
 document.querySelector('.world').append(controls);
 const next=document.createElement('button');next.type='button';next.className='audio-next';next.textContent='▶▏';next.setAttribute('aria-label','Next song');next.title='Next song';controls.insertBefore(next,controls.querySelector('label'));
 const count=document.createElement('span');count.className='audio-count';count.textContent='1/2';count.setAttribute('aria-live','polite');controls.insertBefore(count,next);
 const button=controls.querySelector('button'),slider=controls.querySelector('input'),state=controls.querySelector('.audio-state');
 const songs=['assets/music/chill-radio.mp4','assets/music/chill-radio-2.mp4'];let current=0;
 const track=new Audio(songs[0]);track.preload='none';track.volume=.3;
 async function advance(autoplay){if(next.disabled)return;next.disabled=true;button.disabled=true;try{current=(current+1)%songs.length;track.src=songs[current];count.textContent=`${current+1}/2`;if(autoplay){state.textContent='…';await track.play()}sync()}catch{retry()}finally{next.disabled=false;button.disabled=false}}
 next.onclick=()=>advance(!track.paused);track.addEventListener('ended',()=>advance(true));
 function sync(){const playing=!track.paused;button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',playing?'Pause relaxing music':'Play relaxing music');button.title=playing?'Pause music':'Play music';state.textContent=playing?'Ⅱ':'▶'}
 function retry(){state.textContent='↻';button.title='Retry music';button.setAttribute('aria-label','Retry relaxing music');button.setAttribute('aria-pressed','false')}
 button.onclick=async()=>{button.disabled=true;try{if(track.paused){state.textContent='…';await track.play()}else track.pause();sync()}catch{retry()}finally{button.disabled=false}};
 slider.oninput=()=>{track.volume=Number(slider.value)/100};
 track.addEventListener('pause',sync);track.addEventListener('playing',sync);track.addEventListener('error',()=>{retry();button.disabled=false});
 window.addEventListener('pagehide',()=>track.pause());
 document.addEventListener('portfolio:game-open',()=>track.pause());
})();
