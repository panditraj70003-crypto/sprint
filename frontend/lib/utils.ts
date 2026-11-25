import {Project,Role,Student} from "./data";
export const filled=(p:Project,r:Role)=>p.team.filter(m=>m.roleId===r.id).length;
export const vacancies=(p:Project,r:Role)=>Math.max(0,r.openings-filled(p,r));
export const openTotal=(p:Project)=>p.roles.reduce((a,r)=>a+vacancies(p,r),0);
export const isOpen=(p:Project)=>!p.draft&&!p.closed&&openTotal(p)>0;
export const statusOf=(p:Project)=>p.draft?"Draft":p.status==="completed"?"Completed":p.closed?"Recruitment closed":openTotal(p)>0?"Recruiting":"Team complete";
const lc=(a:string[])=>a.map(s=>s.toLowerCase());
export const matchScore=(mine:string[],req:string[])=>{const m=lc(mine);return req.length?Math.round(100*req.filter(s=>m.includes(s.toLowerCase())).length/req.length):0};
export function coverage(p:Project,students:Student[]){const have=lc(p.team.flatMap(m=>students.find(s=>s.id===m.studentId)?.skills??[]));return{covered:p.skills.filter(s=>have.includes(s.toLowerCase())),missing:p.skills.filter(s=>!have.includes(s.toLowerCase()))}}
export const uid=(p:string)=>p+Math.random().toString(36).slice(2,8);
