"use client";
import {createContext,useContext,useState,ReactNode} from "react";
import {APPS,PROJECTS,STUDENTS,ME,Project,Student} from "./data";
import {vacancies,uid} from "./utils";
function useImpl(){
  const [students,setStudents]=useState(STUDENTS);
  const [projects,setProjects]=useState(PROJECTS);
  const [apps,setApps]=useState(APPS);
  const [saved,setSaved]=useState<string[]>(["p2","p3"]);
  const [toast,setToast]=useState("");
  const notify=(m:string)=>{setToast(m);setTimeout(()=>setToast(""),2600)};
  const me=students.find(s=>s.id===ME)!;
  const student=(id:string)=>students.find(s=>s.id===id);
  const upsertProject=(p:Project)=>setProjects(l=>l.some(x=>x.id===p.id)?l.map(x=>x.id===p.id?p:x):[p,...l]);
  const apply=(projectId:string,roleId:string,message:string)=>{setApps(a=>[{id:uid("a"),projectId,roleId,studentId:ME,message,date:new Date().toISOString().slice(0,10),status:"Pending"},...a]);notify("Application sent")};
  const withdraw=(id:string)=>{setApps(a=>a.map(x=>x.id===id?{...x,status:"Withdrawn"}:x));notify("Application withdrawn")};
  const decide=(id:string,accept:boolean)=>{
    const a=apps.find(x=>x.id===id);if(!a)return;
    const p=projects.find(x=>x.id===a.projectId)!;const role=p.roles.find(r=>r.id===a.roleId)!;
    if(accept){
      if(vacancies(p,role)<1){notify("No vacancies left for this role");return}
      setProjects(l=>l.map(x=>x.id===p.id?{...x,team:[...x.team,{studentId:a.studentId,roleId:role.id,roleTitle:role.title}]}:x));
      setApps(l=>l.map(x=>x.id===id?{...x,status:"Accepted"}:x));notify(`${student(a.studentId)?.name} joined the team`);
    }else{setApps(l=>l.map(x=>x.id===id?{...x,status:"Rejected"}:x));notify("Application rejected")}
  };
  const toggleSave=(id:string)=>{setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);notify(saved.includes(id)?"Removed from saved":"Saved project")};
  const updateMe=(patch:Partial<Student>)=>{setStudents(l=>l.map(s=>s.id===ME?{...s,...patch}:s));notify("Profile updated")};
  return{students,projects,apps,saved,toast,notify,me,student,upsertProject,apply,withdraw,decide,toggleSave,updateMe};
}
const Ctx=createContext<ReturnType<typeof useImpl>|null>(null);
export function StoreProvider({children}:{children:ReactNode}){const v=useImpl();return <Ctx.Provider value={v}>{children}</Ctx.Provider>}
export const useApp=()=>useContext(Ctx)!;
