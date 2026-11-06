function currentPeriod(h=new Date().getHours()){return h<6||h>=18?'night':h>=15?'evening':h>=11?'noon':'morning'}
const periodNames={morning:'PAGI',noon:'SIANG',evening:'SORE',night:'MALAM'};
function updateHomeClock(){const now=new Date(),colon=now.getMilliseconds()<500?'':' off';document.querySelector('#time').innerHTML=`${String(now.getHours()).padStart(2,'0')}<span class="clock-separator${colon}">:</span>${String(now.getMinutes()).padStart(2,'0')}`;room.dataset.light=period==='auto'?currentPeriod():period;document.querySelector('#themeAuto').setAttribute('aria-pressed',String(period==='auto'));document.querySelector('#themeTime').value=period==='auto'?currentPeriod():period;document.querySelector('#year').textContent=now.getFullYear()}
document.querySelector('#themeAuto').onclick=()=>{period='auto';updateHomeClock()};document.querySelector('#themeTime').onchange=e=>{period=e.target.value;updateHomeClock()};updateHomeClock();setInterval(updateHomeClock,250);
// Effects share the coordinate system of the 1024px room artwork.
const homeFX=document.createElement('canvas');homeFX.width=homeFX.height=1024;homeFX.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:5';homeFX.setAttribute('aria-hidden','true');room.append(homeFX);const hc=homeFX.getContext('2d');
function polygon(points,color){hc.beginPath();points.forEach(([x,y],i)=>i?hc.lineTo(x,y):hc.moveTo(x,y));hc.closePath();hc.fillStyle=color;hc.fill()}
function glow(x,y,rx,ry,color){hc.save();hc.translate(x,y);hc.scale(rx,ry);let g=hc.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,color);g.addColorStop(1,'transparent');hc.fillStyle=g;hc.fillRect(-1,-1,2,2);hc.restore()}
// Trace the actual blue glass pixels, preserving the blind, bevels and mullions.
// A geometric quadrilateral alone leaves a visible seam against the painted frame.
let glassMask=null,glassTexture=null;
const roomArtwork=room.querySelector('img');
function prepareWindowGlass(){
 const sample=document.createElement('canvas');sample.width=sample.height=1024;
 const ctx=sample.getContext('2d',{willReadFrequently:true});ctx.drawImage(roomArtwork,0,0,1024,1024);
 const pixels=ctx.getImageData(684,292,102,96).data,mask=new Uint8Array(102*96),path=new Path2D();
 const bounds=[[[686,294],[732,316],[732,360],[686,339]],[[738,321],[783,342],[783,386],[738,365]]];
 function inside(x,y,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [a,b]=poly[i],[c,d]=poly[j];if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)yes=!yes}return yes}
 for(let y=0;y<96;y++)for(let x=0;x<102;x++){
  const i=(y*102+x)*4,[r,g,b]=pixels.subarray(i,i+3);
  if(bounds.some(p=>inside(x+684,y+292,p))&&b>r+16&&g>r+12)mask[y*102+x]=1;
 }
 glassTexture=document.createElement('canvas');glassTexture.width=1024;glassTexture.height=1024;const texture=glassTexture.getContext('2d');
 for(let y=0;y<96;y++)for(let x=0;x<102;x++)if(mask[y*102+x]){
  path.rect(x+684,y+292,1,1);const i=(y*102+x)*4,r=pixels[i],g=pixels[i+1];
  const edge=!mask[y*102+x-1]||!mask[y*102+x+1]||!mask[(y-1)*102+x]||!mask[(y+1)*102+x];
  texture.fillStyle=edge?'rgba(15,27,39,.32)':r>125&&g>175?'rgba(217,239,247,.14)':'rgba(21,43,60,.035)';
  texture.fillRect(x+684,y+292,1,1);
 }
 glassMask=path;
}
if(roomArtwork.complete&&roomArtwork.naturalWidth)prepareWindowGlass();else roomArtwork.addEventListener('load',prepareWindowGlass,{once:true});
function windowPanes(){hc.clip(glassMask||new Path2D())}
const windowStars=[
 [695,310,1,4100,.2],[704,325,2,5300,1.5],[721,327,1,3800,3.1],
 [699,336,1,6200,4.2],[719,341,1,4700,2.6],[745,339,1,5700,.8],
 [755,342,2,4600,3.7],[770,356,1,6500,1.9],[749,353,1,3900,4.8],
 [760,366,1,5100,2.1],[776,374,1,5900,5.5]
];
function nightWindow(t,reduced){
 hc.save();windowPanes();const sky=hc.createLinearGradient(0,300,0,385);sky.addColorStop(0,'#14213e');sky.addColorStop(1,'#385473');hc.fillStyle=sky;hc.fillRect(680,295,110,95);
 for(const [x,y,size,cycle,phase] of windowStars){
  const shimmer=reduced?.72:.55+.45*Math.sin(t*Math.PI*2/(cycle*.48)+phase);
  hc.globalAlpha=.3+shimmer*.7;hc.fillStyle='#f8eed0';hc.fillRect(x,y,size,size);
  if(size===2){hc.globalAlpha=(reduced?.18:Math.max(0,shimmer-.65))*.65;hc.fillStyle='#badbff';hc.fillRect(x-1,y,4,2);hc.fillRect(x,y-1,2,4)}
 }
 hc.globalAlpha=1;glow(714,314,9,9,'rgba(200,222,255,.13)');hc.fillStyle='#fbeab8';hc.fillRect(712,312,5,5);hc.fillStyle='#243650';hc.fillRect(714,311,4,4);
 hc.restore();if(glassTexture)hc.drawImage(glassTexture,0,0)
}
function daylightWindow(period,t,reduced){hc.save();windowPanes();const sky=hc.createLinearGradient(0,300,0,385);if(period==='evening'){sky.addColorStop(0,'#354b7b');sky.addColorStop(.55,'#d78771');sky.addColorStop(1,'#ffc176')}else if(period==='noon'){sky.addColorStop(0,'#75b8e1');sky.addColorStop(1,'#d7ebc8')}else{sky.addColorStop(0,'#80bee3');sky.addColorStop(1,'#d0eaf1')}hc.fillStyle=sky;hc.fillRect(680,295,110,95);if(period==='morning'){
 // Repeat by the same tile width, so the loop never jumps or reveals a gap.
 const shift=reduced?0:Math.floor(t/250)%48;hc.fillStyle='#f4faf8';for(let i=-1;i<3;i++){let x=680+shift+i*48;hc.fillRect(x,323,16,3);hc.fillRect(x+4,320,8,3)}
 const distant=reduced?0:Math.floor(t/400)%60;hc.fillStyle='#dceef3';for(let i=-1;i<3;i++){let x=680+distant+i*60;hc.fillRect(x,344,12,3);hc.fillRect(x+3,341,6,3)}
 }hc.restore();if(glassTexture)hc.drawImage(glassTexture,0,0)}

