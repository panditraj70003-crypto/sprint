"use client";
import {useState} from "react";
import {Github,Globe,Linkedin} from "lucide-react";
import {useApp} from "@/lib/store";
import {DEPARTMENTS,YEARS,Student} from "@/lib/data";
import {Avatar,PageHeader,Tag,TagInput} from "@/components/ui";
export default function Profile(){
  const {me,updateMe,notify}=useApp();const [edit,setEdit]=useState(false);const [f,setF]=useState<Student>(me);const [err,setErr]=useState("");
  const save=()=>{if(f.name.trim().length<2){setErr("Name is required.");return}if(f.bio.trim().length<10){setErr("Write a short bio of at least 10 characters.");return}if(!f.skills.length){setErr("Add at least one skill.");return}setErr("");updateMe(f);setEdit(false)};
  const T=({k,l}:{k:"name"|"github"|"linkedin"|"portfolio";l:string})=><div><label className="label">{l}</label><input className="input" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/></div>;
  if(edit)return <><PageHeader title="Edit profile"/><div className="card max-w-2xl space-y-4"><T k="name" l="Name"/><div className="grid gap-4 sm:grid-cols-2"><div><label className="label">Department</label><select className="input" value={f.dept} onChange={e=>setF({...f,dept:e.target.value})}>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></div><div><label className="label">Academic year</label><select className="input" value={f.year} onChange={e=>setF({...f,year:e.target.value})}>{YEARS.map(d=><option key={d}>{d}</option>)}</select></div></div>
    <div><label className="label">Bio</label><textarea rows={3} className="input" value={f.bio} onChange={e=>setF({...f,bio:e.target.value})}/></div>
    <div><label className="label">Skills</label><TagInput value={f.skills} onChange={v=>setF({...f,skills:v})}/></div><div><label className="label">Interests</label><TagInput value={f.interests} onChange={v=>setF({...f,interests:v})}/></div><div><label className="label">Preferred roles</label><TagInput value={f.roles} onChange={v=>setF({...f,roles:v})}/></div>
    <T k="github" l="GitHub"/><T k="linkedin" l="LinkedIn"/><T k="portfolio" l="Portfolio"/>{err&&<p className="err">{err}</p>}
    <div className="flex justify-end gap-2"><button className="btn-ghost" onClick={()=>{setF(me);setErr("");setEdit(false)}}>Cancel</button><button className="btn-primary" onClick={save}>Save profile</button></div></div></>;
  return <><PageHeader title="Profile" action={<button className="btn-primary" onClick={()=>{setF(me);setEdit(true)}}>Edit profile</button>}/>
    <div className="grid gap-6 lg:grid-cols-3"><div className="card lg:col-span-2"><div className="mb-4 flex items-center gap-4"><Avatar name={me.name} size={72}/><div><h2 className="text-xl font-extrabold">{me.name}</h2><p className="text-sm text-[#5b5f5a]">{me.dept} · {me.year}</p></div></div><p className="text-sm">{me.bio}</p>
      <h3 className="mb-2 mt-5 font-bold">Skills</h3><div className="flex flex-wrap gap-1.5">{me.skills.map(s=><Tag key={s} on>{s}</Tag>)}</div>
      <h3 className="mb-2 mt-5 font-bold">Interests</h3><div className="flex flex-wrap gap-1.5">{me.interests.map(s=><Tag key={s}>{s}</Tag>)}</div>
      <h3 className="mb-2 mt-5 font-bold">Preferred roles</h3><div className="flex flex-wrap gap-1.5">{me.roles.map(s=><Tag key={s}>{s}</Tag>)}</div></div>
    <div className="space-y-6"><div className="card space-y-3 text-sm"><h3 className="font-bold">Links</h3><a className="flex items-center gap-2 text-brand" href={`https://${me.github}`}><Github size={16}/>{me.github}</a><a className="flex items-center gap-2 text-brand" href={`https://${me.linkedin}`}><Linkedin size={16}/>{me.linkedin}</a><a className="flex items-center gap-2 text-brand" href={`https://${me.portfolio}`}><Globe size={16}/>{me.portfolio}</a></div>
    <div className="card"><h3 className="mb-2 font-bold">Previous projects</h3><ul className="list-inside list-disc text-sm text-[#5b5f5a]">{me.past.map(x=><li key={x}>{x}</li>)}</ul></div></div></div></>;
}
