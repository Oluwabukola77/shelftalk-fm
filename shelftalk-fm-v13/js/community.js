(async function(){
 const db=window.shelfTalkDB, target=document.getElementById('eventPreview'); if(!target)return;
 if(!db){target.innerHTML='<div class="empty-state"><h3>Community calendar is ready.</h3><p>Connect Supabase to load live events.</p></div>';return;}
 const {data,error}=await db.from('events').select('*').eq('status','published').gte('starts_at',new Date().toISOString()).order('starts_at',{ascending:true}).limit(3);
 if(error||!data?.length){target.innerHTML='<div class="empty-state"><h3>Nothing scheduled yet.</h3><p>New ShelfTalk gatherings will appear here.</p></div>';return;}
 target.innerHTML=data.map(e=>`<article class="event-card"><div class="event-image" style="background-image:url('${e.image_url||'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=85'}')"></div><div class="event-card-body"><span class="eyebrow">${new Date(e.starts_at).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}</span><h3>${e.title}</h3><p>${e.description||'A ShelfTalk literary gathering.'}</p><a class="text-btn" href="events.html">View event →</a></div></article>`).join('');
})();