// Cache soft volumetric beams; only their opacity changes during animation.
const screenRays=document.createElement('canvas');screenRays.width=screenRays.height=1024;
const rc=screenRays.getContext('2d');
function lightRay(points,start,end,strength){
 rc.save();rc.filter='blur(5px)';
 const gradient=rc.createLinearGradient(...start,...end);
 gradient.addColorStop(0,`rgba(157,218,255,${strength})`);
 gradient.addColorStop(.38,`rgba(130,200,255,${strength*.5})`);
 gradient.addColorStop(1,'rgba(130,200,255,0)');
 rc.beginPath();points.forEach(([x,y],i)=>i?rc.lineTo(x,y):rc.moveTo(x,y));rc.closePath();rc.fillStyle=gradient;rc.fill();rc.restore();
}
// Monitor faces diagonally toward the chair and the centre of the room.
lightRay([[327,373],[448,317],[623,474],[501,581],[327,451]],[387,394],[551,522],.32);
lightRay([[342,414],[440,368],[575,523],[523,556]],[394,412],[550,540],.12);
const tvRays=document.createElement("canvas");tvRays.width=tvRays.height=1024;tvRays.getContext("2d").drawImage(screenRays,0,0);
rc.clearRect(0,0,1024,1024);
// TV faces away from us, toward the rug. Keep its opaque back unlit.
rc.save();rc.beginPath();rc.rect(0,0,1024,1024);
rc.moveTo(213,617);rc.lineTo(336,677);rc.lineTo(336,798);rc.lineTo(213,738);rc.closePath();rc.clip('evenodd');
lightRay([[222,625],[330,681],[527,610],[365,482]],[280,653],[454,548],.36);
lightRay([[235,632],[314,674],[463,548],[401,502]],[281,650],[440,535],.13);
rc.restore();
const monitorRays=tvRays;const televisionRays=screenRays;
let tvSceneStart=-1,tvSceneDuration=300,tvPrevious=.5,tvTarget=.8;
function tvBrightness(t){
 if(tvSceneStart<0||t-tvSceneStart>=tvSceneDuration){
  tvPrevious=tvTarget;tvTarget=.18+Math.random()*.72;
  tvSceneStart=t;tvSceneDuration=180+Math.random()*340;
 }
 const progress=Math.min(1,(t-tvSceneStart)/Math.min(110,tvSceneDuration*.4));
 const eased=progress*progress*(3-2*progress);
 return tvPrevious+(tvTarget-tvPrevious)*eased;
}

