"use client";
import Link from "next/link";
import {useState} from "react";
import {useApp} from "@/lib/store";
import {ME} from "@/lib/data";
import {Confirm,Empty,PageHeader,Pill} from "@/components/ui";
export default function Applications(){
  const {apps,projects,withdraw}=useApp();const [w,setW]=useState<string|null>(null);
  const mine=apps.filter(a=>a.studentId===ME);
  return <><PageHeader title="My applications" sub="Track every role you applied for."/>
    {mine.length?<div className="space-y-3">{mine.map(a=>{const p=projects.find(x=>x.id===a.projectId);const r=p?.roles.find(x=>x.id===a.roleId);return <div key={a.id} className="card flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold">{p?.title}</p><p className="text-sm text-[#5b5f5a]">{r?.title} · Applied {a.date}</p></div><div className="flex items-center gap-2"><Pill tone={a.status==="Accepted"?"sage":a.status==="Pending"?"amber":a.status==="Rejected"?"red":"gray"}>{a.status}</Pill><Link href={`/projects/${a.projectId}`} className="btn-ghost">View project</Link>{a.status==="Pending"&&<button className="btn-danger" onClick={()=>setW(a.id)}>Withdraw</button>}</div></div>})}</div>:<Empty text="You have not applied to any roles yet." action={<Link href="/explore" className="btn-primary">Explore projects</Link>}/>}
    <Confirm open={!!w} title="Withdraw application?" body="The project owner will no longer see this application." label="Withdraw" onNo={()=>setW(null)} onYes={()=>{withdraw(w!);setW(null)}}/></>;
}
