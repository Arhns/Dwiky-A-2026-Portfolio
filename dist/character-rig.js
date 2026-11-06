// Continuous articulated gait using the original character's face and proportions.
function renderOriginalCharacter(angle,isWalking,direction){
 ctx.clearRect(0,0,96,128);if(!characterSheet.complete||!characterSheet.naturalWidth)return;
 const moving=isWalking&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!moving){ctx.imageSmoothingEnabled=false;ctx.save();ctx.translate(48,118);ctx.scale(direction,1);ctx.drawImage(characterSheet,14,66,334,588,-29,-102,58,102);ctx.restore();return;}
 const c=moving?Math.cos(angle):0,s=moving?Math.sin(angle):0,bob=moving?-Math.abs(s):0;
 ctx.imageSmoothingEnabled=false;ctx.save();ctx.translate(48,0);ctx.scale(direction,1);ctx.translate(-48,0);
 function poly(points,color){ctx.fillStyle=color;let min=128,max=0;for(const pt of points){min=Math.min(min,pt[1]);max=Math.max(max,pt[1])}for(let yy=Math.floor(min);yy<=Math.ceil(max);yy++){const xs=[];for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]<=yy&&b[1]>yy)||(b[1]<=yy&&a[1]>yy))xs.push(a[0]+(yy-a[1])*(b[0]-a[0])/(b[1]-a[1]))}xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2)ctx.fillRect(Math.round(xs[k]),yy,Math.round(xs[k+1])-Math.round(xs[k])+1,1)}}
 function disc(x,y,r,color){ctx.fillStyle=color;for(let yy=-Math.ceil(r);yy<=r;yy++){const w=Math.floor(Math.sqrt(Math.max(0,r*r-yy*yy)));ctx.fillRect(Math.round(x)-w,Math.round(y)+yy,w*2+1,1)}}
 function limb(a,b,width,color){const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,nx=-dy/d*width/2,ny=dx/d*width/2;poly([[a[0]+nx,a[1]+ny],[b[0]+nx,b[1]+ny],[b[0]-nx,b[1]-ny],[a[0]-nx,a[1]-ny]],color);disc(a[0],a[1],width/2,color);disc(b[0],b[1],width/2,color)}
 function knee(hip,ankle){const dx=ankle[0]-hip[0],dy=ankle[1]-hip[1],d=Math.min(26.9,Math.hypot(dx,dy)),h=Math.sqrt(Math.max(0,13.5*13.5-d*d/4)),len=Math.hypot(dx,dy)||1;return[(hip[0]+ankle[0])/2+dy/len*h,(hip[1]+ankle[1])/2-dx/len*h]}
 function leg(hip,ankle,far){const k=knee(hip,ankle);limb(hip,k,8,'#171d20');limb(k,ankle,7,'#171d20');limb(hip,k,5,far?'#af8769':'#cba17b');limb(k,ankle,4,far?'#af8769':'#d3ae89');ctx.fillStyle='#e0e0d6';ctx.fillRect(Math.round(ankle[0])-3,Math.round(ankle[1])-5,6,6);const ax=ankle[0],ay=ankle[1];poly([[ax-5,ay-1],[ax+2,ay-1],[ax+7,ay+2],[ax+8,ay+6],[ax-6,ay+6]],'#171e22');ctx.fillStyle='#e2e3db';ctx.fillRect(Math.round(ax)-5,Math.round(ay)+5,13,2);ctx.fillStyle='#8e9696';ctx.fillRect(Math.round(ax)-3,Math.round(ay)+1,5,1);ctx.fillStyle='#e6e5dd';ctx.fillRect(Math.round(ax)-2,Math.round(ay)+2,4,1)}
 const leftAnkle=[40+c*8,112-Math.max(0,s)*6],rightAnkle=[55-c*8,112-Math.max(0,-s)*6];
 // Opposite hand and foot swing; knees flex only on the recovery step.
 const farShoulder=[61,55+bob],farElbow=[65+c*3,68+bob],farHand=[65+c*6,78+bob];
 limb(farShoulder,farElbow,9,'#171c1f');limb(farElbow,farHand,6,'#af8769');disc(...farHand,3,'#af8769');
 leg([53,85+bob],rightAnkle,true);leg([42,85+bob],leftAnkle,false);
 poly([[35,80+bob],[60,80+bob],[61,95+bob],[51,96+bob],[48,90+bob],[45,96+bob],[34,95+bob]],'#1b2226');
 poly([[36,84+bob],[47,85+bob],[46,91+bob],[36,91+bob]],'#30373b');
 poly([[32,51+bob],[43,47+bob],[54,47+bob],[64,52+bob],[68,65+bob],[60,69+bob],[59,85+bob],[35,85+bob],[34,69+bob],[28,65+bob]],'#191f23');
 poly([[34,54+bob],[43,51+bob],[52,52+bob],[59,56+bob],[56,76+bob],[38,79+bob]],'#282d32');
 poly([[36,81+bob],[46,83+bob],[59,80+bob],[59,84+bob],[46,86+bob],[36,84+bob]],'#dbddd5');
 ctx.drawImage(characterSheet,112,296,122,158,36,54+Math.round(bob),24,28);
 const nearShoulder=[32,56+bob],nearElbow=[29-c*3,69+bob],nearHand=[31-c*6,80+bob];
 limb(nearShoulder,nearElbow,9,'#20262b');limb(nearElbow,nearHand,7,'#171d20');limb(nearElbow,nearHand,5,'#d0a781');disc(...nearHand,3,'#d0a781');
 ctx.fillStyle='#bf9877';ctx.fillRect(43,44+Math.round(bob),10,8);
 // Unchanged messy hair and glasses from the original idle sprite.
 ctx.drawImage(characterSheet,62,70,238,229,27,16+Math.round(bob),41,40);
 ctx.restore();
}


