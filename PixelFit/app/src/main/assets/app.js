(function(){
"use strict";
const C=FitCore,$=s=>document.querySelector(s),KEY="pixelfit.db.v1",TY={load:"负重",bw:"自重",assist:"辅助",time:"计时"};
let db=null;try{db=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!db||db.v!==1)db=C.newDB();if(!Array.isArray(db.plan))db.plan=[];db.planSets=db.planSets||{};db.checkins=db.checkins||{};db.profile=db.profile||{name:"",avatar:"bear"};if(db.goal&&!db.goal.id)db.goal={id:"pullup1",start:db.goal.start,end:db.goal.end,perWeek:db.goal.perWeek};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){alert("保存失败：存储空间可能已满")}};
const ui={tab:"home",checkin:false,ckres:false,ck:{energy:3,sore:2,pain:"none",sleep:7},pick:false,pickFor:"rec",q:"",sum:null,sel:null,restEnd:0,msg:"",prep:false,anat:null,mus:null,exOpen:null,view:{},gf:"全部",gsel:null,gend:null,gp:null,lib:false,lq:"",lg:"全部",lopen:null,metric:"minutes"};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pad=n=>String(n).padStart(2,"0"),mmss=ms=>{const s=Math.max(0,Math.floor(ms/1000));return pad(Math.floor(s/60))+":"+pad(s%60)};
const today=()=>{const d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())};
const mkSet=(t,g)=>({id:C.uid(),w:g&&g.w!=null?g.w:(t==="bw"?0:null),reps:g&&g.reps!=null?g.reps:null,sec:g&&g.sec!=null?g.sec:null,rpe:null,done:false});
const bestStr=(t,b)=>t==="load"?b.w+"kg"+(b.e?"（估算1RM "+b.e+"kg）":""):t==="bw"?(b.b.w?"+"+b.b.w+"kg×":"")+b.b.reps+"次":t==="assist"?"辅助 "+b.a.w+"kg×"+b.a.reps+"次":b.s+"秒";

function setRow(it,i,s,j,t){
 const inp=(f,v,st)=>`<input type="number" inputmode="decimal" step="${st}" value="${v==null?"":v}" data-f="${f}" data-i="${i}" data-j="${j}" ${s.done?"disabled":""}>`;
 const cells=t==="time"?inp("sec",s.sec,1):inp("w",s.w,0.5)+inp("reps",s.reps,1);
 return `<div class="sr ${t==="time"?"c4":"c5"} ${s.done?"done":""}"><span>${j+1}</span>${cells}${inp("rpe",s.rpe,0.5)}<button class="ck" data-a="done" data-i="${i}" data-j="${j}">${s.done?"✓":"○"}</button></div>`}
function itemCard(it,i){
 const id=db.active.id,e=C.exOf(db,it.ex),t=e.t,L=C.last(db,it.ex,id),b=C.best(db,it.ex,id),sg=C.suggestFor(db,it.ex,id,ctx()),pr=C.prs(db,it.ex,it.sets,id);
 const h=({load:["kg","次"],bw:["+kg","次"],assist:["辅助kg","次"],time:["秒"]})[t];
 return `<section class="card"><div class="row"><h3 style="margin:0">${esc(e.n)}</h3><span><button class="link" data-a="anat" data-id="${esc(it.ex)}">肌肉图</button><button class="link" data-a="rmex" data-i="${i}">移除</button></span></div>
 <div class="mu">${L?"上次 "+L.date+"："+C.fmtSets(t,L.sets):"没有历史记录"}${b.n?" ｜ 最佳："+bestStr(t,b):""}</div>
 <div class="sug ${sg.kind}"><b>建议</b> ${esc(sg.text)}<div class="mu">依据：${esc(sg.why)}</div></div>
 ${pr.length?`<div class="pr">🎉 新纪录：${pr.map(esc).join("；")}</div>`:""}
 <div class="sh ${t==="time"?"c4":"c5"}"><span>组</span>${h.map(x=>`<span>${x}</span>`).join("")}<span>RPE</span><span></span></div>
 ${it.sets.map((s,j)=>setRow(it,i,s,j,t)).join("")}
 <button class="btn ghost" data-a="addset" data-i="${i}">＋ 加一组</button></section>`}
function plist(){const q=ui.q.trim();return C.all(db).filter(e=>!q||e.n.includes(q)||e.m.includes(q)).map(e=>`<button class="pi" data-a="pick" data-id="${esc(e.id)}"><b>${esc(e.n)}</b><span class="mu">${esc(e.m)} · ${TY[e.t]}</span></button>`).join("")||'<p class="mu">没有匹配的动作</p>'}
function picker(){return `<div class="modal"><div class="sheet"><div class="row"><h3>选择动作</h3><button class="link" data-a="closepick">关闭</button></div><input id="q" placeholder="搜索动作或肌群" value="${esc(ui.q)}"><div id="plist">${plist()}</div><details><summary>创建自定义动作</summary><input id="cn" placeholder="动作名称"><select id="ct"><option value="load">负重（kg×次）</option><option value="bw">自重（次，可加负重）</option><option value="assist">辅助（辅助kg×次）</option><option value="time">计时（秒）</option></select><button class="btn" data-a="newex">创建并添加</button></details></div></div>`}
function summaryView(){const s=ui.sum;return `<section class="card"><h2>本次训练总结</h2><div>完成 <b>${s.sets}</b> 组 · 用时 <b>${s.min}</b> 分钟${s.vol?" · 负重总量 <b>"+s.vol+"</b> kg":""}</div>
 ${s.prs.length?s.prs.map(p=>`<div class="pr">🎉 ${esc(p.n)}：${p.l.map(esc).join("；")}</div>`).join(""):'<p class="mu">本次没有新的个人最佳。能按计划完成，本身就是进步。</p>'}
 <textarea id="note" rows="3" placeholder="训练备注（可选）：状态、疼痛、感受"></textarea>
 <button class="btn" data-a="save">保存训练</button><button class="btn ghost" data-a="back">返回继续训练</button></section>`}
