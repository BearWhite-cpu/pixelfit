import json,sys
from playwright.sync_api import sync_playwright
res=[];errs=[]
def ok(c,m):res.append(bool(c));print("ok  :" if c else "FAIL:",m)
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={"width":360,"height":740})
    pg.on("pageerror",lambda e:errs.append(str(e)));pg.on("dialog",lambda d:d.accept())
    pg.goto("file:///mnt/user-data/outputs/pixelfit-preview.html");T=lambda t:pg.click(f"[data-a=tab][data-id={t}]")
    db=lambda:json.loads(pg.evaluate("localStorage.getItem('pixelfit.db.v1')"))
    def session(ex):
        T("train");pg.click("[data-a=start]");pg.click("[data-a=addex]");pg.click(f"[data-id={ex}]")
        for j in range(3):
            if j>0:pg.click('[data-a=addset][data-i="0"]')
            pg.fill(f'[data-f=w][data-j="{j}"]',"10");pg.fill(f'[data-f=reps][data-j="{j}"]',"8");pg.fill(f'[data-f=rpe][data-j="{j}"]',"7");pg.click(f'[data-a=done][data-j="{j}"]')
        pg.click("[data-a=finish]");pg.click("[data-a=save]")
    session("goblet_squat");t=pg.inner_text("body")
    ok("+10 积分" in t and "新勋章：首次训练" in t,"保存后显示奖励：+10 积分、新勋章「首次训练」")
    ok(pg.locator(".hero svg").count()>=1,"奖励页显示像素勋章")
    pg.click("[data-a=rwback]");ok("LV 1" in pg.inner_text("body") and "10 积分" in pg.inner_text("body"),"首页显示等级与积分")
    session("bench");ok("同一天多次训练只计一次" in pg.inner_text("body"),"同一天第二次训练：不重复发积分，并说明原因")
    pg.click("[data-a=rwback]");before=db()["rewards"]
    ok(sum(r["points"] for r in before)==10 and len({r["key"] for r in before})==len(before),"账本总分 10，且没有重复条目")
    T("ach");t=pg.inner_text("body");ok("LV 1" in t and "勋章 1/8" in t and "积分记录" in t and "不扣分" in t,"成就页：等级、勋章 1/8、积分记录、不扣分声明")
    ok(pg.locator(".bd.lock").count()==7,"未获得的 7 枚勋章显示为灰色并写明条件")
    pg.reload();ok(db()["rewards"]==before,"刷新后账本不变（重复同步不会重复发放）")
    T("progress");t=pg.inner_text("body");ok("近 7 天复盘" in t and "近 8 周" in t and "各肌群训练量" in t,"成长页：周复盘、8周统计、肌群训练量")
    ok("对比前 7 天" in t and "训练次数" in t,"近 7 天复盘包含今天的训练")
    pg.click("[data-a=sel]");ok("表现趋势" in pg.inner_text("body"),"动作详情显示表现趋势")
    pg.click("[data-a=export]");bk=pg.input_value("#bk");ok("rewards" not in json.loads(bk),"导出备份不含积分账本（导入时由训练记录重新推导）")
    pg.fill("#bk",json.dumps({**json.loads(bk),"rewards":[{"key":"fake","points":9999}]}));pg.click("[data-a=import]")
    T("ach");ok("9999" not in pg.inner_text("body") and "LV 1" in pg.inner_text("body"),"导入含伪造积分的备份：伪造部分被忽略")
    pg.screenshot(path="shot_ach.png",full_page=True)
    b.close()
print(errs);print(sum(res),"/",len(res),"通过");sys.exit(0 if all(res) else 1)
