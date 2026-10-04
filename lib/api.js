export const API_URL = 'https://api.abcz.workers.dev/api/fitlog';

const localImages = [
  '/assets/penpot-1.webp',
  '/assets/penpot-2.webp',
  '/assets/penpot-3.webp',
  '/assets/penpot-4.webp',
  '/assets/penpot-5.webp',
];

const seed = [
  ['BARBELL BENCH PRESS','CHEST','Barbell, Bench',25,180,4.8],
  ['PULL-UP','BACK','Pull-up Bar',15,120,4.6],
  ['BACK SQUAT','LEGS','Barbell, Rack',30,240,4.9],
  ['PUSH-UP','CHEST','Bodyweight',10,90,4.4],
  ['DUMBBELL BICEP CURL','ARMS','Dumbbells',12,80,4.3],
  ['CONVENTIONAL DEADLIFT','LEGS','Barbell',28,260,4.9],
  ['OVERHEAD PRESS','SHOULDERS','Barbell',20,150,4.3],
  ['HOLLOW-BODY PLANK','CORE','Bodyweight',10,60,4.4],
  ['RUSSIAN TWIST','CORE','Medicine Ball',8,70,4.1],
  ['DUMBBELL BICEP CURL','ARMS','Dumbbells',12,80,4.3],
  ['WALKING LUNGE','LEGS','Dumbbells (optional)',18,170,4.5],
  ['RUSSIAN TWIST','CORE','Medicine Ball',10,90,4.1],
];

const descriptions = {
  'BARBELL BENCH PRESS':'A compound press that builds chest thickness, triceps, and pressing power from a stable bench.',
  'PULL-UP':'A bodyweight pull that develops your lats, upper back, grip, and control.',
  'BACK SQUAT':'A foundational lower-body lift for building leg strength, stability, and total-body bracing.',
  'PUSH-UP':'A simple, effective pressing movement for chest, shoulders, triceps, and core control.',
  'DUMBBELL BICEP CURL':'A controlled arm movement that targets the biceps through a clean, full range of motion.',
  'CONVENTIONAL DEADLIFT':'A powerful hinge that trains the posterior chain, grip, and full-body strength.',
  'OVERHEAD PRESS':'A standing press that builds shoulder strength, upper-body stability, and overhead control.',
  'HOLLOW-BODY PLANK':'A core stability drill that teaches full-body tension and controlled breathing.',
  'RUSSIAN TWIST':'A rotational core exercise that challenges control while keeping the trunk engaged.',
  'WALKING LUNGE':'A moving single-leg pattern for quads, glutes, balance, and coordination.',
};

export const fallbacks = seed.map((x,i)=>({
  id:String(i+1), name:x[0], title:x[0], category:x[1], categories:[x[1]],
  equipment:x[2], duration:x[3], calories:x[4], rating:x[5],
  difficulty:['Intermediate','Intermediate','Advanced','Beginner'][i%4],
  sets:i%3===0?4:3, reps:i%3===0?'6-8':'8-12',
  description:descriptions[x[0]] || 'A focused movement for building strength, control, and consistent training volume.',
  instructions:[
    'Set up your equipment and choose a controlled working weight.',
    'Brace your core and keep a stable, deliberate starting position.',
    'Complete every rep through a comfortable full range of motion.',
    'Rack the weight safely, rest, and repeat for the planned sets.'
  ],
  image:localImages[i%localImages.length]
}));

function num(v, fallback){ const n=Number.parseFloat(v); return Number.isFinite(n)?n:fallback; }

export function normalizeWorkout(raw,index=0){
  const fallback=fallbacks[index % fallbacks.length];
  const cats=raw?.categories ?? raw?.category ?? raw?.muscleGroups ?? raw?.muscle_group ?? fallback.categories;
  const categories=(Array.isArray(cats)?cats:[cats]).filter(Boolean).map(String);
  const name=String(raw?.name ?? raw?.title ?? raw?.workoutName ?? fallback.name);
  return {
    ...fallback,
    id:String(raw?.id ?? raw?._id ?? fallback.id),
    name,title:name,
    category:categories[0] || fallback.category,
    categories:categories.length?categories:fallback.categories,
    equipment:raw?.equipment ?? raw?.equipment_name ?? fallback.equipment,
    duration:num(raw?.duration ?? raw?.duration_minutes ?? raw?.minutes,fallback.duration),
    calories:num(raw?.calories ?? raw?.calorie_burn,fallback.calories),
    rating:num(raw?.rating ?? raw?.score,fallback.rating),
    difficulty:raw?.difficulty ?? fallback.difficulty,
    sets:raw?.sets ?? fallback.sets,
    reps:raw?.reps ?? fallback.reps,
    description:raw?.description ?? fallback.description,
    instructions:Array.isArray(raw?.instructions)&&raw.instructions.length ? raw.instructions.slice(0,4) : fallback.instructions,
    image:raw?.image ?? raw?.imageUrl ?? raw?.thumbnail ?? fallback.image,
  };
}

export async function fetchWorkouts(){
  const res=await fetch(API_URL);
  if(!res.ok) throw new Error('Failed to fetch workouts');
  const json=await res.json();
  const data=Array.isArray(json)?json:(json?.data ?? json?.workouts ?? json?.results ?? []);
  return data.map((item,i)=>normalizeWorkout(item,i));
}

export async function fetchWorkout(id){
  const res=await fetch(`${API_URL}/${encodeURIComponent(id)}`);
  if(!res.ok) return null;
  const json=await res.json();
  return normalizeWorkout(json?.data ?? json?.workout ?? json,0);
}

export { localImages };