function train(){
 const a=db.active;if(ui.sum)return summaryView();if(ui.lib&&!a)return libView();if(ui.prep&&!a)return prepView();
 if(!a){const rec=[...db.sessions].sort((x,y)=>y.start-x.start).slice(0,5);
  return (ui.msg?`<div class="pr">${esc(ui.msg)}</div>`:"")+`<section class="card"><h2>开始训练</h2><p class="mu">选动作、记录每一组。再次练同一个动作时，会显示上次成绩和这次的建议。</p><button class="btn big" data-a="today">开始今日训练</button><button class="link" data-a="prep">自己安排动作</button><button class="link" data-a="lib">动作库</button><button class="link" data-a="start">跳过准备，直接记录</button></section><h3>最近训练</h3>`+
  (rec.length?rec.map(s=>`<div class="card sm"><b>${s.date}</b><div class="mu">${s.items.map(i=>esc((C.exOf(db,i.ex)||{n:i.ex}).n)+" "+i.sets.length+"组").join("、")}</div></div>`).join(""):'<p class="mu">还没有训练记录</p>')}
 return `<div class="bar2"><span>训练中 <b id="el"></b></span><button class="btn sm2 ghost" data-a="finish">完成训练</button></div>`+a.items.map(itemCard).join("")+`<button class="btn ghost" data-a="addex">＋ 添加动作</button><button class="link" data-a="abort">放弃本次训练</button><div id="rest" class="restbar" ${ui.restEnd>Date.now()?"":"hidden"}><span>休息 <b id="rt"></b></span><button class="btn sm2 ghost" data-a="skiprest">跳过</button></div>`+(ui.pick?picker():"")+(ui.anat?anatSheet(ui.anat):"")}
function detail(id){const e=C.exOf(db,id),b=C.best(db,id),ss=db.sessions.filter(s=>s.items.some(i=>i.ex===id)).sort((x,y)=>y.start-x.start).slice(0,8);
 return `<section class="card"><h3 style="margin:0">${esc(e.n)} · 个人最佳</h3><div>${bestStr(e.t,b)}</div>${trendChart(id)}</section><h3>最近记录</h3>`+ss.map(s=>{const it=s.items.find(i=>i.ex===id);return `<div class="card sm"><b>${s.date}</b><div>${C.fmtSets(e.t,C.doneSets(db,it))}</div></div>`}).join("")}
function progress(){return statsCards()+progressOld()}
function progressOld(){
 const has=C.all(db).filter(e=>db.sessions.some(s=>s.items.some(i=>i.ex===e.id)));
 return `<h2>动作成长</h2>`+(has.length?`<div class="chips">${has.map(e=>`<button class="chip ${ui.sel===e.id?"on":""}" data-a="sel" data-id="${esc(e.id)}">${esc(e.n)}</button>`).join("")}</div>`:'<p class="mu">完成第一次训练后，这里会显示每个动作的历史和个人最佳。</p>')+
 (ui.sel&&has.some(e=>e.id===ui.sel)?detail(ui.sel):"")+
 `<section class="card"><h3 style="margin:0">数据备份</h3><p class="mu">数据只保存在本机。请自己保存好导出的备份文本。</p><button class="btn ghost" data-a="export">导出备份</button><button class="btn ghost" data-a="import">从文本恢复</button><textarea id="bk" rows="4" placeholder="导出的备份显示在这里；恢复时把备份粘贴到这里"></textarea><input type="file" id="bf" accept=".json,application/json,text/plain"></section>`}
const LV={primary:1,secondary:2,stabilizer:3},RN={primary:"主要",secondary:"协同",stabilizer:"稳定"};
function mapSvg(view,sm,zoom){const levels={},ids={};C.MUSCLES.forEach(m=>{ids[m.mapRegionId]=m.muscleId;if(sm[m.muscleId])levels[m.mapRegionId]=LV[sm[m.muscleId].level]});return FitAnatomy.svg(view,{levels,ids,zoom})}
const legend=()=>`<div class="lg"><span><i class="sw" style="background:#ff5a36"></i>主要</span><span><i class="sw" style="background:#ffb020"></i>协同</span><span><i class="sw hat"></i>稳定</span></div><p class="mu">示意图：按动作常见的肌肉分工分三级显示，不是肌电测量，也不代表你个人的实际刺激程度。</p>`;
function musPanel(sm){const m=ui.mus&&C.MUSCLE[ui.mus];if(!m)return '<p class="mu">点击图上的肌肉，查看名称和参与的动作。</p>';const o=sm[m.muscleId];
 return `<div class="pr info">${esc(m.name)}：${o?RN[o.level]+"肌群。参与动作："+o.ex.map(x=>esc(x.n)+"（"+RN[x.role]+"）").join("、"):"不在当前计划的动作中"}</div>`}
function anatomyCard(id){const e=C.exOf(db,id),sm=C.muscleSummary(db,[id]),dv=e.anatomyMapId==="body-back"?"back":"front",v=ui.view[id]||dv,nm=l=>Object.keys(sm).filter(k=>sm[k].level===l).map(k=>C.MUSCLE[k].name).join("、")||"—";
 return `<div class="anat"><div class="mu">训练目的：${esc(C.PATTERNS[e.movementPattern]||"自定义动作")}</div>`+
 (e.anatomyMapId?`<div class="chips">${[["front","正面"],["back","背面"],["zoom","局部"]].map(x=>`<button class="chip ${v===x[0]?"on":""}" data-a="view" data-id="${esc(id)}" data-v="${x[0]}">${x[1]}</button>`).join("")}</div><div class="one">${mapSvg(v==="zoom"?dv:v,sm,v==="zoom")}</div>${legend()}${musPanel(sm)}`:'<p class="mu">自定义动作暂无肌群数据。</p>')+
 `<div><b>主要</b> ${nm("primary")}<br><b>协同</b> ${nm("secondary")}<br><b>稳定</b> ${nm("stabilizer")}</div>`+
 ((e.techniqueNotes||[]).length?`<b>动作要点</b><ul>${e.techniqueNotes.map(t=>`<li>${esc(t)}</li>`).join("")}</ul>`:"")+`</div>`}
