"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

// ===== Types =====
type Theme = "default" | "serif" | "dark" | "minimal";
type BlockType = "title"|"toc"|"chapter"|"subchapter"|"paragraph"|"quote"|"list"|"code"|"image"|"divider";

interface Block { type:BlockType; content:string; items?:string[]; chapterNum?:number; imageUrl?:string; }

type Layout = "minimal"|"literary"|"business"|"tech"|"warm"|"chinese";

interface Tpl { id:Layout; name:string; desc:string;
  pageBg:string; textColor:string; accent:string; accent2:string;
  titleColor:string; subColor:string; cardBg:string; cardBorder:string;
  fontFamily:string;
}

var TP:Record<Layout,Tpl> = {
  minimal:   { id:"minimal", name:"极简留白", desc:"黑字白底 · 细线分割 · 极致干净",
    pageBg:"#ffffff", textColor:"#2d2d2d", accent:"#1a1a1a", accent2:"#888888",
    titleColor:"#111111", subColor:"#999999", cardBg:"#ffffff", cardBorder:"#f0f0f0", fontFamily:"system-ui" },
  literary:  { id:"literary", name:"文艺清新", desc:"暖米底色 · 枝叶点缀 · 温柔治愈",
    pageBg:"#fdfaf5", textColor:"#4a453a", accent:"#6b8f5e", accent2:"#a3b899",
    titleColor:"#3d3528", subColor:"#9a9488", cardBg:"#faf7f0", cardBorder:"#e8e0d5", fontFamily:"system-ui" },
  business:  { id:"business", name:"商务专业", desc:"深蓝基调 · 严谨结构 · 权威可信",
    pageBg:"#ffffff", textColor:"#1e293b", accent:"#1e40af", accent2:"#3b82f6",
    titleColor:"#0f172a", subColor:"#64748b", cardBg:"#f8fafc", cardBorder:"#e2e8f0", fontFamily:"system-ui" },
  tech:      { id:"tech", name:"科技蓝调", desc:"渐变卡片 · 数据醒目 · 未来感",
    pageBg:"#f8fafc", textColor:"#1e293b", accent:"#2563eb", accent2:"#60a5fa",
    titleColor:"#0f172a", subColor:"#64748b", cardBg:"#ffffff", cardBorder:"#dbeafe", fontFamily:"system-ui" },
  warm:      { id:"warm", name:"温暖治愈", desc:"珊瑚暖橙 · 圆润柔和 · 生活感",
    pageBg:"#fffbf5", textColor:"#4a3f35", accent:"#e8815b", accent2:"#f0a88a",
    titleColor:"#3d2c20", subColor:"#a09080", cardBg:"#fff8f2", cardBorder:"#f5e0d0", fontFamily:"system-ui" },
  chinese:   { id:"chinese", name:"新中式", desc:"朱红描金 · 印章纹样 · 东方雅韵",
    pageBg:"#fefaf5", textColor:"#3c3028", accent:"#b5302a", accent2:"#c9a96e",
    titleColor:"#2c2018", subColor:"#9a8c7b", cardBg:"#fef9f2", cardBorder:"#e8dcc8", fontFamily:"'Noto Serif SC', 'STSong', serif" },
};

var THEME_MODES:Record<Theme,{pageBg:string;border:string;text:string;dim:string}> = {
  default:{ pageBg:"#ffffff", border:"#e2e8f0", text:"#64748b", dim:"#94a3b8" },
  serif:  { pageBg:"#faf8f5", border:"#dcd5c8", text:"#6b5e4f", dim:"#a0927e" },
  dark:   { pageBg:"#0f172a", border:"#334155", text:"#94a3b8", dim:"#64748b" },
  minimal:{ pageBg:"#ffffff", border:"#f1f5f9", text:"#64748b", dim:"#94a3b8" },
};

// ===== Typesetting Engine =====

