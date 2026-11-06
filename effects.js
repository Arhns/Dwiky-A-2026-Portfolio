// All scene coordinates share the room's 1000 x 1000 coordinate space.
const sceneCanvas=document.createElement('canvas');sceneCanvas.className='scene-effects';sceneCanvas.width=1000;sceneCanvas.height=1000;sceneCanvas.setAttribute('aria-hidden','true');room.append(sceneCanvas);
const fx=sceneCanvas.getContext('2d'),reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
const palettes={morning:['#83bfed','#e7f5f9','#507557','#739258'],noon:['#c4dcdf','#fff1b4','#5e7844','#8a9b4d'],evening:['#b3779e','#ffc078','#4b5958','#77724c'],night:['#111b38','#324761','#1d3540','#2d4d47']};
fx.scale(1,1);
function environment(ms){const moving=reduceMotion.matches?0:ms/1000,p=room.dataset.light||'morning',colors=palettes[p]||palettes.morning;fx.clearRect(0,0,1000,1000);
// Perspective-mapped outdoor view; the window frame and central mullion stay fixed.
fx.save();fx.transform(1,.51,0,1,605,195);fx.beginPath();fx.rect(0,0,133,106);fx.clip();const sky=fx.createLinearGradient(0,0,0,106);sky.addColorStop(0,colors[0]);sky.addColorStop(1,colors[1]);fx.fillStyle=sky;fx.fillRect(0,0,133,106);
if(p==='night'){for(let i=0;i<24;i++){const sx=(i*37+11)%133,sy=(i*23+5)%75;fx.globalAlpha=.55+.4*Math.sin(moving*.8+i);fx.fillStyle='#fff7ca';fx.fillRect(sx,sy,i%4===0?2:1,1.5)}fx.globalAlpha=1;fx.fillStyle='#eee8c0';fx.beginPath();fx.arc(100,18,7,0,Math.PI*2);fx.fill()}else{fx.fillStyle=p==='evening'?'#ffca84':'#fff7d2';fx.beginPath();fx.arc(p==='evening'?100:29,p==='evening'?63:16,10,0,Math.PI*2);fx.fill();fx.fillStyle=p==='evening'?'#ffdcbb99':'#ffffffb0';for(let i=0;i<4;i++){const cx=((i*48+moving*1.7)%200)-35,cy=16+i*12;fx.fillRect(cx,cy,23,4);fx.fillRect(cx+5,cy-4,12,4)}}
// Pixel silhouettes and trees, with individually swaying clusters of leaves.
fx.fillStyle=p==='night'?'#233348':'#8b9da0';for(let i=0;i<10;i++)fx.fillRect(i*16,63-(i*17)%28,10,50);
for(let layer=0;layer<2;layer++){fx.fillStyle=colors[2+layer];for(let i=0;i<32;i++){const sway=Math.sin(moving*1.1+i*.7+layer)*1.3;const tx=i*6-20+sway,ty=75+layer*14+Math.sin(i*2)*12;fx.fillRect(tx,ty,12,40);fx.fillRect(tx-3,ty+5,18,10);fx.fillRect(tx+2,ty-4,8,8)}}fx.restore();
// Window's fixed mullion, in the same isometric projection.
fx.strokeStyle='#494638';fx.lineWidth=5;fx.beginPath();fx.moveTo(666,224);fx.lineTo(666,331);fx.stroke();fx.strokeStyle='#aa9d7a';fx.lineWidth=1;fx.stroke();
// Two front intake fans: luminous ring plus actual rotating blades.
for(const cy of [266,297]){fx.save();fx.translate(491,cy);fx.scale(.62,1);const pulse=.6+.22*Math.sin(moving*.9);fx.shadowColor='#ffb54a';fx.shadowBlur=8+pulse*7;fx.strokeStyle=`rgba(255,183,77,${pulse})`;fx.lineWidth=2;fx.beginPath();fx.arc(0,0,11,0,Math.PI*2);fx.stroke();fx.shadowBlur=0;fx.rotate(moving*3);fx.fillStyle='#c79855bb';for(let b=0;b<7;b++){fx.rotate(Math.PI*2/7);fx.beginPath();fx.moveTo(1,1);fx.quadraticCurveTo(10,-8,9,1);fx.lineTo(3,4);fx.fill()}fx.fillStyle='#f2cf87';fx.beginPath();fx.arc(0,0,2,0,Math.PI*2);fx.fill();fx.restore()}
// Soft light spilling from the desktop display into the workspace.
fx.save();fx.globalCompositeOperation='screen';fx.filter='blur(15px)';fx.fillStyle=`rgba(113,197,236,${p==='night'?.24:.13})`;fx.beginPath();fx.moveTo(279,293);fx.lineTo(390,239);fx.lineTo(390,313);fx.lineTo(279,366);fx.closePath();fx.fill();fx.filter='blur(20px)';fx.fillStyle=`rgba(99,177,225,${p==='night'?.12:.06})`;fx.beginPath();fx.ellipse(343,375,83,28,-.45,0,Math.PI*2);fx.fill();fx.restore();if(typeof screenLighting==="function")screenLighting(moving,p);requestAnimationFrame(environment)}requestAnimationFrame(environment);