const anatSheet=id=>`<div class="modal"><div class="sheet"><div class="row"><h3>${esc(C.exOf(db,id).n)}</h3><button class="link" data-a="closeanat">关闭</button></div>${anatomyCard(id)}</div></div>`;
function exBlock(id){const e=C.exOf(db,id),open=ui.exOpen===id;return `<section class="card"><div class="row"><h3 style="margin:0">${esc(e.n)}</h3><button class="link" data-a="exopen" data-id="${esc(id)}">${open?"收起":"查看图谱"}</button></div>${open?anatomyCard(id):`<div class="mu">主要：${(e.primaryMuscles||[]).map(k=>C.MUSCLE[k].name).join("、")||"—"}</div>`}</section>`}
function prepView(){const ids=db.plan;
 let h=`<div class="row"><h2>训练准备</h2><button class="link" data-a="closeprep">返回</button></div>${checkCard()}<section class="card"><h3 style="margin:0">今日动作</h3>${ids.map(id=>`<div class="row"><span>${esc(C.exOf(db,id).n)} ${isGoalEx(id)?'<span class="tag">目标任务</span>':""}</span><button class="link" data-a="rmplan" data-id="${esc(id)}">移除</button></div>`).join("")||'<p class="mu">先添加今天要练的动作，就能看到肌群总览。</p>'}<button class="btn ghost" data-a="addplan">＋ 添加动作</button></section>`;
 if(ids.length){const f=C.prepInfo(db,ids),sm=f.summary;
  h+=`<section class="card"><h3 style="margin:0">今日肌群总览</h3><div class="maps"><figure>${mapSvg("front",sm)}<figcaption>正面</figcaption></figure><figure>${mapSvg("back",sm)}<figcaption>背面</figcaption></figure></div>${legend()}${musPanel(sm)}<p><b>今日重点：</b>${f.focus.join("、")||"—"}</p></section>`+ids.map(exBlock).join("")+
  `<section class="card"><h3 style="margin:0">训练准备</h3><b>建议热身</b><ul>${f.warm.map(w=>`<li>${esc(w)}</li>`).join("")||"<li>轻量热身 1–2 组</li>"}</ul><b>注意事项</b><ul>${f.notes.map(n=>`<li>${esc(n.n)}：${n.tips.map(esc).join("；")}</li>`).join("")}</ul><p class="mu">出现尖锐疼痛或异常不适，请立即停止并休息，必要时咨询专业人员。</p></section><button class="btn big" data-a="begin">我已了解，开始训练记录</button>`}
 return h+`<button class="link" data-a="start">跳过准备，直接记录</button>`+(ui.pick?picker():"")}
function choose(id){if(ui.pickFor==="plan"){if(!db.plan.includes(id))db.plan.push(id);ui.pick=false;save();render()}else addEx(id)}
const LVN={good:"状态良好",mild:"轻度疲劳",poor:"状态较差",stop:"建议休息"},LVC={good:"ok",mild:"warn",poor:"bad",stop:"bad"},DN=["一","二","三","四","五","六","日"];
const addDays=n=>{const d=new Date(Date.now()+n*864e5);return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())};
const ctx=()=>{const c=db.checkins[today()];return c&&c.level==="poor"?{noPR:true,why:c.reasons.join("；")}:null};
function planSets(id,t,sg){const n=(db.planSets||{})[id]||0,tg=sg.targets.slice();if(!tg.length)return Array.from({length:n||1},()=>mkSet(t));if(n){while(tg.length>n)tg.pop();while(tg.length<n)tg.push(tg[tg.length-1])}return tg.map(g=>mkSet(t,g))}
function loadPlan(){if(db.plan.length)return;const p=C.planToday(db,db.checkins[today()],today());db.plan=p.items.map(x=>x.ex);db.planSets={};p.items.forEach(x=>{db.planSets[x.ex]=x.sets});save()}
function isGoalEx(id){const st=C.goalStatus(db,today());return !!(st&&!st.done&&st.stages[st.cur].ex.includes(id))}
function checkCard(){const c=db.checkins[today()];if(!c)return "";return `<section class="card"><div class="row"><h3 style="margin:0">今日状态</h3><span class="tag ${LVC[c.level]}">${LVN[c.level]}</span></div><ul>${c.reasons.map(r=>`<li>${esc(r)}</li>`).join("")}</ul><div>${esc(c.advice)}</div></section>`}
const planRows=p=>p.items.map(x=>`<div class="row"><span>${esc(C.exOf(db,x.ex).n)} ${x.goal?'<span class="tag">目标任务</span>':""}</span><span class="mu">${x.sets} 组</span></div>`).join("");
function homeView(){const t=today(),ck=db.checkins[t],g=C.goalStatus(db,t),P=C.pointsOf(db),LI=C.levelInfo(P),wk=C.weekInfo(db,t,db.goal?db.goal.perWeek:3),ls=C.lastSession(db),pf=db.profile;
 const plan=ck&&ck.level!=="stop"&&!db.active?`<div class="mu" style="margin-top:6px">今日建议</div>${planRows(C.planToday(db,ck,t))}`:"";
 const goal=g?`<div class="row"><b>${esc(g.def.n)}</b><span class="tag">剩 ${g.weeksLeft} 周</span></div>${g.done?'<div class="pr">🎉 目标已完成</div>':`<div class="mu" style="margin:6px 0 4px">阶段 ${g.cur+1}/${g.stages.length}：${esc(g.current.n)}</div><div class="bar"><i style="width:${Math.round(g.stages.filter(x=>x.met).length/g.stages.length*100)}%"></i></div><div class="mu" style="margin-top:4px">${esc(g.current.text)}</div>`}`:`<p class="mu">还没有长期目标。设定后，每天的训练任务会和目标阶段关联。</p><button class="btn ghost" data-a="tab" data-id="profile">设定长期目标</button>`;
 return `<div class="card hero"><div class="av" data-a="tab" data-id="profile">${FitPixel.avatar(pf.avatar,60)}</div><div><b style="font-size:18px">${esc(pf.name||"运动员")}</b><div class="mu">LV ${LI.l} · ${P} 积分 · 已完成 ${db.sessions.length} 次训练</div></div></div>
 <section class="card"><h3 style="margin-top:0">今日训练</h3>${ck?`<div class="row"><span>今日状态 <span class="tag ${LVC[ck.level]}">${LVN[ck.level]}</span></span><button class="link" data-a="recheck">重新评估</button></div><div class="mu">${esc(ck.advice)}</div>${plan}`:'<p class="mu">训练前先做 30 秒状态评估，系统会据此调整今天的训练。</p>'}<button class="btn big" data-a="today">${db.active?"继续训练":"开始今日训练"}</button></section>
 <section class="card"><h3 style="margin-top:0">长期目标</h3>${goal}</section>
 <section class="card"><h3 style="margin-top:0">本周</h3><div class="dots">${DN.map((d,i)=>`<div class="dot ${wk.days[i]?"on":""} ${i===wk.todayIdx?"td":""}">${d}</div>`).join("")}</div><div class="mu">本周 ${wk.n}/${wk.target} 次</div></section>
 <section class="card"><h3 style="margin-top:0">最近一次训练</h3>${ls?`<div>${ls.date} · ${ls.sets} 组 · ${ls.min} 分钟${ls.vol?" · 负重总量 "+ls.vol+"kg":""}</div>${ls.prs.map(p=>`<div class="pr">🎉 ${esc(p.n)}：${p.l.map(esc).join("；")}</div>`).join("")}`:'<p class="mu">还没有训练记录</p>'}</section>`}
