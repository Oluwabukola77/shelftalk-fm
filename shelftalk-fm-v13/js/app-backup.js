const books = [
 {id:"alchemist",title:"The Alchemist",author:"Paulo Coelho",genre:"fiction",country:"Brazil",rating:"4.7",cover:"https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg",description:"A timeless story about following a dream, listening to yourself and paying attention to the journey.",links:[["Publisher / Ebook","#"],["Library search","#"],["Print edition","#"]]},
 {id:"tomorrow",title:"Tomorrow, and Tomorrow, and Tomorrow",author:"Gabrielle Zevin",genre:"fiction",country:"United States",rating:"4.8",cover:"https://covers.openlibrary.org/b/isbn/9780593321201-L.jpg",description:"A story about friendship, creativity, ambition and the complicated ways people build a life together.",links:[["Ebook","#"],["Audiobook","#"],["Print edition","#"]]},
 {id:"half-yellow-sun",title:"Half of a Yellow Sun",author:"Chimamanda Ngozi Adichie",genre:"african",country:"Nigeria",rating:"4.8",cover:"https://covers.openlibrary.org/b/isbn/9780007200286-L.jpg",description:"A powerful novel about love, war, family and the human cost of the Biafran conflict.",links:[["Publisher / Ebook","#"],["Library search","#"],["Print edition","#"]]},
 {id:"things-fall-apart",title:"Things Fall Apart",author:"Chinua Achebe",genre:"african",country:"Nigeria",rating:"4.8",cover:"https://covers.openlibrary.org/b/isbn/9780385474542-L.jpg",description:"A landmark novel about culture, change and the collision between Igbo society and colonial power.",links:[["Ebook","#"],["Library search","#"],["Print edition","#"]]},
 {id:"atomic-habits",title:"Atomic Habits",author:"James Clear",genre:"nonfiction",country:"United States",rating:"4.7",cover:"https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",description:"A practical framework for building good habits and breaking bad ones through small, consistent changes.",links:[["Author / Ebook","#"],["Audiobook","#"],["Print edition","#"]]},
 {id:"evelyn-hugo",title:"The Seven Husbands of Evelyn Hugo",author:"Taylor Jenkins Reid",genre:"fiction",country:"United States",rating:"4.6",cover:"https://covers.openlibrary.org/b/isbn/9781501161933-L.jpg",description:"A reclusive Hollywood icon finally tells the story of her life, loves and the choices that shaped her.",links:[["Ebook","#"],["Audiobook","#"],["Print edition","#"]]},
 {id:"purple-hibiscus",title:"Purple Hibiscus",author:"Chimamanda Ngozi Adichie",genre:"african",country:"Nigeria",rating:"4.7",cover:"https://covers.openlibrary.org/b/isbn/9781616202415-L.jpg",description:"A coming-of-age story about family, faith, freedom and finding a voice.",links:[["Publisher / Ebook","#"],["Library search","#"],["Print edition","#"]]},
 {id:"great-gatsby",title:"The Great Gatsby",author:"F. Scott Fitzgerald",genre:"classic",country:"United States",rating:"4.4",cover:"https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",description:"A classic portrait of longing, wealth, reinvention and the American dream.",links:[["Library / Ebook","#"],["Print edition","#"]]}
];

const authors = [
 {id:"anna",name:"Anna Davis",country:"United Kingdom",role:"Writer & literary educator",image:"https://cdn.sanity.io/images/pbcwb2z8/production/f3ac5ca67e10668c6682cc80113993aa4a2efacb-5760x3840.jpg?auto=format&fit=crop&w=900&q=80",bio:"Writer, editor and literary educator interested in how stories change the way we see ourselves and each other."},
 {id:"michels",name:"Anna Michels",country:"United States",role:"Author & editorial director",image:"https://images.squarespace-cdn.com/content/v1/550d7c8be4b01d797b316def/1441245405887-UKB0XWPWROG129W82P39/image-asset.jpeg",bio:"Author and editorial professional passionate about contemporary literature and helping stories find their readers."},
 {id:"amara",name:"Amara Okoye",country:"Nigeria",role:"Novelist & storyteller",image:"https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85",bio:"A Nigerian storyteller exploring identity, family, memory and the emotional landscapes of modern African life."}
];

function bookCard(b){return `<article class="book-card"><a href="book.html?id=${b.id}"><div class="book-cover"><img loading="lazy" src="${b.cover}" alt="${b.title} book cover"></div><h3>${b.title}</h3><p>${b.author}</p><div class="book-meta"><span class="book-tag">${b.genre}</span><span>★ ${b.rating}</span></div></a></article>`}
function authorCard(a){return `<article class="author-card"><img loading="lazy" src="${a.image}" alt="${a.name}"><div><span class="location">${a.country}</span><h3>${a.name}</h3><p>${a.role}</p><a href="author.html?id=${a.id}">View profile →</a></div></article>`}

