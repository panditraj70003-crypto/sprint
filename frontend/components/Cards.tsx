"use client";
import Link from "next/link";
import {Bookmark,Users} from "lucide-react";
import {Project,Student} from "@/lib/data";
import {useApp} from "@/lib/store";
import {matchScore,openTotal,statusOf} from "@/lib/utils";
import {Avatar,Pill,Tag} from "./ui";
export function ProjectCard({p}:{p:Project}){
  const {me,student,saved,toggleSave}=useApp();const m=matchScore(me.skills,p.skills);const open=openTotal(p);
  return <div className="card flex flex-col">
    <div className="mb-3 flex items-start justify-between gap-2"><Pill tone="gray">{p.category}</Pill><div className="flex items-center gap-2"><span className="tag bg-amber/30 text-[#6b4a10]">{m}% match</span><button aria-label="Save project" onClick={()=>toggleSave(p.id)}><Bookmark size={18} className={saved.includes(p.id)?"fill-brand text-brand":"text-[#8a8d86]"}/></button></div></div>
    <Link href={`/projects/${p.id}`} className="text-lg font-bold leading-snug hover:text-brand">{p.title}</Link>
    <p className="mt-1 line-clamp-2 text-sm text-[#5b5f5a]">{p.description}</p>
    <div className="my-3 flex flex-wrap gap-1.5">{p.skills.slice(0,4).map(s=><Tag key={s}>{s}</Tag>)}{p.skills.length>4&&<Pill tone="gray">+{p.skills.length-4}</Pill>}</div>
    <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-xs text-[#5b5f5a]"><span className="flex items-center gap-2"><Avatar name={student(p.creatorId)?.name??"?"} size={24}/>{student(p.creatorId)?.name}</span><span className="flex items-center gap-3"><span className="flex items-center gap-1"><Users size={13}/>{p.team.length}</span><span className="font-semibold text-brand">{open>0&&!p.closed?`${open} open`:statusOf(p)}</span></span></div>
  </div>;
}
export function StudentCard({s,onView}:{s:Student;onView?:()=>void}){
  const {me}=useApp();
  return <div className="card flex flex-col"><div className="mb-3 flex items-center gap-3"><Avatar name={s.name} size={46}/><div className="min-w-0"><p className="font-bold">{s.name}</p><p className="truncate text-xs text-[#5b5f5a]">{s.dept} · {s.year}</p></div></div>
    <p className="line-clamp-2 text-sm text-[#5b5f5a]">{s.bio}</p>
    <div className="my-3 flex flex-wrap gap-1.5">{s.skills.map(k=><Tag key={k} on={me.skills.includes(k)}>{k}</Tag>)}</div>
    <p className="text-xs text-[#5b5f5a]">Interests: {s.interests.join(", ")}</p>
    <div className="mt-auto flex items-center justify-between pt-3 text-xs text-brand"><a href={`https://${s.portfolio}`} target="_blank" rel="noreferrer" className="underline">{s.portfolio}</a>{onView&&<button className="btn-ghost px-3 py-1.5 text-xs" onClick={onView}>View profile</button>}</div></div>;
}