function checkView(){const c=ui.ck,seg=(f,o)=>`<div class="seg">${o.map(x=>`<button class="${c[f]===x[0]?"on":""}" data-a="ckset" data-f="${f}" data-v="${x[0]}">${x[1]}</button>`).join("")}</div>`;
 return `<div class="row"><h2>今日状态评估</h2><button class="link" data-a="ckback">返回</button></div><section class="card"><h3 style="margin-top:0">精力水平</h3>${seg("energy",[[1,"1 很低"],[2,"2 偏低"],[3,"3 一般"],[4,"4 不错"],[5,"5 充沛"]])}<h3>昨晚睡眠（小时）</h3><input id="cksleep" type="number" step="0.5" min="0" max="14" value="${c.sleep==null?7:c.sleep}"><h3>肌肉酸痛</h3>${seg("sore",[[1,"1 无"],[2,"2 轻微"],[3,"3 中等"],[4,"4 明显"],[5,"5 严重"]])}<h3>疼痛或异常不适</h3>${seg("pain",[["none","没有"],["mild","轻微局部不适"],["severe","明显疼痛/异常"]])}<button class="btn" data-a="cksubmit">生成今日建议</button></section>`}
function resView(){const c=db.checkins[today()],p=C.planToday(db,c,today());
 return `<div class="row"><h2>今日建议</h2><button class="link" data-a="ckback">返回首页</button></div>${checkCard()}`+(c.level==="stop"?"":`<section class="card"><h3 style="margin-top:0">今日训练</h3>${planRows(p)}${p.note?`<p class="mu">${esc(p.note)}</p>`:""}<button class="btn big" data-a="ckgo">进入训练准备</button></section>`)}
const GRPS=["全部","背","腿","臀","胸","肩","手臂","核心"];
function goalSetup(id){const d=C.goalDef({id}),pv=C.goalPreview(db,id),w=Math.max(8,d.st.length*6);
 return `<section class="card"><h3 style="margin-top:0">${esc(d.n)}</h3>${pv.map((x,i)=>`<div class="stg"><div class="no">${i+1}</div><div><b>${esc(x.n)}</b><div class="mu">完成条件：${esc(x.need)}</div></div></div>`).join("")}<p class="mu">⚠ 高阶动作请在前置阶段达标后再尝试；出现尖锐疼痛立即停止，必要时咨询专业人员。</p><h3>目标期限（自己选择）</h3><div class="chips">${[8,12,24,52].map(x=>`<button class="chip" data-a="gwk" data-v="${x}">${x} 周</button>`).join("")}</div><input id="ge" type="date" value="${ui.gend||addDays(w*7)}"><h3>每周训练次数</h3><select id="gp">${[2,3,4,5,6].map(x=>`<option ${x===(ui.gp||3)?"selected":""}>${x}</option>`).join("")}</select><p class="mu">期限只是你给自己的节点。进度只看真实训练记录，阶段达标才进入下一阶段。</p><button class="btn" data-a="savegoal">开始这个目标</button></section>`}
