const C=require("../app/src/main/assets/core.js");let n=0,f=0;
const ok=(c,m)=>{n++;if(!c){f++;console.log("FAIL:",m)}else console.log("ok  :",m)};
const S=(w,reps,rpe,sec)=>({id:Math.random()+"",w,reps,sec,rpe,done:true});let t=1e9;
const ts=d=>Date.UTC(+d.slice(0,4),+d.slice(5,7)-1,+d.slice(8,10),9);
const add=(db,date,items)=>{const st=ts(date)+(t++%1000);db.sessions.push({id:"s"+st,date,start:st,end:st+36e5,note:"",items:items.map(([ex,sets])=>({ex,sets}))})};
const ids=new Set(C.BUILTIN.map(e=>e.id));
ok(C.GOALS.length>=20,"高阶目标目录 ≥20 个（现有 "+C.GOALS.length+"）");
ok(new Set(C.GOALS.map(g=>g.grp)).size>=7,"覆盖 ≥7 个肌群："+[...new Set(C.GOALS.map(g=>g.grp))].join("、"));
ok(C.GOALS.every(g=>g.st.length>=3&&g.st.every(s=>s.ex.every(x=>ids.has(x))&&s.c.every(c=>ids.has(c[1])))),"每个目标≥3个阶段，阶段动作和判定条件引用的动作都在动作库里");
ok(new Set(C.GOALS.map(g=>g.id)).size===C.GOALS.length,"目标ID不重复");
ok(C.BUILTIN.length>=45,"动作库 "+C.BUILTIN.length+" 个动作");
ok(C.BUILTIN.filter(e=>["pistol","dragon","muscleup","nordic","hspu","lsit"].includes(e.id)).length===6,"手枪蹲/龙旗/肌肉上杆/北欧挺身/倒立撑/L坐都在库里");
const cn=C.chainOf("pullup");ok(cn.regress.includes("pullup_assist")&&cn.progress.includes("pullup_high")&&cn.progress.includes("weighted_pullup"),"回归/进阶动作由动作链推导（引体向上）");
ok(C.equipOf(C.exOf(C.newDB(),"pushup")).includes("无需")&&C.equipOf(C.exOf(C.newDB(),"dip"))==="双杠","器械信息");
ok(C.BUILTIN.every(e=>C.mistakesOf(e).length>0),"每个动作都有常见错误");
ok(C.groupsOf(C.exOf(C.newDB(),"dragon")).includes("核心")&&C.groupsOf(C.exOf(C.newDB(),"nordic")).includes("腿"),"肌群筛选分类");
// 目标判定：手枪蹲
let db=C.newDB();db.goal={id:"pistol",start:"2026-11-01",end:"2027-03-01",perWeek:3};
add(db,"2026-11-02",[["pistol",[S(0,1,9)]]]);let g=C.goalStatus(db,"2026-11-06");ok(g.cur===0&&!g.stages[0].met&&!g.done,"没完成前置阶段时，直接做出手枪蹲也不会跳过阶段");
add(db,"2026-11-03",[["bulgarian",[S(8,10,7),S(8,10,7),S(8,10,8)]]]);g=C.goalStatus(db,"2026-11-06");ok(g.stages[0].met&&g.cur===1&&/保加利亚分腿蹲/.test(g.stages[0].text),"保加利亚分腿蹲单组10次 → 阶段1完成");
add(db,"2026-11-04",[["box_pistol",[S(0,8,8)]]]);g=C.goalStatus(db,"2026-11-06");ok(g.cur===2&&g.done===false||g.done,"箱式单腿深蹲8次 → 进入阶段3或完成（手枪蹲此前已记录）");
ok(g.done,"手枪蹲记录在目标开始之后：三个阶段都满足 → 目标完成");
db=C.newDB();db.goal={id:"pistol",start:"2026-11-01",end:"2027-03-01",perWeek:3};add(db,"2026-11-03",[["bulgarian",[S(8,10,7)]]]);add(db,"2026-11-04",[["box_pistol",[S(0,8,8)]]]);
const pl=l=>C.planToday(db,{level:l},"2026-11-06");
ok(pl("good").items.some(x=>x.ex==="pistol"&&x.goal)&&!pl("mild").items.some(x=>x.ex==="pistol")&&!pl("poor").items.some(x=>x.ex==="pistol")&&/只在状态良好时/.test(pl("mild").note),"「测试手枪蹲」阶段只在状态良好时安排");
db=C.newDB();db.goal={id:"hipthrust60",start:"2026-11-01",end:"2027-03-01",perWeek:3};add(db,"2026-11-02",[["hip_thrust",[S(20,9,7)]]]);
ok(!C.goalStatus(db,"2026-11-06").stages[0].met,"重量条件：20kg 只做了 9 次，不满足「≥10 次」");
add(db,"2026-11-03",[["hip_thrust",[S(20,10,7)]]]);ok(C.goalStatus(db,"2026-11-06").stages[0].met,"20kg × 10 次 → 达标");
const pv=C.goalPreview(C.newDB(),"muscleup");ok(pv.length===3&&pv.every(s=>/「/.test(s.need)),"目标预览：每个阶段显示可验证的完成条件");
db=C.newDB();db.goal={id:"pullup10",start:"2026-11-01",end:"2027-06-01",perWeek:3};ok(C.goalStatus(db,"2026-11-06").stages.length===7,"10次引体向上：7个阶段（含前置的1次引体）");
// 滚动8周
db=C.newDB();const T="2026-11-06";add(db,"2026-11-06",[["goblet_squat",[S(10,8,7),S(10,8,7),S(10,8,7)]]]);add(db,"2026-10-31",[["goblet_squat",[S(10,8,7)]]]);add(db,"2026-10-30",[["goblet_squat",[S(10,8,7)]]]);
const w0=C.windowStats(db,T,0),w1=C.windowStats(db,T,1);ok(w0.end===T&&w0.start==="2026-10-31"&&w0.n===2&&w1.end==="2026-10-30"&&w1.n===1,"窗口从今天开始往前每7天一段：今天 ~ 6天前 为第一段");
ok(C.windowStats(db,T,7).start==="2026-09-12"&&C.windowStats(db,T,7).end==="2026-09-18","第8段覆盖 49–55 天前");
const ds=C.dispSeries(Object.assign(C.newDB(),{sessions:[]}),"pullup_assist");ok(ds.pts.length===0&&/越低越好/.test(ds.u),"辅助动作图表标明「越低越好」");
db=C.newDB();add(db,"2026-11-01",[["pullup_assist",[S(30,5,7),S(25,5,7)]]]);ok(C.dispSeries(db,"pullup_assist").pts[0].v===25,"辅助动作曲线取最低辅助重量");
// 迁移与导入
ok(C.goalDef({type:"pullup"}).id==="pullup1"&&C.goalDef({id:"nope"})===undefined,"旧版目标自动映射为 pullup1；未知目标无效");
let imp=C.validate({v:1,custom:[],sessions:[],goal:{type:"pullup",start:"2026-11-01",end:"2027-01-01",perWeek:3,baseline:"x"}});ok(imp.goal.id==="pullup1"&&!("baseline" in imp.goal),"导入旧版备份时迁移目标");
imp=C.validate({v:1,custom:[],sessions:[],goal:{id:"nope",start:"a",end:"b",perWeek:3}});ok(imp.goal===null,"导入未知目标时被丢弃");
// 旧积分不重复
db=C.newDB();db.goal={type:"pullup",start:"2026-11-01",end:"2027-04-01",perWeek:3};
add(db,"2026-11-02",[["dead_hang",[S(0,0,7,30),S(0,0,7,30),S(0,0,7,30)]],["inv_row",[S(0,10,7)]]]);
db.rewards=[{key:"stage:0",kind:"stage",points:30,reason:"旧",sessionId:null,date:"2026-11-02",ts:1}];C.syncRewards(db,T);
ok(db.rewards.filter(r=>r.kind==="stage").length===1,"升级前已领过的阶段奖励不会用新规则重复发放");
db=C.newDB();db.goal={id:"plank180",start:"2026-11-01",end:"2027-04-01",perWeek:3};add(db,"2026-11-02",[["plank",[S(0,0,7,60),S(0,0,7,60),S(0,0,7,60)]]]);C.syncRewards(db,T);
const k1=db.rewards.find(r=>r.kind==="stage").key;db.goal={id:"abwheel10",start:"2026-11-03",end:"2027-04-01",perWeek:3};add(db,"2026-11-04",[["abwheel_knee",[S(0,10,7),S(0,10,7),S(0,10,7)]]]);C.syncRewards(db,T);
ok(db.rewards.filter(r=>r.kind==="stage").length===2&&db.rewards.filter(r=>r.kind==="stage")[1].key!==k1,"换了新目标后，新目标的阶段奖励独立计算");
console.log(n-f+"/"+n+" 通过");process.exit(f?1:0)
