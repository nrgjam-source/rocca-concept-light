'use strict';
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');navigation.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);});
navigation.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();if(document.activeElement.closest('nav'))menu.focus();}});
const tabs=[...document.querySelectorAll('[data-tab]')];
function selectTab(key,focus=false){tabs.forEach(tab=>{const active=tab.dataset.tab===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.querySelector('#panel-'+tab.dataset.tab).hidden=!active;if(active&&focus)tab.focus();});}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(tab.dataset.tab));tab.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const j=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;selectTab(tabs[j].dataset.tab,true);}});});
document.querySelectorAll('[data-process]').forEach(a=>a.addEventListener('click',()=>selectTab(a.dataset.process)));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let queued=false;
function schedule(){if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;updateSticky();});}}
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',()=>{if(innerWidth>1150)closeMenu();schedule();});
schedule();

const sticky=document.querySelector('#mobile-cta');
function updateSticky(){if(!sticky||!document.querySelector('.hero')||!document.querySelector('#contact'))return;const hero=document.querySelector('.hero').getBoundingClientRect();const contact=document.querySelector('#contact').getBoundingClientRect();sticky.hidden=innerWidth>700||hero.bottom>72||contact.top<innerHeight*.8||navigation.classList.contains('open');}
menu.addEventListener('click',updateSticky);
const form=document.querySelector('#project-form');const draft=document.querySelector('#draft-link');
if(form&&draft){
 document.querySelectorAll('[data-inquiry]').forEach(link=>link.addEventListener('click',()=>{const kind=link.dataset.inquiry;if(!form.elements.task.value&&kind!=='project')form.elements.task.value=kind==='material'?'Нужен подбор материала. ':kind==='professional'?'Оценка профессионального проекта. ':kind+': ';draft.hidden=true;}));
 form.addEventListener('input',()=>{draft.hidden=true;document.querySelector('#form-status').textContent='';});
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const body=['Имя: '+form.elements.name.value,'Контакт: '+form.elements.contact.value,'Задача: '+form.elements.task.value].join('\n\n');draft.href='mailto:info@granit47spb.ru?subject='+encodeURIComponent('ROCCA — расчёт проекта')+'&body='+encodeURIComponent(body);draft.hidden=false;document.querySelector('#form-status').textContent='Письмо подготовлено. Откройте его, приложите материалы и отправьте.';draft.focus();});
}

