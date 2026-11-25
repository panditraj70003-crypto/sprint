"use client";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useState} from "react";
import {Bookmark,Clock,MapPin,Tag as TagIcon} from "lucide-react";
import {useApp} from "@/lib/store";
import {Role} from "@/lib/data";
import {coverage,matchScore,statusOf,vacancies} from "@/lib/utils";
import {Avatar,Coverage,Empty,Modal,PageHeader,Pill,Tag} from "@/components/ui";
export default function Detail(){
  const {id}=useParams<{id:string}>();const {projects,apps,me,meId,student,saved,toggleSave,apply,students}=useApp();
  const [role,setRole]=useState<Role|null>(null);const [msg,setMsg]=useState("");const [err,setErr]=useState("");
  const p=projects.find(x=>x.id===id);if(!p)return <Empty text="Project not found."/>;
  const owner=p.creatorId===meId;const member=p.team.some(m=>m.studentId===meId);const cov=coverage(p,students);const c=student(p.creatorId)??{name:"Student",dept:"",year:""};
  const applied=(r:Role)=>apps.some(a=>a.projectId===p.id&&a.roleId===r.id&&a.studentId===meId&&(a.status==="Pending"||a.status==="Accepted"));
  const send=async()=>{if(msg.trim().length<10){setErr("Write at least 10 characters about why you fit this role.");return}try{await apply(p.id,role!.id,msg.trim());setRole(null);setMsg("");setErr("")}catch(error){setErr(error instanceof Error?error.message:"Could not send application.")}};
  return <>
    <PageHeader title={p.title} sub={`${p.category} · ${p.department}`} action={<div className="flex gap-2"><button className="btn-ghost" onClick={()=>toggleSave(p.id)}><Bookmark size={16} className={saved.includes(p.id)?"fill-brand text-brand":""}/>{saved.includes(p.id)?"Saved":"Save"}</button>{(owner||member)&&<Link className="btn-primary" href={`/my-projects/${p.id}`}>{owner?"Manage project":"Team dashboard"}</Link>}</div>}/>
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="card"><div className="mb-3 flex flex-wrap gap-2"><Pill tone={statusOf(p)==="Recruiting"?"sage":"gray"}>{statusOf(p)}</Pill><Pill tone="amber">{matchScore(me.skills,p.skills)}% skill match</Pill></div>
          <p className="text-sm leading-relaxed">{p.description}</p>
          <div className="mt-4 grid gap-3 text-sm text-[#5b5f5a] sm:grid-cols-3"><span className="flex items-center gap-2"><Clock size={15}/>{p.duration}</span><span className="flex items-center gap-2"><TagIcon size={15}/>{p.commitment}</span><span className="flex items-center gap-2"><MapPin size={15}/>{p.mode}</span></div>
          <div className="mt-4 flex flex-wrap gap-1.5">{p.skills.map(s=><Tag key={s} on={me.skills.map(x=>x.toLowerCase()).includes(s.toLowerCase())}>{s}</Tag>)}</div></div>
        <div><h2 className="mb-3 text-lg font-bold">Open roles</h2><div className="space-y-3">{p.roles.map(r=>{const v=vacancies(p,r);const mm=matchScore(me.skills,r.skills);return <div key={r.id} className="card flex flex-wrap items-start justify-between gap-3"><div className="max-w-md"><p className="font-bold">{r.title} <span className="text-sm font-normal text-[#5b5f5a]">· {v} of {r.openings} open</span></p><p className="my-1 text-sm text-[#5b5f5a]">{r.description}</p><div className="flex flex-wrap items-center gap-1.5">{r.skills.map(s=><Tag key={s}>{s}</Tag>)}<Pill tone="amber">{mm}% match</Pill></div></div>
          {owner?<Pill tone="gray">Your project</Pill>:<button className="btn-primary" disabled={v<1||p.closed||p.draft||applied(r)||member} onClick={()=>setRole(r)}>{applied(r)?"Applied":member?"On team":v<1?"Filled":"Apply for role"}</button>}</div>})}{!p.roles.length&&<Empty text="No roles defined yet."/>}</div></div>
      </div>
      <div className="space-y-6">
        <div className="card"><p className="mb-3 font-bold">Created by</p><div className="flex items-center gap-3"><Avatar name={c.name} size={44}/><div><p className="font-semibold">{c.name}</p><p className="text-xs text-[#5b5f5a]">{c.dept} · {c.year}</p></div></div></div>
        <div className="card"><p className="mb-3 font-bold">Team ({p.team.length})</p><div className="space-y-3">{p.team.map(m=>{const s=student(m.studentId)!;return <div key={m.studentId} className="flex items-center gap-3"><Avatar name={s.name} size={34}/><div className="text-sm"><p className="font-semibold">{s.name}</p><p className="text-xs text-[#5b5f5a]">{m.roleTitle}</p></div></div>})}</div></div>
        <div className="card"><Coverage {...cov}/></div>
      </div>
    </div>
    <Modal open={!!role} onClose={()=>setRole(null)} title={`Apply: ${role?.title??""}`}><p className="mb-3 text-sm text-[#5b5f5a]">Tell {c.name.split(" ")[0]} why you are a good fit. Your profile is shared automatically.</p><textarea rows={5} className="input" value={msg} onChange={e=>setMsg(e.target.value)} placeholder="What have you built that is relevant? How many hours can you give?"/>{err&&<p className="err">{err}</p>}<div className="mt-4 flex justify-end gap-2"><button className="btn-ghost" onClick={()=>setRole(null)}>Cancel</button><button className="btn-primary" onClick={send}>Send application</button></div></Modal>
  </>;
}