// Smart auto-segmentation: detect plain text vs markdown, auto-structure plain text
function smartSegment(raw:string):string {
  var lines=raw.split("\n"), hasMd=false;
  for(var i=0;i<lines.length;i++){
    var l=lines[i].trim();
    if(/^#+ |^[-*>] |^```|^第[一二三四五六七八九十\d]+[章节篇部]|^Chapter\s+\d+/i.test(l)){hasMd=true;break;}
  }
  if(hasMd) return raw;

  var result:string[]=[], ch=0, inList=false;
  for(var i=0;i<lines.length;i++){
    var l=lines[i].trim();
    if(!l){inList=false;continue;}
    var isBlank=!l;
    if(!isBlank && ch===0 && i===0){result.push("# "+l);continue;}

    // Chapter detection
    var chMatch=l.match(/^第([一二三四五六七八九十\d]+)[章节篇部]/);
    if(chMatch){inList=false;ch++;result.push("\n\n第"+chMatch[1]+"章 "+l.replace(chMatch[0],"").trim());continue;}

    // Numbered section
    var numMatch=l.match(/^(\d+)[\.、\s]+/);
    if(numMatch){inList=true;result.push("\n\n第"+(++ch)+"章 "+l.replace(numMatch[0],"").trim());continue;}

    if(inList){result.push(l);continue;}

    if(result.length===1){result.push("\n\n"+l);}
    else{result.push("  "+l);}
  }
  return result.join("\n");
}

type TextProfile = {wordCount:number;charCount:number;readingTime:number;emoji:number;hasNumbers:boolean;hasQuotes:boolean;avgParaLen:number;keywords:string[];suggestedLayout:Layout;suggestedTheme:Theme;density:string;genre:string};
function analyzeText(text:string):TextProfile {
  text=text.replace(/^#+ /gm,"").replace(/```[\s\S]*?```/g,"").replace(/\*\*/g,"").replace(/\*/g,"").replace(/`/g,"");
  var emoji=/[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}]/gu;var em=text.match(emoji);var emojiCnt=em?em.length:0;
  var hasNumbers=/\d/.test(text);var hasQuotes=/[""''\u201C\u201D\u2018\u2019]/.test(text);
  var chars=text.replace(/\s/g,"").length;
  var words=text.replace(/[^\u4e00-\u9fff\w]/g," ").split(/\s+/).filter(function(w){return w.length>0;});
  var wordCount=words.length+Math.round(chars/1.5);
  var paras=text.split(/\n\n+/).filter(function(p){return p.trim().length>10;});
  var avgParaLen=paras.length>0?Math.round(paras.reduce(function(s,p){return s+p.length;},0)/paras.length):0;
  var readingTime=Math.max(1,Math.round(wordCount/300));

  var genre="通用";
  var academicScore=0, bizScore=0, mediaScore=0, chatScore=0, resumeScore=0;
  var aca=["研究","分析","理论","数据","实验","证明","结论","表明","显示","显著","影响","因素","方法","模型"];
  var biz=["战略","市场","业务","营收","客户","产品","增长","利润","投资","管理","团队","目标","方案","执行"];
  var med=["热点","爆款","流量","粉丝","关注","分享","点赞","视频","直播","话题","内容","平台"];
  var chat=["吗","呢","吧","哈哈","哎","哦","啦","呀","嗯","嘿","呵呵","嘻嘻"];
  var res=["经历","技能","教育","姓名","电话","邮箱","地址","公司","职位","项目","负责"];
  var lc=text.toLowerCase();
  aca.forEach(function(w){if(lc.indexOf(w)>=0)academicScore++;});
  biz.forEach(function(w){if(lc.indexOf(w)>=0)bizScore++;});
  med.forEach(function(w){if(lc.indexOf(w)>=0)mediaScore++;});
  chat.forEach(function(w){if(lc.indexOf(w)>=0)chatScore++;});
  res.forEach(function(w){if(lc.indexOf(w)>=0)resumeScore++;});
  if(emojiCnt>3){mediaScore+=3;chatScore+=2;}
  if(hasNumbers&&hasQuotes)academicScore+=2;
  if(wordCount<50)resumeScore+=2;
  if(wordCount>500){academicScore+=1;bizScore+=1;}
  var scores:{[k:string]:number}={academic:academicScore,biz:bizScore,media:mediaScore,chat:chatScore,resume:resumeScore};
  var top="biz",topV=0;
  Object.keys(scores).forEach(function(k){if(scores[k]>topV){topV=scores[k];top=k;}});
  var genreMap:{[k:string]:string}={academic:"学术型",biz:"商务型",media:"新媒体型",chat:"对话型",resume:"简历型"};
  if(topV>=3)genre=genreMap[top]||"通用";

  var layoutMap:{[k:string]:Layout}={academic:"literary",biz:"business",media:"tech",chat:"warm",resume:"minimal"};
  var suggestedLayout=layoutMap[top]||"minimal";

  var suggestedTheme:"default"|"serif"|"dark"|"minimal"="default";
  if(academicScore>4)suggestedTheme="serif";
  else if(mediaScore>3&&emojiCnt>2)suggestedTheme="dark";
  else if(resumeScore>3||wordCount<80)suggestedTheme="minimal";

  var density=avgParaLen>300?"密集":avgParaLen>150?"适中":"稀疏";

  var stopWords=["的","了","在","是","我","有","和","就","不","人","都","一","一个","上","也","很","到","说","要","去","你","会","着","没有","看","好","自己","这","他","她","它","们","那","可以","什么","怎么","因为","所以","但是","而且","然后","如果","还是","已经","比较","非常","可能","应该","开始","结束","发生","进行","使用","通过","出现","具有","需要","该","本","其","为","与","及","做","被","让","给","能","从","向","把","将","对","用","以","来","也","中","过","而","或","之","等","前","后","当","并","更","新","每"];
  var freq:{[k:string]:number}={};
  words.forEach(function(w){
    if(w.length>=2&&stopWords.indexOf(w)<0&&!/^[\d\W_]+$/.test(w)){
      freq[w]=freq[w]?freq[w]+1:1;
    }
  });
  var keywords=Object.keys(freq).sort(function(a,b){return freq[b]-freq[a];}).slice(0,8);

  return {wordCount:wordCount,charCount:chars,readingTime:readingTime,emoji:emojiCnt,hasNumbers:hasNumbers,hasQuotes:hasQuotes,avgParaLen:avgParaLen,keywords:keywords,suggestedLayout:suggestedLayout,suggestedTheme:suggestedTheme,density:density,genre:genre};
}

function smartSvg(tp:Tpl,content:string):string {
  var a=tp.accent,a2=tp.accent2,bg=tp.cardBg;
  var lc=content.toLowerCase(), w=800, h=140;
  var svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'"><rect fill="'+bg+'" width="'+w+'" height="'+h+'"/>';
  if(/数据|统计|数字|增长|上升|提升|增加|同比|环比|趋势|图表/i.test(lc)){
    var bars=[{x:80,h:60},{x:150,h:85},{x:220,h:55},{x:290,h:95},{x:360,h:70},{x:430,h:80}];
    for(var bi=0;bi<bars.length;bi++){svg+='<rect x="'+bars[bi].x+'" y="'+(h-bars[bi].h)+'" width="50" height="'+bars[bi].h+'" fill="'+(bi%2===0?a:a2)+'" opacity="0.'+(20+bi*3)+'"/><animate attributeName="height" from="0" to="'+bars[bi].h+'" dur="0.8s" fill="freeze"/><animate attributeName="y" from="'+h+'" to="'+(h-bars[bi].h)+'" dur="0.8s" fill="freeze"/>';}
    svg+='<line x1="60" y1="20" x2="60" y2="'+h+'" stroke="'+a+'" opacity="0.1" stroke-width="1"/>';
    svg+='<line x1="60" y1="'+h+'" x2="520" y2="'+h+'" stroke="'+a+'" opacity="0.1" stroke-width="1"/>';
  }
  else if(/团队|协作|组织|网络|连接|关系|生态|平台|系统|架构/i.test(lc)){
    var cx=[150,250,180,320,220,400,280,350],cy=[30,50,80,40,70,55,95,35],cr=[8,6,10,7,9,5,8,6];
    for(var ni=0;ni<cx.length;ni++){svg+='<circle cx="'+cx[ni]+'" cy="'+cy[ni]+'" r="'+cr[ni]+'" fill="'+a+'" opacity="0.08"/>';}
    svg+='<line x1="150" y1="30" x2="250" y2="50" stroke="'+a2+'" opacity="0.06" stroke-width="1"/>';
    svg+='<line x1="180" y1="80" x2="320" y2="40" stroke="'+a+'" opacity="0.05" stroke-width="1"/>';
    svg+='<line x1="280" y1="95" x2="350" y2="35" stroke="'+a2+'" opacity="0.06" stroke-width="1"/>';
  }
  else if(/时间|历程|阶段|发展|年|月|日|开始|结束|过程|路线|规划/i.test(lc)){
    svg+='<line x1="100" y1="70" x2="700" y2="70" stroke="'+a+'" opacity="0.12" stroke-width="1.5"/>';
    for(var ti=0;ti<5;ti++){svg+='<circle cx="'+ (150+ti*120)+'" cy="70" r="5" fill="'+(ti%2===0?a:a2)+'" opacity="0.2"/>';}
  }
  else{svg+='<circle cx="120" cy="50" r="12" fill="'+a+'" opacity="0.06"/><circle cx="680" cy="90" r="18" fill="'+a2+'" opacity="0.05"/><rect x="300" y="20" width="200" height="100" rx="20" fill="none" stroke="'+a+'" opacity="0.04" stroke-width="1"/>';}
  svg+='</svg>';
  return svg;
}

function attachSmartImages(blocks:Block[],tp:Tpl):Block[] {
  return blocks.map(function(b){
    if(b.type!=="image")return b;
    if(b.imageUrl&&b.imageUrl.trim())return b;
    return Object.assign({},b,{imageUrl:"data:image/svg+xml,"+encodeURIComponent(smartSvg(tp,b.content))});
  });
}

function typeset(md:string):{title:string;blocks:Block[]} {
  var lines=md.split("\n"), blocks:Block[]=[], title="", inList=false, listItems:string[]=[], inCode=false, codeLines:string[]=[];
  var chNum=0;
  for(var i=0;i<lines.length;i++){
    var raw=lines[i], l=raw.trim();
    if(inCode){
      if(/^```/.test(l)){blocks.push({type:"code",content:codeLines.join("\n")});inCode=false;codeLines=[];}
      else codeLines.push(raw);
      continue;
    }
    if(/^```/.test(l)){inCode=true;continue;}
    if(i===0&&/^# +/.test(l)){title=l.replace(/^# +/,"");continue;}
    if(i===0&&!title&&l){title=l;continue;}
    if(/^# +/.test(l)){if(inList){blocks.push({type:"list",content:"",items:listItems});listItems=[];inList=false;}blocks.push({type:"subchapter",content:l.replace(/^#+ /,"")});continue;}
    if(/^第[一二三四五六七八九十\d]+章/.test(l)){if(inList){blocks.push({type:"list",content:"",items:listItems});listItems=[];inList=false;}chNum++;blocks.push({type:"chapter",content:l.replace(/^第[一二三四五六七八九十\d]+章\s*/,""),chapterNum:chNum});continue;}
    if(/^## +/.test(l)){if(inList){blocks.push({type:"list",content:"",items:listItems});listItems=[];inList=false;}blocks.push({type:"subchapter",content:l.replace(/^## +/,"")});continue;}
    if(/^> /.test(l)){if(inList){blocks.push({type:"list",content:"",items:listItems});listItems=[];inList=false;}blocks.push({type:"quote",content:l.replace(/^> /,"")});continue;}
    if(/^---/.test(l)){if(inList){blocks.push({type:"list",content:"",items:listItems});listItems=[];inList=false;}blocks.push({type:"divider",content:""});continue;}
    if(/^[-*] /.test(l)){inList=true;listItems.push(l.replace(/^[-*] /,""));continue;}
    if(/^\d+[\.\、]/.test(l)){inList=true;listItems.push(l.replace(/^\d+[\.\、]\s*/,""));continue;}
    if(l){if(inList){blocks.push({type:"list",content:"",items:listItems});listItems=[];inList=false;}blocks.push({type:"paragraph",content:l});}
    else{if(inList){blocks.push({type:"list",content:"",items:listItems});listItems=[];inList=false;}}
  }
  if(inList)blocks.push({type:"list",content:"",items:listItems});
  if(!title&&blocks.length>0&&blocks[0].type==="paragraph"){title=blocks[0].content;blocks.shift();}
  if(!title)title="未命名文档";
  return {title:title, blocks:blocks};
}

function useReadingProgress() {
  var [progress,setProgress]=useState(0);
  useEffect(function(){
    var h=function(){var st=window.scrollY,sh=document.documentElement.scrollHeight-window.innerHeight;setProgress(sh>0?Math.min(100,Math.round((st/sh)*100)):0);};
    window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h);};
  },[]);
  return progress;
}

// ===== WeChat Public Account Renderers =====

// 1. 极简留白 — Minimal white space, thin gray lines, pure typography
function MZ(tp:Tpl){
  var bg=tp.pageBg;
  return function(props:{blocks:Block[],title:string}){
    return React.createElement("article",{className:"max-w-2xl mx-auto px-6 py-12",style:{backgroundColor:bg,fontFamily:tp.fontFamily}},
      React.createElement("header",{className:"mb-16 text-center"},
        React.createElement("h1",{className:"text-2xl font-light tracking-wider leading-relaxed mb-6",style:{color:tp.titleColor}},props.title),
        React.createElement("div",{className:"w-8 h-px mx-auto",style:{backgroundColor:tp.accent,opacity:0.3}})),
      props.blocks.map(function(b,idx){
        if(b.type==="chapter") return React.createElement("section",{key:idx,className:"mt-14 mb-6",style:{scrollMarginTop:"5rem"}},
          React.createElement("h2",{className:"text-base font-normal tracking-widest mb-4",style:{color:tp.subColor,borderBottom:"1px solid "+tp.cardBorder,paddingBottom:8}},b.content));
        if(b.type==="subchapter") return React.createElement("h3",{key:idx,className:"text-sm font-medium mt-8 mb-3",style:{color:tp.titleColor,scrollMarginTop:"5rem"}},b.content);
        if(b.type==="paragraph") return React.createElement("p",{key:idx,className:"mb-5 text-[15px] leading-[1.9] tracking-[0.02em]",style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:b.content}});
        if(b.type==="quote") return React.createElement("blockquote",{key:idx,className:"my-8 pl-6 py-1",style:{borderLeft:"3px solid "+tp.accent,color:tp.subColor}},
          React.createElement("p",{className:"text-sm leading-relaxed"},b.content));
        if(b.type==="list") return React.createElement("ul",{key:idx,className:"my-5 space-y-2"},
          (b.items||[]).map(function(item,j){return React.createElement("li",{key:j,className:"flex items-start gap-2 text-[14px] leading-relaxed pl-1",style:{color:tp.textColor}},
            React.createElement("span",{className:"mt-1.5 w-1 h-1 rounded-full flex-shrink-0",style:{backgroundColor:tp.accent,opacity:0.4}}),
            React.createElement("span",{dangerouslySetInnerHTML:{__html:item}}));}));
        if(b.type==="image") return React.createElement("figure",{key:idx,className:"my-10"},
          React.createElement("img",{src:b.imageUrl||smartSvg(tp,b.content),alt:b.content,className:"w-full object-cover",style:{borderRadius:2}}),
          b.content&&React.createElement("figcaption",{className:"text-xs mt-3 text-center",style:{color:tp.subColor}},b.content));
        if(b.type==="divider") return React.createElement("div",{key:idx,className:"my-12 text-center tracking-[1em]",style:{color:tp.cardBorder,fontSize:12}},"\u00B7 \u00B7 \u00B7");
        if(b.type==="code") return React.createElement("pre",{key:idx,className:"my-5 p-5 text-xs overflow-x-auto",style:{backgroundColor:tp.cardBg,borderRadius:4,color:tp.textColor,border:"1px solid "+tp.cardBorder}},React.createElement("code",null,b.content));
        return null;
      }),
      React.createElement("footer",{className:"mt-16 pt-8 text-center",style:{borderTop:"1px solid "+tp.cardBorder}},
        React.createElement("p",{className:"text-xs",style:{color:tp.subColor}},"\u00A9 2026 \u00B7 感谢阅读")));
  };
}

// 2. 文艺清新 — Warm cream, botanical accents, rounded shapes
function LZ(tp:Tpl){
  var bg=tp.pageBg;
  return function(props:{blocks:Block[],title:string}){
    return React.createElement("article",{className:"max-w-2xl mx-auto px-6 py-10",style:{backgroundColor:bg,fontFamily:tp.fontFamily}},
      React.createElement("header",{className:"mb-12 text-center"},
        React.createElement("div",{className:"inline-flex items-center gap-3 px-5 py-1.5 rounded-full text-xs mb-6",style:{backgroundColor:tp.cardBg,color:tp.accent,border:"1px solid "+tp.cardBorder}},String.fromCodePoint(127807)," 静心阅读 ",String.fromCodePoint(127807)),
        React.createElement("h1",{className:"text-xl font-bold leading-relaxed mb-4 px-2",style:{color:tp.titleColor}},props.title),
        React.createElement("div",{className:"flex justify-center gap-1.5"},
          React.createElement("span",{className:"w-6 h-px",style:{backgroundColor:tp.accent2,opacity:0.5}}),
          React.createElement("span",{className:"w-1.5 h-1.5 rounded-full",style:{backgroundColor:tp.accent}}),
          React.createElement("span",{className:"w-6 h-px",style:{backgroundColor:tp.accent2,opacity:0.5}}))),
      props.blocks.map(function(b,idx){
        if(b.type==="chapter") return React.createElement("section",{key:idx,className:"mt-12 mb-6",style:{scrollMarginTop:"5rem"}},
          React.createElement("h2",{className:"flex items-center gap-3 text-base font-bold mb-5",style:{color:tp.titleColor}},
            React.createElement("span",{className:"w-1.5 h-1.5 rounded-full flex-shrink-0",style:{backgroundColor:tp.accent}}),
            b.content));
        if(b.type==="subchapter") return React.createElement("h3",{key:idx,className:"text-sm font-semibold mt-8 mb-3 ml-3",style:{color:tp.accent,scrollMarginTop:"5rem",borderLeft:"2px solid "+tp.accent,paddingLeft:8}},b.content);
        if(b.type==="paragraph") return React.createElement("p",{key:idx,className:"mb-5 text-[15px] leading-[1.85] text-justify",style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:b.content}});
        if(b.type==="quote") return React.createElement("div",{key:idx,className:"my-7 p-5 rounded-xl text-center",style:{backgroundColor:tp.cardBg,border:"1px solid "+tp.cardBorder}},
          React.createElement("p",{className:"text-sm leading-relaxed italic",style:{color:tp.accent}},String.fromCodePoint(128172)," ",b.content," ",String.fromCodePoint(128172)));
        if(b.type==="list") return React.createElement("ul",{key:idx,className:"my-5 space-y-2.5"},
          (b.items||[]).map(function(item,j){return React.createElement("li",{key:j,className:"flex items-start gap-2.5 text-[14px] leading-relaxed p-2.5 rounded-lg",style:{backgroundColor:j%2===0?tp.cardBg:"transparent"}},
            React.createElement("span",{className:"mt-0.5 flex-shrink-0"},String.fromCodePoint(127803)),
            React.createElement("span",{style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:item}}));}));
        if(b.type==="image") return React.createElement("figure",{key:idx,className:"my-8"},
          React.createElement("img",{src:b.imageUrl||smartSvg(tp,b.content),alt:b.content,className:"w-full object-cover rounded-xl",style:{border:"2px solid "+tp.cardBorder}}));
        if(b.type==="divider") return React.createElement("div",{key:idx,className:"my-10 text-center text-sm tracking-widest",style:{color:tp.accent2,opacity:0.4}},"\u273F \u273F \u273F");
        if(b.type==="code") return React.createElement("pre",{key:idx,className:"my-5 p-5 text-xs overflow-x-auto rounded-xl",style:{backgroundColor:tp.cardBg,color:tp.textColor,border:"1px solid "+tp.cardBorder}},React.createElement("code",null,b.content));
        return null;
      }),
      React.createElement("footer",{className:"mt-16 pt-10 text-center relative"},
        React.createElement("div",{className:"absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center",style:{backgroundColor:tp.cardBg,border:"1px solid "+tp.cardBorder}},String.fromCodePoint(127803)),
        React.createElement("p",{className:"mt-4 text-xs",style:{color:tp.subColor}},"期待下次遇见 \u00B7 点个在看吧")));
  };
}

