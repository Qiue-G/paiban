"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// ===== Types =====
type Theme = "default" | "serif" | "dark" | "minimal";
type BlockType = "title"|"toc"|"chapter"|"subchapter"|"paragraph"|"quote"|"list"|"code"|"image"|"divider";

interface Block { type:BlockType; content:string; items?:string[]; chapterNum?:number; imageUrl?:string; }

type Layout = "business"|"media"|"academic"|"resume"|"marketing"|"wechat";

interface Tpl { id:Layout; name:string; desc:string;
  pageBg:string; textColor:string; accent:string; accent2:string;
  titleColor:string; subColor:string; cardBg:string; cardBorder:string;
  fontFamily:string;
}

var TP:Record<Layout,Tpl> = {
  business:  { id:"business", name:"商务报告", desc:"左侧色条 · 超大编号 · 专业严谨",
    pageBg:"#ffffff", textColor:"#2c3e50", accent:"#2563eb", accent2:"#3b82f6",
    titleColor:"#1e293b", subColor:"#64748b", cardBg:"#f8fafc", cardBorder:"#e2e8f0", fontFamily:"system-ui" },
  media:     { id:"media", name:"新媒体图文", desc:"彩色卡片阵 · 圆角大图 · 社媒风格",
    pageBg:"#fdf6f0", textColor:"#3d2c1e", accent:"#ff6b35", accent2:"#ff8a60",
    titleColor:"#e85d2c", subColor:"#8b5e3c", cardBg:"#ffffff", cardBorder:"#ffe0d0", fontFamily:"system-ui" },
  academic:  { id:"academic", name:"学术论文", desc:"宋体/楷体 · 两端对齐 · 首行缩进 · 页眉",
    pageBg:"#fcfaf5", textColor:"#2c2c2c", accent:"#8b0000", accent2:"#a52a2a",
    titleColor:"#1a1a1a", subColor:"#666666", cardBg:"#fefefe", cardBorder:"#d4c5a9", fontFamily:"'Noto Serif SC', 'SimSun', serif" },
  resume:    { id:"resume", name:"简历名片", desc:"大留白 · 细线分隔 · 时间轴 · 极简克制",
    pageBg:"#ffffff", textColor:"#334155", accent:"#94a3b8", accent2:"#64748b",
    titleColor:"#0f172a", subColor:"#94a3b8", cardBg:"#ffffff", cardBorder:"#f1f5f9", fontFamily:"system-ui" },
  marketing: { id:"marketing", name:"营销落地页", desc:"深色渐变 · 大字报 · 霓虹高亮 · 冲击感",
    pageBg:"#0a0815", textColor:"#cbd5e1", accent:"#a855f7", accent2:"#c084fc",
    titleColor:"#ffffff", subColor:"#94a3b8", cardBg:"#141028", cardBorder:"#2d1f6e", fontFamily:"system-ui" },
  wechat:    { id:"wechat", name:"微信聊天风", desc:"气泡对话 · 手机边框 · 绿色主题 · 轻松",
    pageBg:"#ededed", textColor:"#333333", accent:"#07c160", accent2:"#2ecc71",
    titleColor:"#191919", subColor:"#888888", cardBg:"#ffffff", cardBorder:"#d9d9d9", fontFamily:"system-ui" },
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
  // Check if already has markdown markers
  for(var i=0;i<lines.length;i++){
    var l=lines[i].trim();
    if(/^#+ |^[-*>] |^```|^第[一二三四五六七八九十\d]+[章节篇部]|^Chapter\s+\d+/i.test(l)){hasMd=true;break;}
  }
  if(hasMd) return raw; // already markdown, pass through

  // Plain text: auto-detect structure
  var result:string[]=[], ch=0, inList=false;
  for(var i=0;i<lines.length;i++){
    var l=lines[i].trim();
    // Skip empty lines
    if(!l){inList=false;continue;}
    // Title: first non-empty line
    if(result.length===0){result.push("# "+l.slice(0,80));continue;}
    // Divider
    if(/^[-*_]{3,}$/.test(l)){result.push("---");inList=false;continue;}
    // Chapter detection: 第X章, X. title pattern, short standalone bold line
    if(/^第[一二三四五六七八九十\d]+[章节篇部]/.test(l)||/^(Chapter|Part)\s+\d+/i.test(l)){
      ch++;result.push("第"+ch+"章 "+l.replace(/^(第[一二三四五六七八九十\d]+[章节篇部]\s*)/,""));inList=false;continue;}
    // Numbered chapter: "一、xxx" "1. xxx" etc (but only if preceded by blank line and is standalone)
    if((/^[一二三四五六七八九十]+[、，,.]/.test(l)||/^\d+[.)]\s/.test(l))&&l.length<30&&(i===0||!lines[i-1].trim())){
      ch++;result.push("第"+ch+"章 "+l.replace(/^[一二三四五六七八九十\d]+\s*[、，,.。.)]\s*/,""));inList=false;continue;}
    // Sub heading: short line without end punctuation, preceded by blank line
    var prevBlank=i===0||!lines[i-1].trim();
    var noEndPunct=!/[。！？，、；：）\)""」』\.!\?,;:)$]$/.test(l);
    if(prevBlank&&l.length<35&&noEndPunct&&!/^[一二三四五六七八九十\d]+[、.)]/.test(l)&&!/^[（(]*[\u4e00-\u9fa5\w]/.test(l.slice(0,2))){
      result.push("## "+l);inList=false;continue;}
    // List detection: line starts with bullet-like pattern
    if(/^[-*•◦▪▸►→·]\s/.test(l)){result.push("- "+l.replace(/^[-*•◦▪▸►→·]\s*/,""));inList=true;continue;}
    // Numbered list
    if(/^\d+[.)]\s/.test(l)){result.push("- "+l.replace(/^\d+[.)]\s*/,""));inList=true;continue;}
    // Continuation of list (indented or similar)
    if(inList&&(l.startsWith("  ")||l.startsWith("\t"))){result.push("- "+l.trim());continue;}
    inList=false;
    // Quote: text in quotes or looks like a citation
    if(/^[""「『].+[""」』]$/.test(l)&&l.length>10&&prevBlank){result.push("> "+l.replace(/^[""「『]/,"").replace(/[""」』]$/,""));continue;}
    // Regular paragraph
    result.push(l);
  }
  // Merge consecutive paragraphs into one if no blank line between them
  var merged:string[]=[];
  for(var j=0;j<result.length;j++){
    var r=result[j];
    if(r.startsWith("# ")||r.startsWith("## ")||r.startsWith("- ")||r.startsWith("> ")||r.startsWith("---")||j===0){
      merged.push(r);continue;
    }
    var prev=merged[merged.length-1];
    if(prev&&!prev.startsWith("# ")&&!prev.startsWith("## ")&&!prev.startsWith("- ")&&!prev.startsWith("> ")&&!prev.startsWith("---")){
      merged[merged.length-1]=prev+"\n"+r;
    }else{
      merged.push(r);
    }
  }
  return merged.join("\n\n");
}

