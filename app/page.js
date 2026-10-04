'use client';
import {useEffect,useMemo,useState} from 'react';
import {ArrowDown,ArrowUpRight,ChevronDown,Clock3,Flame,Search,Star} from 'lucide-react';
import Link from 'next/link';
import {fetchWorkouts,fallbacks} from '@/lib/api';
import WorkoutCard from '@/components/WorkoutCard';

export default function Home(){
 const [items,setItems]=useState([]);
 const [loading,setLoading]=useState(true);
 const [sort,setSort]=useState('duration');
 const [query,setQuery]=useState('');
 useEffect(()=>{let live=true;(async()=>{try{const data=await fetchWorkouts();if(live)setItems(data.length?data:fallbacks)}catch{if(live)setItems(fallbacks)}finally{if(live)setLoading(false)}})();return()=>{live=false}},[]);
 const shown=useMemo(()=>items.filter(w=>(w.name+' '+w.categories.join(' ')+' '+w.equipment).toLowerCase().includes(query.toLowerCase())).sort((a,b)=>Number(a[sort])-Number(b[sort])),[items,sort,query]);
 return <>
  <section className="container hero">
   <div>
    <p className="eyebrow">WORKOUT LIBRARY</p>
    <h1 className="display">TRAIN WITH INTENT. <span>LOG EVERY SET.</span></h1>
    <p className="hero-copy">FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today's plan, and watch the week's work add up.</p>
    <a href="#library" className="btn btn-primary mt-7"><ArrowDown size={15}/> Browse Workouts</a>
   </div>
   <div className="hero-visual">
    <img src="/assets/penpot-1.webp" alt="FitLog workout illustration"/>
    <span className="hero-stamp">TRAIN / LOG / REPEAT</span>
   </div>
  </section>
  <section id="library" className="library">
   <div className="container">
    <div className="section-head">
     <div><h2 className="display">THE LIBRARY</h2><p>Twelve lifts covering every major muscle group.</p></div>
     <div className="library-tools">
      <label className="search-box"><Search size={13}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search workouts"/></label>
      <label className="sort-box"><span>Sort By</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="duration">Duration</option><option value="calories">Calories</option><option value="rating">Rating</option></select><ChevronDown size={13}/></label>
     </div>
    </div>
    {loading ? <div className="loading"><div><div className="spinner"/><div className="loading-text">Loading workouts…</div></div></div> :
      <div className="workout-grid">{shown.map((w,i)=><WorkoutCard key={`${w.id}-${i}`} w={w}/>)}</div>}
   </div>
  </section>
 </>;
}