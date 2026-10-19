'use strict';
/* ROCCA Light motion and gallery. Business logic remains in main.js/private.js. */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const desktop=matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
 const smoothDevice=matchMedia('(min-width: 768px) and (pointer: fine)');
 const root=document.documentElement;
 root.classList.add('motion-ready');
 let lenis=null;
 function configureScroll(){
  lenis?.destroy();lenis=null;
  if(!reduce.matches&&smoothDevice.matches&&typeof window.Lenis==='function'){
   lenis=new Lenis({lerp:.14,smoothWheel:true,syncTouch:false,anchors:false,prevent:node=>!!node.closest('[data-lenis-prevent],form,#navigation.open,textarea,select')});
  }
  root.classList.toggle('rocca-smooth-scroll',!!lenis);
 }
 configureScroll();
 smoothDevice.addEventListener('change',configureScroll);

 // Keep heading markup and explicit line breaks; wrap words, not letters.
 const wordHeads=[...document.querySelectorAll('[data-word-reveal],.editorial-home h1,.editorial-home h2,.journal-copy h1,.page-heading h1')];
 function prepareWords(h){
  if(h.dataset.wordsReady)return;h.dataset.wordsReady='true';
  const label=h.innerText.replace(/\s+/g,' ').trim();h.setAttribute('aria-label',label);
  const walker=document.createTreeWalker(h,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  const count=nodes.reduce((n,t)=>n+(t.textContent.match(/\S+/g)||[]).length,0);let index=0;
  nodes.forEach(node=>{const f=document.createDocumentFragment();node.textContent.split(/(\s+)/).filter(Boolean).forEach(word=>{
   if(/^\s+$/.test(word)){f.append(document.createTextNode(word));return;}
   const clip=document.createElement('span'),inside=document.createElement('span');clip.className='word-clip';clip.setAttribute('aria-hidden','true');inside.className='word-inner';inside.style.setProperty('--word-delay',`${Math.min(index*70,Math.max(0,900-650))}ms`);inside.textContent=word;clip.append(inside);f.append(clip);index++;
  });node.replaceWith(f);});
 }
 if(!reduce.matches)wordHeads.forEach(prepareWords);
 const homeHero=document.querySelector('.editorial-home .hero');
 const heroWords=homeHero?.querySelector('h1');
 const wordObserver='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('words-visible');wordObserver.unobserve(e.target);}}),{threshold:.15}):null;
 wordHeads.forEach(h=>{if(h!==heroWords){if(reduce.matches||!wordObserver)h.classList.add('words-visible');else wordObserver.observe(h);}});

 const entries=[...document.querySelectorAll('[data-motion],.technology-item')].filter(e=>!wordHeads.includes(e)&&!e.closest('.hero')&&!e.matches('[data-image-reveal]'));
 const entryObserver='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('motion-visible');entryObserver.unobserve(e.target);}}),{threshold:.1,rootMargin:'0px 0px -20px 0px'}):null;
 entries.forEach(e=>{if(reduce.matches||!entryObserver)e.classList.add('motion-visible');else{e.classList.add('motion-pending');entryObserver.observe(e);}});

 // Nested layers isolate entry, parallax and hover transforms.
 const imageFrames=[...document.querySelectorAll('[data-image-reveal]')];
 imageFrames.forEach(frame=>{
  const img=frame.querySelector('img');if(!img)return;
  const entry=document.createElement('div'),depth=document.createElement('div');entry.className='motion-image-layer';depth.className='motion-parallax-layer';img.before(entry);depth.append(img);entry.append(depth);
 });
 const imageObserver='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('image-visible');imageObserver.unobserve(e.target);}}),{threshold:.07,rootMargin:'0px 0px -15px 0px'}):null;
 imageFrames.forEach(frame=>{if(reduce.matches||!imageObserver)frame.classList.add('image-visible');else{frame.classList.add('image-pending');imageObserver.observe(frame);}});

 if(homeHero){
  const image=homeHero.querySelector('.hero-photo img');
  if(!reduce.matches)homeHero.classList.add('motion-hero');
  homeHero.querySelectorAll('.intro,.actions,.hero-helper').forEach((e,i)=>{e.classList.add('hero-detail');e.style.setProperty('--detail-delay',`${250+i*120}ms`);});
  const show=()=>{homeHero.classList.add('hero-motion-ready');heroWords?.classList.add('words-visible');};
  if(image){const ready=()=>Promise.race([image.decode().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,1000))]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(show)));if(image.complete)ready();else{image.addEventListener('load',ready,{once:true});image.addEventListener('error',show,{once:true});setTimeout(show,1600);}}
  else show();
 }

 // A single optional preloader per session, no blocking of input or page scrolling.
 function preload(){
  if(reduce.matches||!smoothDevice.matches)return;
  try{if(sessionStorage.getItem('rocca-light-entry-v1'))return;sessionStorage.setItem('rocca-light-entry-v1','seen');}catch{return;}
  const brand=document.querySelector('header .brand');if(!brand)return;
  const screen=document.createElement('div');screen.className='site-preloader';screen.setAttribute('aria-hidden','true');screen.inert=true;
  const mark=brand.cloneNode(true);mark.removeAttribute('href');mark.removeAttribute('aria-label');screen.append(mark);const line=document.createElement('span');line.className='site-preloader-line';screen.append(line);document.body.append(screen);
  setTimeout(()=>{screen.classList.add('is-done');setTimeout(()=>screen.remove(),280);},650);
 }
 preload();

 const parallaxFrames=[...document.querySelectorAll('[data-parallax]')];
 // Homepage desktop Hero remains compositionally unchanged; only its photograph gains shallow depth.
 if(homeHero){const frame=homeHero.querySelector('.hero-photo');if(frame&&!frame.querySelector('.motion-parallax-layer')){const img=frame.querySelector('img');const layer=document.createElement('div');layer.className='motion-parallax-layer';img.before(layer);layer.append(img);parallaxFrames.push(frame);}}
 const activeFrames=new Set();let scrollDirty=true;
 const depthObserver='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)activeFrames.add(e.target);else activeFrames.delete(e.target);scrollDirty=true;}),{rootMargin:'100px 0px',threshold:0}):null;
 parallaxFrames.forEach(frame=>depthObserver?.observe(frame));
 addEventListener('scroll',()=>{scrollDirty=true;},{passive:true});addEventListener('resize',()=>{scrollDirty=true;},{passive:true});
 function resetDepth(){parallaxFrames.forEach(f=>{f.style.removeProperty('--parallax-y');f.style.removeProperty('--parallax-scale');});scrollDirty=true;}
 desktop.addEventListener('change',resetDepth);
 function frame(time){
  lenis?.raf(time);
  if(scrollDirty){
   scrollDirty=false;
   if(desktop.matches&&!reduce.matches&&!document.hidden){
    const updates=[...activeFrames].map(el=>{const r=el.getBoundingClientRect();const progress=Math.max(-1,Math.min(1,(r.top+r.height/2-innerHeight/2)/(innerHeight/2+r.height/2)));return[el,Math.round(progress*28*10)/10];});
    updates.forEach(([el,y])=>{el.style.setProperty('--parallax-y',y+'px');el.style.setProperty('--parallax-scale',el.classList.contains('hero-photo')?'1.035':'1.075');});
   }
  }
  requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);

 // Same-page anchors work with native scrolling and Lenis, including keyboard focus.
 document.addEventListener('click',event=>{
  const a=event.target.closest('a[href]');if(!a||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||a.target||a.hasAttribute('download'))return;
  const url=new URL(a.href,location.href);if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash)return;
  let target;try{target=document.getElementById(decodeURIComponent(url.hash.slice(1)));}catch{return;}if(!target||!lenis)return;
  event.preventDefault();history.pushState(null,'',url.hash);const offset=-(document.querySelector('header')?.offsetHeight||90)-18;
  lenis.scrollTo(target,{offset,onComplete:()=>{const added=!target.hasAttribute('tabindex');if(added)target.tabIndex=-1;target.focus({preventScroll:true});if(added)target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true});}});
 });
 document.addEventListener('focusin',e=>{if(e.target.closest('form'))lenis?.start();});

 // Magnetic movement is bounded to six CSS pixels and never affects forms.
 document.querySelectorAll('[data-magnetic],.button,.nav-cta,.production-copy .text-link').forEach(button=>{
  let pending=false,last=null;
  button.addEventListener('pointermove',e=>{if(!desktop.matches||reduce.matches||e.pointerType!=='mouse')return;last=e;if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;if(!last)return;const r=button.getBoundingClientRect();const x=Math.max(-6,Math.min(6,(last.clientX-r.left-r.width/2)*.045));const y=Math.max(-6,Math.min(6,(last.clientY-r.top-r.height/2)*.1));button.style.setProperty('--magnet-x',x+'px');button.style.setProperty('--magnet-y',y+'px');});});
  button.addEventListener('pointerleave',()=>{last=null;button.style.removeProperty('--magnet-x');button.style.removeProperty('--magnet-y');});button.setAttribute('data-magnetic','');
 });

 const cursor=document.createElement('div');cursor.className='context-cursor';cursor.textContent='СМОТРЕТЬ ↗';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);let cursorPoint=null,cursorQueued=false;
 document.querySelectorAll('[data-context-cursor]').forEach(link=>{
  link.addEventListener('pointerenter',()=>{if(desktop.matches&&!reduce.matches)cursor.classList.add('is-active');});link.addEventListener('pointerleave',()=>cursor.classList.remove('is-active'));
  link.addEventListener('pointermove',e=>{if(!desktop.matches||reduce.matches)return;cursorPoint=[e.clientX+16,e.clientY+16];if(cursorQueued)return;cursorQueued=true;requestAnimationFrame(()=>{cursorQueued=false;cursor.style.transform=`translate3d(${cursorPoint[0]}px,${cursorPoint[1]}px,0)`;});});
 });
 const chapters=[...document.querySelectorAll('[data-chapter]')];
 if(chapters.length&&'IntersectionObserver' in window){const current=new Map();const io=new IntersectionObserver(entries=>{entries.forEach(e=>current.set(e.target,e.isIntersecting));const active=chapters.find(c=>current.get(c));if(!active)return;document.querySelectorAll('[data-chapter-link]').forEach(a=>{if(a.hash==='#'+active.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});},{rootMargin:'-22% 0px -55% 0px',threshold:0});chapters.forEach(c=>io.observe(c));}
 const marquee=document.querySelector('.materials-marquee');marquee?.querySelector('button').addEventListener('click',e=>{const paused=marquee.classList.toggle('is-paused');e.currentTarget.setAttribute('aria-pressed',String(paused));e.currentTarget.setAttribute('aria-label',paused?'Продолжить строку материалов':'Приостановить строку материалов');e.currentTarget.textContent=paused?'▶':'Ⅱ';});

 // Native horizontal scroll-snap: mouse drag, touch, arrows and keyboard share one rail.
 document.querySelectorAll('[data-gallery-rail]').forEach(rail=>{
  const section=rail.closest('section'),slides=[...rail.querySelectorAll('.rail-slide')],prev=section.querySelector('[data-rail-prev]'),next=section.querySelector('[data-rail-next]'),count=section.querySelector('[data-rail-count]'),progress=section.querySelector('[data-rail-progress]');
  let active=0,pending=false,drag=null;
  function update(){const r=rail.getBoundingClientRect();const left=r.left+parseFloat(getComputedStyle(rail).paddingLeft);let distance=Infinity;slides.forEach((slide,i)=>{const d=Math.abs(slide.getBoundingClientRect().left-left);if(d<distance){distance=d;active=i;}});slides.forEach((s,i)=>s.classList.toggle('is-active',i===active));prev.disabled=active===0;next.disabled=active===slides.length-1;count.textContent=`${String(active+1).padStart(2,'0')} / ${slides.length}`;progress.value=active+1;}
  function go(index){const target=slides[Math.max(0,Math.min(slides.length-1,index))];rail.scrollTo({left:target.offsetLeft-rail.offsetLeft-parseFloat(getComputedStyle(rail).paddingLeft),behavior:reduce.matches||Math.abs(index-active)>2?'instant':'smooth'});}
  prev.addEventListener('click',()=>go(active-1));next.addEventListener('click',()=>go(active+1));
  rail.addEventListener('scroll',()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;update();});},{passive:true});
  rail.addEventListener('keydown',e=>{if(e.target!==rail)return;if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();go(e.key==='Home'?0:e.key==='End'?slides.length-1:active+(e.key==='ArrowRight'?1:-1));}});
  rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,left:rail.scrollLeft,id:e.pointerId,moved:false};});
  rail.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>5&&!drag.moved){drag.moved=true;rail.classList.add('is-dragging');rail.setPointerCapture(drag.id);}if(drag.moved){e.preventDefault();rail.scrollLeft=drag.left-dx;}});
  const release=()=>{if(!drag)return;const moved=drag.moved;drag=null;rail.classList.remove('is-dragging');if(moved){update();go(active);}};rail.addEventListener('pointerup',release);rail.addEventListener('pointercancel',release);rail.addEventListener('pointerleave',()=>{if(drag&&!drag.moved)release();});rail.addEventListener('dragstart',e=>e.preventDefault());rail.querySelectorAll('img').forEach(i=>i.draggable=false);addEventListener('resize',update,{passive:true});update();
 });
 reduce.addEventListener('change',()=>{
  configureScroll();resetDepth();
  if(reduce.matches){entries.forEach(e=>e.classList.add('motion-visible'));wordHeads.forEach(e=>e.classList.add('words-visible'));imageFrames.forEach(e=>e.classList.add('image-visible'));homeHero?.classList.add('hero-motion-ready');document.querySelector('.site-preloader')?.remove();cursor.classList.remove('is-active');document.querySelectorAll('[data-magnetic]').forEach(e=>{e.style.removeProperty('--magnet-x');e.style.removeProperty('--magnet-y');});}
 });
})();
