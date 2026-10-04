'use client';
import Link from 'next/link';
import {Check,Clock3,Flame,Star,X,ArrowUpRight} from 'lucide-react';
import toast from 'react-hot-toast';
import {useState} from 'react';
import {usePlan} from '@/components/PlanProvider';

function PlanCard({w,savedTab}){
 const {removePlan,removeSaved,markDone,done}=usePlan(); const isDone=done.includes(w.id);
 return <article className="plan-item">
  <img src={w.image} alt={w.name}/>
  <div className="plan-main"><h3 className="display">{w.name}</h3><p>{w.equipment}</p><div className="stats"><span className="stat"><Clock3 size={12}/>{w.duration} min</span><span className="stat"><Flame size={12}/>{w.calories} kcal</span><span className="stat"><Star size={12}/>{w.rating}</span></div></div>
  <div className="plan-actions">
   <Link className="btn btn-ghost" href={`/workout/${w.id}`}><ArrowUpRight size={13}/> View Details</Link>
   {!savedTab && <><button className="btn btn-ghost" disabled={isDone} onClick={()=>{markDone(w.id);toast.success('Workout marked as done')}}><Check size={13}/> {isDone?'Done':'Mark as Done'}</button><button className="btn btn-ghost" aria-label="Remove" onClick={()=>{removePlan(w.id);toast.success('Removed from today’s plan')}}><X size={14}/></button></>}
   {savedTab && <button className="btn btn-ghost" onClick={()=>{removeSaved(w.id);toast.success('Removed from saved')}}><X size={14}/> Remove</button>}
  </div>
 </article>
}

export default function MyPlan(){
 const {plan,saved,minutes,calories,ready}=usePlan(); const [tab,setTab]=useState('plan'); const list=tab==='plan'?plan:saved;
 if(!ready)return <div className="loading"><div><div className="spinner"/><div className="loading-text">Loading workouts…</div></div></div>;
 return <section className="container page">
  <p className="section-kicker">DAILY LOG</p><h1 className="display page-title">MY PLAN</h1><p className="page-sub">Cap of five lifts for today. Finish them, then load more.</p>
  <div className="metrics"><div className="metric"><strong>{plan.length}</strong><span>Exercises</span></div><div className="metric"><strong>{minutes}</strong><span>Minutes</span></div><div className="metric"><strong>{calories}</strong><span>Calories</span></div></div>
  <div className="tabs"><button className={`tab ${tab==='plan'?'active':''}`} onClick={()=>setTab('plan')}>Today’s Plan</button><button className={`tab ${tab==='saved'?'active':''}`} onClick={()=>setTab('saved')}>Saved</button></div>
  {list.length===0?<div className="empty"><p className="section-kicker">NOTHING HERE YET</p><h2 className="display">LOAD YOUR NEXT LIFT.</h2><p>Browse the library and add a lift to get today moving.</p><Link href="/#library" className="btn btn-primary mt-6">Go to workouts</Link></div>:<div className="plan-list">{list.map((w,i)=><PlanCard key={`${w.id}-${i}`} w={w} savedTab={tab==='saved'}/>)}</div>}
 </section>
}