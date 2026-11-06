// 原创像素头像与勋章（程序生成，不使用任何第三方素材）
(function(root){
"use strict";
const HEAD=["............","............","..kkkkkkkk..",".kbbbbbbbbk.","kbbbbbbbbbbk","kbbebbbbebbk","kbbebbbbebbk","kbpbbllbbpbk","kbbblnnlbbbk",".kbbbbbbbbk.","..kkkkkkkk..","............"];
const EARS={round:[".kk......kk.","kiik....kiik"],point:["kk........kk","kikk....kkik"],tall:["..kk....kk..",".kiik..kiik."],ant:[".....kk.....",".....kk....."],none:["............","............"]};
const AV={
bear:{n:"小熊",ear:"round",b:"#c98a4b",i:"#c98a4b",l:"#f1d3a5",e:"#1a1a2e",p:"#ff9eb0",nn:"#3b2a1a"},
cat:{n:"小猫",ear:"point",b:"#9aa5b1",i:"#ffb3c1",l:"#e8edf2",e:"#1a1a2e",p:"#ff9eb0",nn:"#ff7a9c"},
fox:{n:"小狐",ear:"point",b:"#f28c28",i:"#ffffff",l:"#fff4e0",e:"#1a1a2e",p:"#ffb38a",nn:"#222222"},
rabbit:{n:"小兔",ear:"tall",b:"#f4f4f8",i:"#ffb3c1",l:"#ffe3ea",e:"#1a1a2e",p:"#ffb3c1",nn:"#ff7a9c"},
panda:{n:"熊猫",ear:"round",b:"#f5f5f5",i:"#222222",l:"#dddddd",e:"#111111",p:"#ffb3c1",nn:"#222222"},
frog:{n:"青蛙",ear:"round",b:"#5dbb63",i:"#ffffff",l:"#c8f0b8",e:"#1a1a2e",p:"#ff9eb0",nn:"#2f7a36"},
penguin:{n:"企鹅",ear:"none",b:"#2d3a4f",i:"#2d3a4f",l:"#f5f5f5",e:"#ffffff",p:"#ff9eb0",nn:"#ff9f1c"},
robot:{n:"机器人",ear:"ant",b:"#9fb3c8",i:"#9fb3c8",l:"#5b6b7d",e:"#22d3ee",p:"#5b6b7d",nn:"#22d3ee"}};
const BASE=["..kkkkkk..",".kyyyyyyk.","kyyyyyyyyk","kyyyyyyyyk","kyyyyyyyyk","kyyyyyyyyk","kyyyyyyyyk","kyyyyyyyyk",".kyyyyyyk.","..kkkkkk.."];
const SYM={star:["..ww..","wwwwww",".wwww.",".wwww.","ww..ww",".w..w."],flame:["...w..","..ww..",".wrrw.",".wrrw.",".wrrw.","..ww.."],dumb:["......","w.dd.w","wwddww","wwddww","w.dd.w","......"],trophy:["wwwwww","wwwwww",".wwww.","..ww..","..ww..",".wwww."],flag:["wrrrr.","wrrrr.","wrrr..","w.....","w.....","w....."],pullup:["wwwwww","w....w","..ww..","..ww..",".w..w.",".w..w."],moon:["..ww..",".ww...","ww....","ww....",".ww...","..ww.."],heart:["ww..ww","wwwwww","wwwwww",".wwww.","..ww..","......"]};
const BD=[["first","首次训练","完成并保存第一次有效训练（至少 3 组）","#ffcc33","star"],["pr","个人最佳","首次打破某个动作的个人纪录","#ff9f1c","trophy"],["streak","连续训练","连续 2 周达到每周训练目标","#ff6b35","flame"],["strength","力量突破","累计 5 次个人纪录","#22d3ee","dumb"],["stage","阶段达成","完成长期目标的第一个阶段","#7ee081","flag"],["pullup","首个引体","完成一次标准引体向上","#b18cff","pullup"],["rest","恢复有道","状态不佳时选择休息：当天没有训练，也不扣分","#5aa9ff","moon"],["heart","坚持不懈","连续 4 周达到每周训练目标","#ff7aa2","heart"]].map(a=>({id:a[0],name:a[1],desc:a[2],color:a[3],sym:a[4]}));
function draw(rows,pal,px){let r="";rows.forEach((row,y)=>{for(let x=0;x<row.length;x++){const f=pal[row[x]];if(f)r+='<rect x="'+x+'" y="'+y+'" width="1" height="1" fill="'+f+'"/>'}});return '<svg viewBox="0 0 '+rows[0].length+' '+rows.length+'" width="'+px+'" height="'+px+'" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">'+r+'</svg>'}
const avRows=id=>EARS[AV[id].ear].concat(HEAD.slice(2));
const avatar=(id,px)=>{const a=AV[id]||AV.bear;return draw(avRows(AV[id]?id:"bear"),{k:"#0a0e14",b:a.b,i:a.i,l:a.l,e:a.e,p:a.p,n:a.nn},px||56)};
const bdRows=b=>BASE.map((row,y)=>[...row].map((c,x)=>{if(y>=2&&y<=7&&x>=2&&x<=7){const s=SYM[b.sym][y-2][x-2];if(s!==".")return s}return c}).join(""));
const badge=(id,px)=>{const b=BD.find(x=>x.id===id);return draw(bdRows(b),{k:"#0a0e14",y:b.color,w:"#ffffff",d:"#1f2a38",r:"#ff3b30"},px||48)};
const API={AV,BD,SYM,HEAD,EARS,BASE,avRows,bdRows,avatar,badge,ids:Object.keys(AV)};
if(typeof module!=="undefined")module.exports=API;else root.FitPixel=API;
})(typeof window!=="undefined"?window:globalThis);