// 3. 商务专业 — Structured navy, numbered sections, authority
function BZ(tp:Tpl){
  var bg=tp.pageBg;
  return function(props:{blocks:Block[],title:string}){
    return React.createElement("article",{className:"max-w-2xl mx-auto px-6 py-10",style:{backgroundColor:bg,fontFamily:tp.fontFamily}},
      React.createElement("header",{className:"mb-10"},
        React.createElement("div",{className:"flex items-center gap-3 mb-4"},
          React.createElement("div",{className:"h-10 w-1 rounded-sm",style:{backgroundColor:tp.accent}}),
          React.createElement("div",null,
            React.createElement("div",{className:"text-[10px] tracking-[0.2em] uppercase mb-1",style:{color:tp.accent2}},"Professional Report"),
            React.createElement("div",{className:"text-xs",style:{color:tp.subColor}},"第"+Math.ceil(props.blocks.length/3)+"期"))),
        React.createElement("h1",{className:"text-xl font-extrabold leading-snug tracking-tight",style:{color:tp.titleColor}},props.title)),
      props.blocks.map(function(b,idx){
        if(b.type==="chapter") return React.createElement("section",{key:idx,className:"mt-12 mb-6",style:{scrollMarginTop:"5rem"}},
          React.createElement("div",{className:"flex items-center gap-3 mb-4"},
            React.createElement("span",{className:"w-7 h-7 rounded flex items-center justify-center text-xs font-bold text-white",style:{backgroundColor:tp.accent}},b.chapterNum||1),
            React.createElement("h2",{className:"text-base font-bold",style:{color:tp.titleColor}},b.content)));
        if(b.type==="subchapter") return React.createElement("h3",{className:"text-sm font-bold mt-8 mb-3 pl-3",style:{color:tp.titleColor,borderLeft:"3px solid "+tp.accent,scrollMarginTop:"5rem"}},b.content);
        if(b.type==="paragraph") return React.createElement("p",{key:idx,className:"mb-5 text-[15px] leading-[1.85]",style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:b.content}});
        if(b.type==="quote") return React.createElement("div",{key:idx,className:"my-7 p-5 rounded-r-lg",style:{backgroundColor:tp.cardBg,borderLeft:"4px solid "+tp.accent}},
          React.createElement("p",{className:"text-sm leading-relaxed font-medium",style:{color:tp.accent}},"\u201C",b.content,"\u201D"));
        if(b.type==="list") return React.createElement("ul",{key:idx,className:"my-5 space-y-2"},
          (b.items||[]).map(function(item,j){return React.createElement("li",{key:j,className:"flex items-start gap-3 text-[14px] leading-relaxed"},
            React.createElement("span",{className:"flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white mt-0.5",style:{backgroundColor:tp.accent2}},j+1),
            React.createElement("span",{style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:item}}));}));
        if(b.type==="image") return React.createElement("figure",{key:idx,className:"my-8"},
          React.createElement("img",{src:b.imageUrl||smartSvg(tp,b.content),alt:b.content,className:"w-full object-cover rounded-lg",style:{border:"1px solid "+tp.cardBorder}}),
          b.content&&React.createElement("figcaption",{className:"text-xs mt-2 text-center",style:{color:tp.subColor}},b.content));
        if(b.type==="divider") return React.createElement("div",{key:idx,className:"my-10",style:{borderTop:"1px solid "+tp.cardBorder}});
        if(b.type==="code") return React.createElement("pre",{key:idx,className:"my-5 p-5 text-xs overflow-x-auto rounded-lg",style:{backgroundColor:"#0f172a",color:"#e2e8f0",border:"1px solid #334155"}},React.createElement("code",null,b.content));
        return null;
      }),
      React.createElement("footer",{className:"mt-14 pt-8",style:{borderTop:"2px solid "+tp.accent}},
        React.createElement("div",{className:"flex items-center justify-between"},
          React.createElement("span",{className:"text-xs",style:{color:tp.subColor}},"\u00A9 2026 Company Inc."),
          React.createElement("span",{className:"text-xs px-2 py-0.5 rounded",style:{backgroundColor:tp.accent,color:"white"}},"END"))));
  };
}

