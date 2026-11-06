// Fixed low-resolution scene buffers create a consistent, crisp pixel grid.
const roomImage=room.querySelector('img');
const baseCanvas=document.createElement('canvas'),frontCanvas=document.createElement('canvas');
baseCanvas.className='pixel-room';frontCanvas.className='furniture-front';
for(const c of [baseCanvas,frontCanvas]){c.width=c.height=1254;c.setAttribute('aria-hidden','true');room.append(c)}
function furniturePath(c){
 const shapes=[
 // TV, its supporting console, game console, and foreground plant.
 [[65,490],[225,579],[225,706],[65,609]],
 [[27,632],[355,820],[355,897],[27,707]],
 [[229,611],[261,600],[263,691],[237,712]],
 [[275,738],[320,731],[341,758],[365,769],[374,811],[346,845],[315,829],[287,784]],
 // Bed is in front of the walking corridor on the right.
 [[759,545],[919,459],[968,497],[969,676],[603,845],[511,793],[511,706]]
 ];for(const points of shapes){c.moveTo(...points[0]);for(const pt of points.slice(1))c.lineTo(...pt);c.closePath()}
}
function renderRoom(){if(!roomImage.complete||!roomImage.naturalWidth)return;const b=baseCanvas.getContext('2d');b.imageSmoothingEnabled=false;b.clearRect(0,0,1254,1254);b.drawImage(roomImage,0,0,1254,1254);const f=frontCanvas.getContext('2d');f.clearRect(0,0,1254,1254);f.save();f.scale(1.254,1.254);f.beginPath();furniturePath(f);f.clip();f.imageSmoothingEnabled=false;f.drawImage(baseCanvas,0,0,1000,1000);f.restore()}
roomImage.addEventListener('load',renderRoom);renderRoom();


