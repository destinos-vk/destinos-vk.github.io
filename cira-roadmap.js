/*
=========================================================
CIRA CLUB — Shared Issue Road Map
File: cira-roadmap.js
Version: 1.6
Status: PILOT SHARED COMPONENT
Date: 2026-09-30

Purpose:
One shared Road Map renderer for all CIRA CLUB Issue pages.

IMPORTANT:
- Internal methodological STOP order is fixed.
- Public links are enabled only when a real page exists.
- No dead links are generated.
- Shared component URL is canonical and unversioned.
- NEWS-001 uses absolute routes while production is split
  between espanamania.es and GitHub Pages.
=========================================================
*/
(function(){
  "use strict";
  const COMPONENT_VERSION="1.6";
  const STOP_DEFINITIONS=[
    {id:1,label:"Listen"},
    {id:2,label:"Language"},
    {id:3,label:"Fluency Training"},
    {id:4,label:"Pattern Drills"},
    {id:5,label:"Recombination"},
    {id:6,label:"Conversation Stimulus"}
  ];
  const ISSUE_ROUTES={
    "NEWS-001":{
      1:"https://espanamania.es/ciraclub/cira-club-homepage/",
      2:"https://espanamania.es/ciraclub/CIRA-NEWS-001-Vocabulary/",
      3:"https://espanamania.es/ciraclub/NEWS-001-AD10-BBU/",
      4:"https://espanamania.es/ciraclub/drills/CIRA-NEWS-AD31/",
      5:"https://espanamania.es/ciraclub/drills/CIRA-NEWS-AD40/",
      6:"https://destinos-vk.github.io/ciraclub/drills/CIRA-NEWS-AD70/"
    }
  };
  const PAGE_ROUTES={
    "NEWS-001":{
      listen:"https://espanamania.es/ciraclub/cira-club-homepage/",
      vocabulary:"https://espanamania.es/ciraclub/CIRA-NEWS-001-Vocabulary/",
      grammar:"https://espanamania.es/ciraclub/CIRA-NEWS-001-GRAMMA/",
      bbu:"https://espanamania.es/ciraclub/NEWS-001-AD10-BBU/",
      fluency:"https://espanamania.es/ciraclub/CIRA-NEWS-001-AD20-Fluency/",
      substitution:"https://espanamania.es/ciraclub/drills/CIRA-NEWS-AD31/",
      response:"https://espanamania.es/ciraclub/drills/CIRA-NEWS-AD32/",
      translation:"https://espanamania.es/ciraclub/drills/CIRA-NEWS-AD33/",
      replacement:"https://espanamania.es/ciraclub/drills/CIRA-NEWS-AD40/",
      variation:"https://espanamania.es/ciraclub/drills/CIRA-NEWS-AD50/",
      review:"https://espanamania.es/ciraclub/drills/CIRA-NEWS-AD60/",
      narrative:"https://destinos-vk.github.io/ciraclub/drills/CIRA-NEWS-AD70/",
      dialog:"https://destinos-vk.github.io/ciraclub/drills/CIRA-NEWS-AD80/"
    }
  };
  function injectStyles(){
    if(document.getElementById("cira-roadmap-component-styles"))return;
    const style=document.createElement("style");
    style.id="cira-roadmap-component-styles";
    style.textContent=`
      .cira-roadmap--shared .cira-roadmap__inner{max-width:var(--cira-content-max,1180px);overflow-x:auto;scrollbar-width:thin}
      .cira-roadmap--shared .cira-roadmap__track{min-width:920px;grid-template-columns:repeat(6,minmax(130px,1fr))}
      .cira-roadmap--shared .cira-roadmap__track::before{left:8.333%;right:8.333%}
      .cira-roadmap--shared .cira-stop{text-decoration:none}
      .cira-roadmap--shared .cira-stop__label{font-size:14px;line-height:1.25}
      .cira-roadmap--shared .cira-stop--link:hover .cira-stop__circle,.cira-roadmap--shared .cira-stop--link:focus-visible .cira-stop__circle{border-color:var(--cira-primary,#38475a)}
      .cira-roadmap--shared .cira-stop--link:focus-visible{outline:3px solid var(--cira-focus,#5e83a6);outline-offset:5px;border-radius:12px}
      .cira-roadmap--shared .cira-stop.is-pending{opacity:.66}
      @media(max-width:767px){.cira-roadmap--shared .cira-roadmap__inner{padding-left:16px;padding-right:16px}.cira-roadmap--shared .cira-roadmap__track{min-width:850px}}
    `;
    document.head.appendChild(style);
  }
  function createStop(stop,activeStop,routes){
    const active=stop.id===activeStop,href=routes?routes[stop.id]:null;
    let node;
    if(href&&!active){node=document.createElement("a");node.href=href;node.className="cira-stop cira-stop--link"}
    else{node=document.createElement("div");node.className="cira-stop";if(!active&&!href)node.classList.add("is-pending")}
    if(active){node.classList.add("is-active");node.setAttribute("aria-current","step")}
    if(href&&active)node.dataset.href=href;
    node.setAttribute("aria-label",`STOP ${stop.id} — ${stop.label}`);
    const circle=document.createElement("span"),label=document.createElement("span");
    circle.className="cira-stop__circle";circle.textContent=String(stop.id);
    label.className="cira-stop__label";label.textContent=stop.label;
    node.append(circle,label);return node;
  }
  function renderRoadMap(root){
    const issue=root.dataset.ciraIssue||"NEWS-001",activeStop=Number(root.dataset.ciraActiveStop||"1"),routes=ISSUE_ROUTES[issue]||{};
    const nav=document.createElement("nav"),inner=document.createElement("div"),track=document.createElement("div");
    nav.className="cira-roadmap cira-roadmap--shared";nav.setAttribute("aria-label",`${issue} Road Map`);
    inner.className="cira-roadmap__inner";track.className="cira-roadmap__track";
    STOP_DEFINITIONS.forEach(stop=>track.appendChild(createStop(stop,activeStop,routes)));
    inner.appendChild(track);nav.appendChild(inner);root.replaceWith(nav);
  }
  function init(){injectStyles();const roots=Array.from(document.querySelectorAll("[data-cira-roadmap], #cira-roadmap-root, .cira-roadmap-root"));[...new Set(roots)].forEach(renderRoadMap);console.info("CIRA shared Road Map v"+COMPONENT_VERSION)}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();