// 4. 科技蓝调 — Gradient cards, data-forward, modern tech
function TZ(tp:Tpl){
  var bg=tp.pageBg;
  return function(props:{blocks:Block[],title:string}){
    return React.createElement("article",{className:"max-w-2xl mx-auto px-5 py-10",style:{backgroundColor:bg,fontFamily:tp.fontFamily}},
      React.createElement("header",{className:"mb-12"},
        React.createElement("div",{className:"rounded-2xl p-8 mb-6",style:{background:"linear-gradient(135deg, "+tp.accent+"22, "+tp.accent2+"22)",border:"1px solid "+tp.cardBorder}},
          React.createElement("div",{className:"flex items-center gap-2 mb-4 text-[10px] tracking-[0.2em] font-bold",style:{color:tp.accent2}},"\u25C6 TECH REPORT \u25C6"),
          React.createElement("h1",{className:"text-xl font-extrabold leading-snug",style:{color:tp.titleColor}},props.title)),
        React.createElement("div",{className:"flex gap-3 flex-wrap"},
          ["深度分析","数据驱动","行业前沿"].map(function(t){return React.createElement("span",{key:t,className:"text-[11px] px-3 py-1 rounded-full font-medium",style:{backgroundColor:tp.cardBg,color:tp.accent,border:"1px solid "+tp.cardBorder}},t);}))),
      props.blocks.map(function(b,idx){
        if(b.type==="chapter") return React.createElement("section",{key:idx,className:"mt-12 mb-6",style:{scrollMarginTop:"5rem"}},
          React.createElement("div",{className:"rounded-xl p-5 mb-5",style:{backgroundColor:tp.cardBg,border:"1px solid "+tp.cardBorder}},
            React.createElement("div",{className:"flex items-center gap-3 mb-2"},
              React.createElement("div",{className:"w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold",style:{background:"linear-gradient(135deg,"+tp.accent+","+tp.accent2+")"}},String.fromCodePoint(0x26A1)),
              React.createElement("h2",{className:"text-base font-bold",style:{color:tp.titleColor}},b.content))));
        if(b.type==="subchapter") return React.createElement("h3",{key:idx,className:"text-sm font-bold mt-8 mb-3 flex items-center gap-2",style:{color:tp.accent,scrollMarginTop:"5rem"}},
          React.createElement("span",{className:"w-1.5 h-1.5 rounded-full",style:{backgroundColor:tp.accent2}}),b.content);
        if(b.type==="paragraph") return React.createElement("p",{key:idx,className:"mb-5 text-[15px] leading-[1.85]",style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:b.content}});
        if(b.type==="quote") return React.createElement("div",{key:idx,className:"my-7 p-5 rounded-xl",style:{background:"linear-gradient(135deg,"+tp.accent+"18,"+tp.accent2+"10)",border:"1px solid "+tp.cardBorder}},
          React.createElement("p",{className:"text-sm leading-relaxed font-medium",style:{color:tp.accent}},"\u25B8 ",b.content));
        if(b.type==="list") return React.createElement("ul",{key:idx,className:"my-5 space-y-2"},
          (b.items||[]).map(function(item,j){return React.createElement("li",{key:j,className:"flex items-start gap-2.5 text-[14px] leading-relaxed p-3 rounded-lg",style:{backgroundColor:j%2===0?tp.cardBg:"transparent"}},
            React.createElement("span",{className:"mt-1 flex-shrink-0 w-4 h-4 rounded flex items-center justify-center text-[10px] text-white font-bold",style:{backgroundColor:tp.accent2}},"\u2713"),
            React.createElement("span",{style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:item}}));}));
        if(b.type==="image") return React.createElement("figure",{key:idx,className:"my-8"},
          React.createElement("img",{src:b.imageUrl||smartSvg(tp,b.content),alt:b.content,className:"w-full object-cover rounded-xl",style:{border:"2px solid "+tp.cardBorder}}));
        if(b.type==="divider") return React.createElement("div",{key:idx,className:"my-10 flex items-center gap-3 justify-center"},
          React.createElement("span",{className:"h-px flex-1",style:{background:"linear-gradient(90deg,transparent,"+tp.accent2+")",opacity:0.3}}),
          React.createElement("span",{className:"text-[10px] px-2 py-0.5 rounded-full",style:{backgroundColor:tp.cardBg,color:tp.accent2,border:"1px solid "+tp.cardBorder}},"\u25C6"),
          React.createElement("span",{className:"h-px flex-1",style:{background:"linear-gradient(90deg,"+tp.accent2+",transparent)",opacity:0.3}}));
        if(b.type==="code") return React.createElement("pre",{key:idx,className:"my-5 p-5 text-xs overflow-x-auto rounded-lg",style:{backgroundColor:"#0f172a",color:"#60a5fa",border:"1px solid #1e293b"}},React.createElement("code",null,b.content));
        return null;
      }),
      React.createElement("footer",{className:"mt-16 pt-8 text-center",style:{borderTop:"1px solid "+tp.cardBorder}},
        React.createElement("div",{className:"inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs",style:{backgroundColor:tp.cardBg,border:"1px solid "+tp.cardBorder}},
          React.createElement("span",{style:{color:tp.accent}},"\u25C6"),
          React.createElement("span",{style:{color:tp.subColor}},"扫码关注 \u00B7 获取更多深度报告"),
          React.createElement("span",{style:{color:tp.accent}},"\u25C6"))));
  };
}

