A="app/src/main/assets/"
h=open(A+"index.html").read()
h=h.replace('<link rel="stylesheet" href="style.css">','<style>'+open(A+"style.css").read()+'</style>')
for f in ("core","anatomy","pixel","app"):h=h.replace('<script src="%s.js"></script>'%f,'<script>'+open(A+f+".js").read()+'</script>')
open("/mnt/user-data/outputs/pixelfit-preview.html","w").write(h)
