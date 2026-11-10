import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.querySelector('#game');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#a9dce6');
scene.fog = new THREE.Fog('#c8e8d9', 26, 105);
const camera = new THREE.PerspectiveCamera(53, innerWidth / innerHeight, .1, 180);
camera.position.set(0, 5.3, 10.8);
camera.lookAt(0, 1.0, -7);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
scene.add(new THREE.HemisphereLight('#f5fff0', '#718c61', 2.15));
const sun = new THREE.DirectionalLight('#fff0ce', 2.6);
sun.position.set(-7, 12, 8); sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -12; sun.shadow.camera.right = 12; sun.shadow.camera.top = 15; sun.shadow.camera.bottom = -12;
scene.add(sun);
const mat = (color, roughness=.87) => new THREE.MeshStandardMaterial({ color, roughness });
const green = mat('#80ad67'), darkGreen = mat('#668e59'), grassLight = mat('#a5c878'), roadMat = mat('#dfcfaa'), roadSide = mat('#9eaa6c'), cream = mat('#f4e3bf'), wood = mat('#ad7b4e'), pink = mat('#ee9d98'), snoutMat = mat('#f3b3aa'), hoofMat = mat('#855f55'), eyeMat = mat('#352e2a',.42), appleMat=mat('#d95e48',.43), leafMat=mat('#6a9c5e');
function mesh(geo, material, parent=scene, x=0,y=0,z=0){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function box(parent,material,x,y,z,sx,sy,sz){return mesh(new THREE.BoxGeometry(sx,sy,sz),material,parent,x,y,z)}
function sphere(parent,material,x,y,z,sx,sy=sx,sz=sx,detail=16){const o=mesh(new THREE.SphereGeometry(1,detail,12),material,parent,x,y,z);o.scale.set(sx,sy,sz);return o}
// Soft rolling fields and the country lane.
box(scene,green,0,-.55,-41,190,.65,160);
box(scene,roadSide,0,-.19,-39,8.35,.35,150);
box(scene,roadMat,0,-.09,-39,7.3,.28,150);
for(const x of [-1.2,1.2]){
  const line=box(scene,mat('#f2e7c9'),x,.061,-39,.055,.018,150);line.castShadow=false;
}
// Distant round trees, fence, and fluffy clouds complete the handmade farm setting.
const cloudMat=mat('#fff8e9');
function makeCloud(x,y,z,s){const g=new THREE.Group();scene.add(g);sphere(g,cloudMat,-.75,0,0,.8*s,.38*s,.42*s);sphere(g,cloudMat,0,.25*s,0,1.05*s,.56*s,.5*s);sphere(g,cloudMat,.8,0,0,.72*s,.38*s,.42*s);g.position.set(x,y,z);return g}
makeCloud(-8,9,-35,1.6);makeCloud(8,11,-52,1.3);makeCloud(0,8,-74,1.7);
const scenery=[];
function makeTree(x,z,scale=1){const g=new THREE.Group();scene.add(g);mesh(new THREE.CylinderGeometry(.13*scale,.2*scale,1.35*scale,8),wood,g,0,.67*scale,0);sphere(g,green,0,1.65*scale,0,.85*scale,.75*scale,.82*scale);sphere(g,grassLight,-.37*scale,1.6*scale,.1*scale,.46*scale,.45*scale,.48*scale);g.position.set(x,0,z);scenery.push({group:g,kind:'tree'});return g}
function makeFence(x,z,side){const g=new THREE.Group();scene.add(g);for(let j=0;j<3;j++){const post=box(g,cream,0,.48+j*.85,0,.13,.95,.15);post.rotation.z=.05*(j%2?1:-1);}box(g,wood,0,.42,0,.16,.12,2.1);box(g,wood,0,1.06,0,.16,.12,2.1);g.position.set(x,0,z);g.rotation.y=side*.09;scenery.push({group:g,kind:'fence'});return g}
for(let i=0;i<15;i++){const z=-i*8-5;makeTree(-6.5-(i%3)*1.3,z,.72+(i%4)*.12);makeTree(6.7+(i%2)*1.4,z-3,.7+(i%3)*.14);if(i%2===0){makeFence(-5.1,z-2,-1);makeFence(5.1,z-2,1)}}
// Cute little pig assembled from rounded 3D shapes.
const pig=new THREE.Group();scene.add(pig);
const body=sphere(pig,pink,0,.72,0,.53,.48,.72,22);body.castShadow=true;
sphere(pig,snoutMat,0,.91,-.57,.48,.34,.28,20);
sphere(pig,mat('#d97f79'),0,.91,-.81,.27,.19,.08,16);
for(const x of [-.105,.105])sphere(pig,mat('#a75e5c'),x,.92,-.88,.035,.075,.025,12);
// Ears, eyes, cheeks, and four sturdy trotters.
for(const x of [-.36,.36]){const ear=sphere(pig,pink,x,1.25,-.16,.19,.31,.16,16);ear.rotation.z=x<0?-.38:.38;sphere(pig,mat('#f5c2b9'),x,1.27,-.286,.095,.17,.035,12);sphere(pig,eyeMat,x*.82,1.06,-.57,.055,.072,.045,12);sphere(pig,mat('#f4c5a4'),x*1.6,.68,-.08,.12,.1,.07,12);}
const legs=[];for(const x of [-.34,.34])for(const z of [-.39,.4]){const leg=mesh(new THREE.CylinderGeometry(.105,.12,.35,10),pink,pig,x,.3,z);legs.push(leg);sphere(pig,hoofMat,x,.13,z-.015,.13,.09,.15,12)}
const tail=mesh(new THREE.TorusGeometry(.105,.035,8,16),pink,pig,0,.8,.68);tail.rotation.x=1.1;
pig.position.set(0,0,3.8);
// Obstacles and collectible apples.
const obstacleGroups=[];const appleGroups=[];
function makeHay(){const g=new THREE.Group();const bale=mesh(new THREE.BoxGeometry(.92,.9,.82),mat('#e8b95f'),g,0,.48,0);bale.rotation.y=.12;for(let y=.23;y<.9;y+=.23){const line=mesh(new THREE.TorusGeometry(.48,.025,5,20),mat('#bd8843'),g,0,y,0);line.rotation.x=Math.PI/2;line.scale.set(1,.87,1)}return g}
function makeCrate(){const g=new THREE.Group();box(g,wood,0,.48,0,.88,.88,.82);const slat=mat('#d1a26d');for(let x of [-.28,0,.28])box(g,slat,x,.48,-.42,.1,.84,.035);box(g,wood,0,.48,-.455,.89,.09,.06);box(g,wood,0,.48,.455,.89,.09,.06);return g}
function makePumpkin(){const g=new THREE.Group();sphere(g,mat('#e68a48'),0,.43,0,.48,.42,.45,16);for(let i=0;i<5;i++){const rib=mesh(new THREE.TorusGeometry(.36,.028,5,16),mat('#bf693d'),g,0,.43,0);rib.rotation.y=i*Math.PI/5;}mesh(g,new THREE.CylinderGeometry(.055,.075,.2,8),wood,g,0,.79,0);return g}
function makeApple(){const g=new THREE.Group();sphere(g,appleMat,0,.4,0,.28,.31,.25,18);mesh(g,new THREE.CylinderGeometry(.025,.035,.17,7),wood,g,0,.72,0);const leaf=sphere(g,leafMat,.1,.76,0,.13,.055,.07,12);leaf.rotation.z=-.4;return g}
const obstacleMakers=[makeHay,makeCrate,makePumpkin];
let running=false, lane=0, jumpV=0, jumpY=0, speed=15, distance=0, apples=0, lives=3, spawnClock=0, appleClock=0, lastTime=0, invuln=0;
let best=Number(localStorage.getItem('frontpig-best')||0);
const scoreEl=document.querySelector('#score'), bestEl=document.querySelector('#best'), coinsEl=document.querySelector('#coins'), heartsEl=document.querySelector('#hearts'), meter=document.querySelector('#meter-fill'), menu=document.querySelector('#menu'), gameover=document.querySelector('#gameover'), toast=document.querySelector('#toast');
bestEl.textContent=String(best).padStart(4,'0');
function showToast(text){toast.textContent=text;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),700)}
function laneX(n){return n*2.4}
function addObstacleRow(){const count=Math.random()<.34?2:1;const safe=Math.floor(Math.random()*3)-1;for(let i=0;i<count;i++){let l;if(count===2){l=[-1,0,1].filter(v=>v!==safe)[i]}else l=Math.floor(Math.random()*3)-1;const g=obstacleMakers[Math.floor(Math.random()*obstacleMakers.length)]();g.position.set(laneX(l),0,-83);scene.add(g);obstacleGroups.push({group:g,lane:l,hit:false})}}
function addApples(){const l=Math.floor(Math.random()*3)-1;const count=4;for(let i=0;i<count;i++){const g=makeApple();g.position.set(laneX(l),.15,-47-i*2.5);scene.add(g);appleGroups.push({group:g,lane:l,taken:false})}}
function clearThings(){for(const o of obstacleGroups)scene.remove(o.group);for(const a of appleGroups)scene.remove(a.group);obstacleGroups.length=0;appleGroups.length=0}
function startGame(){clearThings();running=true;lane=0;jumpV=0;jumpY=0;distance=0;apples=0;lives=3;speed=15;spawnClock=1.4;appleClock=2;invuln=0;pig.position.set(0,0,3.8);pig.visible=true;menu.classList.add('hidden');gameover.classList.add('hidden');updateHud()}
function updateHud(){scoreEl.textContent=String(Math.floor(distance)).padStart(4,'0');coinsEl.textContent=apples;heartsEl.textContent='♥ '.repeat(lives).trim()||'♡ ♡ ♡';meter.style.width=`${Math.min(100,(distance%100))}%`;}
function endGame(){running=false;const sc=Math.floor(distance);if(sc>best){best=sc;localStorage.setItem('frontpig-best',String(best));bestEl.textContent=String(best).padStart(4,'0')}document.querySelector('#final-score').textContent=sc;document.querySelector('#final-coins').textContent=apples;document.querySelector('#final-best').textContent=best;gameover.classList.remove('hidden')}
function move(dir){if(!running)return;lane=Math.max(-1,Math.min(1,lane+dir));}
function jump(){if(!running)return;if(jumpY<.03){jumpV=8.1}}
function press(button,fn){button.addEventListener('pointerdown',e=>{e.preventDefault();button.classList.add('pressed');fn()});for(const ev of ['pointerup','pointercancel','pointerleave'])button.addEventListener(ev,()=>button.classList.remove('pressed'))}
press(document.querySelector('#left-btn'),()=>move(-1));press(document.querySelector('#right-btn'),()=>move(1));press(document.querySelector('#jump-btn'),jump);
document.querySelector('#play-btn').addEventListener('click',startGame);document.querySelector('#again-btn').addEventListener('click',startGame);
window.addEventListener('keydown',e=>{if(['ArrowLeft','a','A'].includes(e.key)){e.preventDefault();move(-1)}if(['ArrowRight','d','D'].includes(e.key)){e.preventDefault();move(1)}if(['ArrowUp',' ','w','W'].includes(e.key)){e.preventDefault();jump()}if(e.key==='Enter'&&!running)startGame()});
let touchStart=null;canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')touchStart={x:e.clientX,y:e.clientY}});canvas.addEventListener('pointerup',e=>{if(!touchStart||!running)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;if(Math.abs(dx)>28&&Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1);else if(dy<-25)jump();touchStart=null});
function update(dt,time){if(!running)return;distance+=speed*dt*.48;speed=Math.min(25,15+distance*.012);spawnClock-=dt;appleClock-=dt;if(spawnClock<=0){addObstacleRow();spawnClock=Math.max(.82,1.58-distance*.0015)+Math.random()*.4}if(appleClock<=0){addApples();appleClock=3.1+Math.random()*1.8}
  const target=laneX(lane);pig.position.x+=(target-pig.position.x)*Math.min(1,dt*11);jumpV-=20*dt;jumpY=Math.max(0,jumpY+jumpV*dt);if(jumpY===0)jumpV=0;pig.position.y=jumpY+Math.abs(Math.sin(time*9))*0.035;pig.rotation.z+=( (target-pig.position.x)*-.09-pig.rotation.z)*dt*7;pig.rotation.x=Math.sin(time*8)*.025;
  legs.forEach((leg,i)=>{leg.rotation.x=running?Math.sin(time*13+i*Math.PI)*.52:0});tail.rotation.z=Math.sin(time*7)*.25;
  for(const o of obstacleGroups){o.group.position.z+=speed*dt;if(!o.hit&&o.group.position.z>2.65&&o.group.position.z<4.2&&Math.abs(pig.position.x-laneX(o.lane))<1.12){if(jumpY<.68&&invuln<=0){o.hit=true;lives--;invuln=1.15;showToast(lives?'Oof!':'Oh, crumbs!');updateHud();if(!lives){endGame();break}}else if(jumpY>=.68)o.hit=true}if(o.group.position.z>11){scene.remove(o.group);o.remove=true}}
  for(const a of appleGroups){a.group.position.z+=speed*dt;a.group.rotation.y+=dt*2.5;a.group.position.y=.2+Math.sin(time*5+a.group.position.z)*.08;if(!a.taken&&Math.abs(a.group.position.z-3.8)<.85&&Math.abs(pig.position.x-laneX(a.lane))<.95){a.taken=true;apples++;showToast('+1 APPLE!');scene.remove(a.group)}if(a.group.position.z>11){scene.remove(a.group);a.remove=true}}
  for(let i=obstacleGroups.length-1;i>=0;i--)if(obstacleGroups[i].remove)obstacleGroups.splice(i,1);for(let i=appleGroups.length-1;i>=0;i--)if(appleGroups[i].remove||appleGroups[i].taken)appleGroups.splice(i,1);
  for(const item of scenery){item.group.position.z+=speed*dt*.28;if(item.group.position.z>14)item.group.position.z-=120}invuln=Math.max(0,invuln-dt);pig.visible=invuln<=0||Math.floor(time*14)%2===0;updateHud();}
function resize(){camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<600?58:53;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(innerWidth,innerHeight)}window.addEventListener('resize',resize);
const clock=new THREE.Clock();function frame(now){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.04),t=now*.001;update(dt,t);renderer.render(scene,camera)}requestAnimationFrame(frame);
