import Link from 'next/link';
import {ArrowUpRight,Clock3,Flame,Star} from 'lucide-react';
export default function WorkoutCard({w}){return <Link href={`/workout/${w.id}`} className="workout-card group">
 <div className="workout-thumb">
  <img src={w.image} alt={w.name}/>
  <div className="card-tags">{w.categories.slice(0,2).map(c=><span className="tag" key={c}>{c}</span>)}</div>
  <span className="card-arrow"><ArrowUpRight size={15}/></span>
 </div>
 <div className="card-body">
  <h3 className="display card-title">{w.name}</h3>
  <p className="equipment">{w.equipment}</p>
  <div className="stats"><span className="stat"><Clock3 size={12}/>{w.duration} min</span><span className="stat"><Flame size={12}/>{w.calories} kcal</span><span className="stat"><Star size={12}/>{w.rating}</span></div>
 </div>
 </Link>}