function goalList(){return `<div class="mu" style="margin-bottom:6px">选择一个长期目标（共 ${C.GOALS.length} 个高阶动作目标）</div><div class="chips">${GRPS.map(x=>`<button class="chip ${ui.gf===x?"on":""}" data-a="gfilter" data-id="${x}">${x}</button>`).join("")}</div>`+C.GOALS.filter(g=>ui.gf==="全部"||g.grp===ui.gf).map(g=>`<div class="card sm gi ${ui.gsel===g.id?"sel":""}" data-a="gpick" data-id="${g.id}"><div class="row"><b>${esc(g.n)}</b><span class="tag">${g.grp}</span></div><div class="mu">${g.st.length} 个阶段 · 起点：${esc(g.st[0].n)}</div></div>`).join("")+(ui.gsel?goalSetup(ui.gsel):"")}
function profileView(){const pf=db.profile,g=db.goal,gs=C.goalStatus(db,today());
 const goal=g&&gs?`<b style="font-size:18px">${esc(gs.def.n)}</b><div class="mu">目标期限：${g.end}（剩 ${gs.weeksLeft} 周）· 每周 ${g.perWeek} 次</div>${gs.stages.map((x,i)=>`<div class="stg ${x.met?"ok":i===gs.cur&&!gs.done?"cur":""}"><div class="no">${x.met?"✓":i+1}</div><div><b>${esc(x.n)}</b><div class="mu">完成条件：${esc(x.need)}</div><div class="mu">当前：${esc(x.text)}</div></div></div>`).join("")}<button class="link" data-a="delgoal">更换目标</button>`:goalList();
 return `<h2>我的</h2><section class="card"><div class="hero"><div class="av">${FitPixel.avatar(pf.avatar,60)}</div><div style="flex:1"><input id="pn" maxlength="12" placeholder="你的名字" value="${esc(pf.name)}"></div></div><h3>选择头像</h3><div class="avs">${FitPixel.ids.map(id=>`<button class="${pf.avatar===id?"sel":""}" data-a="avatar" data-id="${id}"><span class="av">${FitPixel.avatar(id,52)}</span><div class="mu">${FitPixel.AV[id].n}</div></button>`).join("")}</div></section>
 <section class="card"><h3 style="margin-top:0">长期目标</h3>${goal}</section>`}
const EM={day:"💪",pr:"🏆",week:"📅",streak:"🔥",stage:"🚩",goal:"🎯",badge:"🏅"};
function rewardView(){const R=ui.reward,ad=R.add.filter(r=>r.kind!=="badge"),bs=R.add.filter(r=>r.kind==="badge"),got=ad.reduce((t,r)=>t+r.points,0),LI=C.levelInfo(R.pts);
 return `<h2>训练已保存</h2><section class="card" style="text-align:center"><div class="big-n">${got>0?"+"+got+" 积分":"已记录"}</div>${ad.length?"":'<p class="mu">同一天多次训练只计一次训练积分；个人纪录和目标进度仍会计入。</p>'}</section>`+
 (ad.length?`<section class="card">${ad.map(r=>`<div class="row"><span>${EM[r.kind]} ${esc(r.reason)}</span><b style="color:var(--ac)">+${r.points}</b></div>`).join("")}</section>`:"")+
 bs.map(r=>{const b=FitPixel.BD.find(x=>"badge:"+x.id===r.key);return `<section class="card hero">${FitPixel.badge(b.id,56)}<div><b>🏅 新勋章：${b.name}</b><div class="mu">${esc(b.desc)}</div></div></section>`}).join("")+
 `<section class="card"><div class="row"><span>LV ${LI.l}</span><span class="mu">${R.pts}/${LI.next} 积分</span></div><div class="bar"><i style="width:${LI.pct}%"></i></div></section><button class="btn big" data-a="rwback">返回首页</button>`}
function achView(){const P=C.pointsOf(db),LI=C.levelInfo(P),R=db.rewards,bk={};R.filter(r=>r.kind==="badge").forEach(r=>{bk[r.key]=r});const nb=Object.keys(bk).length;
 return `<h2>成就</h2><section class="card"><div class="hero"><div class="av">${FitPixel.avatar(db.profile.avatar,56)}</div><div style="flex:1"><div class="big-n">LV ${LI.l}</div><div class="mu">${P} 积分 · 距下一级还差 ${LI.next-P}</div></div></div><div class="bar" style="margin-top:8px"><i style="width:${LI.pct}%"></i></div></section>
 <section class="card"><h3 style="margin-top:0">勋章 ${nb}/${FitPixel.BD.length}</h3><div class="badges">${FitPixel.BD.map(b=>{const g=bk["badge:"+b.id];return `<div class="bd ${g?"":"lock"}">${FitPixel.badge(b.id,44)}<div>${b.name}</div>${g?`<div>${g.date}</div>`:""}</div>`}).join("")}</div><div class="mu" style="margin-top:8px">${FitPixel.BD.filter(b=>!bk["badge:"+b.id]).map(b=>esc(b.name)+"："+esc(b.desc)).join("<br>")||"全部勋章已获得 🎉"}</div></section>
 <section class="card"><h3 style="margin-top:0">积分记录</h3>${[...R].filter(r=>r.points>0).sort((a,b)=>b.ts-a.ts).slice(0,15).map(r=>`<div class="row"><span>${EM[r.kind]} ${esc(r.reason)}<div class="mu">${r.date}${r.sessionId?" · 关联训练记录":""}</div></span><b style="color:var(--ac)">+${r.points}</b></div>`).join("")||'<p class="mu">完成有效训练（至少 3 组）后获得积分。</p>'}</section>
 <p class="mu">积分只来自真实完成的训练记录。休息日、恢复日和状态不佳时选择休息，不扣分、不惩罚。</p>`}
