'use client';
import {useEffect,useState} from 'react';
import {ArrowLeft,Check,Plus,Save} from 'lucide-react';
import {useParams,useRouter} from 'next/navigation';
import toast from 'react-hot-toast';
import {fetchWorkout,fallbacks} from '@/lib/api';
import {usePlan} from '@/components/PlanProvider';

export default function Details(){
 const {id}=useParams(),router=useRouter();
 const {addPlan,addSaved,plan,saved}=usePlan();
 const [w,setW]=useState(null),[loading,setLoading]=useState(true);
 useEffect(()=>{let live=true;(async()=>{try{const data=await fetchWorkout(id);if(live)setW(data||fallbacks.find(x=>x.id===String(id))||null)}catch{if(live)setW(fallbacks.find(x=>x.id===String(id))||null)}finally{if(live)setLoading(false)}})();return()=>{live=false}},[id]);
 if(loading)return <div className="loading"><div><div className="spinner"/><div className="loading-text">Loading workout…</div></div></div>;
 if(!w)return <div className="container page text-center"><h1 className="display page-title">WORKOUT NOT FOUND</h1><button className="btn btn-primary mt-7" onClick={()=>router.push('/')}>Back to Library</button></div>;
 const inPlan=plan.some(x=>x.id===w.id),isSaved=saved.some(x=>x.id===w.id);
 const add=()=>{if(inPlan)return toast('Already in today’s plan');if(plan.length>=5)return toast.error('Today’s Plan is full — 5 lifts max');addPlan(w);toast.success('Added to today’s plan')};
 const save=()=>{if(isSaved)return toast('Already saved');addSaved(w);toast.success('Saved for later')};
 return <section className="container detail">
  <button className="back" onClick={()=>router.back()}><ArrowLeft size={14}/> Back</button>
  <div className="detail-grid">
   <div className="detail-media"><img src={w.image} alt={w.name}/></div>
   <div>
    <div className="card-tags" style={{position:'static'}}>{w.categories.map(c=><span className="tag" key={c}>{c}</span>)}</div>
    <h1 className="display detail-title">{w.name}</h1>
    <p className="detail-desc">{w.description}</p>
    <div className="specs">{[['EQUIPMENT',w.equipment],['DIFFICULTY',w.difficulty],['SETS',w.sets],['REPS',w.reps],['DURATION',`${w.duration} min`],['CALORIES',`${w.calories} kcal`],['RATING',w.rating]].map(([a,b])=><div className="spec-row" key={a}><span>{a}</span><span>{b}</span></div>)}</div>
    <div className="instructions"><h2>INSTRUCTIONS</h2><ol>{w.instructions.slice(0,4).map((x,i)=><li key={i}><b>0{i+1}</b><span>{x}</span></li>)}</ol></div>
    <div className="detail-actions"><button className="btn btn-primary" onClick={add}><Plus size={15}/> Add to today’s plan</button><button className="btn btn-outline" onClick={save}><Save size={15}/> Save for later</button></div>
   </div>
  </div>
 </section>;
}