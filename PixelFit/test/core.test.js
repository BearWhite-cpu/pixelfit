const C=require("../app/src/main/assets/core.js");let n=0,f=0;
const ok=(c,m)=>{n++;if(!c){f++;console.log("FAIL:",m)}else console.log("ok  :",m)};
const S=(w,reps,rpe,sec)=>({id:Math.random()+"",w,reps,sec,rpe,done:true});
let t=1000;const add=(db,ex,sets,date)=>{db.sessions.push({id:"s"+(t),date,start:t++,end:t,note:"",items:[{ex,sets}]})};
// 3 同一动作读取上次、4 个人最佳
let db=C.newDB();add(db,"goblet_squat",[S(12,8,7),S(12,8,7),S(12,8,7)],"2026-11-01");add(db,"goblet_squat",[S(14,8,7),S(14,7,8)],"2026-11-03");
const L=C.last(db,"goblet_squat");ok(L.date==="2026-11-03"&&L.sets.length===2,"读取上次成绩（最近一次）");
const b=C.best(db,"goblet_squat");ok(b.w===14&&b.e===17.73,"个人最佳：最大重量14kg、1RM 17.73");
ok(C.prs(db,"goblet_squat",[S(15,6,8)]).length>=1,"重量突破被识别为新纪录");
ok(C.prs(db,"goblet_squat",[S(12,8,7)]).length===0,"没有突破时不报纪录");
ok(C.prs(C.newDB(),"goblet_squat",[S(12,8,7)]).length===0,"首次训练不算新纪录");
// 5 建议
db=C.newDB();add(db,"goblet_squat",[S(12,8,7),S(12,8,7),S(12,8,7)],"2026-11-01");
let g=C.suggest(db,"goblet_squat");ok(g.kind==="add_reps"&&g.targets.every(x=>x.w===12&&x.reps===9),"12kg×8×3 → 同重量每组+1次（"+g.text+"）");
db=C.newDB();add(db,"goblet_squat",[S(12,12,8),S(12,12,8),S(12,12,7)],"2026-11-01");
g=C.suggest(db,"goblet_squat");ok(g.kind==="increase"&&g.targets[0].w===12.5,"达上限且RPE≤8 → 加重到12.5kg（"+g.text+"）");
// 6 高RPE不加重
db=C.newDB();add(db,"goblet_squat",[S(12,12,9),S(12,12,9),S(12,12,10)],"2026-11-01");
g=C.suggest(db,"goblet_squat");ok(g.kind==="maintain"&&g.targets[0].w===12,"达上限但RPE9–10 → 维持不加重");
db=C.newDB();add(db,"goblet_squat",[S(12,12,null),S(12,12,null)],"2026-11-01");
g=C.suggest(db,"goblet_squat");ok(g.kind==="increase"&&/未记录 RPE/.test(g.text),"未记录RPE时加重并提示可退回");
db=C.newDB();add(db,"goblet_squat",[S(20,5,9),S(20,6,9),S(20,7,8)],"2026-11-01");
g=C.suggest(db,"goblet_squat");ok(g.kind==="reduce"&&g.targets[0].w<20,"多组低于下限 → 降低重量");
db=C.newDB();add(db,"goblet_squat",[S(5,12,7),S(5,12,7)],"2026-11-01");
g=C.suggest(db,"goblet_squat");ok(g.kind==="add_reps","小重量颗粒度过大 → 先加次数而不是加0.5kg");
// 7 辅助引体
db=C.newDB();add(db,"pullup_assist",[S(30,8,7),S(30,8,7)],"2026-11-01");
g=C.suggest(db,"pullup_assist");ok(g.kind==="increase"&&g.targets[0].w===25,"辅助引体达上限 → 辅助减少到25kg（"+g.text+"）");
add(db,"pullup_assist",[S(25,5,8)],"2026-11-05");
ok(C.prs(db,"pullup_assist",[S(20,4,9)]).length===1,"辅助重量更小算进步（20kg<25kg）");
ok(C.prs(db,"pullup_assist",[S(35,10,6)]).length===0,"辅助更大不算进步（35kg）");
db=C.newDB();add(db,"pullup_assist",[S(0,8,7)],"2026-11-01");ok(/自重引体/.test(C.suggest(db,"pullup_assist").text),"辅助为0 → 提示改练自重");
// 计时/自重
db=C.newDB();add(db,"plank",[S(null,null,7,60),S(null,null,7,60)],"2026-11-01");ok(C.suggest(db,"plank").targets[0].sec===65,"计时动作：达上限+5秒");
// 重复提交与导入
db=C.newDB();db.active={id:"a1",date:"2026-11-06",start:1,items:[{ex:"goblet_squat",sets:[S(12,8,7)]}]};
const r1=C.finish(db,"");db.active={id:"a1",date:"2026-11-06",start:1,items:[{ex:"goblet_squat",sets:[S(12,8,7)]}]};
ok(r1&&C.finish(db,"")===null&&db.sessions.length===1,"相同训练ID不能重复保存");
db.active={id:"a2",date:"x",start:2,items:[{ex:"goblet_squat",sets:[{w:12,reps:8,done:false}]}]};ok(C.finish(db,"")===null,"没有完成任何组时不保存");
const exp=JSON.parse(JSON.stringify({v:1,custom:[],sessions:db.sessions}));ok(C.validate(exp).sessions.length===1,"导出的备份可恢复");
let bad=false;try{C.validate({v:2})}catch(e){bad=true}ok(bad,"无效备份被拒绝");
console.log(n-f+"/"+n+" 通过");process.exit(f?1:0);