// 5. 温暖治愈 — Coral warm, rounded soft, cozy lifestyle
function WZ(tp:Tpl){
  var bg=tp.pageBg;
  return function(props:{blocks:Block[],title:string}){
    return React.createElement("article",{className:"max-w-xl mx-auto px-6 py-10",style:{backgroundColor:bg,fontFamily:tp.fontFamily}},
      React.createElement("header",{className:"mb-12 text-center"},
        React.createElement("div",{className:"inline-block mb-5",style:{fontSize:36}},String.fromCodePoint(127968)),
        React.createElement("h1",{className:"text-lg font-bold leading-relaxed mb-4 px-4",style:{color:tp.titleColor}},props.title),
        React.createElement("div",{className:"flex items-center justify-center gap-2 text-[11px]",style:{color:tp.subColor}},
          String.fromCodePoint(128197)," 分享生活 \u00B7 ",String.fromCodePoint(128150)," 记录美好")),
      props.blocks.map(function(b,idx){
        if(b.type==="chapter") return React.createElement("section",{key:idx,className:"mt-12 mb-6 text-center",style:{scrollMarginTop:"5rem"}},
          React.createElement("div",{className:"inline-flex flex-col items-center"},
            React.createElement("span",{className:"w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3",style:{backgroundColor:tp.accent}},String.fromCodePoint(127849)),
            React.createElement("h2",{className:"text-base font-bold",style:{color:tp.titleColor}},b.content)));
        if(b.type==="subchapter") return React.createElement("h3",{key:idx,className:"text-sm font-bold mt-8 mb-3 text-center",style:{color:tp.accent,scrollMarginTop:"5rem"}},
          String.fromCodePoint(127775)," ",b.content," ",String.fromCodePoint(127775));
        if(b.type==="paragraph") return React.createElement("p",{key:idx,className:"mb-5 text-[15px] leading-[1.85]",style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:b.content}});
        if(b.type==="quote") return React.createElement("div",{key:idx,className:"my-7 p-5 rounded-2xl text-center",style:{backgroundColor:tp.accent+"12",border:"2px dotted "+tp.accent+"40"}},
          React.createElement("p",{className:"text-sm leading-relaxed font-medium",style:{color:tp.accent}},b.content));
        if(b.type==="list") return React.createElement("ul",{key:idx,className:"my-5 space-y-2.5"},
          (b.items||[]).map(function(item,j){return React.createElement("li",{key:j,className:"flex items-start gap-2.5 text-[14px] leading-relaxed py-2 px-3 rounded-xl",style:{backgroundColor:j%2===0?tp.cardBg:"transparent"}},
            React.createElement("span",{className:"text-base flex-shrink-0 mt-0.5"},[String.fromCodePoint(127849),String.fromCodePoint(127854),String.fromCodePoint(127853),String.fromCodePoint(9749)][j%4]),
            React.createElement("span",{style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:item}}));}));
        if(b.type==="image") return React.createElement("figure",{key:idx,className:"my-8"},
          React.createElement("img",{src:b.imageUrl||smartSvg(tp,b.content),alt:b.content,className:"w-full object-cover rounded-2xl",style:{border:"2px solid "+tp.cardBorder}}));
        if(b.type==="divider") return React.createElement("div",{key:idx,className:"my-10 text-center tracking-[0.5em]",style:{color:tp.accent2,opacity:0.35,fontSize:14}},"\u2665 \u2665 \u2665");
        if(b.type==="code") return React.createElement("pre",{key:idx,className:"my-5 p-5 text-xs overflow-x-auto rounded-xl",style:{backgroundColor:tp.cardBg,color:tp.textColor,border:"1px solid "+tp.cardBorder}},React.createElement("code",null,b.content));
        return null;
      }),
      React.createElement("footer",{className:"mt-16 pt-8 text-center",style:{borderTop:"2px dashed "+tp.cardBorder}},
        React.createElement("p",{className:"text-xs mb-3",style:{color:tp.accent}},String.fromCodePoint(128150)," 感谢读到这里的你 ",String.fromCodePoint(128150)),
        React.createElement("p",{className:"text-xs",style:{color:tp.subColor}},"长按识别二维码 \u00B7 每天都有小确幸")));
  };
}

