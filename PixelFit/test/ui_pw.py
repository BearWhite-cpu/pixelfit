import json,sys
from playwright.sync_api import sync_playwright
errs=[];res=[]
def ok(c,m):
    res.append(c);print("ok  :" if c else "FAIL:",m)
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={"width":360,"height":740})
    pg.on("pageerror",lambda e:errs.append(str(e)));pg.on("dialog",lambda d:(errs.append("dialog:"+d.message),d.accept()))
    pg.goto("file:///mnt/user-data/outputs/pixelfit-preview.html")
    def session(w,r,rpe):
        pg.click("[data-a=tab][data-id=train]");pg.click("[data-a=start]");pg.click("[data-a=addex]");pg.click("[data-id=goblet_squat]")
        for j in range(3):
            if j>0: pg.click('[data-a=addset][data-i="0"]')
            pg.fill(f'[data-f=w][data-j="{j}"]',str(w));pg.fill(f'[data-f=reps][data-j="{j}"]',str(r));pg.fill(f'[data-f=rpe][data-j="{j}"]',str(rpe))
            pg.press(f'[data-f=rpe][data-j="{j}"]',"Tab");pg.click(f'[data-a=done][data-j="{j}"]')
        pg.click("[data-a=finish]")
    session(12,8,7);t=pg.inner_text("body")
    ok("完成 3 组" in t,"总结页显示完成3组")
    pg.click("[data-a=save]");ok(len(json.loads(pg.evaluate("localStorage.getItem('pixelfit.db.v1')"))["sessions"])==1,"保存后写入本地存储")
    pg.reload();pg.click("[data-a=tab][data-id=train]");pg.click("[data-a=start]");pg.click("[data-a=addex]");pg.click("[data-id=goblet_squat]");t=pg.inner_text("body")
    ok("上次" in t and "12kg×8@7" in t,"重新打开后读取上次成绩")
    ok("每组增加 1 次" in t,"显示建议：每组增加1次")
    ok(pg.input_value('[data-f=reps][data-j="2"]')=="9" and pg.input_value('[data-f=w][data-j="0"]')=="12","按建议预填 12kg×9")
    pg.click('[data-a=done][data-j="0"]');ok(True,"已点击完成一组")
    pg.screenshot(path="/home/claude/PixelFit/test/shot.png")
    pg.click("[data-a=abort]");pg.click("[data-a=tab][data-id=progress]");pg.click("[data-a=sel]")
    ok("个人最佳" in pg.inner_text("body"),"成长页显示个人最佳")
    pg.click("[data-a=export]");bk=pg.input_value("#bk");ok(len(json.loads(bk)["sessions"])==1,"导出备份包含训练")
    pg.click("[data-a=import]");ok(not any(e for e in errs if "dialog:不是" in e),"导入备份通过校验")
    b.close()
print(errs);print(sum(res),"/",len(res),"通过");sys.exit(0 if all(res) else 1)