let leavesCanvas=null,leavesClip=null,unlitLamp=null;
function prepareRoomDetails(){
 const source=document.createElement('canvas');source.width=source.height=1024;const sc=source.getContext('2d',{willReadFrequently:true});sc.drawImage(roomArtwork,0,0,1024,1024);
 leavesCanvas=document.createElement('canvas');leavesCanvas.width=1024;leavesCanvas.height=1024;const lc=leavesCanvas.getContext('2d'),pixels=sc.getImageData(685,347,99,76),mask=new Path2D();
 const data=pixels.data;
 for(let y=0;y<76;y++)for(let x=0;x<99;x++){
  const i=(y*99+x)*4,r=data[i],g=data[i+1],b=data[i+2],px=x+685,py=y+347;
  const pane=(px>=688&&px<=728&&py>350+(px-688)*.5&&py<405+(px-688)*.5)||(px>=742&&px<=778&&py>378+(px-742)*.5&&py<411);
  if(pane&&g>r*1.08&&g>b*1.15){mask.rect(px,py,1,1)}else data[i+3]=0;
 }
 lc.putImageData(pixels,685,347);leavesClip=mask;
 unlitLamp=document.createElement('canvas');unlitLamp.width=1024;unlitLamp.height=1024;const off=unlitLamp.getContext('2d'),lamp=sc.getImageData(596,748,76,74);
 for(let y=0;y<74;y++)for(let x=0;x<76;x++){
  const i=(y*76+x)*4,r=lamp.data[i],g=lamp.data[i+1],b=lamp.data[i+2],d=Math.hypot((x-38)/35,(y-34)/34);
  if(r>g*1.08&&g>b*1.12&&d<1){const v=r*.36+g*.48+b*.16;lamp.data[i]=v*.94;lamp.data[i+1]=v*.91;lamp.data[i+2]=v*.83;lamp.data[i+3]=Math.round(255*Math.min(1,(1-d)*5))}else lamp.data[i+3]=0;
 }off.putImageData(lamp,596,748);
}
function paintRoomDetails(t,reduced){
 if(unlitLamp&&room.dataset.light!=='night')hc.drawImage(unlitLamp,0,0);
 if(!leavesCanvas||reduced)return;
 hc.save();hc.clip(leavesClip);hc.imageSmoothingEnabled=false;
 // Different canopy bands follow the same breeze with a slight delay.
 for(let y=347;y<423;y+=8){const dx=Math.round(Math.sin(t*.0017+y*.13)*1.5+Math.sin(t*.0007)*.5);hc.drawImage(leavesCanvas,684,y,101,8,684+dx,y,101,8)}
 const tint={morning:'rgba(156,203,240,.12)',noon:'rgba(255,227,165,.1)',evening:'rgba(230,141,83,.24)',night:'rgba(11,25,59,.78)'};
 hc.fillStyle=tint[room.dataset.light];hc.fillRect(684,347,101,76);hc.restore();
}
if(roomArtwork.complete&&roomArtwork.naturalWidth)prepareRoomDetails();else roomArtwork.addEventListener('load',prepareRoomDetails,{once:true});

const roomMotionPreference=matchMedia('(prefers-reduced-motion: reduce)');
function paintCoffeeSteam(time, reduced, period) {
 if (period !== 'morning' && period !== 'noon') return;

 hc.save();
 hc.fillStyle = '#fff6df';
 for (const delay of [0, .47]) {
  const progress = reduced ? .22 + delay : (time / 2050 + delay) % 1;
  const x = 373 + Math.round(Math.sin(progress * 9) * 4);
  const y = 477 - Math.round(progress * 32);
  hc.globalAlpha = Math.sin(progress * Math.PI) * .85;
  hc.fillRect(x, y, 4, 6);
  hc.fillRect(x + 2, y - 4, 3, 4);
  hc.fillRect(x + 4, y - 7, 2, 3);
 }
 hc.restore();
}