// 6. 新中式 — Vermilion & gold, seal motifs, Eastern elegance
function CZ(tp:Tpl){
  var bg=tp.pageBg;
  return function(props:{blocks:Block[],title:string}){
    return React.createElement("article",{className:"max-w-2xl mx-auto px-6 py-10",style:{backgroundColor:bg,fontFamily:tp.fontFamily}},
      React.createElement("header",{className:"mb-14 text-center relative"},
        React.createElement("div",{className:"absolute left-1/2 top-0 transform -translate-x-1/2 w-px h-12",style:{backgroundColor:tp.accent,opacity:0.15}}),
        React.createElement("div",{className:"pt-14"},
          React.createElement("h1",{className:"text-xl font-bold leading-relaxed tracking-[0.08em] mb-4",style:{color:tp.titleColor}},props.title),
          React.createElement("div",{className:"inline-flex items-center gap-4"},
            React.createElement("span",{className:"w-8 h-px",style:{backgroundColor:tp.accent2,opacity:0.5}}),
            React.createElement("span",{className:"w-5 h-5 border-2 flex items-center justify-center text-[9px] font-bold",style:{borderColor:tp.accent,color:tp.accent}},"\u5370"),
            React.createElement("span",{className:"w-8 h-px",style:{backgroundColor:tp.accent2,opacity:0.5}})))),
      props.blocks.map(function(b,idx){
        if(b.type==="chapter") return React.createElement("section",{key:idx,className:"mt-14 mb-8",style:{scrollMarginTop:"5rem"}},
          React.createElement("div",{className:"flex items-center gap-4 mb-5"},
            React.createElement("div",{className:"flex flex-col items-center"},
              React.createElement("span",{className:"w-7 h-7 border-2 flex items-center justify-center text-[10px] font-bold",style:{borderColor:tp.accent,color:tp.accent}},"\u5341"),
              React.createElement("span",{className:"w-px flex-1 mt-1",style:{backgroundColor:tp.accent,opacity:0.15}})),
            React.createElement("h2",{className:"text-lg font-bold tracking-wider",style:{color:tp.titleColor}},b.content)));
        if(b.type==="subchapter") return React.createElement("h3",{key:idx,className:"mt-8 mb-4 text-sm font-bold pl-4",style:{color:tp.titleColor,borderLeft:"3px solid "+tp.accent,scrollMarginTop:"5rem"}},b.content);
        if(b.type==="paragraph") return React.createElement("p",{key:idx,className:"mb-5 text-[15px] leading-[2] tracking-[0.03em] indent-8",style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:b.content}});
        if(b.type==="quote") return React.createElement("div",{key:idx,className:"my-8 py-5 px-6 text-center relative",style:{backgroundColor:tp.cardBg,border:"1px solid "+tp.cardBorder}},
          React.createElement("p",{className:"text-sm leading-relaxed tracking-wide italic",style:{color:tp.accent}},"\u300C",b.content,"\u300D"),
          React.createElement("div",{className:"absolute -top-2.5 left-1/2 transform -translate-x-1/2 px-2 text-[10px]",style:{backgroundColor:bg,color:tp.accent2}},"\u6458\u5F55"));
        if(b.type==="list") return React.createElement("ul",{key:idx,className:"my-6 space-y-2.5"},
          (b.items||[]).map(function(item,j){return React.createElement("li",{key:j,className:"flex items-start gap-3 text-[14px] leading-relaxed py-2 px-3",style:{borderBottom:"1px solid "+tp.cardBorder}},
            React.createElement("span",{className:"text-sm flex-shrink-0 mt-0.5",style:{color:tp.accent}},"\u25C6"),
            React.createElement("span",{style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:item}}));}));
        if(b.type==="image") return React.createElement("figure",{key:idx,className:"my-10"},
          React.createElement("div",{className:"p-1",style:{border:"1px solid "+tp.cardBorder}},
            React.createElement("img",{src:b.imageUrl||smartSvg(tp,b.content),alt:b.content,className:"w-full object-cover",style:{border:"1px solid "+tp.cardBorder}})));
        if(b.type==="divider") return React.createElement("div",{key:idx,className:"my-12 text-center tracking-[12px]",style:{color:tp.accent2,opacity:0.25,fontSize:10}},"\u25C7\u25C6\u25C7");
        if(b.type==="code") return React.createElement("pre",{key:idx,className:"my-5 p-5 text-xs overflow-x-auto",style:{backgroundColor:"#2c2416",color:"#d4c5a9",border:"1px solid #4a3d2a"}},React.createElement("code",null,b.content));
        return null;
      }),
      React.createElement("footer",{className:"mt-16 pt-10 text-center relative"},
        React.createElement("div",{className:"absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1",style:{backgroundColor:bg,color:tp.accent,border:"1px solid "+tp.accent,fontSize:11}},"\u9898\u8BB0"),
        React.createElement("p",{className:"text-xs mt-4 tracking-wider",style:{color:tp.subColor}},"\u957F\u6309\u8BC6\u522B \u00B7 \u5173\u6CE8\u516C\u4F17\u53F7")));
  };
}