function typeset(text:string):{title:string;blocks:Block[]} {
  var lines=text.trim().split("\n"), blocks:Block[]=[], title="未命名文档", ch=0;
  for(var i=0;i<lines.length;i++){
    var line=lines[i].trim(); if(!line)continue;
    if(i===0){title=line.replace(/^#+\s*/,"").slice(0,60);blocks.push({type:"title",content:line.replace(/^#+\s*/,"")});continue;}
    if(/^[-*]{3,}$/.test(line)){blocks.push({type:"divider",content:""});continue;}
    if(/^第[一二三四五六七八九十\d]+[章节篇部]/.test(line)||/^[一二三四五六七八九十]+[、，,.]./.test(line)||/^Chapter\s+\d+/i.test(line)){ch++;blocks.push({type:"chapter",content:line.replace(/^#+\s*/,""),chapterNum:ch});continue;}
    if(/^#{2,3}\s/.test(line)){blocks.push({type:"subchapter",content:line.replace(/^#{2,3}\s*/,""),chapterNum:ch});continue;}
    if(line.startsWith("```")){var cl:string[]=[];i++;while(i<lines.length&&!lines[i].trim().startsWith("```")){cl.push(lines[i]);i++;}blocks.push({type:"code",content:cl.join("\n")});continue;}
    if(line.startsWith(">")){blocks.push({type:"quote",content:line.replace(/^>\s*/,"")});continue;}
    if(/^[-*•]\s/.test(line)){var li:string[]=[];while(i<lines.length&&/^[-*•]\s/.test(lines[i].trim())){li.push(lines[i].trim().replace(/^[-*•]\s*/,""));i++;}i--;blocks.push({type:"list",content:"",items:li});continue;}
    if(/^\d+[.)]\s/.test(line)){var nl:string[]=[];while(i<lines.length&&/^\d+[.)]\s/.test(lines[i].trim())){nl.push(lines[i].trim().replace(/^\d+[.)]\s*/,""));i++;}i--;blocks.push({type:"list",content:"",items:nl});continue;}
    blocks.push({type:"paragraph",content:line});
  }
  for(var k=0;k<blocks.length;k++){if(blocks[k].type==="paragraph"){blocks[k].content=blocks[k].content.replace(/\*\*(.+?)\*\*/g,"<b>$1</b>");}}
  var hd=blocks.filter(function(b){return b.type==="chapter"||b.type==="subchapter"});
  if(hd.length>=2){blocks.splice(blocks.findIndex(function(b){return b.type==="title"})+1,0,{type:"toc",content:"",items:hd.map(function(h){return h.type==="chapter"?(h.chapterNum+". "+h.content):"  "+h.content;})});}
  for(var j=0;j<blocks.length;j++){if(blocks[j].type==="chapter"&&j+1<blocks.length&&blocks[j+1].type!=="image"){blocks.splice(j+1,0,{type:"image",content:blocks[j].content,imageUrl:""});j++;}}
  return {title:title,blocks:blocks};
}

function useReadingProgress():number{var[p,sp]=useState(0);useEffect(function(){function f(){var h=document.documentElement.scrollHeight-window.innerHeight;sp(h>0?Math.min(100,Math.round((window.scrollY/h)*100)):0);}window.addEventListener("scroll",f,{passive:true});return function(){window.removeEventListener("scroll",f);};},[]);return p;}

function svgData(tp:Tpl,idx:number):string {
  var a=tp.accent,a2=tp.accent2,bg=tp.cardBg;
  var svgs=[
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="140"><rect fill="'+bg+'" width="800" height="140"/><circle cx="120" cy="70" r="30" fill="'+a+'" opacity="0.08"/><circle cx="250" cy="50" r="40" fill="'+a2+'" opacity="0.06"/><rect x="350" y="40" width="350" height="60" rx="8" fill="'+a+'" opacity="0.04"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="140"><rect fill="'+bg+'" width="800" height="140"/><line x1="100" y1="40" x2="700" y2="40" stroke="'+a+'" stroke-width="1" opacity="0.15"/><line x1="100" y1="70" x2="500" y2="70" stroke="'+a2+'" stroke-width="2" opacity="0.1"/><line x1="100" y1="100" x2="600" y2="100" stroke="'+a+'" stroke-width="1" opacity="0.08"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="140"><rect fill="'+bg+'" width="800" height="140"/><rect x="80" y="30" width="200" height="80" rx="12" fill="'+a+'" opacity="0.06"/><rect x="310" y="45" width="160" height="50" rx="8" fill="'+a2+'" opacity="0.05"/><rect x="500" y="35" width="220" height="70" rx="10" fill="'+a+'" opacity="0.07"/></svg>',
  ];
  return "data:image/svg+xml;base64,"+btoa(svgs[idx%3]);
}

// ====== RENDER: Business ======
function BZ(contentBg:string,tp:Tpl) {
  return function(props:{blocks:Block[]}) {
    return React.createElement("div",{className:"max-w-3xl mx-auto px-6 py-12",style:{backgroundColor:contentBg,fontFamily:tp.fontFamily}},
      props.blocks.map(function(b,idx){
        if(b.type==="title") return React.createElement("header",{key:idx,className:"mb-14"},
          React.createElement("h1",{className:"text-3xl font-black tracking-tight leading-tight",style:{color:tp.titleColor}},b.content),
          React.createElement("div",{className:"mt-4 w-16 h-1 rounded-full",style:{backgroundColor:tp.accent}}));
        if(b.type==="chapter") return React.createElement("section",{key:idx,className:"relative mt-16 mb-8",style:{scrollMarginTop:"5rem"}},
          React.createElement("span",{className:"absolute -top-10 -left-4 text-8xl font-black pointer-events-none leading-none",style:{color:tp.accent,opacity:0.06}},String(b.chapterNum||0).padStart(2,"0")),
          React.createElement("div",{className:"flex items-center gap-3 ml-2"},
            React.createElement("div",{className:"w-1 h-7 rounded-sm flex-shrink-0",style:{backgroundColor:tp.accent}}),
            React.createElement("h2",{className:"text-xl font-bold",style:{color:tp.titleColor}},b.content)));
        if(b.type==="subchapter") return React.createElement("h3",{key:idx,className:"text-base font-semibold mt-8 mb-4 ml-2",style:{color:tp.titleColor,scrollMarginTop:"5rem"}},b.content);
        if(b.type==="paragraph") return React.createElement("p",{key:idx,className:"mb-5 text-sm leading-loose ml-2",style:{color:tp.textColor,textAlign:"justify"},dangerouslySetInnerHTML:{__html:b.content}});
        if(b.type==="quote") return React.createElement("blockquote",{key:idx,className:"my-8 ml-2 pl-5 py-4 border-l-4 rounded-r-lg",style:{borderColor:tp.accent,backgroundColor:tp.cardBg+"cc"}},
          React.createElement("p",{className:"text-sm leading-relaxed italic",style:{color:tp.subColor}},b.content));
        if(b.type==="list") return React.createElement("ul",{key:idx,className:"my-5 ml-2 space-y-3"},
          (b.items||[]).map(function(item,j){return React.createElement("li",{key:j,className:"flex items-start gap-3 text-sm",style:{color:tp.textColor}},
            React.createElement("span",{className:"mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0",style:{backgroundColor:tp.accent,opacity:0.5}}),
            React.createElement("span",{className:"leading-relaxed",dangerouslySetInnerHTML:{__html:item}}));}));
        if(b.type==="image") return React.createElement("figure",{key:idx,className:"my-10 ml-2"},
          React.createElement("img",{src:svgData(tp,idx),alt:b.content,className:"w-full h-32 object-cover rounded-lg"+(tp.cardBorder?" border":"")}));
        if(b.type==="divider") return React.createElement("div",{key:idx,className:"my-10 ml-2 w-1/3 h-px",style:{backgroundColor:tp.accent,opacity:0.2}});
        if(b.type==="code") return React.createElement("pre",{key:idx,className:"my-6 ml-2 p-4 rounded-lg text-xs overflow-x-auto",style:{backgroundColor:"#1e293b",color:"#e2e8f0"}},React.createElement("code",null,b.content));
        if(b.type==="toc") return React.createElement("div",{key:idx,className:"my-8 ml-2 p-5 rounded-xl border",style:{borderColor:tp.cardBorder,backgroundColor:tp.cardBg}},
          React.createElement("p",{className:"text-xs font-bold uppercase tracking-wider mb-3",style:{color:tp.accent}},"目录"),
          React.createElement("ul",{className:"space-y-1.5"},(b.items||[]).map(function(t,i){return React.createElement("li",{key:i,className:"text-sm",style:{color:tp.subColor}},t);})));
        return null;
      }));
  };
}

// ====== RENDER: Media ======
function MZ(contentBg:string,tp:Tpl) {
  return function(props:{blocks:Block[]}) {
    return React.createElement("div",{className:"max-w-2xl mx-auto px-4 py-8",style:{backgroundColor:contentBg,fontFamily:tp.fontFamily}},
      props.blocks.map(function(b,idx){
        if(b.type==="title") return React.createElement("header",{key:idx,className:"mb-10 text-center"},
          React.createElement("span",{className:"inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4 text-white",style:{backgroundColor:tp.accent}},"新媒体图文"),
          React.createElement("h1",{className:"text-2xl font-extrabold leading-snug",style:{color:tp.titleColor}},b.content));
        if(b.type==="chapter") return React.createElement("section",{key:idx,className:"mt-10 mb-6",style:{scrollMarginTop:"5rem"}},
          React.createElement("div",{className:"flex items-center gap-3"},
            React.createElement("span",{className:"flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm",style:{backgroundColor:tp.accent}},b.chapterNum),
            React.createElement("h2",{className:"text-lg font-bold",style:{color:tp.titleColor}},b.content)));
        if(b.type==="subchapter") return React.createElement("h3",{key:idx,className:"text-base font-bold mt-6 mb-3",style:{color:tp.titleColor,scrollMarginTop:"5rem"}},b.content);
        if(b.type==="paragraph") return React.createElement("div",{key:idx,className:"mb-4 p-5 rounded-2xl border shadow-sm",style:{borderColor:tp.cardBorder,backgroundColor:tp.cardBg}},
          React.createElement("p",{className:"text-sm leading-relaxed",style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:b.content}}));
        if(b.type==="quote") return React.createElement("div",{key:idx,className:"mb-4 p-5 rounded-2xl border shadow-sm",style:{borderColor:tp.cardBorder,backgroundColor:tp.cardBg}},
          React.createElement("div",{className:"flex items-start gap-3"},
            React.createElement("span",{className:"text-3xl leading-none flex-shrink-0",style:{color:tp.accent,opacity:0.25}},"\u201C"),
            React.createElement("p",{className:"text-sm leading-relaxed italic",style:{color:tp.accent}},b.content)));
        if(b.type==="list") return React.createElement("div",{key:idx,className:"mb-4 p-5 rounded-2xl border shadow-sm",style:{borderColor:tp.cardBorder,backgroundColor:tp.cardBg}},
          React.createElement("ul",{className:"space-y-2.5"},(b.items||[]).map(function(item,j){return React.createElement("li",{key:j,className:"flex items-center gap-3 text-sm",style:{color:tp.textColor}},
            React.createElement("span",{className:"flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm",style:{backgroundColor:tp.accent2}},j+1),
            React.createElement("span",{dangerouslySetInnerHTML:{__html:item}}));})));
        if(b.type==="image") return React.createElement("img",{key:idx,src:svgData(tp,idx),alt:b.content,className:"w-full h-44 object-cover rounded-2xl my-6 shadow-md"});
        if(b.type==="divider") return React.createElement("div",{key:idx,className:"my-8 flex justify-center"},React.createElement("svg",{width:50,height:12,viewBox:"0 0 50 12"},React.createElement("circle",{cx:8,cy:6,r:3,fill:tp.accent,opacity:0.3}),React.createElement("circle",{cx:25,cy:6,r:4,fill:tp.accent,opacity:0.5}),React.createElement("circle",{cx:42,cy:6,r:3,fill:tp.accent,opacity:0.3})));
        if(b.type==="code") return React.createElement("pre",{key:idx,className:"my-4 p-4 rounded-2xl text-xs overflow-x-auto",style:{backgroundColor:"#1e293b",color:"#e2e8f0"}},React.createElement("code",null,b.content));
        if(b.type==="toc") return React.createElement("div",{key:idx,className:"my-6 p-5 rounded-2xl border shadow-sm",style:{borderColor:tp.cardBorder,backgroundColor:tp.cardBg}},
          React.createElement("p",{className:"text-xs font-bold mb-3",style:{color:tp.accent}},"\uD83D\uDCCB 本文目录"),
          React.createElement("ul",{className:"space-y-1.5"},(b.items||[]).map(function(t,i){return React.createElement("li",{key:i,className:"text-sm",style:{color:tp.subColor}},t);})));
        return null;
      }));
  };
}

// ====== RENDER: Academic ======
function AZ(contentBg:string,tp:Tpl) {
  return function(props:{blocks:Block[]}) {
    return React.createElement("div",{className:"max-w-2xl mx-auto px-8 py-12",style:{backgroundColor:contentBg,fontFamily:tp.fontFamily}},
      React.createElement("div",{className:"text-center mb-2 text-xs tracking-widest uppercase",style:{color:tp.subColor}},"\u2500\u2500 学术排版 \u2500\u2500"),
      props.blocks.map(function(b,idx){
        if(b.type==="title") return React.createElement("header",{key:idx,className:"mb-12 text-center"},
          React.createElement("h1",{className:"text-2xl font-bold tracking-wide leading-relaxed",style:{color:tp.titleColor}},b.content),
          React.createElement("div",{className:"mt-4 w-12 h-0.5 mx-auto",style:{backgroundColor:tp.accent}}));
        if(b.type==="chapter") return React.createElement("section",{key:idx,className:"mt-12 mb-6",style:{scrollMarginTop:"5rem"}},
          React.createElement("h2",{className:"text-lg font-bold tracking-wider",style:{color:tp.titleColor}},
            React.createElement("span",{className:"mr-3",style:{color:tp.accent,fontWeight:400}},String(b.chapterNum)+"."),b.content));
        if(b.type==="subchapter") return React.createElement("h3",{className:"text-base font-bold mt-6 mb-3",key:idx,style:{color:tp.titleColor,scrollMarginTop:"5rem"}},b.content);
        if(b.type==="paragraph") return React.createElement("p",{key:idx,className:"mb-4 text-sm leading-loose",style:{color:tp.textColor,textIndent:"2em",textAlign:"justify"},dangerouslySetInnerHTML:{__html:b.content}});
        if(b.type==="quote") return React.createElement("blockquote",{key:idx,className:"my-8 ml-8 pl-6 py-4 border-l-2 text-sm leading-relaxed italic",style:{borderColor:tp.accent,backgroundColor:"rgba(0,0,0,0.015)"},dangerouslySetInnerHTML:{__html:b.content}});
        if(b.type==="list") return React.createElement("ol",{key:idx,className:"my-4 ml-12 space-y-1.5 text-sm",style:{color:tp.textColor,listStyleType:"decimal"}},
          (b.items||[]).map(function(item,j){return React.createElement("li",{key:j,className:"leading-relaxed",dangerouslySetInnerHTML:{__html:item}});}));
        if(b.type==="image") return React.createElement("figure",{key:idx,className:"my-10 text-center"},
          React.createElement("img",{src:svgData(tp,idx),alt:b.content,className:"max-w-full h-28 object-cover mx-auto border",style:{borderColor:tp.cardBorder}}),
          React.createElement("figcaption",{className:"text-xs mt-2",style:{color:tp.subColor}},"\u56FE "+idx+": "+b.content));
        if(b.type==="divider") return React.createElement("div",{key:idx,className:"my-10 text-center text-sm tracking-widest",style:{color:tp.subColor}},"*  *  *");
        if(b.type==="code") return React.createElement("pre",{key:idx,className:"my-6 p-4 text-xs overflow-x-auto border",style:{backgroundColor:"#f5f5f5",borderColor:tp.cardBorder}},React.createElement("code",null,b.content));
        if(b.type==="toc") return React.createElement("div",{key:idx,className:"my-8 p-5 border-t border-b",style:{borderColor:tp.cardBorder}},
          React.createElement("p",{className:"text-xs font-bold tracking-wider mb-3 text-center",style:{color:tp.accent}},"\u76EE \u5F55"),
          React.createElement("ul",{className:"space-y-1.5"},(b.items||[]).map(function(t,i){return React.createElement("li",{key:i,className:"text-sm",style:{color:tp.subColor}},t);})));
        return null;
      }),
      React.createElement("div",{className:"mt-12 pt-6 text-center text-xs",style:{color:tp.subColor,borderTop:"1px solid "+tp.cardBorder}},"\u2014 \u672C\u6587\u7ED3\u675F \u2014"));
  };
}

// ====== RENDER: Resume ======
function RZ(contentBg:string,tp:Tpl) {
  return function(props:{blocks:Block[]}) {
    return React.createElement("div",{className:"max-w-2xl mx-auto px-8 py-16",style:{backgroundColor:contentBg,fontFamily:tp.fontFamily}},
      props.blocks.map(function(b,idx){
        if(b.type==="title") return React.createElement("header",{key:idx,className:"mb-16"},
          React.createElement("h1",{className:"text-lg font-light tracking-[0.3em] uppercase",style:{color:tp.titleColor}},b.content),
          React.createElement("div",{className:"mt-5 w-6 h-px",style:{backgroundColor:tp.accent}}));
        if(b.type==="chapter") return React.createElement("section",{key:idx,className:"mt-14 mb-6",style:{scrollMarginTop:"5rem"}},
          React.createElement("span",{className:"text-[10px] tracking-[0.3em] uppercase block mb-2",style:{color:tp.accent}},String(b.chapterNum||0).padStart(2,"0")),
          React.createElement("h2",{className:"text-sm font-medium",style:{color:tp.titleColor}},b.content),
          React.createElement("div",{className:"mt-3 w-full h-px",style:{backgroundColor:tp.cardBorder}}));
        if(b.type==="subchapter") return React.createElement("h3",{key:idx,className:"text-xs font-medium mt-8 mb-3",style:{color:tp.titleColor,scrollMarginTop:"5rem"}},b.content);
        if(b.type==="paragraph") return React.createElement("p",{key:idx,className:"mb-5 text-sm leading-loose",style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:b.content}});
        if(b.type==="quote") return React.createElement("div",{key:idx,className:"my-8 pl-6 text-sm leading-relaxed",style:{borderLeft:"1px solid "+tp.accent,color:tp.subColor}},b.content);
        if(b.type==="list") return React.createElement("ul",{key:idx,className:"my-5 space-y-2.5"},(b.items||[]).map(function(item,j){
          return React.createElement("li",{key:j,className:"flex items-start gap-3 text-sm",style:{color:tp.textColor}},
            React.createElement("span",{className:"mt-1 flex-shrink-0 opacity-25",style:{color:tp.accent}},"\u2014"),
            React.createElement("span",{className:"leading-relaxed",dangerouslySetInnerHTML:{__html:item}}));}));
        if(b.type==="image") return React.createElement("img",{key:idx,src:svgData(tp,idx),alt:b.content,className:"w-full h-28 object-cover my-10",style:{opacity:0.6}});
        if(b.type==="divider") return React.createElement("div",{key:idx,className:"my-10 w-full h-px",style:{backgroundColor:tp.cardBorder}});
        if(b.type==="code") return React.createElement("pre",{key:idx,className:"my-6 p-4 text-xs overflow-x-auto",style:{backgroundColor:"#f8fafc",border:"1px solid "+tp.cardBorder}},React.createElement("code",null,b.content));
        if(b.type==="toc") return React.createElement("div",{key:idx,className:"my-10"},
          React.createElement("p",{className:"text-[10px] tracking-[0.3em] uppercase mb-5",style:{color:tp.accent}},"Contents"),
          React.createElement("ul",{className:"space-y-2"},(b.items||[]).map(function(t,i){return React.createElement("li",{key:i,className:"text-sm",style:{color:tp.subColor}},t);})));
        return null;
      }));
  };
}

// ====== RENDER: Marketing ======
function KT(contentBg:string,tp:Tpl) {
  return function(props:{blocks:Block[]}) {
    return React.createElement("div",{className:"max-w-2xl mx-auto px-6 py-10",style:{backgroundColor:contentBg,fontFamily:tp.fontFamily}},
      props.blocks.map(function(b,idx){
        if(b.type==="title") return React.createElement("header",{key:idx,className:"mb-12 p-8 -mx-6 text-center rounded-3xl",style:{background:"linear-gradient(135deg, "+tp.accent+" 0%, "+tp.accent2+" 100%)"}},
          React.createElement("span",{className:"inline-block px-3 py-1 rounded-full text-xs font-bold mb-4",style:{backgroundColor:"rgba(255,255,255,0.2)",color:"#fff"}},"\uD83D\uDD25 TRENDING"),
          React.createElement("h1",{className:"text-3xl font-black leading-tight text-white"},b.content));
        if(b.type==="chapter") return React.createElement("section",{key:idx,className:"mt-14 mb-8",style:{scrollMarginTop:"5rem"}},
          React.createElement("span",{className:"text-xs tracking-[0.3em] uppercase block mb-3 font-bold",style:{color:tp.accent2}},"Part "+String(b.chapterNum).padStart(2,"0")),
          React.createElement("h2",{className:"text-2xl font-black",style:{color:tp.titleColor}},b.content));
        if(b.type==="subchapter") return React.createElement("h3",{key:idx,className:"text-lg font-bold mt-8 mb-4",style:{color:tp.titleColor,scrollMarginTop:"5rem"}},b.content);
        if(b.type==="paragraph") return React.createElement("p",{key:idx,className:"mb-6 text-base leading-loose",style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:b.content}});
        if(b.type==="quote") return React.createElement("div",{key:idx,className:"my-8 p-6 rounded-xl border",style:{borderColor:tp.accent+"44",background:"linear-gradient(135deg, "+tp.accent+"18, "+tp.accent2+"08)"}},
          React.createElement("p",{className:"text-lg leading-relaxed font-bold text-center",style:{color:tp.titleColor}},"\u201C"+b.content+"\u201D"));
        if(b.type==="list") return React.createElement("ul",{key:idx,className:"my-6 space-y-3"},(b.items||[]).map(function(item,j){
          return React.createElement("li",{key:j,className:"flex items-start gap-3 py-2 px-4 rounded-lg",style:{backgroundColor:tp.cardBg}},
            React.createElement("span",{className:"flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",style:{backgroundColor:tp.accent,color:"#fff"}},"\u2713"),
            React.createElement("span",{className:"text-sm leading-relaxed font-medium",style:{color:tp.textColor},dangerouslySetInnerHTML:{__html:item}}));}));
        if(b.type==="image") return React.createElement("img",{key:idx,src:svgData(tp,idx),alt:b.content,className:"w-full h-40 object-cover rounded-2xl my-8",style:{opacity:0.7}});
        if(b.type==="divider") return React.createElement("div",{key:idx,className:"my-10 w-full h-px",style:{background:"linear-gradient(90deg, transparent, "+tp.accent+"44, transparent)"}});
        if(b.type==="code") return React.createElement("pre",{key:idx,className:"my-6 p-5 rounded-xl text-xs overflow-x-auto",style:{backgroundColor:tp.cardBg,color:tp.textColor,border:"1px solid "+tp.cardBorder}},React.createElement("code",null,b.content));
        if(b.type==="toc") return React.createElement("div",{key:idx,className:"my-8 p-5 rounded-xl border",style:{borderColor:tp.cardBorder,backgroundColor:tp.cardBg}},
          React.createElement("p",{className:"text-xs font-bold uppercase tracking-wider mb-3",style:{color:tp.accent2}},"\uD83D\uDCCD In This Article"),
          React.createElement("ul",{className:"space-y-1.5"},(b.items||[]).map(function(t,i){return React.createElement("li",{key:i,className:"text-sm",style:{color:tp.textColor}},t);})));
        return null;
      }));
  };
}

// ====== RENDER: WeChat ======
function WZ(contentBg:string,tp:Tpl) {
  return function(props:{blocks:Block[];title?:string}) {
    return React.createElement("div",{className:"max-w-sm mx-auto",style:{backgroundColor:contentBg,fontFamily:tp.fontFamily,borderRadius:24,overflow:"hidden",boxShadow:"0 0 0 3px #1a1a1a, 0 0 0 6px #333, 0 20px 60px rgba(0,0,0,0.3)"}},
      // phone notch
      React.createElement("div",{className:"h-8 flex items-center justify-center",style:{backgroundColor:"#1a1a1a"}},
        React.createElement("div",{className:"w-16 h-1.5 rounded-full",style:{backgroundColor:"#444"}})),
      // status bar
      React.createElement("div",{className:"px-4 py-2 flex items-center justify-between text-[10px] font-medium",style:{backgroundColor:"#1a1a1a",color:"#fff"}},
        React.createElement("span",null,"9:41"),
        React.createElement("span",null,"\uD83D\uDCF6 \uD83D\uDD0B")),
      // chat header
      React.createElement("div",{className:"px-4 py-2.5 flex items-center gap-2 border-b",style:{backgroundColor:tp.cardBg,borderColor:tp.cardBorder}},
        React.createElement("div",{className:"w-8 h-8 rounded-full",style:{backgroundColor:tp.accent,opacity:0.2}}),
        React.createElement("span",{className:"text-sm font-bold flex-1",style:{color:tp.titleColor}},props.title||"排版预览"),
        React.createElement("span",{style:{color:tp.accent,fontSize:18}},"\u22EE")),
      // messages
      React.createElement("div",{className:"px-3 py-3 min-h-[500px] overflow-y-auto",style:{backgroundColor:tp.pageBg}},
        React.createElement("div",{className:"flex justify-center mb-6"},
          React.createElement("span",{className:"text-[10px] px-2 py-0.5 rounded",style:{backgroundColor:"rgba(0,0,0,0.1)",color:tp.subColor}},"今天")),
        props.blocks.map(function(b,idx){
          if(b.type==="title") return React.createElement("div",{key:idx,className:"flex justify-center my-4"},
            React.createElement("div",{className:"max-w-[85%] px-4 py-2.5 rounded-2xl",style:{backgroundColor:tp.accent,color:"#fff",borderRadius:"16px 4px 16px 16px",fontWeight:700,fontSize:15}},
              b.content));
          if(b.type==="chapter") return React.createElement("div",{key:idx,className:"flex justify-center my-5"},
            React.createElement("span",{className:"text-[10px] px-3 py-1 rounded-full",style:{backgroundColor:"rgba(0,0,0,0.1)",color:tp.subColor}},b.content));
          if(b.type==="subchapter") return React.createElement("div",{key:idx,className:"flex justify-center my-4"},
            React.createElement("div",{className:"max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-bold",style:{backgroundColor:tp.cardBg,borderRadius:"16px 16px 16px 4px",color:tp.titleColor,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}},b.content));
          var isMe = idx%2===0;
          if(b.type==="paragraph") return React.createElement("div",{key:idx,className:"flex mb-3 "+(isMe?"":"justify-end")},
            React.createElement("div",{className:"max-w-[80%] px-4 py-2.5 text-sm leading-relaxed",style:{backgroundColor:isMe?tp.cardBg:tp.accent,color:isMe?tp.textColor:"#fff",borderRadius:isMe?"4px 16px 16px 16px":"16px 4px 16px 16px",boxShadow:"0 1px 2px rgba(0,0,0,0.06)"},dangerouslySetInnerHTML:{__html:b.content}}));
          if(b.type==="quote") return React.createElement("div",{key:idx,className:"flex justify-center my-4"},
            React.createElement("div",{className:"max-w-[85%] px-4 py-3 rounded-2xl text-sm italic",style:{backgroundColor:"rgba(0,0,0,0.04)",color:tp.subColor,borderRadius:"12px 12px 12px 12px"}},b.content));
          if(b.type==="list") return React.createElement("div",{key:idx,className:"flex flex-col "+(isMe?"items-start":"items-end")+" my-3"},
            (b.items||[]).map(function(item,j){return React.createElement("div",{key:j,className:"mb-2 max-w-[80%] px-4 py-2.5 text-sm leading-relaxed",style:{backgroundColor:isMe?tp.cardBg:tp.accent,color:isMe?tp.textColor:"#fff",borderRadius:isMe?"4px 16px 16px 16px":"16px 4px 16px 16px",boxShadow:"0 1px 2px rgba(0,0,0,0.06)"},dangerouslySetInnerHTML:{__html:item}});}));
          if(b.type==="image") return React.createElement("div",{key:idx,className:"flex justify-center my-4"},
            React.createElement("img",{src:svgData(tp,idx),alt:b.content,className:"max-w-[75%] h-28 object-cover rounded-xl"}));
          if(b.type==="divider") return React.createElement("div",{key:idx,className:"flex justify-center my-4"},
            React.createElement("span",{className:"text-xs",style:{color:tp.subColor}},"\u00B7 \u00B7 \u00B7"));
          return null;
        })),
      // input bar
      React.createElement("div",{className:"px-3 py-2.5 flex items-center gap-2 border-t",style:{backgroundColor:tp.cardBg,borderColor:tp.cardBorder}},
        React.createElement("div",{className:"flex-1 h-9 rounded-full border px-3 flex items-center text-xs",style:{borderColor:tp.cardBorder,color:tp.subColor}},"\u270D\uFE0F 输入消息..."),
        React.createElement("div",{className:"w-9 h-9 rounded-full flex items-center justify-center text-white text-xs",style:{backgroundColor:tp.accent}},"+")),
      // home bar
      React.createElement("div",{className:"h-7 flex items-center justify-center",style:{backgroundColor:tp.cardBg}},
        React.createElement("div",{className:"w-28 h-1 rounded-full",style:{backgroundColor:"rgba(0,0,0,0.2)"}})),
    React.createElement("div",{className:"text-center text-[10px] py-1",style:{color:tp.subColor}},tp.name));
  };
}

// ===== Template picker cards =====
function PickerCard(props:{tp:Tpl;onClick:()=>void}) {
  var t=props.tp;
  var isDark=t.id==="marketing", isWx=t.id==="wechat";
  var previewBg=isDark?t.pageBg:isWx?t.pageBg:t.cardBg;
  return React.createElement("button",{onClick:props.onClick,className:"text-left rounded-2xl border-2 transition-all hover:shadow-xl hover:scale-[1.02] overflow-hidden",style:{borderColor:isDark?t.cardBorder:t.cardBorder,backgroundColor:t.cardBg}},
    // preview strip
    React.createElement("div",{className:"p-4",style:{backgroundColor:previewBg}},
      t.id==="business" && React.createElement("div",null,
        React.createElement("div",{className:"flex items-center gap-2 mb-2"},React.createElement("div",{className:"w-1 h-4 rounded-sm",style:{backgroundColor:t.accent}}),React.createElement("div",{className:"h-2.5 w-24 rounded",style:{backgroundColor:t.titleColor,opacity:0.8}})),
        React.createElement("div",{className:"flex gap-1.5 mb-2"},React.createElement("div",{className:"h-1.5 w-full rounded",style:{backgroundColor:t.textColor,opacity:0.15}}),React.createElement("div",{className:"h-1.5 w-2/3 rounded",style:{backgroundColor:t.textColor,opacity:0.1}})),
        React.createElement("div",{className:"flex gap-1.5"},React.createElement("div",{className:"h-1.5 w-5/6 rounded",style:{backgroundColor:t.textColor,opacity:0.15}}),React.createElement("div",{className:"h-1.5 w-1/2 rounded",style:{backgroundColor:t.textColor,opacity:0.1}}))),
      t.id==="media" && React.createElement("div",{className:"space-y-2"},
        React.createElement("div",{className:"flex items-center gap-2"},React.createElement("div",{className:"w-6 h-6 rounded-lg flex-shrink-0",style:{backgroundColor:t.accent}}),React.createElement("div",{className:"h-2 w-20 rounded-full",style:{backgroundColor:t.accent,opacity:0.3}})),
        React.createElement("div",{className:"h-14 rounded-xl border",style:{backgroundColor:t.cardBg,borderColor:t.cardBorder}})),
      t.id==="academic" && React.createElement("div",{className:"text-center space-y-1.5"},
        React.createElement("div",{className:"h-3 w-28 mx-auto rounded",style:{backgroundColor:t.titleColor,opacity:0.9}}),
        React.createElement("div",{className:"h-0.5 w-8 mx-auto rounded",style:{backgroundColor:t.accent}}),
        React.createElement("div",{className:"h-1.5 w-full rounded",style:{backgroundColor:t.textColor,opacity:0.08}}),
        React.createElement("div",{className:"h-1.5 w-5/6 mx-auto rounded",style:{backgroundColor:t.textColor,opacity:0.08}}),
        React.createElement("div",{className:"h-1.5 w-4/6 mx-auto rounded",style:{backgroundColor:t.textColor,opacity:0.06}})),
      t.id==="resume" && React.createElement("div",{className:"space-y-3"},
        React.createElement("div",{className:"flex items-center gap-3"},React.createElement("div",{className:"h-2 w-16 rounded",style:{backgroundColor:t.accent,opacity:0.5}}),React.createElement("div",{className:"flex-1 h-px",style:{backgroundColor:t.cardBorder}})),
        React.createElement("div",{className:"h-1.5 w-3/4 rounded",style:{backgroundColor:t.textColor,opacity:0.1}}),
        React.createElement("div",{className:"h-1.5 w-1/2 rounded",style:{backgroundColor:t.textColor,opacity:0.08}}),
        React.createElement("div",{className:"h-1.5 w-2/3 rounded",style:{backgroundColor:t.textColor,opacity:0.1}})),
      t.id==="marketing" && React.createElement("div",{className:"space-y-2.5"},
        React.createElement("div",{className:"h-16 rounded-xl",style:{background:"linear-gradient(135deg, "+t.accent+"dd, "+t.accent2+"dd)"}}),
        React.createElement("div",{className:"h-2 w-24 rounded",style:{backgroundColor:t.textColor,opacity:0.3}}),
        React.createElement("div",{className:"h-1.5 w-full rounded",style:{backgroundColor:t.textColor,opacity:0.1}})),
      t.id==="wechat" && React.createElement("div",{className:"space-y-2"},
        React.createElement("div",{className:"flex justify-center"},React.createElement("div",{className:"h-2 w-16 rounded-full",style:{backgroundColor:t.subColor,opacity:0.3}})),
        React.createElement("div",{className:"h-4 w-3/4 rounded-2xl",style:{backgroundColor:t.cardBg,borderRadius:"4px 12px 12px 12px"}}),
        React.createElement("div",{className:"flex justify-end"},React.createElement("div",{className:"h-4 w-1/2 rounded-2xl",style:{backgroundColor:t.accent,borderRadius:"12px 4px 12px 12px"}})),
        React.createElement("div",{className:"h-4 w-2/3 rounded-2xl",style:{backgroundColor:t.cardBg,borderRadius:"4px 12px 12px 12px"}}))),
    // label
    React.createElement("div",{className:"px-4 py-3 border-t",style:{borderColor:t.cardBorder}},
      React.createElement("div",{className:"text-sm font-bold",style:{color:t.titleColor}},t.name),
      React.createElement("div",{className:"text-xs mt-0.5",style:{color:t.subColor}},t.desc))
  );
}

// ===== Main Page =====
export default function DocNewPage() {
  var [step,setStep]=useState("template" as "template"|"edit"|"result");
  var [layout,setLayout]=useState("business" as Layout);
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
  function doTypeset(){if(!input.trim())return;var r=typeset(smartSegment(input));setTitle(r.title);setBlocks(r.blocks);setStep("result");setTimeout(function(){window.scrollTo({top:0,behavior:"smooth"});},100);}

  // Pick renderer
  var renderers={business:BZ, media:MZ, academic:AZ, resume:RZ, marketing:KT, wechat:WZ} as {[k:string]:(bg:string,tp:Tpl)=>any};
  var Article=renderers[layout](tpl.pageBg,tpl);

  return React.createElement("div",{className:"min-h-screen transition-colors duration-500",style:{backgroundColor:thm.pageBg,fontFamily:"system-ui"}},
    // progress bar
    step==="result"&&React.createElement("div",{className:"fixed top-0 left-0 z-50 h-1 transition-all duration-150",style:{width:progress+"%",backgroundColor:tpl.accent}}),
    // header
    React.createElement("header",{className:"px-4 py-4 flex items-center gap-3 sticky top-0 z-40",style:{backgroundColor:thm.pageBg,borderBottom:"1px solid "+thm.border}},
      React.createElement(Link,{href:"/",className:"text-sm hover:opacity-70",style:{color:thm.text}},React.createElement("i",{className:"fas fa-arrow-left"})),
      React.createElement("span",{className:"font-semibold text-sm truncate",style:{color:pageIsDark?thm.text:tpl.titleColor}},step==="template"?"选择模板":title),
      React.createElement("div",{className:"ml-auto flex items-center gap-2"},
        step!=="template"&&React.createElement("button",{onClick:cycleTheme,className:"rounded-lg border px-3 py-1.5 text-xs hover:opacity-80",style:{borderColor:thm.border,color:thm.text}},
          React.createElement("i",{className:"fas fa-palette mr-1"}),"主题"),
        step==="edit"&&React.createElement("button",{onClick:doTypeset,className:"rounded-lg px-4 py-1.5 text-xs font-bold text-white hover:opacity-90",style:{backgroundColor:tpl.accent}},"开始排版"),
        step==="result"&&React.createElement("button",{onClick:doCopy,className:"rounded-lg px-4 py-1.5 text-xs font-bold text-white hover:opacity-90",style:{backgroundColor:tpl.accent}},
          React.createElement("i",{className:"fas "+(copied?"fa-check":"fa-copy")+" mr-1"}),copied?"已复制":"复制"))),
    // Template picker
    step==="template"&&React.createElement("div",{className:"max-w-5xl mx-auto px-4 py-10"},
      React.createElement("h2",{className:"text-xl font-bold mb-2 text-center",style:{color:pageIsDark?thm.text:"#1a1a2e"}},"选择排版模板"),
      React.createElement("p",{className:"text-sm mb-8 text-center",style:{color:thm.text}},"6 套独立视觉风格，每种都是完全不同的阅读体验"),
      React.createElement("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"},
        Object.values(TP).map(function(t){return React.createElement(PickerCard,{key:t.id,tp:t,onClick:function(){setLayout(t.id);setStep("edit");}});}))),
    // Editor
    step==="edit"&&React.createElement("div",{className:"max-w-4xl mx-auto px-4 py-8"},
      React.createElement("div",{className:"flex items-center gap-2 mb-4"},
        React.createElement("span",{className:"text-xs px-2.5 py-1 rounded-full text-white font-bold",style:{backgroundColor:tpl.accent}},tpl.name),
        React.createElement("button",{onClick:function(){setStep("template");},className:"text-xs underline",style:{color:thm.text}},"换模板")),
      React.createElement("p",{className:"text-xs mb-3",style:{color:thm.dim}},"支持：Markdown 语法 · # 标题 · ## 副标题 · **加粗** · - 列表 · > 引用 · --- 分隔 · 第X章 章节"),
      React.createElement("textarea",{value:input,onChange:function(e:any){setInput(e.target.value);},
        placeholder:"第一行为标题\n\n第1章 项目背景分析\n本章介绍项目启动的宏观环境。\n\n**核心结论：市场正经历结构性转变。**\n\n## 细分市场洞察\n\n- 第一代产品已进入成熟期\n- 新兴技术带来颠覆性机会\n- 用户习惯正在快速迁移\n\n> 行业专家指出：未来三年将出现三到五家百亿级平台。\n\n---\n\n第2章 战略执行路线图\n本章阐述具体落地计划。",
        className:"w-full h-96 rounded-xl border p-6 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all font-mono",
        style:{backgroundColor:pageIsDark?"#1e293b":"#ffffff",color:pageIsDark?thm.text:"#1c1d21",borderColor:pageIsDark?thm.border:"#e5e7eb"}})),
    // Result
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
            React.createElement("i",{className:"fas fa-th-large mr-1"}),"换模板"),
          React.createElement("button",{onClick:doCopy,className:"rounded-lg px-4 py-2 text-sm font-bold text-white hover:opacity-90",style:{backgroundColor:tpl.accent}},
            React.createElement("i",{className:"fas "+(copied?"fa-check":"fa-copy")+" mr-1"}),copied?"已复制":"复制全文")))));
}
