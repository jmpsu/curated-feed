"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Bookmark, ChevronLeft, ChevronRight, Clock3, ExternalLink, Hash, Heart, Menu, Pause, Play, Plus, Search, Settings2, SlidersHorizontal, Sparkles, Volume2, X } from "lucide-react";

type StreamItem = { id:number; kind:string; source:string; time:string; title:string; deck:string; image:string; tags:string[]; duration:number; accent:string };

const ITEMS: StreamItem[] = [
  { id:1, kind:"FIELD NOTE", source:"MIT Technology Review", time:"12m ago", title:"The small models quietly changing how AI runs at the edge", deck:"A focused look at the techniques making local intelligence faster, cheaper, and more private.", image:"https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=85", tags:["ai","cuttingedge","local-first"], duration:22, accent:"#d9ff56" },
  { id:2, kind:"VISUAL STORY", source:"Saved collection · Architecture", time:"38m ago", title:"Concrete, salt air, and the geometry of quiet spaces", deck:"A coastal residence where material restraint does the storytelling.", image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85", tags:["architecture","design","coastal"], duration:15, accent:"#ff916e" },
  { id:3, kind:"VIDEO", source:"YouTube · Two Minute Papers", time:"1h ago", title:"A new simulation makes digital worlds feel physical", deck:"Selected because it intersects your AI, visual systems, and future-tech collections.", image:"https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1600&q=85", tags:["ai","simulation","cuttingedge"], duration:34, accent:"#7ae7ff" },
  { id:4, kind:"PHOTO ESSAY", source:"Outside", time:"2h ago", title:"Before sunrise on Florida's wild Atlantic edge", deck:"A slow visual study of weather, tide, and empty shoreline.", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85", tags:["ocean","photography","florida"], duration:18, accent:"#87a8ff" },
  { id:5, kind:"SIGNAL", source:"Ars Technica", time:"3h ago", title:"The open-source tools worth watching this week", deck:"A concise scan of projects showing unusual technical momentum.", image:"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85", tags:["opensource","engineering","cuttingedge"], duration:24, accent:"#f3cf64" },
];

const NEWS = [
  ["AI", "New techniques push useful models onto smaller hardware", "8m"],
  ["DESIGN", "A waterfront home built around shadow and breeze", "26m"],
  ["SPACE", "A sharper look at the chemistry of distant worlds", "51m"],
  ["FLORIDA", "Night photography meets the summer storm line", "1h"],
  ["TOOLS", "Five open projects with serious creative potential", "2h"],
];
const ALL_TAGS = ["ai","cuttingedge","architecture","design","local-first","simulation","coastal","photography","florida","ocean","opensource","engineering"];

export default function Home() {
  const [index,setIndex] = useState(0);
  const [playing,setPlaying] = useState(true);
  const [elapsed,setElapsed] = useState(0);
  const [focusTags,setFocusTags] = useState<string[]>(["ai","cuttingedge"]);
  const [mutedTags,setMutedTags] = useState<string[]>([]);
  const [weights,setWeights] = useState<Record<string,number>>({ai:90,cuttingedge:86,architecture:62,photography:58,design:66});
  const [settings,setSettings] = useState(false);
  const [search,setSearch] = useState("");
  const [liked,setLiked] = useState<number[]>([]);
  const [saved,setSaved] = useState<number[]>([]);
  const [hydrated,setHydrated] = useState(false);

  const visible = useMemo(() => ITEMS.filter(i => !i.tags.some(t=>mutedTags.includes(t)) && (!focusTags.length || i.tags.some(t=>focusTags.includes(t)))),[focusTags,mutedTags]);
  const stream = visible.length ? visible : ITEMS;
  const current = stream[index % stream.length];
  useEffect(()=>{
    try {
      const raw=localStorage.getItem("joey-stream-preferences");
      if(raw){ const p=JSON.parse(raw); setFocusTags(p.focusTags??["ai","cuttingedge"]); setMutedTags(p.mutedTags??[]); setWeights(p.weights??weights); setLiked(p.liked??[]); setSaved(p.saved??[]); }
    } finally { setHydrated(true); }
  },[]);
  useEffect(()=>{
    if(hydrated) localStorage.setItem("joey-stream-preferences",JSON.stringify({focusTags,mutedTags,weights,liked,saved}));
  },[hydrated,focusTags,mutedTags,weights,liked,saved]);
  useEffect(()=>{ setIndex(0); setElapsed(0); },[focusTags,mutedTags]);
  useEffect(()=>{
    if(!playing) return;
    const t=setInterval(()=>setElapsed(v=>{
      if(v>=current.duration-1){ setIndex(i=>(i+1)%stream.length); return 0; }
      return v+1;
    }),1000);
    return()=>clearInterval(t);
  },[playing,current,stream.length]);
  const move=(dir:number)=>{ setIndex(i=>(i+dir+stream.length)%stream.length); setElapsed(0); };
  const addFocus=(tag:string)=>{ if(!focusTags.includes(tag)) setFocusTags([...focusTags,tag]); };
  const toggle=(id:number, list:number[], setter:(v:number[])=>void)=>setter(list.includes(id)?list.filter(x=>x!==id):[...list,id]);

  return <main className="app-shell">
    <header className="topbar">
      <a className="wordmark" href="#"><span>J</span> STREAM</a>
      <div className="stream-status"><i/> LIVE CURATION <b>{stream.length} STORIES</b></div>
      <nav><a href="#stream">Stream</a><a href="#signals">Signals</a><button onClick={()=>setSettings(true)}><Settings2 size={17}/> Tune feed</button></nav>
    </header>
    <section className="workspace" id="stream">
      <aside className="left-rail">
        <div className="rail-label">YOUR SIGNAL</div><h2>What should the stream follow?</h2>
        <div className="tag-search"><Search size={16}/><input aria-label="Search tags" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a tag"/></div>
        <div className="drop-zone" onDragOver={e=>e.preventDefault()} onDrop={e=>addFocus(e.dataTransfer.getData("tag"))}>
          <div><Sparkles size={15}/> FOCUSING ON</div>{focusTags.length===0 && <p>Drag tags here to shape the stream</p>}
          <div className="focus-list">{focusTags.map(t=><span key={t}>#{t}<button onClick={()=>setFocusTags(focusTags.filter(x=>x!==t))}><X size={12}/></button></span>)}</div>
        </div>
        <div className="tag-cloud">{ALL_TAGS.filter(t=>t.includes(search.toLowerCase())&&!focusTags.includes(t)).map(t=><button draggable onDragStart={e=>e.dataTransfer.setData("tag",t)} onClick={()=>addFocus(t)} key={t}>#{t}<Plus size={12}/></button>)}</div>
        <button className="fine-tune" onClick={()=>setSettings(true)}><SlidersHorizontal size={16}/> Fine-tune weights</button>
        <div className="daily"><Clock3 size={18}/><div><b>Daily mix</b><span>Fresh signal, less repetition</span></div><strong>ON</strong></div>
      </aside>
      <div className="stage">
        <div className="timeline-head"><span>NOW PLAYING</span><small>{String(index+1).padStart(2,"0")} / {String(stream.length).padStart(2,"0")}</small></div>
        <div className="timeline">{stream.map((item,i)=>{ const active=i===index%stream.length; return <button key={item.id} className={active?"thumb active":"thumb"} onClick={()=>{setIndex(i);setElapsed(0)}}><img src={item.image} alt=""/><span>{active?"PLAYING":`0${i+1}`}</span></button> })}</div>
        <article className="feature" style={{"--accent":current.accent} as React.CSSProperties}>
          <img className="feature-image" src={current.image} alt=""/><div className="shade"/>
          <div className="feature-copy">
            <div className="eyebrow"><span>{current.kind}</span><i/> {current.source} · {current.time}</div>
            <h1>{current.title}</h1><p>{current.deck}</p>
            <div className="tags">{current.tags.map(t=><button key={t} onClick={()=>addFocus(t)}>#{t}</button>)}<button className="add-tag"><Plus size={13}/> tag</button></div>
            <div className="actions">
              <button className={liked.includes(current.id)?"selected":""} onClick={()=>toggle(current.id,liked,setLiked)}><Heart size={18} fill={liked.includes(current.id)?"currentColor":"none"}/></button>
              <button className={saved.includes(current.id)?"selected":""} onClick={()=>toggle(current.id,saved,setSaved)}><Bookmark size={18} fill={saved.includes(current.id)?"currentColor":"none"}/></button>
              <button className="read">Open story <ArrowUpRight size={17}/></button>
            </div>
          </div>
          <button className="nav prev" onClick={()=>move(-1)} aria-label="Previous"><ChevronLeft/></button><button className="nav next" onClick={()=>move(1)} aria-label="Next"><ChevronRight/></button>
          <div className="player"><button onClick={()=>setPlaying(!playing)}>{playing?<Pause size={17}/>:<Play size={17}/>}</button><div className="progress"><i style={{width:`${elapsed/current.duration*100}%`}}/></div><span>{current.duration-elapsed}s</span><Volume2 size={16}/></div>
        </article>
      </div>
      <aside className="news-rail" id="signals">
        <div className="news-title"><div><i/> LIVE SIGNALS</div><button><Menu size={17}/></button></div><p className="news-intro">Headlines selected around your active tags.</p>
        <div className="headlines">{NEWS.map((n,i)=><a key={i} href="#"><span>{n[0]} · {n[2]}</span><h3>{n[1]}</h3><ExternalLink size={15}/></a>)}</div>
        <button className="source-button">Manage sources <ArrowUpRight size={15}/></button>
      </aside>
    </section>
    {settings&&<div className="modal-backdrop" onMouseDown={()=>setSettings(false)}><section className="settings" onMouseDown={e=>e.stopPropagation()}>
      <header><div><span>FEED CONTROLS</span><h2>Tune your signal</h2></div><button onClick={()=>setSettings(false)}><X/></button></header><p>Raise what matters. Silence what does not. Changes reshape the stream immediately.</p>
      <div className="weight-list">{["ai","cuttingedge","architecture","photography","design"].map(t=><label key={t}><div><b>#{t}</b><span>{weights[t]||50}%</span></div><input type="range" min="0" max="100" value={weights[t]||50} onChange={e=>setWeights({...weights,[t]:Number(e.target.value)})}/><button className={mutedTags.includes(t)?"muted":""} onClick={()=>setMutedTags(mutedTags.includes(t)?mutedTags.filter(x=>x!==t):[...mutedTags,t])}>{mutedTags.includes(t)?"Muted":"Mute"}</button></label>)}</div>
      <div className="scope"><Hash size={17}/><div><b>Exclusions persist on this device</b><span>Use Mute above to remove matching content. Unmute at any time.</span></div></div><button className="save" onClick={()=>setSettings(false)}>Save & refresh stream</button>
    </section></div>}
  </main>;
}
