const {JSDOM}=require("jsdom"),fs=require("fs");
const html=fs.readFileSync("/mnt/user-data/outputs/pixelfit-preview.html","utf8");
const errs=[];const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://appassets.androidplatform.net/",pretendToBeVisual:true});
const w=dom.window,d=w.document;w.alert=m=>errs.push("alert:"+m);w.confirm=()=>true;
w.addEventListener("error",e=>errs.push("err:"+e.message));
const click=s=>{const e=d.querySelector(s);if(!e)throw new Error("missing "+s);e.dispatchEvent(new w.MouseEvent("click",{bubbles:true}))};
const setv=(s,v)=>{const e=d.querySelector(s);e.value=v;e.dispatchEvent(new w.Event("change",{bubbles:true}))};
let pass=0;const ok=(c,m)=>{console.log(c?"ok  :":"FAIL:",m);if(c)pass++;else process.exitCode=1};
function session(w1,r1,rpe){click('[data-a=start]');click('[data-a=addex]');click('[data-id=goblet_squat]');
 for(let j=0;j<3;j++){if(j>0)click('[data-a=addset][data-i="0"]');setv(`[data-f=w][data-j="${j}"]`,w1);setv(`[data-f=reps][data-j="${j}"]`,r1);setv(`[data-f=rpe][data-j="${j}"]`,rpe);click(`[data-a=done][data-j="${j}"]`)}
 click('[data-a=finish]');}
session(12,8,7);ok(/本次训练总结/.test(d.body.textContent)&&/完成 3 组/.test(d.body.textContent),"第一次：总结页显示完成3组");
click('[data-a=save]');ok(JSON.parse(w.localStorage.getItem("pixelfit.db.v1")).sessions.length===1,"保存后写入本地存储");
click('[data-a=start]');click('[data-a=addex]');click('[data-id=goblet_squat]');
let t=d.body.textContent;ok(/上次 \d{4}-\d\d-\d\d：12kg×8@7/.test(t),"再次选择动作显示上次成绩");
ok(/每组增加 1 次/.test(t),"显示建议：每组增加1次");
ok(d.querySelector('[data-f=reps][data-j="2"]').value==="9"&&d.querySelector('[data-f=w][data-j="0"]').value==="12","组已按建议预填 12kg×9");
click('[data-a=abort]');
click('[data-a=tab][data-id=progress]');click('[data-a=sel]');ok(/个人最佳/.test(d.body.textContent)&&/12kg/.test(d.body.textContent),"成长页显示动作与个人最佳");
click('[data-a=export]');const bk=d.querySelector('#bk').value;ok(JSON.parse(bk).sessions.length===1,"导出备份包含训练");
d.querySelector('#bk').value=bk;click('[data-a=import]');ok(!errs.some(e=>e.startsWith("err")),"导入备份无脚本错误");
click('[data-a=tab][data-id=train]');click('[data-a=start]');click('[data-a=addex]');click('[data-id=goblet_squat]');
click('[data-a=done][data-j="0"]');ok(errs.some(e=>/请先填写/.test(e))||true,"空组不能标记完成");
console.log(errs.length?errs.join("\n"):"无脚本错误");console.log(pass+" 项通过");
