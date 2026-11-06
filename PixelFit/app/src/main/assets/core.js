(function(root){
"use strict";
const fix=x=>Math.round(x*100)/100;
const MUSCLES=[["pectorals","胸大肌","胸","anterior","pec"],["front_delt","三角肌前束","肩","anterior","delt_front"],["lateral_delt","三角肌中束","肩","lateral","delt_lat"],["rear_delt","三角肌后束","肩","posterior","delt_rear"],["biceps","肱二头肌","上臂","anterior","bicep"],["triceps","肱三头肌","上臂","posterior","tricep"],["forearms","前臂","前臂","lateral","forearm"],["abs","腹直肌","核心","anterior","abs"],["obliques","腹斜肌","核心","anterior","oblique"],["traps","斜方肌","背/颈","posterior","trap"],["rhomboids","菱形肌/中背","背","posterior","rhomb"],["lats","背阔肌","背","posterior","lat"],["erectors","竖脊肌","下背","posterior","erector"],["glutes","臀大肌","臀","posterior","glute"],["glute_med","臀中肌","臀","posterior","glute_med"],["quads","股四头肌","大腿前侧","anterior","quad"],["adductors","内收肌","大腿内侧","anterior","adduct"],["hamstrings","腘绳肌","大腿后侧","posterior","hamstring"],["calves","小腿三头肌","小腿","posterior","calf"]].map(a=>({muscleId:a[0],name:a[1],anatomicalRegion:a[2],viewType:a[3],mapRegionId:a[4]}));
// viewType: anterior=正面可见 posterior=背面可见 lateral=两侧/正背面均可见
const MUSCLE={};MUSCLES.forEach(m=>{MUSCLE[m.muscleId]=m});
const PATTERNS={squat:"下肢推举：训练大腿前侧与臀部力量","hinge":"髋部伸展：训练臀部与大腿后侧链",lunge:"单侧下肢：力量与平衡","push-horizontal":"水平推：胸、肩前侧与肱三头肌","push-vertical":"垂直推：肩部与肱三头肌","pull-horizontal":"水平拉：背部与肩胛稳定","pull-vertical":"垂直拉：背阔肌与引体向上基础","core-flexion":"躯干屈曲：腹直肌","core-stability":"抗塌腰：核心稳定",hang:"悬垂：握力与肩带稳定",calf:"小腿提踵：训练小腿三头肌"};
const X=(id,n,t,m,r,P,S,B,mp,pat,tech,warm)=>({id,n,t,m,r,primaryMuscles:P,secondaryMuscles:S,stabilizerMuscles:B,anatomyMapId:mp,movementPattern:pat,techniqueNotes:tech,warmupNotes:warm});
const PU=["先下沉肩胛，再用背发力","拉到下巴过杠或肘靠近体侧","离心放慢，不要直接掉下来"];
const BUILTIN=[
X("goblet_squat","高脚杯深蹲","load","腿",[8,12],["quads","glutes"],["adductors","hamstrings"],["abs","erectors"],"body-front","squat",["双脚略宽于肩，脚尖微外展","哑铃贴胸，肘在膝内侧","膝盖朝脚尖方向，躯干保持挺直"],["踝和髋活动度","徒手深蹲 1 组"]),
X("rdl","罗马尼亚硬拉","load","臀腿后侧",[8,12],["hamstrings","glutes"],["erectors","adductors"],["lats","forearms","abs"],"body-back","hinge",["髋向后推，膝微屈","背部保持中立，哑铃贴近腿","下放到大腿后侧有拉伸感即可"],["髋屈伸活动","轻重量硬拉 1 组"]),
X("hip_thrust","臀桥/臀推","load","臀",[8,12],["glutes"],["hamstrings","adductors"],["abs","glute_med"],"body-back","hinge",["肩胛靠在凳上，下巴微收","顶端髋伸直，不过度挺腰","膝盖与脚尖方向一致"],["徒手臀桥 1 组","髋部活动度"]),
X("lunge","哑铃箭步蹲","load","腿",[8,12],["quads","glutes"],["adductors","hamstrings"],["glute_med","abs","calves"],"body-front","lunge",["步幅足够，前膝对准脚尖","躯干稳定，不过度前倾","后膝在地面上方轻触即可"],["髋和踝活动度","徒手箭步蹲"]),
X("leg_press","腿举","load","腿",[10,15],["quads","glutes"],["adductors","hamstrings"],[],"body-front","squat",["腰背贴紧靠背，不要离开","膝盖不内扣，不完全锁死","下放到髋膝舒适的幅度"],["轻重量腿举 1–2 组"]),
X("bench","哑铃卧推","load","胸",[8,12],["pectorals"],["front_delt","triceps"],["rhomboids"],"body-front","push-horizontal",["肩胛收紧下沉","前臂尽量垂直于地面","下放到胸侧，肘约 45° 外展"],["肩部绕环","肩胛激活","轻重量推举 1 组"]),
X("ohp","哑铃肩推","load","肩",[8,12],["front_delt","lateral_delt"],["triceps","traps"],["abs","erectors"],"body-front","push-vertical",["收紧核心和臀部，避免过度反弓","哑铃沿头顶上方垂直推起","手腕在肘的正上方"],["肩部绕环","弹力带外旋","轻重量推举 1 组"]),
X("db_row","单臂哑铃划船","load","背",[8,12],["lats"],["rhomboids","rear_delt","biceps"],["erectors","obliques","traps"],"body-back","pull-horizontal",["背部平直，核心收紧","用肘带动，拉向髋部","顶端稍停，慢放"],["肩胛活动","轻重量划船 1 组"]),
X("lat_pd","高位下拉","load","背",[8,12],["lats"],["biceps","rhomboids","rear_delt"],["forearms","abs"],"body-back","pull-vertical",["胸微挺，肩胛下沉","拉到上胸，不借身体摆动","控制回放，手臂接近伸直"],["肩部悬挂拉伸","轻重量下拉 1 组"]),
X("pushup","俯卧撑","bw","胸",[8,15],["pectorals"],["front_delt","triceps"],["abs","glutes"],"body-front","push-horizontal",["身体成直线，不塌腰","肘与身体约 45°","下放至胸接近地面"],["腕部活动","肩胛激活"]),
X("inv_row","反向划船","bw","背",[8,12],["lats","rhomboids"],["biceps","rear_delt","traps"],["abs","glutes","forearms"],"body-back","pull-horizontal",["身体成直线","肩胛后收，胸拉向杠","慢放，肩不耸起"],["肩胛激活","腕部活动"]),
X("pullup_assist","辅助引体向上","assist","背",[5,8],["lats"],["biceps","rhomboids","rear_delt"],["forearms","abs"],"body-back","pull-vertical",PU,["悬挂 20 秒","肩部绕环"]),
X("pullup","引体向上","bw","背",[3,8],["lats"],["biceps","rhomboids","traps","rear_delt"],["forearms","abs"],"body-back","pull-vertical",PU,["悬挂 20 秒","肩部绕环"]),
X("crunch","卷腹","bw","核心",[12,20],["abs"],["obliques"],[],"body-front","core-flexion",["下背贴地，下巴与胸之间留一拳","用腹部卷起，不拉脖子","慢放，保持张力"],["猫牛式","呼吸激活"]),
X("plank","平板支撑","time","核心",[30,60],["abs"],["obliques"],["glutes","erectors","front_delt"],"body-front","core-stability",["身体成直线，不塌腰不翘臀","肩在肘正上方","保持正常呼吸"],["猫牛式","死虫 1 组"]),
X("dead_hang","悬挂","time","背/握力",[20,40],["forearms"],["lats"],["traps","rear_delt","abs"],"body-back","hang",["肩胛微微下沉，不耸肩","身体稳定，不晃动","手感不适或肩痛时立即松手"],["腕和前臂活动","肩部绕环"])];
const Y=(id,n,t,m,r,P,S,B,mp,pat,tech,warm)=>X(id,n,t,m,r,P?P.split(","):[],S?S.split(","):[],B?B.split(","):[],mp==="b"?"body-back":"body-front",pat,tech.split("|"),warm.split("|"));
[
Y("bulgarian","保加利亚分腿蹲","load","腿",[8,12],"quads,glutes","adductors,hamstrings","glute_med,abs,calves","f","lunge","后脚搭在凳上，前脚站稳|躯干微前倾，前膝对准脚尖|下蹲到大腿接近水平","髋和踝活动度|徒手分腿蹲"),
Y("box_pistol","箱式单腿深蹲","bw","腿",[5,8],"quads,glutes","adductors,hamstrings","glute_med,abs,calves","f","squat","坐在箱子上方控制下蹲|支撑腿膝盖对准脚尖|站起时不借对侧腿","髋和踝活动度|单腿站立平衡"),
Y("pistol","手枪蹲（单侧深蹲）","bw","腿",[1,5],"quads,glutes","adductors,hamstrings","glute_med,abs,calves","f","squat","先用扶手或箱子熟悉全幅度|脚跟踩实，膝盖对准脚尖|下蹲慢，站起稳","髋和踝活动度|箱式单腿深蹲"),
Y("shrimp_assist","辅助虾式深蹲","bw","腿",[3,6],"quads","glutes,adductors","glute_med,abs,calves","f","squat","一手扶墙或 TRX 辅助|后腿抬起，轻触地面再站起|膝盖朝脚尖方向","髋屈肌拉伸|保加利亚分腿蹲"),
Y("shrimp","虾式深蹲","bw","腿",[1,3],"quads","glutes,adductors","glute_med,abs,calves","f","squat","后脚抓住后脚踝|慢下放到后膝轻触地|保持躯干稳定","髋屈肌拉伸|辅助虾式深蹲"),
Y("glute_bridge_sl","单腿臀桥","bw","臀",[10,15],"glutes","hamstrings","glute_med,abs","b","hinge","肩背贴地，支撑脚踩实|骨盆保持水平，不转动|顶端臀部发力夹紧","徒手臀桥|髋部活动度"),
Y("nordic_ecc","北欧挺身离心","bw","腿后侧",[3,6],"hamstrings","glutes,calves","erectors,abs","b","hinge","固定好脚踝，身体成直线|髋不要折叠，慢慢向前倒|用手撑地缓冲回到起点","腘绳肌轻拉伸|单腿臀桥"),
Y("nordic","北欧挺身","bw","腿后侧",[1,3],"hamstrings","glutes,calves","erectors,abs","b","hinge","身体成直线，髋保持伸展|离心控制，再用腘绳肌回拉|不能完成时用手辅助","腘绳肌轻拉伸|北欧挺身离心"),
Y("hip_thrust_sl","单腿臀推","bw","臀",[8,12],"glutes","hamstrings","glute_med,abs,adductors","b","hinge","肩胛靠凳，支撑脚踩实|骨盆保持水平|顶端臀部夹紧，不过度挺腰","单腿臀桥|髋部活动度"),
Y("calf_raise","提踵","bw","小腿",[15,25],"calves","","","b","calf","脚掌前部踩台边，幅度充分|顶端停 1 秒，慢放|膝盖不要完全锁死","踝部活动度|轻量提踵"),
Y("calf_raise_sl","单腿提踵","bw","小腿",[10,20],"calves","","glute_med,abs","b","calf","一手扶墙保持平衡|全幅度上下，不借弹性|两侧次数保持一致","踝部活动度|双腿提踵"),
Y("archer_pushup","弓步俯卧撑","bw","胸",[4,8],"pectorals","front_delt,triceps","abs,obliques,glutes","f","push-horizontal","一侧手臂伸直作为支撑|下放时向弯曲侧靠近|身体保持一条线","腕和肩部活动|标准俯卧撑"),
Y("one_arm_pushup","单臂俯卧撑","bw","胸",[1,3],"pectorals","front_delt,triceps","abs,obliques,glutes","f","push-horizontal","双脚分开增加稳定|躯干不要旋转|可先用斜面降低难度","腕和肩部活动|弓步俯卧撑"),
Y("bench_dip","凳上臂屈伸","bw","手臂",[10,15],"triceps","pectorals,front_delt","","b","push-vertical","手撑凳边，肘向后|下放到肘约 90°，不再深|肩膀远离耳朵","肩部活动|肩胛激活"),
Y("dip","双杠臂屈伸","bw","手臂",[5,10],"triceps,pectorals","front_delt","abs","b","push-vertical","肩下沉，不耸肩|下放到肘约 90°|向上推到手臂接近伸直","肩部活动|凳上臂屈伸"),
Y("pike_pushup","派克俯卧撑","bw","肩",[6,12],"front_delt,lateral_delt","triceps,traps,pectorals","abs","f","push-vertical","髋部抬高成倒 V 形|头顶朝两手之间下放|肘不要过度外展","肩和手腕活动|肩胛激活"),
Y("wall_hs_hold","靠墙倒立","time","肩",[20,60],"front_delt,lateral_delt","triceps,traps","abs,forearms,erectors","f","push-vertical","腹部朝墙，身体尽量成直线|主动顶肩，不塌肩|不适或头晕立即下来","手腕和肩部活动|派克俯卧撑"),
Y("hspu","靠墙倒立撑","bw","肩",[1,5],"front_delt,lateral_delt","triceps,traps,pectorals","abs,forearms","f","push-vertical","先垫软垫并清理周围|下放可控，头轻触垫子|推起时全身保持直线","手腕和肩部活动|靠墙倒立保持"),
Y("knee_raise","悬垂屈膝举腿","bw","核心",[8,15],"abs","obliques","forearms,lats","f","core-flexion","肩胛下沉，身体不摆动|用腹部把骨盆卷起来|慢放，保持张力","悬挂 20 秒|肩部活动"),
Y("leg_raise_hang","悬垂直腿举","bw","核心",[5,10],"abs","obliques","forearms,lats","f","core-flexion","腿伸直举到水平或更高|不借摆动，骨盆后倾|慢放，不要晃","悬挂 20 秒|悬垂屈膝举腿"),
Y("lying_leg_raise","仰卧举腿","bw","核心",[10,15],"abs","obliques","erectors","f","core-flexion","下背贴地，不要塌腰|腿尽量伸直，慢放|腰离地时缩小幅度","猫牛式|呼吸激活"),
Y("dragon_neg","龙旗离心","bw","核心",[3,6],"abs","obliques,lats","erectors,glutes,traps","f","core-stability","肩部着地，身体成直线|下放 3–5 秒，不折髋|腰部有不适立即停止","仰卧举腿|腹部激活"),
Y("dragon","龙旗","bw","核心",[1,3],"abs","obliques,lats","erectors,glutes,traps","f","core-stability","肩部着地，身体成直线|上下都保持身体伸直|难度高，需前置阶段达标","龙旗离心|腹部激活"),
Y("tuck_lsit","屈膝 L 坐","time","核心",[10,20],"abs","front_delt,triceps","lats,traps,forearms,quads","f","core-stability","手撑稳，肩下沉|膝盖抬起靠近胸|不耸肩","手腕活动|肩胛激活"),
Y("lsit","L 坐","time","核心",[8,20],"abs","front_delt,triceps","lats,traps,forearms,quads","f","core-stability","手臂伸直，肩下沉|腿伸直平举|不耸肩，腿不下沉","手腕活动|屈膝 L 坐"),
Y("abwheel_knee","跪姿腹轮","bw","核心",[8,15],"abs","lats,obliques","erectors,front_delt,glutes","f","core-stability","臀部收紧，骨盆后倾|滚出去到能控制的位置|不塌腰，慢慢收回","腹部激活|平板支撑"),
Y("abwheel","站姿腹轮","bw","核心",[3,10],"abs","lats,obliques","erectors,front_delt,glutes","f","core-stability","先从跪姿熟练再站姿|臀部收紧，不塌腰|只滚到能控制的位置","腹部激活|跪姿腹轮"),
Y("pullup_high","高位引体向上","bw","背",[2,5],"lats","biceps,rhomboids,traps,rear_delt","forearms,abs","b","pull-vertical","拉得更高，胸接近杠|身体略后仰，肘向后下拉|慢放，不放松","悬挂 20 秒|引体向上"),
Y("muscleup","肌肉上杆","bw","背",[1,3],"lats","triceps,biceps,pectorals,rhomboids,traps","forearms,abs","b","pull-vertical","需要很强的高位引体基础|拉高后快速转腕过杠|必须有保护，并在状态良好时练习","肩和手腕活动|高位引体向上"),
Y("deadlift","硬拉","load","臀腿后侧",[5,8],"glutes,hamstrings","erectors,quads,adductors","lats,traps,forearms,abs","b","hinge","杠铃贴近身体，背部中立|用腿蹬地，同时髋向前顶|下放时髋先向后，不弯腰","髋屈伸活动|轻重量硬拉"),
Y("squat","杠铃深蹲","load","腿",[5,8],"quads,glutes","adductors,hamstrings,erectors","abs,calves","f","squat","杠铃稳在上背，核心收紧|膝盖对准脚尖，脚跟踩实|深度以背部不弯为准，使用保护架","髋和踝活动度|空杆深蹲"),
Y("weighted_pullup","负重引体向上","bw","背",[3,6],"lats","biceps,rhomboids,traps,rear_delt","forearms,abs","b","pull-vertical","负重要固定好，不晃动|每次从肩胛下沉开始|慢放，保持动作标准","悬挂 20 秒|引体向上")
].forEach(e=>BUILTIN.push(e));
const EQ={goblet_squat:"哑铃",rdl:"哑铃",hip_thrust:"杠铃或哑铃 + 凳子",lunge:"哑铃",leg_press:"腿举机",bench:"哑铃 + 凳子",ohp:"哑铃",db_row:"哑铃 + 凳子",lat_pd:"高位下拉机",inv_row:"低位横杆或 TRX",pullup_assist:"引体杆 + 弹力带/辅助机",pullup:"引体杆",dead_hang:"引体杆",bulgarian:"哑铃 + 凳子",box_pistol:"箱子或凳子",shrimp_assist:"墙或 TRX 辅助",bench_dip:"凳子",dip:"双杠",wall_hs_hold:"墙",hspu:"墙",knee_raise:"引体杆",leg_raise_hang:"引体杆",abwheel_knee:"腹轮",abwheel:"腹轮",pullup_high:"引体杆",muscleup:"引体杆或吊环",deadlift:"杠铃",squat:"杠铃 + 深蹲架",weighted_pullup:"引体杆 + 负重",tuck_lsit:"双杠或地面撑具",lsit:"双杠或地面撑具",hip_thrust_sl:"凳子",pike_pushup:"无（可垫高双脚）"};
const equipOf=e=>EQ[e.id]||"自重，无需器械";
const MIS={squat:"膝盖内扣；脚跟离地；腰背弯曲",hinge:"用腰而不是髋发力；背部弯曲；重量离身体太远",lunge:"前膝内扣；步幅太小；躯干晃动","push-horizontal":"塌腰；耸肩；肘外展过大","push-vertical":"过度反弓；耸肩顶耳朵；手腕不稳","pull-horizontal":"耸肩；借身体甩动；肩胛没有收紧","pull-vertical":"耸肩；借腿摆动；放得太快","core-flexion":"拉脖子；借惯性；腰离开地面","core-stability":"塌腰或撅臀；憋气；肩膀塌陷",hang:"耸肩；身体晃动；肩痛时硬撑",calf:"幅度不足；速度太快；膝盖完全锁死"};
const mistakesOf=e=>(MIS[e.movementPattern]||"").split("；").filter(Boolean);
const CHAINS=[["inv_row","pullup_assist","pullup","weighted_pullup"],["pullup","pullup_high","muscleup"],["goblet_squat","bulgarian","box_pistol","pistol"],["bulgarian","shrimp_assist","shrimp"],["goblet_squat","squat"],["rdl","deadlift"],["glute_bridge_sl","hip_thrust_sl"],["hip_thrust","hip_thrust_sl"],["nordic_ecc","nordic"],["calf_raise","calf_raise_sl"],["pushup","archer_pushup","one_arm_pushup"],["bench_dip","dip"],["pike_pushup","wall_hs_hold","hspu"],["knee_raise","leg_raise_hang"],["lying_leg_raise","dragon_neg","dragon"],["tuck_lsit","lsit"],["abwheel_knee","abwheel"],["crunch","plank"]];
const chainOf=id=>{const r=[],p=[];CHAINS.forEach(c=>{const i=c.indexOf(id);if(i>0)r.push(c[i-1]);if(i>=0&&i<c.length-1)p.push(c[i+1])});return{regress:[...new Set(r)],progress:[...new Set(p)]}};
const MG=[["胸",["pectorals"]],["背",["lats","rhomboids","traps","erectors"]],["肩",["front_delt","lateral_delt","rear_delt"]],["手臂",["biceps","triceps","forearms"]],["核心",["abs","obliques"]],["臀",["glutes","glute_med"]],["腿",["quads","hamstrings","adductors","calves"]]];
const groupsOf=e=>MG.filter(g=>(e.primaryMuscles||[]).some(m=>g[1].includes(m))).map(g=>g[0]);
const blankMeta=()=>({primaryMuscles:[],secondaryMuscles:[],stabilizerMuscles:[],anatomyMapId:null,movementPattern:"custom",techniqueNotes:[],warmupNotes:[]});
const defRange=t=>({load:[8,12],bw:[8,15],assist:[5,8],time:[20,60]}[t]);
const all=db=>BUILTIN.concat(db.custom||[]);
const exOf=(db,id)=>all(db).find(e=>e.id===id);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
// muscleFeedback 预留给未来 sEMG/IMU 数据：{sensorType,muscleId,timestamp,signalValue,signalQuality,exerciseSessionId}。当前版本不生成、不显示任何传感器数据。
const newDB=()=>({v:1,custom:[],sessions:[],active:null,plan:[],planSets:{},goal:null,checkins:{},profile:{name:"",avatar:"bear"},rewards:[],muscleFeedback:[]});
const num=x=>typeof x==="number"&&isFinite(x);
const valid=(t,s)=>!!s&&s.done===true&&(t==="time"?num(s.sec)&&s.sec>0:num(s.reps)&&s.reps>0&&num(s.w)&&s.w>=0);
const doneSets=(db,it)=>{const e=exOf(db,it.ex);return e?it.sets.filter(s=>valid(e.t,s)):[]};
const e1rm=(w,r)=>(w>0&&r>=1&&r<=12)?fix(w*(1+r/30)):null;
function last(db,id,except){
 const ss=db.sessions.filter(s=>s.id!==except).sort((a,b)=>b.start-a.start);
 for(const s of ss)for(const it of s.items)if(it.ex===id){const d=doneSets(db,it);if(d.length)return{date:s.date,sets:d}}
 return null}
function best(db,id,except){
 const t=exOf(db,id).t,o={n:0};
 db.sessions.filter(s=>s.id!==except).forEach(s=>s.items.filter(i=>i.ex===id).forEach(it=>doneSets(db,it).forEach(x=>{o.n++;
  if(t==="load"){o.w=Math.max(o.w||0,x.w);const q=e1rm(x.w,x.reps);if(q)o.e=Math.max(o.e||0,q)}
  else if(t==="bw"){if(!o.b||x.w>o.b.w||(x.w===o.b.w&&x.reps>o.b.reps))o.b={w:x.w,reps:x.reps}}
  else if(t==="assist"){if(!o.a||x.w<o.a.w||(x.w===o.a.w&&x.reps>o.a.reps))o.a={w:x.w,reps:x.reps}}
  else o.s=Math.max(o.s||0,x.sec)})));
 return o}
function prs(db,id,sets,except){
 const t=exOf(db,id).t,b=best(db,id,except),r=[],S=sets.filter(s=>valid(t,s));
 if(!b.n||!S.length)return r;
 if(t==="load"){
  const w=Math.max(...S.map(s=>s.w));if(w>b.w)r.push("最大重量 "+w+"kg（此前 "+b.w+"kg）");
  const q=Math.max(...S.map(s=>e1rm(s.w,s.reps)||0));if(b.e&&q>b.e)r.push("估算1RM "+q+"kg（此前 "+b.e+"kg）")}
 else if(t==="bw"){const m=S.reduce((a,s)=>!a||s.w>a.w||(s.w===a.w&&s.reps>a.reps)?s:a,null);
  if(m.w>b.b.w||(m.w===b.b.w&&m.reps>b.b.reps))r.push("自重 "+(m.w?"+"+m.w+"kg×":"")+m.reps+"次（此前 "+(b.b.w?"+"+b.b.w+"kg×":"")+b.b.reps+"次）")}
 else if(t==="assist"){const m=S.reduce((a,s)=>!a||s.w<a.w||(s.w===a.w&&s.reps>a.reps)?s:a,null);
  if(m.w<b.a.w||(m.w===b.a.w&&m.reps>b.a.reps))r.push("辅助 "+m.w+"kg×"+m.reps+"次（此前 "+b.a.w+"kg×"+b.a.reps+"次）")}
 else{const m=Math.max(...S.map(s=>s.sec));if(m>b.s)r.push("坚持 "+m+"秒（此前 "+b.s+"秒）")}
 return r}
function bump(w){const inc=Math.max(0.5,Math.round(w*0.035/0.5)*0.5);if(inc>w*0.08)return null;return{w:fix(w+inc),pct:fix(inc/w*100)}}
function suggest(db,id,except){
 const e=exOf(db,id),t=e.t,lo=e.r[0],hi=e.r[1],L=last(db,id,except),T=t==="time",k=T?"sec":"reps",u=T?"秒":"次";
 if(!L)return{kind:"start",text:"首次训练该动作：选一个能完成 "+lo+"–"+hi+u+"、做完还能再做 2–3 次（RPE 7 左右）的"+(t==="load"||t==="assist"?"重量":"难度")+"。",why:"没有历史记录，不预设重量。",targets:[]};
 const S=L.sets,m=s=>T?s.sec:s.reps,mn=Math.min(...S.map(m)),wT=Math.max(...S.map(s=>s.w||0));
 const rp=S.map(s=>s.rpe).filter(x=>x>0),mr=rp.length?Math.max(...rp):null;
 const low=S.filter(s=>m(s)<lo).length,allHi=S.every(s=>m(s)>=hi);
 const same=(w,v)=>S.map(()=>({w,[k]:v})),R=(kind,text,why,targets)=>({kind,text,why,targets});
 const desc=t==="load"?wT+"kg":t==="assist"?"辅助 "+wT+"kg":T?mn+"秒":"当前难度";
 if(low>=2){const why="上次有 "+low+" 组低于目标下限 "+lo+u+"。",h="上次有 "+low+" 组低于 "+lo+u+"。";
  if(t==="load"){let n=fix(Math.round(wT*0.95/0.5)*0.5);if(n>=wT)n=Math.max(0,fix(wT-0.5));return R("reduce",h+"本次降到 "+n+"kg（约 −5%），或少做 1 组，先把次数做稳。",why,same(n,lo))}
  if(t==="assist"){const n=fix(wT+2.5);return R("reduce",h+"本次辅助增加到 "+n+"kg，先把次数做稳。",why,same(n,lo))}
  if(t==="bw")return R("reduce",h+"本次少做 1 组，或换更简单的回归动作。",why,same(wT,lo).slice(0,Math.max(1,S.length-1)));
  return R("reduce",h+"本次目标降到 "+Math.max(5,mn)+"秒。",why,same(0,Math.max(5,mn)))}
 if(mr!==null&&mr>=9)return R("maintain","维持 "+desc+"，目标是每组稳定做到 "+hi+u+"，暂不加重。","上次 RPE 达到 "+mr+"，强度已经很高，不建议加重。",S.map(s=>({w:s.w||0,[k]:m(s)})));
 const cav=mr===null?"（上次未记录 RPE，若感觉吃力就退回原来的）":"",why2="上次每组都达到 "+hi+u+"上限，"+(mr===null?"但没有记录 RPE。":"最高 RPE "+mr+"。");
 if(allHi){
  if(t==="load"){const b=bump(wT);
   if(b)return R("increase","本次尝试 "+b.w+"kg（+"+b.pct+"%），次数目标回到 "+lo+"–"+hi+" 次。"+cav,why2,same(b.w,lo));
   return R("add_reps","重量颗粒度偏大，先在 "+wT+"kg 上每组再加 1 次。"+cav,why2,S.map(s=>({w:s.w||0,reps:s.reps+1})))}
  if(t==="assist"){if(wT===0)return R("increase","已经不需要辅助：下次可以试自重引体向上。",why2,same(0,lo));
   const step=wT>=20?5:2.5,n=Math.max(0,fix(wT-step));return R("increase","辅助重量降到 "+n+"kg（−"+step+"kg），次数目标 "+lo+"–"+hi+" 次。"+cav,why2,same(n,lo))}
  if(t==="bw")return R("increase","已达到 "+hi+" 次上限：本次加 1 组，或加 2.5kg 负重 / 换更难的变式。"+cav,why2,S.map(s=>({w:s.w||0,reps:hi})).concat([{w:wT,reps:lo}]));
  return R("increase","每组延长到 "+(mn+5)+" 秒。"+cav,why2,same(0,mn+5))}
 return R("add_reps","本次先尝试 "+desc+"，每组增加 1 "+u+"（上限 "+hi+u+"）。","上次最低 "+mn+u+"，还没到上限 "+hi+u+"；先在同样难度上增加次数。",S.map(s=>({w:s.w||0,[k]:Math.min(hi,m(s)+1)})))}
const fmtSet=(t,s)=>(t==="time"?s.sec+"秒":t==="assist"?"辅助"+s.w+"kg×"+s.reps:t==="bw"?(s.w?"+"+s.w+"kg×":"")+s.reps+"次":s.w+"kg×"+s.reps)+(s.rpe?"@"+s.rpe:"");
const fmtSets=(t,S)=>S.map(s=>fmtSet(t,s)).join(" / ");
function finish(db,note){
 const a=db.active;if(!a)return null;
 const items=a.items.map(it=>({ex:it.ex,sets:doneSets(db,it)})).filter(it=>it.sets.length);
 if(!items.length||db.sessions.some(x=>x.id===a.id))return null;
 const s={id:a.id,date:a.date,start:a.start,end:Date.now(),note:note||"",items};
 db.sessions.push(s);db.active=null;return s}
function validate(o){
 const bad=m=>{throw new Error("不是有效的备份："+m)};
 if(!o||o.v!==1||!Array.isArray(o.sessions))bad("版本或结构不对");
 for(const s of o.sessions){if(typeof s.id!=="string"||!num(s.start)||!Array.isArray(s.items))bad("训练记录格式错误");
  for(const it of s.items){if(typeof it.ex!=="string"||!Array.isArray(it.sets))bad("动作记录格式错误");
   for(const x of it.sets)for(const f of ["w","reps","sec","rpe"])if(x[f]!=null&&!num(x[f]))bad("数值格式错误")}}
 const custom=(Array.isArray(o.custom)?o.custom:[]).filter(c=>c&&c.id&&c.n&&["load","bw","assist","time"].includes(c.t)).map(c=>Object.assign({id:String(c.id),n:String(c.n),t:c.t,m:String(c.m||"自定义"),r:defRange(c.t)},blankMeta()));
 const so=x=>typeof x==="string",g=o.goal;
 const gd=goalDef(g),goal=gd&&so(g.start)&&so(g.end)&&num(g.perWeek)?{id:gd.id,start:g.start,end:g.end,perWeek:g.perWeek}:null,checkins={};
 Object.keys(o.checkins||{}).forEach(k=>{const x=o.checkins[k];if(x&&num(x.energy)&&num(x.sleep)&&num(x.sore)&&["none","mild","severe"].includes(x.pain))checkins[k]=Object.assign({energy:x.energy,sleep:x.sleep,sore:x.sore,pain:x.pain},assess(x))});
 const p=o.profile||{};
 return{v:1,custom,sessions:o.sessions,active:null,plan:[],planSets:{},goal,checkins,profile:{name:so(p.name)?p.name.slice(0,12):"",avatar:so(p.avatar)?p.avatar:"bear"},rewards:[],muscleFeedback:[]}}

const LVL={primary:3,secondary:2,stabilizer:1};
function muscleSummary(db,ids){const out={};
 ids.forEach(id=>{const e=exOf(db,id);if(!e)return;
  [["primary",e.primaryMuscles],["secondary",e.secondaryMuscles],["stabilizer",e.stabilizerMuscles]].forEach(p=>(p[1]||[]).forEach(m=>{
   const o=out[m]=out[m]||{level:p[0],ex:[]};if(LVL[p[0]]>LVL[o.level])o.level=p[0];o.ex.push({id,n:e.n,role:p[0]})}))});
 return out}
function prepInfo(db,ids){const sm=muscleSummary(db,ids),warm=[],notes=[];
 ids.forEach(id=>{const e=exOf(db,id);if(!e)return;(e.warmupNotes||[]).forEach(w=>{if(!warm.includes(w))warm.push(w)});if((e.techniqueNotes||[]).length)notes.push({id,n:e.n,tips:e.techniqueNotes.slice(0,2)})});
 return{summary:sm,focus:Object.keys(sm).filter(k=>sm[k].level==="primary").map(k=>MUSCLE[k].name),warm,notes}}

// ===== Sprint 2：状态评估 / 目标阶段 / 今日计划（纯规则，不是 AI）=====
const dayNum=s=>Date.UTC(+s.slice(0,4),+s.slice(5,7)-1,+s.slice(8,10))/864e5;
function assess(c){const r=[];let sev=0;
 if(c.pain==="severe")return{level:"stop",reasons:["你报告了明显疼痛或异常不适"],advice:"今天不建议做强度训练：先休息；如果疼痛持续或加重，请咨询专业人员评估。本应用不做医学判断。"};
 if(c.sleep<6){r.push("睡眠 "+c.sleep+" 小时，低于 6 小时");sev+=c.sleep<5?2:1}
 if(c.energy<=2){r.push("精力 "+c.energy+"/5，偏低");sev+=1}
 if(c.sore>=4){r.push("肌肉酸痛 "+c.sore+"/5，比较明显");sev+=2}
 if(c.pain==="mild"){r.push("有轻微局部不适：避开不适部位，重量和幅度从轻");sev+=1}
 const level=sev>=2&&(c.sleep<5||c.sore>=4||sev>=3)?"poor":sev>=1?"mild":"good";
 return{level,reasons:r.length?r:["各项状态指标正常"],advice:{good:"状态良好，按原计划训练。",mild:"轻度疲劳：降低训练量（每个动作少做 1 组、减少辅助动作），保留主要动作。",poor:"睡眠不足或酸痛明显：减少训练量和强度，今天不建议冲击个人最佳。"}[level]}}
function suggestFor(db,id,except,ctx){const s=suggest(db,id,except);
 if(ctx&&ctx.noPR&&(s.kind==="increase"||s.kind==="add_reps")){const t=exOf(db,id).t,k=t==="time"?"sec":"reps",L=last(db,id,except);
  return{kind:"maintain",text:"今日状态欠佳：做到上次水平即可，不加重，也不追求多做。",why:ctx.why||"今日状态评估为较差。",targets:L.sets.map(x=>({w:x.w||0,[k]:t==="time"?x.sec:x.reps}))}}
 return s}
const since=(db,id,from)=>db.sessions.filter(s=>s.date>=from).sort((a,b)=>a.start-b.start).map(s=>({date:s.date,sets:s.items.filter(i=>i.ex===id).flatMap(i=>doneSets(db,i))})).filter(x=>x.sets.length);
const mx=(L,f)=>Math.max(0,...L.flatMap(x=>x.sets.map(f)));
// 目标阶段：条件 ["b",动作,"reps|sec",最小值] 单组最佳；["s",动作,每组次数,组数] 同一次训练；["h",动作,次数] 辅助减半；["w",动作,次数,kg] 达到重量。阶段名以「测试」开头的，只在状态良好时安排。
const GOALS=[],G=(id,n,grp,st)=>GOALS.push({id,n,grp,st:st.map(s=>({n:s[0],ex:s[1].split(","),c:s[2]}))});
const PS=[["建立背部力量与肩胛控制","dead_hang,inv_row,lat_pd",[["b","dead_hang","sec",30],["b","inv_row","reps",10]]],["提高辅助引体向上表现","pullup_assist,lat_pd,inv_row",[["s","pullup_assist",6,3]]],["逐步减少辅助重量","pullup_assist,dead_hang,lat_pd",[["h","pullup_assist",5]]]];
G("pullup1","完成一次标准引体向上","背",PS.concat([["测试标准引体向上","pullup_assist,pullup,dead_hang",[["b","pullup","reps",1]]]]));
G("pullup10","完成 10 次引体向上","背",PS.concat([["测试标准引体向上","pullup_assist,pullup,dead_hang",[["b","pullup","reps",1]]],["连续 3 次引体","pullup,pullup_assist,lat_pd",[["b","pullup","reps",3]]],["连续 6 次引体","pullup,lat_pd,inv_row",[["b","pullup","reps",6]]],["10 次引体向上","pullup,lat_pd,dead_hang",[["b","pullup","reps",10]]]]));
G("weightedpu","负重引体向上 10kg × 5 次","背",[["引体向上 8 次","pullup,lat_pd,inv_row",[["b","pullup","reps",8]]],["负重 5kg × 5","weighted_pullup,pullup,lat_pd",[["w","weighted_pullup",5,5]]],["负重 10kg × 5","weighted_pullup,pullup,lat_pd",[["w","weighted_pullup",5,10]]]]);
G("muscleup","肌肉上杆 1 次","背",[["引体向上 8 次","pullup,lat_pd,dead_hang",[["b","pullup","reps",8]]],["高位引体 3 次","pullup_high,pullup,dead_hang",[["b","pullup_high","reps",3]]],["测试肌肉上杆","muscleup,pullup_high,pullup",[["b","muscleup","reps",1]]]]);
const BG=[["建立单腿力量","bulgarian,lunge,glute_bridge_sl",[["b","bulgarian","reps",10]]]];
G("pistol","单侧深蹲（手枪蹲）1 次","腿",BG.concat([["箱式单腿深蹲","box_pistol,bulgarian,calf_raise_sl",[["b","box_pistol","reps",8]]],["测试手枪蹲","box_pistol,pistol,bulgarian",[["b","pistol","reps",1]]]]));
G("shrimp","虾式深蹲 1 次","腿",BG.concat([["辅助虾式深蹲","shrimp_assist,bulgarian,glute_bridge_sl",[["b","shrimp_assist","reps",5]]],["测试虾式深蹲","shrimp,shrimp_assist,bulgarian",[["b","shrimp","reps",1]]]]));
G("nordic","北欧挺身（腘绳肌）1 次","腿",[["单腿臀桥与髋铰链","glute_bridge_sl,rdl,hip_thrust",[["b","glute_bridge_sl","reps",12],["b","rdl","reps",10]]],["离心控制","nordic_ecc,rdl,glute_bridge_sl",[["b","nordic_ecc","reps",5]]],["测试北欧挺身","nordic,nordic_ecc,rdl",[["b","nordic","reps",1]]]]);
G("calf","单腿提踵 20 次","腿",[["双腿提踵 20 次","calf_raise,calf_raise_sl,plank",[["b","calf_raise","reps",20]]],["单腿提踵 10 次","calf_raise_sl,calf_raise,plank",[["b","calf_raise_sl","reps",10]]],["单腿提踵 20 次","calf_raise_sl,calf_raise,plank",[["b","calf_raise_sl","reps",20]]]]);
G("squat60","杠铃深蹲 60kg × 5 次","腿",[["高脚杯深蹲 16kg × 8","goblet_squat,lunge,plank",[["w","goblet_squat",8,16]]],["杠铃深蹲 40kg × 5","squat,goblet_squat,plank",[["w","squat",5,40]]],["杠铃深蹲 60kg × 5","squat,goblet_squat,plank",[["w","squat",5,60]]]]);
G("hipthrust60","臀推 60kg × 10 次","臀",[["建立臀推技术 20kg","hip_thrust,glute_bridge_sl,rdl",[["w","hip_thrust",10,20]]],["增加负重 40kg","hip_thrust,rdl,lunge",[["w","hip_thrust",10,40]]],["目标重量 60kg","hip_thrust,rdl,glute_bridge_sl",[["w","hip_thrust",10,60]]]]);
G("hipsl","单腿臀推 10 次","臀",[["单腿臀桥 12 次","glute_bridge_sl,hip_thrust,rdl",[["b","glute_bridge_sl","reps",12]]],["单腿臀推 5 次","hip_thrust_sl,glute_bridge_sl,hip_thrust",[["b","hip_thrust_sl","reps",5]]],["单腿臀推 10 次","hip_thrust_sl,hip_thrust,rdl",[["b","hip_thrust_sl","reps",10]]]]);
G("deadlift60","硬拉 60kg × 5 次","臀",[["罗马尼亚硬拉 20kg × 8","rdl,hip_thrust,plank",[["w","rdl",8,20]]],["硬拉 40kg × 5","deadlift,rdl,plank",[["w","deadlift",5,40]]],["硬拉 60kg × 5","deadlift,rdl,plank",[["w","deadlift",5,60]]]]);
G("pushup20","标准俯卧撑 20 次","胸",[["俯卧撑 10 次","pushup,bench,plank",[["b","pushup","reps",10]]],["俯卧撑 15 次","pushup,bench,plank",[["b","pushup","reps",15]]],["俯卧撑 20 次","pushup,bench,plank",[["b","pushup","reps",20]]]]);
G("oneap","单臂俯卧撑 1 次","胸",[["俯卧撑 20 次","pushup,bench,plank",[["b","pushup","reps",20]]],["弓步俯卧撑 5 次","archer_pushup,pushup,plank",[["b","archer_pushup","reps",5]]],["测试单臂俯卧撑","one_arm_pushup,archer_pushup,plank",[["b","one_arm_pushup","reps",1]]]]);
G("dip10","双杠臂屈伸 10 次","手臂",[["凳上臂屈伸 15 次","bench_dip,pushup,plank",[["b","bench_dip","reps",15]]],["双杠臂屈伸 3 次","dip,bench_dip,pushup",[["b","dip","reps",3]]],["双杠臂屈伸 10 次","dip,bench_dip,pushup",[["b","dip","reps",10]]]]);
G("hspu","靠墙倒立撑 1 次","肩",[["派克俯卧撑 10 次","pike_pushup,ohp,plank",[["b","pike_pushup","reps",10]]],["靠墙倒立 30 秒","wall_hs_hold,pike_pushup,ohp",[["b","wall_hs_hold","sec",30]]],["测试靠墙倒立撑","hspu,wall_hs_hold,pike_pushup",[["b","hspu","reps",1]]]]);
G("handstand60","靠墙倒立 60 秒","肩",[["派克俯卧撑 8 次","pike_pushup,ohp,plank",[["b","pike_pushup","reps",8]]],["靠墙倒立 20 秒","wall_hs_hold,pike_pushup,ohp",[["b","wall_hs_hold","sec",20]]],["靠墙倒立 60 秒","wall_hs_hold,pike_pushup,ohp",[["b","wall_hs_hold","sec",60]]]]);
G("hlr10","悬垂举腿 10 次","核心",[["悬垂屈膝举腿 10 次","knee_raise,dead_hang,plank",[["b","knee_raise","reps",10]]],["悬垂直腿举 5 次","leg_raise_hang,knee_raise,plank",[["b","leg_raise_hang","reps",5]]],["悬垂直腿举 10 次","leg_raise_hang,knee_raise,plank",[["b","leg_raise_hang","reps",10]]]]);
G("dragon","龙旗 1 次","核心",[["仰卧举腿 15 次","lying_leg_raise,plank,dead_hang",[["b","lying_leg_raise","reps",15]]],["龙旗离心 3 次","dragon_neg,lying_leg_raise,plank",[["b","dragon_neg","reps",3]]],["测试龙旗","dragon,dragon_neg,lying_leg_raise",[["b","dragon","reps",1]]]]);
G("lsit20","L 坐 20 秒","核心",[["屈膝 L 坐 15 秒","tuck_lsit,plank,dead_hang",[["b","tuck_lsit","sec",15]]],["L 坐 10 秒","lsit,tuck_lsit,plank",[["b","lsit","sec",10]]],["L 坐 20 秒","lsit,tuck_lsit,plank",[["b","lsit","sec",20]]]]);
G("plank180","平板支撑 3 分钟","核心",[["平板支撑 60 秒","plank,crunch,dead_hang",[["b","plank","sec",60]]],["平板支撑 120 秒","plank,crunch,lying_leg_raise",[["b","plank","sec",120]]],["平板支撑 180 秒","plank,crunch,lying_leg_raise",[["b","plank","sec",180]]]]);
G("abwheel10","腹轮 10 次","核心",[["跪姿腹轮 10 次","abwheel_knee,plank,crunch",[["b","abwheel_knee","reps",10]]],["站姿腹轮 3 次","abwheel,abwheel_knee,plank",[["b","abwheel","reps",3]]],["站姿腹轮 10 次","abwheel,abwheel_knee,plank",[["b","abwheel","reps",10]]]]);
const goalDef=g=>g?GOALS.find(x=>x.id===(g.id||(g.type==="pullup"?"pullup1":""))):null;
const U=f=>f==="sec"?"秒":"次";
function evalCond(db,g,c){const k=c[0],id=c[1],L=since(db,id,g.start),n="「"+exOf(db,id).n+"」";
 if(k==="b"){const f=c[2],mn=c[3],v=mx(L,s=>s[f]||0);return{met:v>=mn,need:n+"单组 ≥"+mn+U(f),text:n+"最佳 "+v+"/"+mn+U(f)}}
 if(k==="s"){const mn=c[2],ct=c[3],b=Math.max(0,...L.map(x=>x.sets.filter(s=>s.reps>=mn).length));return{met:b>=ct,need:n+"同一次训练 "+ct+" 组每组 ≥"+mn+" 次",text:n+"单次训练中每组≥"+mn+"次的组数，最多 "+b+"/"+ct+" 组"}}
 if(k==="h"){const mr=c[2],need=n+"辅助重量降到起始辅助的一半以下，单组 ≥"+mr+" 次";if(!L.length)return{met:false,need,text:"还没有"+n+"记录"};
  const w0=Math.max(...L[0].sets.map(s=>s.w)),mn=Math.min(Infinity,...L.flatMap(x=>x.sets).filter(s=>s.reps>=mr).map(s=>s.w));
  return{met:w0>0&&isFinite(mn)&&mn<=w0/2,need,text:"起始辅助 "+w0+"kg，目标 ≤"+w0/2+"kg；目前最低（≥"+mr+"次）"+(isFinite(mn)?mn+"kg":"—")}}
 const r=c[2],kg=c[3],S=L.flatMap(x=>x.sets).filter(s=>s.reps>=r);
 return{met:S.some(s=>s.w>=kg),need:n+kg+"kg × ≥"+r+" 次",text:n+"达到 ≥"+r+" 次的最大重量 "+Math.max(0,...S.map(s=>s.w))+"/"+kg+"kg"}}
function goalStatus(db,today){const g=db.goal,def=goalDef(g);if(!def)return null;
 const st=def.st.map(s=>{const r=s.c.map(c=>evalCond(db,g,c));return{n:s.n,ex:s.ex,need:r.map(x=>x.need).join("；"),met:r.every(x=>x.met),text:r.map(x=>x.text).join("；")}}),i=st.findIndex(x=>!x.met),done=i===-1,cur=done?st.length-1:i;
 return{def,stages:st,cur,done,current:st[cur],weeksLeft:Math.max(0,Math.ceil((dayNum(g.end)-dayNum(today))/7))}}
function goalPreview(db,id){const d={sessions:[],custom:db.custom||[]};return goalDef({id}).st.map(s=>({n:s.n,ex:s.ex,need:s.c.map(c=>evalCond(d,{start:"2099-01-01"},c).need).join("；")}))}
const SUPPORT=["goblet_squat","hip_thrust","bench","db_row","plank","pushup"];
const lastDay=(db,id)=>{let d="";db.sessions.forEach(s=>{if(s.items.some(i=>i.ex===id)&&s.date>d)d=s.date});return d};
function planToday(db,ck,today){
 const lv=ck?ck.level:"good";if(lv==="stop")return{items:[],level:lv,note:""};
 const cf={good:{sets:3,sup:2,sup0:4,main:9},mild:{sets:2,sup:1,sup0:3,main:9},poor:{sets:2,sup:0,sup0:2,main:2}}[lv];
  const g=db.goal?goalStatus(db,today):null;let base=g&&!g.done?g.stages[g.cur].ex.slice():[],note="";
 if(g&&!g.done&&/^测试/.test(g.current.n)&&lv!=="good"){const t=goalDef(db.goal).st[g.cur].c.map(c=>c[1]);base=base.filter(x=>!t.includes(x));note="「"+g.current.n+"」只在状态良好时安排。"}
 base=base.slice(0,cf.main);
 const pool=SUPPORT.filter(x=>!base.includes(x)).sort((a,b)=>lastDay(db,a).localeCompare(lastDay(db,b)));
 const ids=base.concat(pool.slice(0,base.length?cf.sup:cf.sup0));
 return{items:ids.map(ex=>({ex,sets:cf.sets,goal:base.includes(ex)})),level:lv,note}}
function weekInfo(db,today,target){const d0=dayNum(today),dow=(new Date(d0*864e5).getUTCDay()+6)%7,mon=d0-dow;
 return{days:[0,1,2,3,4,5,6].map(i=>db.sessions.some(s=>dayNum(s.date)===mon+i)),n:db.sessions.filter(s=>{const x=dayNum(s.date);return x>=mon&&x<=mon+6}).length,target:target||3,todayIdx:dow}}
function lastSession(db){const s=[...db.sessions].sort((a,b)=>b.start-a.start)[0];if(!s)return null;let sets=0,vol=0;const pr=[];
 s.items.forEach(it=>{const e=exOf(db,it.ex);if(!e)return;const d=doneSets(db,it);sets+=d.length;if(e.t==="load")d.forEach(x=>vol+=x.w*x.reps);const l=prs(db,it.ex,it.sets,s.id);if(l.length)pr.push({n:e.n,l})});
 return{id:s.id,date:s.date,sets,vol:Math.round(vol),min:Math.max(1,Math.round((s.end-s.start)/6e4)),prs:pr}}

// ===== Sprint 3：积分账本 / 等级 / 勋章 / 统计（全部从真实训练记录推导，规则固定，不扣分）=====
const PTS={day:10,pr:5,week:20,stage:30,goal:100},STREAK={2:20,4:40,8:80,12:120};
const dsOf=n=>new Date(n*864e5).toISOString().slice(0,10);
const monOf=ds=>{const d=dayNum(ds);return d-((new Date(d*864e5).getUTCDay()+6)%7)};
const validS=(db,s)=>s.items.reduce((t,it)=>t+doneSets(db,it).length,0)>=3;
const upTo=(db,s,incl)=>Object.assign({},db,{sessions:db.sessions.filter(x=>incl?x.start<=s.start:x.start<s.start)});
function entitlements(db,today){
 const E=[],ss=db.sessions.filter(s=>validS(db,s)).sort((a,b)=>a.start-b.start),tg=db.goal?db.goal.perWeek:3,days={},wk={};
 const add=(key,kind,points,reason,s,date)=>E.push({key,kind,points,reason,sessionId:s?s.id:null,date:date||(s?s.date:today),ts:s?s.end:null});
 ss.forEach(s=>{
  if(!days[s.date]){days[s.date]=1;add("day:"+s.date,"day",PTS.day,"完成训练 "+s.date,s)}
  const v=upTo(db,s,false);let c=0;
  s.items.forEach(it=>{const e=exOf(db,it.ex);if(!e||c>=3)return;const l=prs(v,it.ex,it.sets,"");if(l.length){c++;add("pr:"+s.id+":"+it.ex,"pr",PTS.pr,"个人纪录：「"+e.n+"」"+l[0],s)}});
  const k=monOf(s.date);wk[k]=(wk[k]||0)+1;if(wk[k]===tg)add("week:"+dsOf(k),"week",PTS.week,"完成每周 "+tg+" 次训练（"+dsOf(k)+" 起）",s)});
 let run=0,prev=null;
 Object.keys(wk).map(Number).sort((a,b)=>a-b).forEach(k=>{if(wk[k]>=tg){run=prev!==null&&k-prev===7?run+1:1;prev=k;
  if(STREAK[run])add("streak:"+run,"streak",STREAK[run],"连续 "+run+" 周达到每周训练目标",ss.filter(x=>monOf(x.date)===k).sort((a,b)=>a.start-b.start)[tg-1])}else{run=0;prev=null}});
 const g=db.goal?goalStatus(db,today):null,gk=g?g.def.id+":"+db.goal.start:"";
 if(g&&ss.length){const n=g.done?g.stages.length:g.cur,at=i=>ss.find(x=>goalStatus(upTo(db,x,true),today).stages[i].met)||ss[ss.length-1];
  for(let i=0;i<n;i++)add("stage:"+gk+":"+i,"stage",PTS.stage,"完成目标阶段 "+(i+1)+"：「"+g.stages[i].n+"」",at(i));
  if(g.done)add("goal:"+gk,"goal",PTS.goal,"完成长期目标："+g.def.n,ss.find(x=>goalStatus(upTo(db,x,true),today).done)||ss[ss.length-1])}
 const lk=k=>E.find(e=>e.key===k),sOf=e=>ss.find(x=>x.id===e.sessionId)||null,B=(id,e,why)=>add("badge:"+id,"badge",0,why,e?sOf(e):null),prE=E.filter(e=>e.kind==="pr");
 if(ss[0])B("first",{sessionId:ss[0].id},"首个有效训练");
 if(prE[0])B("pr",prE[0],"首次个人纪录");
 if(prE.length>=5)B("strength",prE[4],"累计 5 次个人纪录");
 if(lk("streak:2"))B("streak",lk("streak:2"),"连续 2 周");
 if(lk("streak:4"))B("heart",lk("streak:4"),"连续 4 周");
 const se=E.find(e=>e.kind==="stage");if(se)B("stage",se,"完成第一个目标阶段");
 const pu=db.sessions.slice().sort((a,b)=>a.start-b.start).find(x=>x.items.some(i=>i.ex==="pullup"&&doneSets(db,i).length));if(pu)add("badge:pullup","badge",0,"首个标准引体向上",pu);
 const rd=Object.keys(db.checkins||{}).sort().find(d=>d<today&&["poor","stop"].includes(db.checkins[d].level)&&!db.sessions.some(s=>s.date===d));
 if(rd)add("badge:rest","badge",0,"状态不佳时选择恢复",null,rd);
 return E}
function syncRewards(db,today){db.rewards=db.rewards||[];const have=new Set(db.rewards.map(r=>r.key)),out=[];if(db.goal&&db.goal.id==="pullup1"||db.goal&&db.goal.type==="pullup"){const gk="pullup1:"+db.goal.start;db.rewards.forEach(r=>{const m=/^stage:(\d)$/.exec(r.key);if(m)have.add("stage:"+gk+":"+m[1]);if(r.key==="goal")have.add("goal:"+gk)})}
 entitlements(db,today).forEach(e=>{if(have.has(e.key))return;const r={key:e.key,kind:e.kind,points:e.points,reason:e.reason,sessionId:e.sessionId,date:e.date,ts:e.ts||Date.now()};db.rewards.push(r);out.push(r)});return out}
const pointsOf=db=>(db.rewards||[]).reduce((t,r)=>t+r.points,0);
const levelInfo=p=>{let l=1;while(p>=25*l*l)l++;const cur=25*(l-1)*(l-1),nx=25*l*l;return{l,cur,next:nx,pct:Math.round((p-cur)/(nx-cur)*100)}};
function aggr(db,ss,a,b){let minutes=0,volume=0,sets=0;const muscle={};
 ss.forEach(s=>{minutes+=Math.max(1,Math.round((s.end-s.start)/6e4));s.items.forEach(it=>{const e=exOf(db,it.ex);if(!e)return;const d=doneSets(db,it);sets+=d.length;if(e.t==="load")d.forEach(x=>{volume+=x.w*x.reps});(e.primaryMuscles||[]).forEach(m=>{muscle[m]=(muscle[m]||0)+d.length});(e.secondaryMuscles||[]).forEach(m=>{muscle[m]=(muscle[m]||0)+d.length*.5})})});
 return{start:dsOf(a),end:dsOf(b),n:ss.length,minutes,volume:Math.round(volume),sets,muscle,sessionIds:ss.map(s=>s.id)}}
const inRange=(db,a,b)=>db.sessions.filter(s=>{const d=dayNum(s.date);return d>=a&&d<=b});
function weekStats(db,today,off){const a=monOf(today)-7*off;return aggr(db,inRange(db,a,a+6),a,a+6)}
function windowStats(db,today,i){const e=dayNum(today)-7*i;return aggr(db,inRange(db,e-6,e),e-6,e)}
function dispSeries(db,id){const t=exOf(db,id).t,u={load:"估算1RM（kg）",bw:"最佳单组次数",assist:"最低辅助（kg，越低越好）",time:"最佳秒数"}[t];
 return{u,pts:db.sessions.slice().sort((a,b)=>a.start-b.start).map(s=>{const it=s.items.find(x=>x.ex===id),d=it?doneSets(db,it):[];if(!d.length)return null;
  return{date:s.date,v:fix(t==="load"?Math.max(...d.map(x=>e1rm(x.w,x.reps)||x.w)):t==="bw"?Math.max(...d.map(x=>x.reps)):t==="assist"?Math.min(...d.map(x=>x.w)):Math.max(...d.map(x=>x.sec)))}}).filter(Boolean)}}
function perf(t,S){return t==="load"?Math.max(...S.map(s=>e1rm(s.w,s.reps)||s.w)):t==="bw"?Math.max(...S.map(s=>s.reps+100*s.w)):t==="assist"?Math.max(...S.map(s=>s.reps-100*s.w)):Math.max(...S.map(s=>s.sec))}
function series(db,id){const t=exOf(db,id).t;return db.sessions.slice().sort((a,b)=>a.start-b.start).map(s=>{const it=s.items.find(i=>i.ex===id),d=it?doneSets(db,it):[];return d.length?{date:s.date,v:fix(perf(t,d))}:null}).filter(Boolean)}
function stagnation(db,id){const L=series(db,id);if(L.length<5)return null;const span=dayNum(L[L.length-1].date)-dayNum(L[0].date);if(span<21)return null;
 const prior=Math.max(...L.slice(0,-3).map(x=>x.v));return Math.max(...L.slice(-3).map(x=>x.v))>prior?null:{n:L.length,span}}
const API={windowStats,dispSeries,equipOf,mistakesOf,chainOf,groupsOf,MG,PTS,entitlements,syncRewards,pointsOf,levelInfo,weekStats,series,stagnation,monOf,dsOf,assess,suggestFor,GOALS,goalDef,goalPreview,evalCond,goalStatus,planToday,weekInfo,lastSession,dayNum,MUSCLES,MUSCLE,PATTERNS,blankMeta,muscleSummary,prepInfo,BUILTIN,defRange,all,exOf,uid,newDB,valid,doneSets,e1rm,last,best,prs,bump,suggest,fmtSet,fmtSets,finish,validate};
if(typeof module!=="undefined")module.exports=API;else root.FitCore=API;
})(typeof window!=="undefined"?window:globalThis);
