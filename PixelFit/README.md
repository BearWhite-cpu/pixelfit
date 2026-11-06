# PixelFit（Sprint 1–4）

离线个人训练管理 App：Kotlin + WebView 外壳，页面为原生 HTML/CSS/JS，无外部依赖。

## 功能概览
- 底部导航：首页 / 训练 / 数据 / 成就 / 我的
- 训练：状态评估 → 今日建议 → 肌群图谱 → 记录器（上次成绩、个人最佳、渐进超负荷建议）；动作库 48 个，可搜索、按部位筛选
- 我的：22 个高阶动作目标可选（背/腿/臀/胸/肩/手臂/核心），目标期限由用户选择，阶段达标才进阶
- 数据：近 7 天复盘、近 8 周折线图（截至今天）、肌群训练量、停滞提醒、备份与恢复
- 成就：积分、等级、像素勋章（休息不扣分）

## 目录
- `app/src/main/assets/`：core.js（数据与规则）、anatomy.js（肌肉图谱）、pixel.js（像素头像/勋章）、app.js（界面）、style.css、index.html
- `app/src/main/java/.../MainActivity.kt`：WebView 外壳（含拍照/选文件）
- `.github/workflows/build.yml`：GitHub Actions 自动构建 Debug APK
- `test/`：逻辑测试（node）与浏览器测试（Playwright）

## 用 GitHub 打包 APK（不需要安装 Android Studio）
1. 注册并登录 github.com，右上角 + → New repository，名称 pixelfit，选 Public，创建。
2. 点 "uploading an existing file"，把解压后文件夹**里面的全部内容**（包含 `.github`）拖进网页，点 Commit changes。
   - 看不到 `.github` 文件夹时：Mac 按 Cmd+Shift+. 显示隐藏文件。
   - 上传后若仓库里没有 `.github/workflows/build.yml`，用 Add file → Create new file，文件名输入 `.github/workflows/build.yml`，粘贴同名文件内容。
3. 打开 Actions 标签，必要时点启用；左侧选 Build APK → Run workflow。
4. 等 3–6 分钟出现绿色对勾，进入该次运行，页面底部 Artifacts 下载 PixelFit-APK，解压得到 app-debug.apk。
5. 传到手机安装（需允许安装未知来源应用）。

注意：每次构建的 Debug 签名可能不同，覆盖安装若提示签名冲突，需先卸载旧版（本地数据会丢，请先在「成长」页导出备份）。
纯血鸿蒙（HarmonyOS NEXT）手机不能安装 APK。

## 测试（在有 node 与 Playwright 的环境）
`for f in core anatomy s2 s3 s4; do node test/$f.test.js; done`
浏览器测试先运行 `python3 test/bundle.py` 生成单文件预览，再运行 `python3 test/ui_*.py`（路径需按本机调整）。

## 尚未实现
云端 AI、姿态识别、华为运动健康同步、饮食热量识别、社交/商城/订阅、伤病诊断。积分与勋章仅存本机，无法防止用户自行修改本地存储。
