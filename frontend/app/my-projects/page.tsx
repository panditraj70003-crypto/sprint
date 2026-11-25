"use client";
import Link from "next/link";
import {Plus,Users} from "lucide-react";
import {useApp} from "@/lib/store";
import {Project} from "@/lib/data";
import {openTotal,statusOf} from "@/lib/utils";
import {Empty,PageHeader,Pill} from "@/components/ui";
export default function MyProjects(){
  const {projects,apps,meId,openCreateProject}=useApp();
  const created=projects.filter(p=>p.creatorId===meId);const joined=projects.filter(p=>p.creatorId!==meId&&p.team.some(m=>m.studentId===meId));
  const Card=({p,own}:{p:Project;own:boolean})=>{const pend=apps.filter(a=>a.projectId===p.id&&a.status==="Pending").length;return <div className="card flex flex-col"><div className="mb-2 flex items-center justify-between"><Pill tone={statusOf(p)==="Recruiting"?"sage":statusOf(p)==="Draft"?"amber":"gray"}>{statusOf(p)}</Pill>{own&&pend>0&&<Pill tone="amber">{pend} pending</Pill>}</div><p className="text-lg font-bold">{p.title}</p><p className="mt-1 flex items-center gap-4 text-sm text-[#5b5f5a]"><span className="flex items-center gap-1"><Users size={14}/>{p.team.length} members</span><span>{openTotal(p)} open positions</span>{own&&<span>{apps.filter(a=>a.projectId===p.id).length} applications</span>}</p><div className="mt-4 flex gap-2">{p.draft?<Link className="btn-primary" href={`/projects/${p.id}/edit`}>Continue editing</Link>:<Link className="btn-primary" href={`/my-projects/${p.id}`}>{own?"Manage project":"Team dashboard"}</Link>}<Link className="btn-ghost" href={`/projects/${p.id}`}>View</Link></div></div>};
  return <><PageHeader title="My projects" action={<button onClick={openCreateProject} className="btn-primary"><Plus size={16}/>Create project</button>}/>
    <h2 className="mb-3 text-lg font-bold">Created by you</h2>{created.length?<div className="mb-8 grid gap-4 md:grid-cols-2">{created.map(p=><Card key={p.id} p={p} own/>)}</div>:<div className="mb-8"><Empty text="You have not created a project yet."/></div>}
    <h2 className="mb-3 text-lg font-bold">Joined</h2>{joined.length?<div className="grid gap-4 md:grid-cols-2">{joined.map(p=><Card key={p.id} p={p} own={false}/>)}</div>:<Empty text="You have not joined a team yet. Apply to a role and it will show up here once accepted." action={<Link href="/explore" className="btn-primary">Explore projects</Link>}/>}</>;
}
