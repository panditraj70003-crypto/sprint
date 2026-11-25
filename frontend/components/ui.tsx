"use client";
import {X} from "lucide-react";
import {ReactNode,useState} from "react";
import {Student} from "@/lib/data";
export const Avatar=({name,size=40}:{name:string;size?:number})=><div style={{width:size,height:size,fontSize:size*0.38}} className="grid shrink-0 place-items-center rounded-full bg-sage font-semibold text-brand">{name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>;
export const Tag=({children,on}:{children:ReactNode;on?:boolean})=><span className={`tag ${on?"bg-brand text-white":"bg-sage text-brand"}`}>{children}</span>;
export const Pill=({children,tone="sage"}:{children:ReactNode;tone?:"sage"|"amber"|"gray"|"red"})=><span className={`tag ${{sage:"bg-sage text-brand",amber:"bg-amber/30 text-[#6b4a10]",gray:"bg-[#eeede6] text-[#5b5f5a]",red:"bg-red-50 text-red-700"}[tone]}`}>{children}</span>;
export const PageHeader=({title,sub,action}:{title:string;sub?:string;action?:ReactNode})=><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h1>{sub&&<p className="mt-1 text-sm text-[#5b5f5a]">{sub}</p>}</div>{action}</div>;
export const Empty=({text,action}:{text:string;action?:ReactNode})=><div className="card py-12 text-center"><p className="mb-4 text-sm text-[#5b5f5a]">{text}</p>{action}</div>;
export function Modal({open,onClose,title,children,size="default"}:{open:boolean;onClose:()=>void;title:string;children:ReactNode;size?:"default"|"wide"}){
  if(!open)return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-3 sm:p-5" onClick={onClose}><div role="dialog" aria-modal="true" aria-label={title} className={`max-h-[94vh] w-full ${size==="wide"?"max-w-5xl":"max-w-lg"} overflow-auto rounded-2xl bg-white p-4 sm:p-6`} onClick={e=>e.stopPropagation()}><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2><button aria-label="Close" onClick={onClose}><X size={18}/></button></div>{children}</div></div>;
}
export const Confirm=({open,title,body,label,onYes,onNo}:{open:boolean;title:string;body:string;label:string;onYes:()=>void;onNo:()=>void})=><Modal open={open} onClose={onNo} title={title}><p className="mb-5 text-sm text-[#5b5f5a]">{body}</p><div className="flex justify-end gap-2"><button className="btn-ghost" onClick={onNo}>Cancel</button><button className="btn-primary" onClick={onYes}>{label}</button></div></Modal>;
export function TagInput({value,onChange,placeholder}:{value:string[];onChange:(v:string[])=>void;placeholder?:string}){
  const [t,setT]=useState("");
  const add=()=>{const v=t.trim();if(v&&!value.includes(v))onChange([...value,v]);setT("")};
  return <div className="input flex flex-wrap items-center gap-1.5">{value.map(s=><span key={s} className="tag bg-sage text-brand">{s}<button type="button" aria-label={`Remove ${s}`} onClick={()=>onChange(value.filter(x=>x!==s))}><X size={12}/></button></span>)}<input className="min-w-28 flex-1 bg-transparent outline-none" value={t} placeholder={placeholder??"Type and press Enter"} onChange={e=>setT(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"||e.key===","){e.preventDefault();add()}}} onBlur={add}/></div>;
}
export function Coverage({covered,missing}:{covered:string[];missing:string[]}){
  const total=covered.length+missing.length;const pct=total?Math.round(100*covered.length/total):0;
  return <div><div className="mb-2 flex justify-between text-sm"><span className="font-semibold">Skill coverage</span><span>{pct}% covered</span></div><div className="mb-3 h-2 overflow-hidden rounded-full bg-sage"><div className="h-full bg-brand" style={{width:`${pct}%`}}/></div><div className="flex flex-wrap gap-1.5">{covered.map(s=><Tag key={s} on>{s}</Tag>)}{missing.map(s=><span key={s} className="tag border border-dashed border-amber bg-amber/15 text-[#6b4a10]">{s} needed</span>)}</div></div>;
}
export function StudentModal({s,onClose}:{s:Student|null;onClose:()=>void}){
  return <Modal open={!!s} onClose={onClose} title={s?.name??""}>{s&&<div className="space-y-3 text-sm"><div className="flex items-center gap-3"><Avatar name={s.name} size={52}/><div><p className="font-semibold">{s.dept}</p><p className="text-[#5b5f5a]">{s.year}</p></div></div><p>{s.bio}</p><div className="flex flex-wrap gap-1.5">{s.skills.map(k=><Tag key={k}>{k}</Tag>)}</div><p className="text-[#5b5f5a]">Interests: {s.interests.join(", ")}</p><p className="text-[#5b5f5a]">Past projects: {s.past.join(", ")}</p><p className="text-brand">{s.github} · {s.linkedin} · {s.portfolio}</p></div>}</Modal>;
}