// ===== PickerCard =====
function PickerCard(props:{tp:Tpl;onClick:()=>void}){
  var t=props.tp;
  var isDark=!1, isWx=!1;
  var previewBg=t.cardBg;
  return React.createElement("button",{onClick:props.onClick,className:"text-left rounded-2xl border-2 transition-all hover:shadow-xl hover:scale-[1.02] overflow-hidden",style:{borderColor:t.cardBorder,backgroundColor:t.cardBg}},
    React.createElement("div",{className:"p-4",style:{backgroundColor:previewBg}},
      t.id==="minimal" && React.createElement("div",{className:"space-y-2 px-2 py-1"},
        React.createElement("div",{className:"w-3/5 h-3 rounded-sm",style:{backgroundColor:t.titleColor,opacity:0.8}}),
        React.createElement("div",{className:"w-1/3 h-0.5 rounded",style:{backgroundColor:t.accent,opacity:0.3}}),
        React.createElement("div",{className:"space-y-1 mt-2"},
          React.createElement("div",{className:"h-1.5 w-full rounded",style:{backgroundColor:t.textColor,opacity:0.1}}),
          React.createElement("div",{className:"h-1.5 w-4/5 rounded",style:{backgroundColor:t.textColor,opacity:0.08}}),
          React.createElement("div",{className:"h-1.5 w-3/5 rounded",style:{backgroundColor:t.textColor,opacity:0.06}}))),
      t.id==="literary" && React.createElement("div",{className:"text-center py-2 space-y-2"},
        React.createElement("div",{className:"inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[8px]",style:{backgroundColor:t.accent+"18",color:t.accent}},"\u273F 静心阅读 \u273F"),
        React.createElement("div",{className:"w-2/3 h-2.5 rounded mx-auto",style:{backgroundColor:t.titleColor,opacity:0.7}}),
        React.createElement("div",{className:"flex justify-center gap-1"},React.createElement("span",{className:"w-4 h-px",style:{backgroundColor:t.accent2,opacity:0.4}}),React.createElement("span",{className:"w-1 h-1 rounded-full",style:{backgroundColor:t.accent}}),React.createElement("span",{className:"w-4 h-px",style:{backgroundColor:t.accent2,opacity:0.4}}))),
      t.id==="business" && React.createElement("div",{className:"space-y-2 pl-1"},
        React.createElement("div",{className:"flex items-center gap-2 mb-2"},React.createElement("div",{className:"w-1 h-8 rounded",style:{backgroundColor:t.accent}}),React.createElement("div",null,React.createElement("div",{className:"h-2.5 w-20 rounded",style:{backgroundColor:t.titleColor,opacity:0.8}}),React.createElement("div",{className:"h-1 w-12 rounded mt-1",style:{backgroundColor:t.subColor,opacity:0.4}}))),
        React.createElement("div",{className:"h-1.5 w-4/5 rounded",style:{backgroundColor:t.textColor,opacity:0.12}}),
        React.createElement("div",{className:"h-1.5 w-3/5 rounded",style:{backgroundColor:t.textColor,opacity:0.08}}),
        React.createElement("div",{className:"flex items-center gap-2 mt-2"},React.createElement("div",{className:"w-5 h-5 rounded flex items-center justify-center text-[8px] text-white",style:{backgroundColor:t.accent}},"1"),React.createElement("div",{className:"w-16 h-1.5 rounded",style:{backgroundColor:t.textColor,opacity:0.12}}))),
      t.id==="tech" && React.createElement("div",{className:"rounded-xl p-3 space-y-2",style:{background:"linear-gradient(135deg,"+t.accent+"15,"+t.accent2+"10)"}},
        React.createElement("div",{className:"text-[8px] font-bold tracking-wider",style:{color:t.accent2}},"\u25C6 TECH \u25C6"),
        React.createElement("div",{className:"h-2.5 w-3/5 rounded",style:{backgroundColor:t.titleColor,opacity:0.8}}),
        React.createElement("div",{className:"flex gap-1.5"},React.createElement("span",{className:"px-2 py-0.5 rounded-full text-[7px]",style:{backgroundColor:t.cardBg,color:t.accent}},"深度"),React.createElement("span",{className:"px-2 py-0.5 rounded-full text-[7px]",style:{backgroundColor:t.cardBg,color:t.accent}},"数据"))),
      t.id==="warm" && React.createElement("div",{className:"text-center py-2 space-y-2"},
        React.createElement("div",{style:{fontSize:22}},String.fromCodePoint(127968)),
        React.createElement("div",{className:"w-2/3 h-2.5 rounded mx-auto",style:{backgroundColor:t.titleColor,opacity:0.7}}),
        React.createElement("div",{className:"flex items-center justify-center gap-1 text-[8px]",style:{color:t.subColor}},String.fromCodePoint(128197)," \u00B7 ",String.fromCodePoint(128150))),
      t.id==="chinese" && React.createElement("div",{className:"text-center py-2 space-y-2"},
        React.createElement("div",{className:"w-5 h-5 border-2 mx-auto flex items-center justify-center text-[8px] font-bold",style:{borderColor:t.accent,color:t.accent}},"\u5370"),
        React.createElement("div",{className:"w-2/3 h-2.5 rounded mx-auto",style:{backgroundColor:t.titleColor,opacity:0.7}}),
        React.createElement("div",{className:"flex items-center justify-center gap-2"},React.createElement("span",{className:"w-5 h-px",style:{backgroundColor:t.accent2,opacity:0.4}}),React.createElement("span",{className:"w-1 h-1",style:{backgroundColor:t.accent}}),React.createElement("span",{className:"w-5 h-px",style:{backgroundColor:t.accent2,opacity:0.4}}))),
      React.createElement("div",{className:"px-4 py-3 border-t",style:{borderColor:t.cardBorder}},
        React.createElement("div",{className:"text-sm font-bold",style:{color:t.titleColor}},t.name),
        React.createElement("div",{className:"text-xs mt-0.5",style:{color:t.subColor}},t.desc))));
}

