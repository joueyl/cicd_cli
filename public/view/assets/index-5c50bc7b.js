import{b as n}from"./operate-2c7e23a2.js";import{d as r,b as l,ab as c,g as i,A as f,B as s,E as d,V as u,o as p}from"./index-ae18c19e.js";const x={class:"h-full flex flex-col"},_=s("h1",{class:"text-2xl font-bold mb-2.5"},"日志",-1),v=r({__name:"index",setup(g){const t=l("");c(async()=>{const e=await n();t.value=e.data});const o=l();return i(()=>{var e;console.log((e=o.value)==null?void 0:e.clientHeight)}),(e,m)=>{var a;return p(),f("div",x,[_,s("div",{style:u({maxHeight:((a=o.value)==null?void 0:a.clientHeight)+"px"}),ref_key:"log",ref:o,class:"max-h-full flex-1 w-full bg-slate-400 whitespace-pre p-4 box-border rounded-2xl overflow-auto"},d(t.value),5)])}}});export{v as default};