const MET={minutes:["训练时长","分钟"],volume:["负重总量","kg"],n:["训练次数","次"],sets:["完成组数","组"]};
function lineChart(vals,labels,unit){const W=330,H=190,L=38,R=24,T=22,B=30,mx=Math.max(0,...vals);
 if(!(mx>0))return '<p class="mu">暂无数据：完成训练后，这里会显示折线图。</p>';
 const top=mx*1.15,X=i=>L+(vals.length<2?(W-L-R)/2:i*(W-L-R)/(vals.length-1)),Y=v=>T+(H-T-B)*(1-v/top);
 return `<svg viewBox="0 0 ${W} ${H}" class="lc" role="img">${[0,.5,1].map(f=>`<line x1="${L}" x2="${W-R}" y1="${Y(top*f)}" y2="${Y(top*f)}" stroke="#2c3f58"/><text x="${L-5}" y="${Y(top*f)+5}" text-anchor="end" fill="#b4c6da" font-size="13">${Math.round(top*f)}</text>`).join("")}<polyline points="${vals.map((v,i)=>X(i)+","+Y(v)).join(" ")}" fill="none" stroke="#c6ff3d" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>${vals.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="5" fill="#0a0e14" stroke="#22d3ee" stroke-width="3"/>${v>0?`<text x="${X(i)}" y="${Y(v)-10}" text-anchor="middle" fill="#fff" font-size="14" font-weight="700">${Math.round(v*10)/10}</text>`:""}<text x="${X(i)}" y="${H-8}" text-anchor="middle" fill="#b4c6da" font-size="12.5">${labels[i]}</text>`).join("")}</svg><div class="mu">${unit}</div>`}
function trendChart(id){const d=C.dispSeries(db,id),p=d.pts.slice(-8);return `<h3>表现趋势</h3>${p.length>1?lineChart(p.map(x=>x.v),p.map(x=>x.date.slice(5)),d.u):'<p class="mu">至少两次训练后显示折线图。</p>'}`}
function statsCards(){const t=today(),tg=db.goal?db.goal.perWeek:3,W=[];for(let i=7;i>=0;i--)W.push(C.windowStats(db,t,i));
 const last=W[7],prev=W[6],m=ui.metric;let rv;
 if(!last.n)rv='<p>近 7 天没有训练记录。休息不扣分，今天从状态评估开始也可以。</p>';
 else{const dv=prev.volume?Math.round((last.volume-prev.volume)/prev.volume*100):null,pr=db.rewards.filter(r=>r.kind==="pr"&&last.sessionIds.includes(r.sessionId)).length,top=Object.entries(last.muscle).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>C.MUSCLE[x[0]].name+" "+x[1]+" 组").join("、");
  rv=`<div class="mu">${last.start.slice(5)} ~ ${last.end.slice(5)}，对比前 7 天</div><div class="row"><span>训练次数</span><b>${last.n}/${tg} ${last.n>=tg?"✅":""}</b></div><div class="row"><span>总时长 / 总组数</span><span>${last.minutes} 分钟 / ${last.sets} 组</span></div><div class="row"><span>负重总量</span><span>${last.volume} kg${dv!==null?"（"+(dv>=0?"+":"")+dv+"%）":""}</span></div><div class="row"><span>个人纪录</span><span>${pr} 次</span></div><div class="mu">训练较多的肌群：${top||"—"}</div><p>${last.n<tg?"接下来先把频率补回来，目标每周 "+tg+" 次，不必补量。":dv!==null&&dv>30?"总量上升较快，接下来保持或小幅增加，留意恢复。":"节奏稳定，接下来可按计划小幅递进。"}</p>`}
 const mu={};W.slice(4).forEach(w=>Object.entries(w.muscle).forEach(([k,v])=>{mu[k]=(mu[k]||0)+v}));const ml=Object.entries(mu).sort((a,b)=>b[1]-a[1]).slice(0,8),mm=ml.length?ml[0][1]:1,st=C.all(db).map(e=>({e,s:C.stagnation(db,e.id)})).filter(x=>x.s);
 return `<h2>数据</h2><section class="card"><h3 style="margin-top:0">近 7 天复盘</h3>${rv}</section>
 <section class="card"><h3 style="margin-top:0">近 8 周（截至今天）</h3><div class="chips">${Object.keys(MET).map(k=>`<button class="chip ${m===k?"on":""}" data-a="metric" data-id="${k}">${MET[k][0]}</button>`).join("")}</div>${lineChart(W.map(w=>w[m]),W.map(w=>w.end.slice(5)),MET[m][0]+"（"+MET[m][1]+"）· 每个点是截至该日的 7 天合计")}</section>
 <section class="card"><h3 style="margin-top:0">各肌群训练量（近 4 周）</h3>${ml.map(x=>`<div class="row" style="font-size:16px"><span style="flex:0 0 96px">${C.MUSCLE[x[0]].name}</span><div class="bar" style="flex:1"><i style="width:${Math.round(x[1]/mm*100)}%"></i></div><span style="flex:0 0 58px;text-align:right">${x[1]} 组</span></div>`).join("")||'<p class="mu">暂无数据</p>'}<div class="mu">估算：主要肌群按 1 组计，协同肌群按 0.5 组计。</div></section>`+
 (st.length?`<section class="card"><h3 style="margin-top:0">停滞提醒</h3>${st.map(x=>`<p>「${esc(x.e.n)}」最近 3 次没有超过此前最佳（共 ${x.s.n} 次记录，跨 ${x.s.span} 天）。可以检查睡眠和恢复、调整次数范围或换变式。</p>`).join("")}<div class="mu">仅在记录足够（至少 5 次、跨 3 周以上）时提示。</div></section>`:"")}
const LG=["全部","胸","背","肩","手臂","核心","臀","腿"];
function libList(){const q=ui.lq.trim(),g=ui.lg;return C.all(db).filter(e=>(!q||e.n.includes(q)||e.m.includes(q))&&(g==="全部"||C.groupsOf(e).includes(g))).map(e=>`<button class="pi" data-a="libopen" data-id="${esc(e.id)}"><b>${esc(e.n)}</b><span class="mu">${esc(C.groupsOf(e).join("/")||e.m)} · ${TY[e.t]}</span></button>`).join("")||'<p class="mu">没有匹配的动作</p>'}
function libView(){if(ui.lopen)return libDetail(ui.lopen);
 return `<div class="row"><h2>动作库</h2><button class="link" data-a="libclose">返回</button></div><input id="lq" placeholder="搜索动作或肌群" value="${esc(ui.lq)}"><div class="chips">${LG.map(x=>`<button class="chip ${ui.lg===x?"on":""}" data-a="libfilter" data-id="${x}">${x}</button>`).join("")}</div><div id="llist" style="margin-top:8px">${libList()}</div><p class="mu">共 ${C.all(db).length} 个动作</p>`}
function libDetail(id){const e=C.exOf(db,id),nb=C.chainOf(id),nm=a=>a.map(x=>esc(C.exOf(db,x).n)).join("、")||"—",ms=C.mistakesOf(e);
 return `<div class="row"><h2>${esc(e.n)}</h2><button class="link" data-a="libopen" data-id="">返回列表</button></div><section class="card"><div class="row"><span>器械</span><b>${esc(C.equipOf(e))}</b></div><div class="row"><span>类型</span><b>${TY[e.t]}</b></div><div class="row"><span>回归动作</span><span>${nm(nb.regress)}</span></div><div class="row"><span>进阶动作</span><span>${nm(nb.progress)}</span></div>${anatomyCard(id)}${ms.length?`<b>常见错误</b><ul>${ms.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}${(e.warmupNotes||[]).length?`<b>建议热身</b><ul>${e.warmupNotes.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}<p class="mu">本版本不含示范视频或 GIF（避免使用未授权素材），以文字指南和示意图为准。</p><button class="btn" data-a="libadd" data-id="${esc(id)}">加入今日计划</button></section>`}
function render(){
 $("#app").innerHTML=ui.reward?rewardView():ui.checkin?checkView():ui.ckres?resView():ui.tab==="home"?homeView():ui.tab==="train"?train():ui.tab==="progress"?progress():ui.tab==="ach"?achView():profileView();
 $("#nav").innerHTML=[["home","首页"],["train","训练"],["progress","数据"],["ach","成就"],["profile","我的"]].map(x=>`<button class="${ui.tab===x[0]?"on":""}" data-a="tab" data-id="${x[0]}">${x[1]}</button>`).join("");tick()}
function tick(){const a=db.active,el=$("#el");if(el&&a)el.textContent=mmss(Date.now()-a.start);
 const r=$("#rest");if(r){const left=ui.restEnd-Date.now();if(left>0){r.hidden=false;$("#rt").textContent=mmss(left)}else r.hidden=true}}
setInterval(tick,500);
function addEx(id){const a=db.active;if(a.items.some(i=>i.ex===id)){alert("这个动作已经在本次训练里了");return}
 const t=C.exOf(db,id).t,sg=C.suggestFor(db,id,a.id,ctx());
 a.items.push({ex:id,sets:sg.targets.length?sg.targets.map(g=>mkSet(t,g)):[mkSet(t)]});ui.pick=false;save();render()}
document.addEventListener("click",ev=>{
 const b=ev.target.closest("[data-a]");if(!b)return;const a=b.dataset.a,i=+b.dataset.i,j=+b.dataset.j,s=db.active;
 if(a==="today"){if(db.active){ui.tab="train";return render()}const ck=db.checkins[today()];if(!ck){ui.ck={energy:3,sore:2,pain:"none",sleep:7};ui.checkin=true;return render()}if(ck.level==="stop"){ui.ckres=true;return render()}loadPlan();ui.prep=true;ui.tab="train";return render()}
 if(a==="recheck"){const c=db.checkins[today()];ui.ck={energy:c.energy,sore:c.sore,pain:c.pain,sleep:c.sleep};ui.checkin=true;return render()}
 if(a==="ckset"){const sl=$("#cksleep");if(sl)ui.ck.sleep=+sl.value;ui.ck[b.dataset.f]=b.dataset.f==="pain"?b.dataset.v:+b.dataset.v;return render()}
 if(a==="cksubmit"){const sl=+$("#cksleep").value;if(!isFinite(sl)||sl<0||sl>14){alert("请填写 0–14 之间的睡眠小时数");return}ui.ck.sleep=sl;db.checkins[today()]=Object.assign({energy:ui.ck.energy,sleep:sl,sore:ui.ck.sore,pain:ui.ck.pain},C.assess(ui.ck));if(!db.active){db.plan=[];db.planSets={}}ui.checkin=false;ui.ckres=true;save();return render()}
 if(a==="ckgo"){loadPlan();ui.ckres=false;ui.prep=true;ui.tab="train";return render()}
 if(a==="ckback"){ui.ckres=false;ui.checkin=false;ui.tab="home";return render()}
 if(a==="avatar"){db.profile.avatar=b.dataset.id;save();return render()}
 if(a==="savegoal"){const e=$("#ge").value;if(!e||e<=today()){alert("请选择今天之后的目标期限");return}db.goal={id:ui.gsel,start:today(),end:e,perWeek:+$("#gp").value||3};ui.gsel=null;ui.gend=null;db.plan=[];db.planSets={};save();return render()}
 if(a==="delgoal"){if(confirm("重设后将清除当前目标（训练记录不受影响）。继续？")){db.goal=null;db.plan=[];db.planSets={};save();render()}return}
 if(a==="gfilter"){ui.gf=b.dataset.id;return render()}
 if(a==="gpick"){ui.gsel=ui.gsel===b.dataset.id?null:b.dataset.id;ui.gend=null;ui.gp=null;return render()}
 if(a==="gwk"){const sp=$("#gp");if(sp)ui.gp=+sp.value;ui.gend=addDays(+b.dataset.v*7);return render()}
 if(a==="metric"){ui.metric=b.dataset.id;return render()}
 if(a==="lib"){ui.lib=true;ui.lopen=null;return render()}
 if(a==="libclose"){ui.lib=false;ui.lopen=null;return render()}
 if(a==="libfilter"){ui.lg=b.dataset.id;return render()}
 if(a==="libopen"){ui.lopen=b.dataset.id||null;return render()}
 if(a==="libadd"){const id=b.dataset.id;if(!db.plan.includes(id))db.plan.push(id);save();ui.lib=false;ui.lopen=null;ui.prep=true;ui.tab="train";return render()}
 if(a==="rwback"){ui.reward=null;ui.tab="home";return render()}
 if(a==="prep"){ui.prep=true;ui.tab="train";return render()}
 if(a==="closeprep"){ui.prep=false;return render()}
 if(a==="addplan"){ui.pickFor="plan";ui.pick=true;ui.q="";return render()}
 if(a==="rmplan"){db.plan=db.plan.filter(x=>x!==b.dataset.id);save();return render()}
 if(a==="exopen"){ui.exOpen=ui.exOpen===b.dataset.id?null:b.dataset.id;return render()}
 if(a==="view"){ui.view[b.dataset.id]=b.dataset.v;return render()}
 if(a==="mus"){if(b.dataset.m){ui.mus=ui.mus===b.dataset.m?null:b.dataset.m;render()}return}
 if(a==="anat"){ui.anat=b.dataset.id;return render()}
 if(a==="closeanat"){ui.anat=null;return render()}
 if(a==="begin"){const sid=C.uid();db.active={id:sid,date:today(),start:Date.now(),items:db.plan.map(id=>{const t=C.exOf(db,id).t,sg=C.suggestFor(db,id,sid,ctx());return{ex:id,sets:planSets(id,t,sg)}})};db.plan=[];db.planSets={};ui.prep=false;ui.msg="";save();return render()}
 if(a==="tab"){ui.tab=b.dataset.id;ui.msg="";ui.checkin=false;ui.ckres=false;ui.reward=null;ui.lib=false;ui.lopen=null;if(ui.tab==="home"||ui.tab==="ach"){C.syncRewards(db,today());save()}return render()}
 if(a==="start"){ui.prep=false;db.active={id:C.uid(),date:today(),start:Date.now(),items:[]};ui.msg="";save();return render()}
 if(a==="addex"){ui.pickFor="rec";ui.pick=true;ui.q="";return render()}
 if(a==="closepick"){ui.pick=false;return render()}
 if(a==="pick")return choose(b.dataset.id);
 if(a==="newex"){const n=$("#cn").value.trim();if(!n){alert("请输入动作名称");return}const t=$("#ct").value,id="c_"+C.uid();db.custom.push(Object.assign({id,n,t,m:"自定义",r:C.defRange(t)},C.blankMeta()));return choose(id)}
 if(a==="rmex"){if(s.items[i].sets.some(x=>x.done)&&!confirm("这个动作已有完成的组，确定移除？"))return;s.items.splice(i,1);save();return render()}
 if(a==="addset"){const it=s.items[i],t=C.exOf(db,it.ex).t,sg=C.suggestFor(db,it.ex,s.id,ctx()),n=it.sets.length,p=it.sets[n-1];
  const g=sg.targets[n]||(p?{w:p.w,reps:p.reps,sec:p.sec}:null);it.sets.push(mkSet(t,g));save();return render()}
 if(a==="done"){const it=s.items[i],x=it.sets[j],t=C.exOf(db,it.ex).t;
  if(!x.done){const ok=t==="time"?x.sec>0:(x.reps>0&&typeof x.w==="number"&&x.w>=0);if(!ok){alert(t==="time"?"请先填写秒数":"请先填写重量和次数");return}ui.restEnd=Date.now()+90000}
  x.done=!x.done;save();return render()}
 if(a==="skiprest"){ui.restEnd=0;return tick()}
 if(a==="finish"){let sets=0,vol=0;const prs=[];
  s.items.forEach(it=>{const e=C.exOf(db,it.ex),d=C.doneSets(db,it);sets+=d.length;if(e.t==="load")d.forEach(x=>vol+=x.w*x.reps);const l=C.prs(db,it.ex,it.sets,s.id);if(l.length)prs.push({n:e.n,l})});
  if(!sets){alert("还没有完成任何一组（点右侧 ○ 标记完成）");return}
  ui.sum={sets,vol:Math.round(vol),min:Math.max(1,Math.round((Date.now()-s.start)/60000)),prs};return render()}
 if(a==="back"){ui.sum=null;return render()}
 if(a==="save"){const r=C.finish(db,$("#note").value);ui.sum=null;ui.restEnd=0;if(r){const add=C.syncRewards(db,today());save();ui.msg="训练已保存。";ui.reward={add,pts:C.pointsOf(db)}}return render()}
 if(a==="abort"){if(confirm("放弃本次训练？未保存的记录会丢失。")){db.active=null;ui.restEnd=0;save();render()}return}
 if(a==="sel"){ui.sel=b.dataset.id;return render()}
 if(a==="export"){const t=JSON.stringify({v:1,custom:db.custom,sessions:db.sessions,goal:db.goal,checkins:db.checkins,profile:db.profile},null,1);$("#bk").value=t;try{navigator.clipboard.writeText(t).catch(()=>{})}catch(e){}alert("备份文本已生成（并尝试复制）。请粘贴到备忘录或发给自己保存。");return}
 if(a==="import"){try{const nd=C.validate(JSON.parse($("#bk").value));if(!confirm("恢复会覆盖当前所有数据（"+nd.sessions.length+" 次训练）。继续？"))return;db=nd;db.planSets={};C.syncRewards(db,today());save();ui.sum=null;alert("已恢复");render()}catch(e){alert(e.message||"备份文本无法解析")}return}
});
document.addEventListener("change",ev=>{const d=ev.target.dataset,s=db.active;if(ev.target.id==="pn"){db.profile.name=ev.target.value.slice(0,12);save();return}
 if(ev.target.id==="bf"){const f=ev.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$("#bk").value=r.result};r.readAsText(f);return}
 if(!d||!d.f||!s)return;let v=ev.target.value===""?null:+ev.target.value;if(v!==null&&(!isFinite(v)||v<0))v=null;if(d.f==="rpe"&&v!==null)v=Math.min(10,Math.max(1,v));
 s.items[+d.i].sets[+d.j][d.f]=v;save()});
document.addEventListener("input",ev=>{if(ev.target.id==="lq"){ui.lq=ev.target.value;$("#llist").innerHTML=libList()}if(ev.target.id==="q"){ui.q=ev.target.value;$("#plist").innerHTML=plist()}});
C.syncRewards(db,today());save();render();
})();