// ===== Main Page =====
export default function DocNewPage() {
  var [step,setStep]=useState("template" as "template"|"edit"|"result");
  var [layout,setLayout]=useState("minimal" as Layout);
  var [input,setInput]=useState("");
  var [blocks,setBlocks]=useState([] as Block[]);
  var [title,setTitle]=useState("未命名文档");
  var [theme,setTheme]=useState("default" as Theme);
  var [copied,setCopied]=useState(false);
  var progress=useReadingProgress();

  var tpl=TP[layout];
  var thm=THEME_MODES[theme];
  var pageIsDark=theme==="dark";

  function cycleTheme(){var ks=["default","serif","dark","minimal"] as Theme[];setTheme(ks[(ks.indexOf(theme)+1)%ks.length]);}
  function doCopy(){var t=blocks.map(function(b){return b.type==="list"?(b.items||[]).join("\n"):b.content;}).join("\n\n");navigator.clipboard.writeText(t);setCopied(true);setTimeout(function(){setCopied(false);},2000);}
  function doTypeset(){
    if(!input.trim())return;
    var seg=smartSegment(input);
    var r=typeset(seg);
    r.blocks=attachSmartImages(r.blocks,tpl);
    setTitle(r.title);setBlocks(r.blocks);setStep("result");
    setTimeout(function(){window.scrollTo({top:0,behavior:"smooth"});},100);
  }

  var renderers={minimal:MZ, literary:LZ, business:BZ, tech:TZ, warm:WZ, chinese:CZ} as {[k:string]:(tp:Tpl)=>any};
  var Article=renderers[layout](tpl);

  return React.createElement("div",{className:"min-h-screen transition-colors duration-500",style:{backgroundColor:thm.pageBg,fontFamily:"system-ui"}},
    step==="result"&&React.createElement("div",{className:"fixed top-0 left-0 z-50 h-1 transition-all duration-150",style:{width:progress+"%",backgroundColor:tpl.accent}}),
    React.createElement("header",{className:"px-4 py-4 flex items-center gap-3 sticky top-0 z-40",style:{backgroundColor:thm.pageBg,borderBottom:"1px solid "+thm.border}},
      React.createElement(Link,{href:"/",className:"text-sm hover:opacity-70",style:{color:thm.text}},React.createElement("i",{className:"fas fa-arrow-left"})),
      React.createElement("span",{className:"font-semibold text-sm truncate",style:{color:pageIsDark?thm.text:tpl.titleColor}},step==="template"?"选择模板":title),
      React.createElement("div",{className:"ml-auto flex items-center gap-2"},
        step!=="template"&&React.createElement("button",{onClick:cycleTheme,className:"rounded-lg border px-3 py-1.5 text-xs hover:opacity-80",style:{borderColor:thm.border,color:thm.text}},
          React.createElement("i",{className:"fas fa-palette mr-1"}),"主题"),
        step==="edit"&&React.createElement("button",{onClick:doTypeset,className:"rounded-lg px-4 py-1.5 text-xs font-bold text-white hover:opacity-90",style:{backgroundColor:tpl.accent}},"开始排版"),
        step==="result"&&React.createElement("button",{onClick:doCopy,className:"rounded-lg px-4 py-1.5 text-xs font-bold text-white hover:opacity-90",style:{backgroundColor:tpl.accent}},
          React.createElement("i",{className:"fas "+(copied?"fa-check":"fa-copy")+" mr-1"}),copied?"已复制":"复制"))),
    step==="template"&&React.createElement("div",{className:"max-w-5xl mx-auto px-4 py-10"},
      React.createElement("h2",{className:"text-xl font-bold mb-2 text-center",style:{color:pageIsDark?thm.text:"#1a1a2e"}},"选择公众号排版"),
      React.createElement("p",{className:"text-sm mb-8 text-center",style:{color:thm.text}},"6 套微信公众号专属风格，覆盖主流内容类型"),
      React.createElement("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"},
        Object.values(TP).map(function(t){return React.createElement(PickerCard,{key:t.id,tp:t,onClick:function(){setLayout(t.id);setStep("edit");}});}))),
    step==="edit"&&React.createElement("div",{className:"max-w-4xl mx-auto px-4 py-8"},
      React.createElement("div",{className:"flex items-center gap-2 mb-4"},
        React.createElement("span",{className:"text-xs px-2.5 py-1 rounded-full text-white font-bold",style:{backgroundColor:tpl.accent}},tpl.name),
        React.createElement("button",{onClick:function(){setStep("template");},className:"text-xs underline",style:{color:thm.text}},"换模板")),
      React.createElement("p",{className:"text-xs mb-3",style:{color:thm.dim}},"支持：Markdown 语法 \u00B7 # 标题 \u00B7 ## 副标题 \u00B7 **加粗** \u00B7 - 列表 \u00B7 > 引用 \u00B7 --- 分隔 \u00B7 第X章 章节"),
      React.createElement("textarea",{value:input,onChange:function(e:any){setInput(e.target.value);},
        placeholder:"第一行为标题\n\n第1章 项目背景分析\n本章介绍项目启动的宏观环境。\n\n**核心结论：市场正经历结构性转变。**\n\n## 细分市场洞察\n\n- 第一代产品已进入成熟期\n- 新兴技术带来颠覆性机会\n- 用户习惯正在快速迁移\n\n> 行业专家指出：未来三年将出现三到五家百亿级平台。\n\n---\n\n第2章 战略执行路线图\n本章阐述具体落地计划。",
        className:"w-full h-96 rounded-xl border p-6 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all font-mono",
        style:{backgroundColor:pageIsDark?"#1e293b":"#ffffff",color:pageIsDark?thm.text:"#1c1d21",borderColor:pageIsDark?thm.border:"#e5e7eb"}})),
    step==="result"&&React.createElement("div",null,
      React.createElement("div",{className:"max-w-3xl mx-auto px-4 py-6"},
        React.createElement("div",{className:"flex items-center gap-2 mb-6"},
          React.createElement("span",{className:"text-xs px-2.5 py-1 rounded-full text-white font-bold",style:{backgroundColor:tpl.accent}},tpl.name)),
        React.createElement(Article,{blocks:blocks,title:title})),
      React.createElement("div",{className:"max-w-3xl mx-auto px-4 py-6 mt-6 flex flex-wrap items-center gap-3 justify-between",style:{borderTop:"1px solid "+thm.border}},
        React.createElement("button",{onClick:function(){setStep("edit");},className:"rounded-lg border px-4 py-2 text-sm hover:opacity-80",style:{borderColor:thm.border,color:thm.text}},
          React.createElement("i",{className:"fas fa-edit mr-1"}),"重新编辑"),
        React.createElement("div",{className:"flex gap-2"},
          React.createElement("button",{onClick:function(){setStep("template");},className:"rounded-lg border px-4 py-2 text-sm hover:opacity-80",style:{borderColor:thm.border,color:thm.text}},
            React.createElement("i",{className:"fas fa-th mr-1"}),"换模板"),
          React.createElement("button",{onClick:doCopy,className:"rounded-lg px-4 py-2 text-sm font-bold text-white hover:opacity-90",style:{backgroundColor:tpl.accent}},
            React.createElement("i",{className:"fas "+(copied?"fa-check":"fa-copy")+" mr-1"}),copied?"已复制":"复制全文")))));
}
