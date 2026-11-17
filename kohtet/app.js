const drawer=document.getElementById('drawer');
const scrim=document.getElementById('scrim');
const menuBtn=document.getElementById('menuBtn');
const closeMenu=document.getElementById('closeMenu');

function openMenu(){
  drawer.classList.add('open');
  scrim.classList.add('show');
  drawer.setAttribute('aria-hidden','false');
  menuBtn.setAttribute('aria-expanded','true');
}

function closeDrawer(){
  drawer.classList.remove('open');
  scrim.classList.remove('show');
  drawer.setAttribute('aria-hidden','true');
  menuBtn.setAttribute('aria-expanded','false');
}

menuBtn.addEventListener('click',openMenu);
closeMenu.addEventListener('click',closeDrawer);
scrim.addEventListener('click',closeDrawer);
drawer.querySelectorAll('a').forEach((link)=>link.addEventListener('click',closeDrawer));
document.addEventListener('keydown',(event)=>{
  if(event.key==='Escape') closeDrawer();
});
