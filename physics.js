// Pure, deterministic driving and event simulation. SI units; no rendering dependency.
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const lerp=(a,b,t)=>a+(b-a)*t;
export const wrapAngle=a=>Math.atan2(Math.sin(a),Math.cos(a));
const controls=[[-40,240],[-70,110],[-75,-40],[-165,-145],[-250,-245],[-205,-340],[-50,-375],[85,-310],[130,-180],[90,-55],[145,60],[175,190],[110,295],[5,320]];
function cat(a,b,c,d,t){return .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);}
export function groundHeight(x,z){return .35+9*Math.exp(-((x-130)**2+(z+230)**2)/42000)+2.4*Math.sin(z*.007)*Math.min(1,Math.max(0,(x+240)/250));}
export function buildTrack(){
 const raw=[];let total=0;for(let i=0;i<=2800;i++){const s=(i%2800)/2800*controls.length,j=Math.floor(s),t=s-j,n=controls.length;const p={x:cat(controls[(j+n-1)%n][0],controls[j][0],controls[(j+1)%n][0],controls[(j+2)%n][0],t),z:cat(controls[(j+n-1)%n][1],controls[j][1],controls[(j+1)%n][1],controls[(j+2)%n][1],t)};if(i)total+=Math.hypot(p.x-raw[i-1].x,p.z-raw[i-1].z);raw.push({...p,d:total});}
 const samples=[];let j=0;const count=1000;for(let i=0;i<count;i++){const d=i/count*total;while(raw[j+1].d<d)j++;const f=(d-raw[j].d)/(raw[j+1].d-raw[j].d),x=lerp(raw[j].x,raw[j+1].x,f),z=lerp(raw[j].z,raw[j+1].z,f);samples.push({x,z,y:groundHeight(x,z)+.09,d});}
 samples.forEach((p,i)=>{const q=samples[(i+1)%count],r=samples[(i+count-1)%count],l=Math.hypot(q.x-r.x,q.z-r.z);p.tx=(q.x-r.x)/l;p.tz=(q.z-r.z)/l;p.heading=Math.atan2(p.tx,p.tz);});
 return {samples,length:total,width:16,count};
}
export const TRACK=buildTrack();
export function atDistance(d){const n=TRACK.count,i=((d/TRACK.length*n)%n+n)%n,j=Math.floor(i),f=i-j,a=TRACK.samples[j],b=TRACK.samples[(j+1)%n];return {x:lerp(a.x,b.x,f),z:lerp(a.z,b.z,f),y:lerp(a.y,b.y,f),tx:lerp(a.tx,b.tx,f),tz:lerp(a.tz,b.tz,f),heading:a.heading,d:((d%TRACK.length)+TRACK.length)%TRACK.length};}
export function nearestPoint(x,z){let best=1e30,idx=0;for(let i=0;i<TRACK.count;i++){const p=TRACK.samples[i],q=(p.x-x)**2+(p.z-z)**2;if(q<best){best=q;idx=i;}}const p=TRACK.samples[idx];return {...p,index:idx,distance:Math.sqrt(best),lateral:(x-p.x)*p.tz-(z-p.z)*p.tx};}
export function createCar(){const p=atDistance(-12);return {x:p.x,z:p.z,heading:p.heading,vx:0,vz:0,speed:0,forwardSpeed:0,steer:0,yawRate:0,nitro:1,boosting:false,drifting:false,offroad:false,accel:0,slip:0,collision:0,nearest:nearestPoint(p.x,p.z)};}
export function stepCar(c,input,dt,assist=true){
 const f={x:Math.sin(c.heading),z:Math.cos(c.heading)},r={x:f.z,z:-f.x};let vf=c.vx*f.x+c.vz*f.z,vs=c.vx*r.x+c.vz*r.z;
 const speed=Math.abs(vf),near=nearestPoint(c.x,c.z);c.nearest=near;c.offroad=near.distance>9.1;c.collision=Math.max(0,c.collision-dt);
 const steerTarget=(input.left?1:0)-(input.right?1:0);c.steer=lerp(c.steer,steerTarget,1-Math.exp(-dt*8));
 let acceleration=0;if(input.throttle) acceleration=vf< -1?13:10.5*(1-Math.pow(Math.max(vf,0)/69,1.3));
 if(input.brake)acceleration=vf>1?-22:vf> -10?-6:0;
 c.boosting=!!(input.boost&&input.throttle&&c.nitro>.01&&vf>3&&!c.offroad);if(c.boosting){acceleration+=12;c.nitro=Math.max(0,c.nitro-dt*.22);}else c.nitro=Math.min(1,c.nitro+dt*.065);
 const drag=.12*vf+.0018*vf*Math.abs(vf)+(c.offroad?1.3*vf:0);acceleration-=drag;
 if(input.handbrake)acceleration-=Math.sign(vf)*Math.min(speed*2,12);
 vf+=acceleration*dt;if(!input.throttle&&!input.brake&&Math.abs(vf)<.05)vf=0;
 // Speed-sensitive bicycle steering, with turn-rate and lateral grip limits.
 const steerAngle=c.steer*(.48/(1+speed*.032));let targetYaw=vf/2.65*Math.tan(steerAngle);targetYaw=clamp(targetYaw,-1.55,1.55);
 if(input.handbrake&&speed>5)targetYaw*=1.35;
 c.yawRate=lerp(c.yawRate,targetYaw,1-Math.exp(-dt*(input.handbrake?4:7)));
 // Looking forward along +Z, screen-left is +X. Positive yaw turns left.
 c.heading=wrapAngle(c.heading+c.yawRate*dt);
 const grip=input.handbrake?1.7:assist?9:6.4;vs*=Math.exp(-grip*dt);vs-=c.yawRate*vf*dt*(input.handbrake?.88:assist?.16:.31);
 c.slip=Math.atan2(Math.abs(vs),Math.max(1,speed));c.drifting=speed>9&&(c.slip>.14||input.handbrake&&Math.abs(c.steer)>.2);
 const nf={x:Math.sin(c.heading),z:Math.cos(c.heading)},nr={x:nf.z,z:-nf.x};c.vx=nf.x*vf+nr.x*vs;c.vz=nf.z*vf+nr.z*vs;
 c.x+=c.vx*dt;c.z+=c.vz*dt;
 // Roadside safety rails protect the prototype's route; shoulders remain drivable.
 const now=nearestPoint(c.x,c.z);if(now.distance>12.6){const nx=(c.x-now.x)/now.distance,nz=(c.z-now.z)/now.distance;c.x=now.x+nx*12.55;c.z=now.z+nz*12.55;const vn=c.vx*nx+c.vz*nz;if(vn>0){c.vx-=1.2*vn*nx;c.vz-=1.2*vn*nz;c.vx*=.78;c.vz*=.78;c.collision=.35;}}
 c.speed=Math.hypot(c.vx,c.vz);c.forwardSpeed=c.vx*nf.x+c.vz*nf.z;c.accel=acceleration;c.nearest=now;
 return c;
}
export const CHECKPOINT_COUNT=12;
export const GATES=Array.from({length:CHECKPOINT_COUNT},(_,i)=>atDistance((i+1)*TRACK.length/CHECKPOINT_COUNT));
export function createEvent(){return {state:'countdown',countdown:3.1,time:0,lap:1,next:0,passed:0,laps:[],lapStart:0,penalties:0,lastGate:-12,gateFlash:0,wrongWay:0};}
export function stepEvent(e,c,previous,dt){
 e.gateFlash=Math.max(0,e.gateFlash-dt);if(e.state==='countdown'){e.countdown-=dt;if(e.countdown<=0)e.state='racing';return null;}
 if(e.state!=='racing')return null;e.time+=dt;
 const g=GATES[e.next],prevSide=(previous.x-g.x)*g.tx+(previous.z-g.z)*g.tz,side=(c.x-g.x)*g.tx+(c.z-g.z)*g.tz;
 const cross=prevSide<=0&&side>0;const lateral=Math.abs((c.x-g.x)*g.tz-(c.z-g.z)*g.tx);
 e.wrongWay=c.forwardSpeed>3&&Math.cos(c.heading-c.nearest.heading)<-.4?e.wrongWay+dt:0;
 if(cross&&lateral<12.7){e.passed++;e.lastGate=(e.next+1)*TRACK.length/CHECKPOINT_COUNT;e.gateFlash=.65;e.next++;
 if(e.next===CHECKPOINT_COUNT){e.laps.push(e.time-e.lapStart);e.lapStart=e.time;if(e.lap===2){e.state='finished';return 'finish';}e.lap++;e.next=0;return 'lap';}return 'checkpoint';}
 return null;
}
export function recoverCar(c,e){const p=atDistance(e.lastGate+4);Object.assign(c,{x:p.x,z:p.z,heading:p.heading,vx:0,vz:0,speed:0,forwardSpeed:0,steer:0,yawRate:0});c.nearest=nearestPoint(c.x,c.z);e.time+=3;e.penalties+=3;}
export function formatTime(t){const ms=Math.floor(t*1000),min=Math.floor(ms/60000),sec=Math.floor(ms/1000)%60;return `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;}
