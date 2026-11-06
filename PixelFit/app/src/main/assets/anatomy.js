// 统一的原创示意人体图（SVG 图层）。区域只用于高亮，不是精确解剖或肌电测量。
(function(root){
"use strict";
const REG={
front:[{r:"pec",e:[82,90,18,13,8]},{r:"delt_front",e:[63,77,9,11,0]},{r:"delt_lat",e:[54,84,6,10,0]},{r:"bicep",e:[53,114,7,18,8]},{r:"forearm",e:[42,170,6,20,8]},
 {r:"abs",k:[90,110,20,72,6],c:1},{r:"oblique",e:[78,150,8,24,-4]},{r:"quad",e:[84,275,14,46,0]},{r:"adduct",e:[95,262,5,28,0]}],
back:[{r:"trap",p:"M100 56 L118 66 L122 88 L100 108 L78 88 L82 66Z",b:[78,56,122,108],c:1},{r:"delt_rear",e:[63,77,9,11,0]},{r:"delt_lat",e:[54,84,6,10,0]},
 {r:"rhomb",e:[90,122,8,12,0]},{r:"lat",e:[76,140,11,28,12]},{r:"tricep",e:[53,114,7,18,8]},{r:"forearm",e:[42,170,6,20,8]},{r:"erector",e:[94,168,6,26,0]},
 {r:"glute_med",e:[80,201,7,9,0]},{r:"glute",e:[86,222,15,16,0]},{r:"hamstring",e:[84,275,13,42,0]},{r:"calf",e:[84,345,9,28,0]}]};
const HALF='<path d="M62 68 L48 76 L38 142 L28 208 L42 212 L52 152 L66 104 Z"/><path d="M72 236 L100 236 L98 300 L95 392 L75 392 L73 300 Z"/>';
const SIL='<g fill="#1b2a3a" stroke="#3f5873" stroke-width="1.5"><circle cx="100" cy="28" r="18"/><rect x="93" y="44" width="14" height="14"/><path d="M62 66 Q100 54 138 66 L134 122 Q130 165 124 200 L128 238 L72 238 L76 200 Q70 165 66 122 Z"/>'+HALF+'<g transform="translate(200 0) scale(-1 1)">'+HALF+'</g></g>';
const box=s=>s.e?[s.e[0]-s.e[2]-2,s.e[1]-s.e[3]-2,s.e[0]+s.e[2]+2,s.e[1]+s.e[3]+2]:s.k?[s.k[0],s.k[1],s.k[0]+s.k[2],s.k[1]+s.k[3]]:s.b;
let n=0;
function svg(view,o){o=o||{};const L=o.levels||{},I=o.ids||{},id="hz"+(++n);let body="",u=null;
 const fill=l=>l===1?"#ff5a36":l===2?"#ffb020":l===3?"url(#"+id+")":"#2c3e52";
 const un=b=>{u=u?[Math.min(u[0],b[0]),Math.min(u[1],b[1]),Math.max(u[2],b[2]),Math.max(u[3],b[3])]:b};
 REG[view].forEach(s=>{const l=L[s.r]||0,at='class="rg" data-a="mus" data-m="'+(I[s.r]||"")+'" data-r="'+s.r+'" data-l="'+l+'" fill="'+fill(l)+'" fill-opacity="'+(l?1:.7)+'" stroke="#0a0e14" stroke-width="'+(l?1.2:.6)+'"';
  const el=s.e?'<ellipse cx="'+s.e[0]+'" cy="'+s.e[1]+'" rx="'+s.e[2]+'" ry="'+s.e[3]+'" transform="rotate('+s.e[4]+' '+s.e[0]+' '+s.e[1]+')" '+at+'/>':s.k?'<rect x="'+s.k[0]+'" y="'+s.k[1]+'" width="'+s.k[2]+'" height="'+s.k[3]+'" rx="'+s.k[4]+'" '+at+'/>':'<path d="'+s.p+'" '+at+'/>';
  body+=s.c?el:el+'<g transform="translate(200 0) scale(-1 1)">'+el+'</g>';
  if(l){const b=box(s);un(b);if(!s.c)un([200-b[2],b[1],200-b[0],b[3]])}});
 let vb="0 0 200 400";
 if(o.zoom&&u){const w=Math.max(u[2]-u[0]+28,80),h=Math.max(u[3]-u[1]+28,80),cx=(u[0]+u[2])/2,cy=(u[1]+u[3])/2;vb=(cx-w/2)+" "+(cy-h/2)+" "+w+" "+h}
 return '<svg viewBox="'+vb+'" role="img" aria-label="人体肌肉示意图（'+(view==="front"?"正面":"背面")+'）" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="'+id+'" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="#12384a"/><line x1="0" y1="0" x2="0" y2="5" stroke="#22d3ee" stroke-width="2"/></pattern></defs>'+SIL+body+'</svg>'}
const regionIds=()=>[...new Set(REG.front.concat(REG.back).map(s=>s.r))];
const API={svg,regionIds};
if(typeof module!=="undefined")module.exports=API;else root.FitAnatomy=API;
})(typeof window!=="undefined"?window:globalThis);
