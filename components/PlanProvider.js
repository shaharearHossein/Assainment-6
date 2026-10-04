'use client';
import {createContext,useContext,useEffect,useMemo,useState} from 'react';
const Ctx=createContext(null);
const read=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return[]}};
export function PlanProvider({children}){
 const [plan,setPlan]=useState([]),[saved,setSaved]=useState([]),[done,setDone]=useState([]),[ready,setReady]=useState(false);
 useEffect(()=>{setPlan(read('fitlog-plan'));setSaved(read('fitlog-saved'));setDone(read('fitlog-done'));setReady(true)},[]);
 useEffect(()=>{if(ready)localStorage.setItem('fitlog-plan',JSON.stringify(plan))},[plan,ready]);
 useEffect(()=>{if(ready)localStorage.setItem('fitlog-saved',JSON.stringify(saved))},[saved,ready]);
 useEffect(()=>{if(ready)localStorage.setItem('fitlog-done',JSON.stringify(done))},[done,ready]);
 const addPlan=w=>{if(plan.some(x=>x.id===w.id)||plan.length>=5)return false;setPlan(p=>[...p,w]);return true};
 const addSaved=w=>{if(saved.some(x=>x.id===w.id))return false;setSaved(p=>[...p,w]);return true};
 const removePlan=id=>{setPlan(p=>p.filter(x=>x.id!==id));setDone(p=>p.filter(x=>x!==id))};
 const removeSaved=id=>setSaved(p=>p.filter(x=>x.id!==id));
 const markDone=id=>setDone(p=>p.includes(id)?p:[...p,id]);
 const value=useMemo(()=>({plan,saved,done,ready,addPlan,addSaved,removePlan,removeSaved,markDone,minutes:plan.reduce((n,x)=>n+Number(x.duration||0),0),calories:plan.reduce((n,x)=>n+Number(x.calories||0),0)}),[plan,saved,done,ready]);
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const usePlan=()=>useContext(Ctx);