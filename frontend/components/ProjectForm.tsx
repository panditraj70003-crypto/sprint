"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {Plus,Trash2} from "lucide-react";
import {CATEGORIES,COMMITMENTS,DEPARTMENTS,DURATIONS,MODES,Project,Role} from "@/lib/data";
import {useApp} from "@/lib/store";
import {PageHeader,TagInput} from "./ui";
const blank=():Project=>({id:"",title:"",description:"",category:CATEGORIES[0],department:DEPARTMENTS[0],duration:DURATIONS[1],commitment:COMMITMENTS[1],mode:MODES[0],skills:[],creatorId:"",roles:[],team:[],draft:true,closed:false});
export default function ProjectForm({initial}:{initial?:Project}){
  const {upsertProject,notify,meId}=useApp();const router=useRouter();
  const [p,setP]=useState<Project>(initial??blank());const [errs,setErrs]=useState<Record<string,string>>({});
  const set=<K extends keyof Project>(k:K,v:Project[K])=>setP(x=>({...x,[k]:v}));
  const setRole=(i:number,patch:Partial<Role>)=>set("roles",p.roles.map((r,j)=>j===i?{...r,...patch}:r));
  const validate=(publish:boolean)=>{
    const e:Record<string,string>={};
    if(p.title.trim().length<4)e.title="Give your project a title of at least 4 characters.";
    if(publish){
      if(p.description.trim().length<30)e.description="Describe the project in at least 30 characters so people understand it.";
      if(!p.skills.length)e.skills="Add at least one required skill.";
      if(!p.roles.length)e.roles="Add at least one team role.";
      p.roles.forEach((r,i)=>{if(!r.title.trim())e[`rt${i}`]="Role title is required.";if(r.openings<1)e[`ro${i}`]="At least 1 opening."});
      if(p.link&&!/^https?:\/\//.test(p.link))e.link="Link must start with http:// or https://.";
    }
    setErrs(e);return!Object.keys(e).length;
  };
  const submit=async(publish:boolean)=>{
    if(!validate(publish)){notify("Fix the highlighted fields");return}
    try { const result=await upsertProject({...p,creatorId:meId,draft:!publish});notify(publish?"Project published":"Draft saved");router.push(publish?`/projects/${result.id}`:"/my-projects"); }
    catch(error){notify(error instanceof Error?error.message:"Could not save project.")}
  };
  const E=({k}:{k:string})=>errs[k]?<p className="err">{errs[k]}</p>:null;
  const Sel=({k,o,l}:{k:"category"|"department"|"duration"|"commitment"|"mode";o:string[];l:string})=><div><label className="label">{l}</label><select className="input" value={p[k]} onChange={e=>set(k,e.target.value)}>{o.map(x=><option key={x}>{x}</option>)}</select></div>;
  return <>
    <PageHeader title={initial?"Edit project":"Create project"} sub="Tell people what you are building and who you need."/>
    <div className="max-w-3xl space-y-5">
      <div className="card space-y-4">
        <div><label className="label">Title</label><input className="input" value={p.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Hostel laundry slot booking"/><E k="title"/></div>
        <div><label className="label">Description</label><textarea rows={4} className="input" value={p.description} onChange={e=>set("description",e.target.value)} placeholder="What problem are you solving, and what will the team build?"/><E k="description"/></div>
        <div className="grid gap-4 sm:grid-cols-2"><Sel k="category" o={CATEGORIES} l="Category"/><Sel k="department" o={DEPARTMENTS} l="Department"/><Sel k="duration" o={DURATIONS} l="Duration"/><Sel k="commitment" o={COMMITMENTS} l="Time commitment"/><Sel k="mode" o={MODES} l="Project mode"/></div>
        <div><label className="label">Required skills</label><TagInput value={p.skills} onChange={v=>set("skills",v)} placeholder="Add a skill, press Enter"/><E k="skills"/></div>
      </div>
      <div className="card space-y-4">
        <div className="flex items-center justify-between"><div><h2 className="font-bold">Team roles</h2><p className="text-xs text-[#5b5f5a]">Each role can have several openings.</p></div><button type="button" className="btn-ghost" onClick={()=>set("roles",[...p.roles,{id:crypto.randomUUID(),title:"",description:"",skills:[],openings:1}])}><Plus size={16}/>Add role</button></div>
        <E k="roles"/>
        {p.roles.map((r,i)=><div key={r.id} className="space-y-3 rounded-xl border border-line bg-paper p-4">
          <div className="flex gap-3"><div className="flex-1"><label className="label">Role title</label><input className="input" value={r.title} onChange={e=>setRole(i,{title:e.target.value})}/><E k={`rt${i}`}/></div><div className="w-24"><label className="label">Openings</label><input type="number" min={1} className="input" value={r.openings} onChange={e=>setRole(i,{openings:Number(e.target.value)})}/><E k={`ro${i}`}/></div><button type="button" aria-label="Remove role" className="mt-7 text-red-700" onClick={()=>set("roles",p.roles.filter((_,j)=>j!==i))}><Trash2 size={18}/></button></div>
          <div><label className="label">What will they do?</label><textarea rows={2} className="input" value={r.description} onChange={e=>setRole(i,{description:e.target.value})}/></div>
          <div><label className="label">Role skills</label><TagInput value={r.skills} onChange={v=>setRole(i,{skills:v})}/></div></div>)}
      </div>
      <div className="card grid gap-4 sm:grid-cols-2"><div><label className="label">Recruitment deadline (optional)</label><input type="date" className="input" value={p.deadline??""} onChange={e=>set("deadline",e.target.value)}/></div><div><label className="label">Collaboration link (optional)</label><input className="input" value={p.link??""} onChange={e=>set("link",e.target.value)} placeholder="https://discord.gg/..."/><E k="link"/></div></div>
      <div className="flex justify-end gap-2"><button className="btn-ghost" onClick={()=>submit(false)}>Save draft</button><button className="btn-primary" onClick={()=>submit(true)}>{initial&&!initial.draft?"Save and publish":"Publish"}</button></div>
    </div></>;
}
