const shadowMask=document.createElement('canvas');shadowMask.width=96;shadowMask.height=128;const shadowCtx=shadowMask.getContext('2d');
const floorCanvas=document.createElement('canvas');floorCanvas.className='floor-effects';floorCanvas.width=floorCanvas.height=1000;floorCanvas.setAttribute('aria-hidden','true');room.append(floorCanvas);const floorFx=floorCanvas.getContext('2d');floorFx.scale(1,1);
function pool(c,x,y,rx,ry,color,alpha){c.save();c.translate(x,y);c.scale(rx,ry);const g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,`rgba(${color},${alpha})`);g.addColorStop(1,`rgba(${color},0)`);c.fillStyle=g;c.fillRect(-1,-1,2,2);c.restore()}
function lighting(ms){const t=reduceMotion.matches?0:ms/1000,night=room.dataset.light==='night',p=room.dataset.light;floorFx.clearRect(0,0,1000,1000);
// Grounded contact shadow follows the feet, independently of sprite animation.

// Window-shaped daylight projected onto the open floor, below the character.
if(!night){const c=p==='evening'?'255,155,69':p==='noon'?'255,231,158':'179,218,247';floorFx.save();floorFx.globalCompositeOperation='screen';floorFx.filter='blur(2px)';floorFx.fillStyle=`rgba(${c},${p==='evening'?.3:.24})`;for(let i=0;i<2;i++){floorFx.beginPath();floorFx.moveTo(552+i*48,510+i*25);floorFx.lineTo(590+i*48,530+i*25);floorFx.lineTo(432+i*48,731+i*25);floorFx.lineTo(385+i*48,706+i*25);floorFx.closePath();floorFx.fill()}floorFx.restore()}
requestAnimationFrame(lighting)}requestAnimationFrame(lighting);
// The source effects loop calls this after drawing the outdoor view and fans.
function screenLighting(t,p){const night=p==='night';fx.save();
// Wallpaper fills the monitor's inner glass, bounded by the existing bezel.
fx.transform(1,-.5,0,1,270,312);fx.beginPath();fx.rect(0,0,121,74);fx.clip();
const bg=fx.createLinearGradient(0,0,121,74);bg.addColorStop(0,'#152d43');bg.addColorStop(1,'#426b7e');fx.fillStyle=bg;fx.fillRect(0,0,121,74);
fx.fillStyle='#517788';fx.beginPath();fx.moveTo(0,74);fx.lineTo(0,65);fx.lineTo(28,43);fx.lineTo(45,58);fx.lineTo(75,33);fx.lineTo(121,66);fx.lineTo(121,74);fx.fill();fx.fillStyle='#78949b';fx.beginPath();fx.moveTo(0,74);fx.lineTo(42,55);fx.lineTo(58,66);fx.lineTo(93,49);fx.lineTo(121,67);fx.lineTo(121,74);fx.fill();
const now=new Date(),blink=now.getMilliseconds()<500;const hh=String(now.getHours()).padStart(2,'0'),mm=String(now.getMinutes()).padStart(2,'0'),ss=String(now.getSeconds()).padStart(2,'0');
fx.textAlign='center';fx.fillStyle='#f1f5e9';fx.font='600 17px monospace';fx.fillText(hh,29,35);fx.fillText(mm,60,35);fx.globalAlpha=blink?1:.4;fx.fillText(ss,91,35);fx.globalAlpha=1;if(blink){fx.fillText(':',44,34);fx.fillText(':',75,34)}
fx.font='5px monospace';fx.fillStyle='#d2e3e4';fx.fillText(now.toLocaleDateString('id-ID',{weekday:'short',day:'numeric',month:'short'}).toUpperCase(),60,48);fx.restore();
fx.save();fx.globalCompositeOperation='screen';
// Device light remains visible after the room is darkened.
if(night){
// The desk lamp switches on at night: a small bulb, warm cone and soft spill.
pool(fx,256,322,25,30,'255,191,91',.5);
fx.save();fx.filter='blur(6px)';const beam=fx.createLinearGradient(256,324,264,403);beam.addColorStop(0,'rgba(255,213,135,.3)');beam.addColorStop(1,'rgba(255,188,87,0)');fx.fillStyle=beam;fx.beginPath();fx.moveTo(251,324);fx.lineTo(261,324);fx.lineTo(307,394);fx.quadraticCurveTo(266,418,225,395);fx.closePath();fx.fill();fx.restore();
pool(fx,266,382,77,35,'255,194,105',.38);
pool(fx,243,333,45,65,'255,184,82',.12);
fx.fillStyle='#ffe4ac';fx.beginPath();fx.ellipse(256,323,3.5,1.6,-.3,0,Math.PI*2);fx.fill();
}
pool(fx,347,390,105,62,'100,186,230',night?.26:.07);pool(fx,477,331,45,56,'255,157,47',night?.19:.045);
if(tv){const flicker=reduceMotion.matches?.32:.28+.065*Math.sin(t*17)+.035*Math.sin(t*29);pool(fx,260,558,123,92,'111,174,237',night?flicker:flicker*.4);pool(fx,310,619,120,54,'137,182,228',night?flicker*.62:flicker*.22)}fx.restore()}








