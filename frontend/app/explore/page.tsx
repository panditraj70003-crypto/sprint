"use client";
import {Suspense,useState} from "react";
import {useSearchParams} from "next/navigation";
import {useApp} from "@/lib/store";
import {CATEGORIES,DEPARTMENTS} from "@/lib/data";
import {openTotal} from "@/lib/utils";
import {ProjectCard} from "@/components/Cards";
import {Empty,PageHeader} from "@/components/ui";
function Inner(){
  const {projects}=useApp();const sp=useSearchParams();
  const [q,setQ]=useState(sp.get("q")??"");const [cat,setCat]=useState("");const [dept,setDept]=useState("");const [skill,setSkill]=useState("");const [openOnly,setOpen]=useState(false);
  const all=Array.from(new Set(projects.flatMap(p=>p.skills))).sort();
  const list=projects.filter(p=>!p.draft).filter(p=>{const t=q.toLowerCase();return(!t||(p.title+p.description+p.skills.join(" ")).toLowerCase().includes(t))&&(!cat||p.category===cat)&&(!dept||p.department===dept)&&(!skill||p.skills.includes(skill))&&(!openOnly||(!p.closed&&openTotal(p)>0))});
  const Sel=({v,s,o,l}:{v:string;s:(x:string)=>void;o:string[];l:string})=><select aria-label={l} className="input w-auto" value={v} onChange={e=>s(e.target.value)}><option value="">{l}</option>{o.map(x=><option key={x}>{x}</option>)}</select>;
  return <>
    <PageHeader title="Explore projects" sub="Find a team that needs what you are good at."/>
    <div className="mb-6 flex flex-wrap items-center gap-2"><input className="input max-w-xs" placeholder="Search title, description or skill" value={q} onChange={e=>setQ(e.target.value)}/><Sel v={cat} s={setCat} o={CATEGORIES} l="All categories"/><Sel v={dept} s={setDept} o={DEPARTMENTS} l="All departments"/><Sel v={skill} s={setSkill} o={all} l="Any skill"/><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={openOnly} onChange={e=>setOpen(e.target.checked)}/>Open roles only</label></div>
    {list.length?<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.map(p=><ProjectCard key={p.id} p={p}/>)}</div>:<Empty text="No projects match these filters. Try removing one."/>}
  </>;
}
export default function Page(){return <Suspense><Inner/></Suspense>}
