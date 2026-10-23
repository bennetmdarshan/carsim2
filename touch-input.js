// One captured pointer per finger, so pedals and steering work simultaneously.
export function createTouchInput(bindings,enabled=()=>true){
 const pointers=new Map();
 function sync(){for(const [action,el] of Object.entries(bindings)){const pressed=[...pointers.values()].some(p=>p.action===action);el.classList.toggle('pressed',pressed);el.setAttribute('aria-pressed',String(pressed));}}
 function release(id,el){const p=pointers.get(id);if(!p||p.el!==el)return;pointers.delete(id);sync();try{if(el.hasPointerCapture?.(id))el.releasePointerCapture(id);}catch{}}
 for(const [action,el] of Object.entries(bindings)){
  el.addEventListener('pointerdown',e=>{if(!enabled()||e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();pointers.set(e.pointerId,{action,el});try{el.setPointerCapture(e.pointerId);}catch{}sync();});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(type,e=>{e.preventDefault();release(e.pointerId,el);});
  el.addEventListener('contextmenu',e=>e.preventDefault());
 }
 return {has(action){return [...pointers.values()].some(p=>p.action===action);},clear(){const old=[...pointers.entries()];pointers.clear();sync();for(const [id,p] of old)try{if(p.el.hasPointerCapture?.(id))p.el.releasePointerCapture(id);}catch{}}};
}
