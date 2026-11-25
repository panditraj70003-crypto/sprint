"use client";
import Link from "next/link";
import {Compass,Plus} from "lucide-react";
import {useApp} from "@/lib/store";
import {ME} from "@/lib/data";
import {isOpen,matchScore} from "@/lib/utils";
import {ProjectCard,StudentCard} from "@/components/Cards";
import {PageHeader} from "@/components/ui";
export default function Dashboard(){
  const {me,projects,apps,saved,students}=useApp();
  const mine=projects.filter(p=>!p.draft&&p.team.some(m=>m.studentId===ME));
  const stats=[["Active projects",mine.length],["Applications",apps.filter(a=>a.studentId===ME&&a.status==="Pending").length],["Teams",mine.filter(p=>p.team.length>1).length],["Saved projects",saved.length]];
  const rec=projects.filter(p=>isOpen(p)&&!p.team.some(m=>m.studentId===ME)).sort((a,b)=>matchScore(me.skills,b.skills)-matchScore(me.skills,a.skills)).slice(0,3);
  const wanted=new Set(projects.filter(isOpen).flatMap(p=>p.skills));
  const comp=students.filter(s=>s.id!==ME).map(s=>({s,n:s.skills.filter(k=>!me.skills.includes(k)&&wanted.has(k)).length})).sort((a,b)=>b.n-a.n).slice(0,3);
  return <>
    <PageHeader title={`Welcome back, ${me.name.split(" ")[0]}`} sub="Here is what is happening with your projects and applications." action={<div className="flex gap-2"><Link href="/explore" className="btn-ghost"><Compass size={16}/>Explore projects</Link><Link href="/projects/new" className="btn-primary"><Plus size={16}/>Create project</Link></div>}/>
    <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">{stats.map(([l,n])=><div key={l} className="card"><p className="text-3xl font-extrabold text-brand">{n}</p><p className="text-sm text-[#5b5f5a]">{l}</p></div>)}</div>
    <h2 className="mb-3 text-lg font-bold">Recommended for your skills</h2>
    <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{rec.map(p=><ProjectCard key={p.id} p={p}/>)}</div>
    <h2 className="mb-1 text-lg font-bold">Teammates who fill your gaps</h2><p className="mb-3 text-sm text-[#5b5f5a]">They bring skills you do not have that open projects are asking for.</p>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{comp.map(({s})=><StudentCard key={s.id} s={s}/>)}</div>
  </>;
}
