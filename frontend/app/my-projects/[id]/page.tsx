"use client";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useEffect,useState} from "react";
import {Check,ExternalLink,X} from "lucide-react";
import {useApp} from "@/lib/store";
import {Student} from "@/lib/data";
import {coverage,filled,openTotal,statusOf,vacancies} from "@/lib/utils";
import {Avatar,Confirm,Coverage,Empty,PageHeader,Pill,StudentModal,Tag} from "@/components/ui";
export default function Manage(){
  const {id}=useParams<{id:string}>();const {projects,apps,student,students,decide,upsertProject,notify,meId,setClosed,completeProject,refreshMyData}=useApp();
  const [view,setView]=useState<Student|null>(null);const [rej,setRej]=useState<string|null>(null);const [closing,setClosing]=useState(false);const [completing,setCompleting]=useState(false);
  useEffect(()=>{void refreshMyData();const refreshOnFocus=()=>{void refreshMyData()};const timer=window.setInterval(()=>{if(!document.hidden)void refreshMyData()},12000);window.addEventListener("focus",refreshOnFocus);return()=>{window.clearInterval(timer);window.removeEventListener("focus",refreshOnFocus)}},[refreshMyData]);
  const p=projects.find(x=>x.id===id);if(!p)return <Empty text="Project not found."/>;
  const owner=p.creatorId===meId;const list=apps.filter(a=>a.projectId===p.id);
  return <>
    <PageHeader title={p.title} sub={owner?"Manage applications and your team.":"Team dashboard"} action={<div className="flex gap-2">{owner&&p.status!=="completed"&&<Link className="btn-ghost" href={`/projects/${p.id}/edit`}>Edit project</Link>}{owner&&!p.draft&&p.status!=="completed"&&<button className="btn-ghost" onClick={()=>p.closed?setClosed(p.id,false).then(()=>notify("Recruitment reopened")).catch(e=>notify(e.message)):setClosing(true)}>{p.closed?"Reopen recruitment":"Close recruitment"}</button>}{owner&&!p.draft&&p.status!=="completed"&&(p.closed||openTotal(p)===0)&&<button className="btn-primary" onClick={()=>setCompleting(true)}>Mark completed</button>}</div>}/>
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="card"><div className="mb-2 flex items-center gap-2"><Pill tone={statusOf(p)==="Recruiting"?"sage":"gray"}>{statusOf(p)}</Pill>{p.deadline&&<span className="text-xs text-[#5b5f5a]">Deadline {p.deadline}</span>}</div><p className="text-sm">{p.description}</p>{p.link&&<a href={p.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand"><ExternalLink size={14}/>Collaboration space</a>}</div>
        <div><h2 className="mb-3 text-lg font-bold">Team members</h2><div className="grid gap-3 sm:grid-cols-2">{p.team.map(m=>{const s=student(m.studentId)!;return <div key={m.studentId} className="card flex items-center gap-3"><Avatar name={s.name}/><div><p className="font-semibold">{s.name}</p><p className="text-xs text-[#5b5f5a]">{m.roleTitle}</p></div></div>})}</div></div>
        <div><h2 className="mb-3 text-lg font-bold">Positions</h2><div className="space-y-2">{p.roles.map(r=><div key={r.id} className="card flex items-center justify-between py-3"><span className="font-semibold">{r.title}</span><span className="text-sm text-[#5b5f5a]">{filled(p,r)} of {r.openings} filled · <b className={vacancies(p,r)?"text-brand":""}>{vacancies(p,r)} open</b></span></div>)}</div></div>
        {owner&&<div><h2 className="mb-3 text-lg font-bold">Applications ({list.length})</h2>{list.length?<div className="space-y-3">{list.map(a=>{const s=student(a.studentId)!;const r=p.roles.find(x=>x.id===a.roleId);return <div key={a.id} className="card"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex gap-3"><Avatar name={s.name} size={44}/><div><p className="font-bold">{s.name}</p><p className="text-xs text-[#5b5f5a]">{s.dept} · {s.year}</p><p className="mt-1 text-xs">Applied for <b>{r?.title}</b></p></div></div><Pill tone={a.status==="Accepted"?"sage":a.status==="Pending"?"amber":"gray"}>{a.status}</Pill></div>
          <p className="my-3 rounded-xl bg-paper p-3 text-sm">{a.message}</p><div className="mb-3 flex flex-wrap gap-1.5">{s.skills.map(k=><Tag key={k}>{k}</Tag>)}</div>
          <div className="flex gap-2"><button className="btn-ghost" onClick={()=>setView(s)}>View profile</button>{a.status==="Pending"&&<><button className="btn-primary" onClick={()=>decide(a.id,true)}><Check size={15}/>Accept</button><button className="btn-danger" onClick={()=>setRej(a.id)}><X size={15}/>Reject</button></>}</div></div>})}</div>:<Empty text="No applications yet. Share your project to attract teammates."/>}</div>}
      </div>
      <div className="card h-fit"><Coverage {...coverage(p,students)}/></div>
    </div>
    <StudentModal s={view} onClose={()=>setView(null)}/>
    <Confirm open={!!rej} title="Reject this application?" body="The applicant will see their application as rejected." label="Reject" onNo={()=>setRej(null)} onYes={()=>{decide(rej!,false);setRej(null)}}/>
    <Confirm open={closing} title="Close recruitment?" body="People will no longer be able to apply. You can reopen it any time." label="Close recruitment" onNo={()=>setClosing(false)} onYes={()=>{setClosed(p.id,true).then(()=>notify("Recruitment closed")).catch(e=>notify(e.message));setClosing(false)}}/>
    <Confirm open={completing} title="Mark this project complete?" body="This will finish the project workflow and keep it visible as completed." label="Mark completed" onNo={()=>setCompleting(false)} onYes={()=>{completeProject(p.id).then(()=>notify("Project marked completed")).catch(e=>notify(e.message));setCompleting(false)}}/>
  </>;
}