function windowLight(period){
 const settings={morning:['190,221,255',.16,.24],noon:['255,235,177',.20,.30],evening:['255,173,109',.18,.28],night:['237,243,255',.065,.14]};
 const [color,beamAlpha,floorAlpha]=settings[period]||settings.morning;
 // Light travels away from the right-hand window onto the open floor.
 hc.save();hc.globalCompositeOperation='screen';
 const beam=hc.createLinearGradient(730,390,485,725);beam.addColorStop(0,`rgba(${color},${beamAlpha})`);beam.addColorStop(1,`rgba(${color},0)`);
 polygon([[689,337],[779,381],[562,760],[386,664]],beam);
 // Clip the light to exposed floor, keeping it off the bed, chair, and furniture.
 hc.save();hc.beginPath();[[553,634],[648,673],[614,724],[560,746],[526,790],[469,756],[435,706]].forEach(([x,y],i)=>i?hc.lineTo(x,y):hc.moveTo(x,y));hc.closePath();hc.clip();
 const floor=hc.createLinearGradient(590,650,465,780);floor.addColorStop(0,`rgba(${color},${floorAlpha})`);floor.addColorStop(1,`rgba(${color},${floorAlpha*.25})`);
 polygon([[556,632],[650,678],[530,801],[431,747]],floor);
 hc.globalCompositeOperation='source-over';hc.strokeStyle='rgba(30,34,48,.28)';hc.lineWidth=7;
 hc.beginPath();hc.moveTo(606,650);hc.lineTo(484,783);hc.moveTo(490,682);hc.lineTo(596,735);hc.stroke();hc.restore();hc.restore();
}
let lastRoomFrame=-Infinity,lastRoomPeriod='',lastRoomGlass=null,lastRoomReduced=null;
function animateRoom(t){
 requestAnimationFrame(animateRoom);
 if(document.hidden)return;
 const reduced=roomMotionPreference.matches;
 // Pixel scenery needs only 30 fps; static reduced-motion scenes redraw on changes.
 if(lastRoomPeriod===room.dataset.light&&lastRoomGlass===glassMask&&lastRoomReduced===reduced&&(reduced||t-lastRoomFrame<1000/30))return;
 lastRoomFrame=t;lastRoomPeriod=room.dataset.light;lastRoomGlass=glassMask;lastRoomReduced=reduced;
 hc.clearRect(0,0,1024,1024);paintRoomDetails(t,reduced);windowLight(room.dataset.light);
 if(room.dataset.light!=='night')daylightWindow(room.dataset.light,t,reduced);
 paintCoffeeSteam(t, reduced, room.dataset.light);
 if(room.dataset.light==='night'){
  nightWindow(t,reduced);hc.save();hc.globalAlpha=reduced?1:.96+Math.sin(t*.0009)*.04;hc.drawImage(monitorRays,0,0);hc.restore();hc.save();hc.globalAlpha=reduced?.72:tvBrightness(t);hc.drawImage(televisionRays,0,0);hc.restore();
  // The monitor glass remains luminous; the TV glow lands in front of its screen.
  polygon([[326,370],[449,310],[449,399],[326,453]],'rgba(121,194,242,.37)');
  glow(472,498,94,47,'rgba(105,187,247,.15)');
  hc.save();hc.globalAlpha=reduced?.72:tvBrightness(t);hc.beginPath();hc.moveTo(332,670);hc.lineTo(470,585);hc.lineTo(550,637);hc.lineTo(395,730);hc.closePath();hc.clip();
  glow(433,649,115,69,'rgba(120,191,255,.23)');hc.restore();
  glow(278,482,115,75,'rgba(255,176,75,.40)');glow(280,473,27,28,'rgba(255,219,135,.85)');
  glow(632,782,115,100,'rgba(255,193,92,.76)');glow(632,782,30,30,'rgba(255,230,167,.95)');glow(568,354,55,90,'rgba(247,153,53,.20)');
 }
 if(!reduced){for(const y of [330,355,382]){hc.save();hc.translate(570,y);hc.scale(.65,1);hc.rotate(t*.0025);hc.fillStyle='#d7964e66';for(let i=0;i<6;i++){hc.rotate(Math.PI/3);hc.fillRect(2,-1,6,2)}hc.restore()}}
}requestAnimationFrame(animateRoom);
