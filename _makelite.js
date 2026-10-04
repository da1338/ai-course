/* 生成 GitHub 托管版：图片 + 压缩视频（原片 192MB → 41MB）
   与原版的差异只有两处：
   1. 封面视频换成静帧图（cover.jpg），省掉首屏 6.7MB 加载
   2. 顶部加一条说明条，注明视频为压缩版

   注意：说明条不放任何外部链接。本页视频已在页面内，
   不要引用别的站点（曾误引过漫游巴士项目的地址，已剔除）。   */
const fs=require('fs');
const src=process.argv[2]||'AI影像创作课程.html';
const dst=process.argv[3]||'.wb_git_tmp/gh-pages/index.html';
let h=fs.readFileSync(src,'utf8');

// 1) 封面视频 → 静帧图
h=h.replace(/<div class="hero-bg">[\s\S]*?<\/div>/,
  '<div class="hero-bg hero-bg-lite"></div>');

// 2) 顶部说明条
const CSS=`
<style>
.hero-bg-lite{
  background-image:url("assets/img/cover.jpg");
  background-size:cover; background-position:center;
}
/* 遮罩与主站保持一致（2026-10-04 加深，防标题被画面亮部吞掉） */
.hero-bg-lite::after{
  content:""; position:absolute; inset:0;
  background:linear-gradient(180deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.52) 26%,
    rgba(0,0,0,.62) 52%,rgba(0,0,0,.78) 74%,var(--bg) 94%,var(--bg) 100%);
}
.lite-note{
  max-width:var(--maxw); margin:0 auto; padding:11px var(--gut);
  display:flex; align-items:center; gap:10px; flex-wrap:wrap;
  border-bottom:1px solid var(--rule); background:var(--bg-2);
  font-family:var(--mono); font-size:12.5px; letter-spacing:.06em; color:var(--ink-3);
}
.lite-note b{color:var(--sig); font-weight:600; letter-spacing:.14em}
.lite-note a{color:var(--ink-2); border-bottom:1px solid var(--sig-line)}
</style>
`;
h=h.replace('</head>', CSS+'</head>');

const note='<div class="lite-note"><b>ONLINE 版</b><span>本页视频为在线压缩版（原 192MB → 41MB），画质适合在线观看 · 内容与模型信息已更新至 2026 年 10 月</span></div>';
h=h.replace(/(<nav[^>]*>[\s\S]*?<\/nav>)/, '$1'+note);

fs.writeFileSync(dst,h);
const nv=(h.match(/<video/g)||[]).length;
console.log('生成:',dst,'|',(h.length/1024).toFixed(1)+'KB','| video 标签',nv);
