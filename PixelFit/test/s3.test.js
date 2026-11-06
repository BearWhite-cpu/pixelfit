const C=require("../app/src/main/assets/core.js");let n=0,f=0;
const ok=(c,m)=>{n++;if(!c){f++;console.log("FAIL:",m)}else console.log("ok  :",m)};
const S=(w,reps,rpe,sec)=>({id:Math.random()+"",w,reps,sec,rpe,done:true});let t=1e9;
const ts=d=>Date.UTC(+d.slice(0,4),+d.slice(5,7)-1,+d.slice(8,10),9);
const add=(db,date,items)=>{const st=ts(date)+(t++%1000);db.sessions.push({id:"s"+st,date,start:st,end:st+36e5,note:"",items:items.map(([ex,sets])=>({ex,sets}))})};
const sq=w=>["goblet_squat",[S(w,8,7),S(w,8,7),S(w,8,7)]];
let db=C.newDB(),T="2026-11-06";
add(db,"2026-11-02",[["goblet_squat",[S(12,8,7),S(12,8,7)]]]);ok(C.syncRewards(db,T).length===0&&C.pointsOf(db)===0,"不足 3 组的训练不算有效训练，不发积分");
add(db,"2026-11-03",[sq(12)]);let a=C.syncRewards(db,T);ok(C.pointsOf(db)===10&&a.some(r=>r.kind==="day"&&r.points===10)&&a.some(r=>r.key==="badge:first"),"有效训练 +10 分，并解锁「首次训练」勋章");
ok(C.syncRewards(db,T).length===0&&C.pointsOf(db)===10,"重复同步不会重复发放（幂等）");
add(db,"2026-11-03",[["bench",[S(8,8,7),S(8,8,7),S(8,8,7)]]]);C.syncRewards(db,T);ok(C.pointsOf(db)===10,"同一天第二次训练：不再发训练积分");
add(db,"2026-11-04",[sq(14)]);a=C.syncRewards(db,T);ok(a.filter(r=>r.kind==="pr").length===1&&C.pointsOf(db)>=25&&a.some(r=>r.key==="badge:pr"),"更重的深蹲 → 个人纪录 +5，并解锁「个人最佳」");
add(db,"2026-11-05",[["goblet_squat",[S(14,8,7),S(14,8,7),S(14,8,7)]]]);C.syncRewards(db,T);ok(!db.rewards.some(r=>r.kind==="pr"&&r.date==="2026-11-05"),"没有超过此前最佳：不发纪录奖励");
const week=db.rewards.find(r=>r.kind==="week");ok(!!week&&week.points===20,"本周完成 3 次训练 → 每周目标 +20");
// 连续周
db=C.newDB();add(db,"2026-10-26",[sq(10)]);add(db,"2026-10-28",[sq(10)]);add(db,"2026-10-30",[sq(10)]);add(db,"2026-11-02",[sq(10)]);add(db,"2026-11-04",[sq(10)]);add(db,"2026-11-06",[sq(10)]);
C.syncRewards(db,T);ok(db.rewards.some(r=>r.key==="streak:2"&&r.points===20)&&db.rewards.some(r=>r.key==="badge:streak"),"连续 2 周达标 → 连续里程碑 +20 与勋章");
db=C.newDB();add(db,"2026-10-12",[sq(10)]);add(db,"2026-10-14",[sq(10)]);add(db,"2026-10-16",[sq(10)]);add(db,"2026-11-02",[sq(10)]);add(db,"2026-11-04",[sq(10)]);add(db,"2026-11-06",[sq(10)]);
C.syncRewards(db,T);ok(!db.rewards.some(r=>r.key==="streak:2"),"中间隔了没训练的周，不算连续（但也不扣分）");
// 不扣分 + 恢复勋章
db=C.newDB();db.checkins={"2026-11-03":{level:"poor",reasons:["x"],advice:"",energy:1,sleep:4,sore:4,pain:"none"},"2026-11-04":{level:"stop",reasons:["x"],advice:"",energy:3,sleep:7,sore:1,pain:"severe"}};
C.syncRewards(db,T);ok(C.pointsOf(db)===0&&db.rewards.every(r=>r.points>=0)&&db.rewards.some(r=>r.key==="badge:rest"),"状态差选择休息：积分不变、没有任何负分，并得到「恢复有道」");
db=C.newDB();db.checkins={"2026-11-06":{level:"poor"}};C.syncRewards(db,T);ok(!db.rewards.some(r=>r.key==="badge:rest"),"当天的评估不立即发恢复勋章（只认已过去的日期且当天没训练）");
// 等级
const L=C.levelInfo;ok(L(0).l===1&&L(24).l===1&&L(25).l===2&&L(99).l===2&&L(100).l===3&&L(25).pct===0,"等级：25/100/225 分升级");
// 目标阶段奖励
db=C.newDB();db.goal={type:"pullup",start:"2026-11-01",end:"2027-04-20",perWeek:3,baseline:""};
add(db,"2026-11-02",[["dead_hang",[S(0,0,7,30),S(0,0,7,30),S(0,0,7,30)]],["inv_row",[S(0,10,7)]]]);C.syncRewards(db,T);
ok(db.rewards.some(r=>r.kind==="stage"&&r.points===30&&r.sessionId)&&db.rewards.some(r=>r.key==="badge:stage"),"完成阶段1 → +30，关联到达成条件的那次训练，并解锁勋章");
add(db,"2026-11-03",[["pullup_assist",[S(30,6,7),S(30,6,7),S(30,6,8)]]]);add(db,"2026-11-04",[["pullup_assist",[S(15,5,8),S(15,5,8),S(15,5,8)]]]);add(db,"2026-11-05",[["pullup",[S(0,1,9),S(0,0,9)]]]);
db.sessions[3].items[0].sets.pop();C.syncRewards(db,T);ok(db.rewards.some(r=>r.kind==="goal"&&r.points===100)&&db.rewards.some(r=>r.key==="badge:pullup"),"首个标准引体 → 目标 +100 与「首个引体」勋章");
ok(db.rewards.every(r=>r.sessionId===null||db.sessions.some(s=>s.id===r.sessionId)),"每条奖励都能追溯到真实训练记录");
// 伪造防护
const x={v:1,custom:[],sessions:db.sessions,rewards:[{key:"fake",points:9999}]};const imp=C.validate(x);C.syncRewards(imp,T);ok(imp.rewards.every(r=>r.key!=="fake")&&C.pointsOf(imp)<500,"导入备份不会带入伪造的积分，积分由训练记录重新推导");
// 统计与停滞
db=C.newDB();add(db,"2026-11-02",[["bench",[S(10,8,7),S(10,8,7)]],["pushup",[S(0,10,7)]]]);
let w=C.weekStats(db,T,0);ok(w.n===1&&w.sets===3&&w.volume===160&&w.muscle.pectorals===3&&w.muscle.triceps===1.5,"周统计：组数、容量、肌群量（主要×1、协同×0.5）");
ok(C.weekStats(db,T,1).n===0,"上周无训练");
const mk=(dates,vals)=>{const d=C.newDB();dates.forEach((x,i)=>add(d,x,[["goblet_squat",[S(vals[i],8,7)]]]));return d};
ok(C.stagnation(mk(["2026-10-01","2026-10-08","2026-10-15","2026-10-22","2026-10-29"],[14,12,12,12,12]),"goblet_squat")!==null,"5次记录、跨4周、最近3次未超过此前最佳 → 提示停滞");
ok(C.stagnation(mk(["2026-10-01","2026-10-08","2026-10-15","2026-10-22"],[14,12,12,12]),"goblet_squat")===null,"只有4次记录 → 不判断停滞");
ok(C.stagnation(mk(["2026-10-25","2026-10-27","2026-10-29","2026-10-31","2026-11-02"],[14,12,12,12,12]),"goblet_squat")===null,"记录跨度不足 3 周 → 不判断停滞");
ok(C.stagnation(mk(["2026-10-01","2026-10-08","2026-10-15","2026-10-22","2026-10-29"],[12,12,12,12,14]),"goblet_squat")===null,"最近一次有进步 → 不提示停滞");
console.log(n-f+"/"+n+" 通过");process.exit(f?1:0)
