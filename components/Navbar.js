'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Dumbbell,Menu,X} from 'lucide-react';
import {useState} from 'react';
import {usePlan} from './PlanProvider';

export default function Navbar(){
 const path=usePathname();
 const {plan,saved}=usePlan();
 const [open,setOpen]=useState(false);
 const workoutActive=path==='/' || path?.startsWith('/workout');
 return <header className="nav-shell sticky top-0 z-50">
  <div className="container nav-inner">
   <Link href="/" className="logo" onClick={()=>setOpen(false)}>
    <span className="logo-mark"><Dumbbell size={16}/></span><span>FITLOG</span>
   </Link>
   <nav className="nav-links">
    <Link className={workoutActive?'active':''} href="/#library">Workouts</Link>
    <Link className={path==='/my-plan'?'active':''} href="/my-plan">My Plan</Link>
   </nav>
   <div className="nav-status">
    <Link href="/my-plan" className="badge plan">Plan <strong>{plan.length}</strong></Link>
    <Link href="/my-plan" className="badge">Saved <strong>{saved.length}</strong></Link>
    <button className="menu-btn" onClick={()=>setOpen(v=>!v)} aria-label="Open menu">{open?<X size={20}/>:<Menu size={20}/>}</button>
   </div>
  </div>
  {open && <div className="border-t border-[#262a2c] bg-[#0d0f10]">
    <div className="container flex flex-col">
      <Link href="/#library" onClick={()=>setOpen(false)} className="border-b border-[#262a2c] py-4 text-[10px] font-black uppercase tracking-[.14em]">Workouts</Link>
      <Link href="/my-plan" onClick={()=>setOpen(false)} className="py-4 text-[10px] font-black uppercase tracking-[.14em]">My Plan</Link>
    </div>
  </div>}
 </header>
}