"use client";
import {useState} from "react";
import {useApp} from "@/lib/store";
import {DEPARTMENTS,YEARS,Student} from "@/lib/data";
import {StudentCard} from "@/components/Cards";
import {Empty,PageHeader,StudentModal} from "@/components/ui";
export default function Students(){
  const {students,meId}=useApp();const [q,setQ]=useState("");const [d,setD]=useState("");const [y,setY]=useState("");const [k,setK]=useState("");const [v,setV]=useState<Student|null>(null);
  const skills=Array.from(new Set(students.flatMap(s=>s.skills))).sort();
  const list=students.filter(s=>s.id!==meId&&(!q||(s.name+s.skills.join(" ")).toLowerCase().includes(q.toLowerCase()))&&(!d||s.dept===d)&&(!y||s.year===y)&&(!k||s.skills.includes(k)));
  return <><PageHeader title="Find students" sub="Search by name or skill to build a balanced team."/>
    <div className="mb-6 flex flex-wrap gap-2"><input className="input max-w-xs" placeholder="Search name or skill" value={q} onChange={e=>setQ(e.target.value)}/>
      <select aria-label="Department" className="input w-auto" value={d} onChange={e=>setD(e.target.value)}><option value="">All departments</option>{DEPARTMENTS.map(x=><option key={x}>{x}</option>)}</select>
      <select aria-label="Year" className="input w-auto" value={y} onChange={e=>setY(e.target.value)}><option value="">Any year</option>{YEARS.map(x=><option key={x}>{x}</option>)}</select>
      <select aria-label="Skill" className="input w-auto" value={k} onChange={e=>setK(e.target.value)}><option value="">Any skill</option>{skills.map(x=><option key={x}>{x}</option>)}</select></div>
    {list.length?<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.map(s=><StudentCard key={s.id} s={s} onView={()=>setV(s)}/>)}</div>:<Empty text="No students match. Try a broader skill or department."/>}
    <StudentModal s={v} onClose={()=>setV(null)}/></>;
}