const homeGrid=document.getElementById("bookGrid");
if(homeGrid) homeGrid.innerHTML=books.slice(0,4).map(bookCard).join("");

const allBooks=document.getElementById("allBooks");
if(allBooks){
  allBooks.innerHTML=books.map(bookCard).join("");
  document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");const f=btn.dataset.filter;allBooks.innerHTML=books.filter(b=>f==="all"||b.genre===f).map(bookCard).join("")}));
}

const allAuthors=document.getElementById("allAuthors");
if(allAuthors) allAuthors.innerHTML=authors.map(authorCard).join("");

const bookDetail=document.getElementById("bookDetail");
if(bookDetail){
  const id=new URLSearchParams(location.search).get("id")||"alchemist"; const b=books.find(x=>x.id===id)||books[0];
  bookDetail.innerHTML=`<section class="book-detail"><div class="detail-cover"><img src="${b.cover}" alt="${b.title} book cover"></div><div><span class="eyebrow">${b.country} • ${b.genre}</span><h1>${b.title}</h1><p class="author-line">by ${b.author}</p><p>${b.description}</p><div class="rating">★★★★★ <span>${b.rating} ShelfTalk rating</span></div><div class="access-box"><h3>Where can I access this book?</h3><p>ShelfTalk links readers to legitimate places to read, buy, listen to or find the book.</p><div class="access-links">${b.links.map(l=>`<a href="${l[1]}" target="_blank" rel="noopener">${l[0]} ↗</a>`).join("")}</div></div><div class="hero-actions"><a class="btn btn-primary" href="#discussion">Join the discussion</a><a class="btn btn-outline" href="books.html">Back to books</a></div></div></section><section class="section" id="discussion"><span class="eyebrow">COMMUNITY</span><h2>Talk about ${b.title}.</h2><p>Discussion threads, reader reviews and buddy reads will live here once Supabase community features are connected.</p></section>`;
}

const authorDetail=document.getElementById("authorDetail");
if(authorDetail){
  const id=new URLSearchParams(location.search).get("id")||"anna"; const a=authors.find(x=>x.id===id)||authors[0]; const authored=books.filter(b=>b.author===a.name);
  authorDetail.innerHTML=`<section class="author-detail"><div class="author-profile"><img src="${a.image}" alt="${a.name}"><div><span class="eyebrow">${a.country}</span><h1>${a.name}</h1><p class="author-line">${a.role}</p><p>${a.bio}</p><div class="hero-actions"><a class="btn btn-primary" href="services.html">Work with ShelfTalk</a><a class="btn btn-outline" href="authors.html">All authors</a></div></div></div><div class="author-books"><span class="eyebrow">BOOKS</span><h2>From the author's shelf.</h2><div class="book-grid">${(authored.length?authored:books.slice(0,4)).map(bookCard).join("")}</div></div></section>`;
}

const newsletterForm=document.getElementById("newsletterForm");
if(newsletterForm) newsletterForm.addEventListener("submit",e=>{e.preventDefault();document.getElementById("newsletterStatus").textContent="Thanks — your subscription request has been received. Connect Supabase to store it permanently.";newsletterForm.reset()});
const serviceForm=document.getElementById("serviceForm");
if(serviceForm) serviceForm.addEventListener("submit",e=>{e.preventDefault();document.getElementById("serviceStatus").textContent="Request captured. Connect Supabase to send it to the ShelfTalk admin dashboard.";serviceForm.reset()});

const toggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".main-nav");
if(toggle) toggle.addEventListener("click",()=>nav.classList.toggle("open"));


// Author spotlight countdowns and community impact counters
function initCountdowns(){document.querySelectorAll('[data-countdown]').forEach(el=>{const target=new Date(el.dataset.countdown).getTime();const tick=()=>{let d=Math.max(0,target-Date.now());const days=Math.floor(d/86400000);d%=86400000;const hours=Math.floor(d/3600000);d%=3600000;const minutes=Math.floor(d/60000);const seconds=Math.floor((d%60000)/1000);['days','hours','minutes','seconds'].forEach((u,i)=>{const n=[days,hours,minutes,seconds][i];const node=el.querySelector('[data-unit="'+u+'"]');if(node)node.textContent=String(n).padStart(2,'0')});if(target-Date.now()<=0)el.classList.add('countdown-live')};tick();setInterval(tick,1000)})}
function initCounters(){const els=document.querySelectorAll('.count-up');if(!els.length)return;const run=()=>els.forEach(el=>{if(el.dataset.done)return;el.dataset.done='1';const target=Number(el.dataset.target)||0;let start=0;const duration=1500;const t0=performance.now();const step=now=>{const p=Math.min(1,(now-t0)/duration);start=Math.floor(target*(1-Math.pow(1-p,3)));el.textContent=start.toLocaleString();if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)});if('IntersectionObserver' in window){const obs=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){run();obs.disconnect()}},{threshold:.25});els.forEach(e=>obs.observe(e))}else run()}
initCountdowns();initCounters();
