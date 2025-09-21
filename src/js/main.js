const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

document.addEventListener('DOMContentLoaded', function() {
  const navbar = $('#navbar');
  const navItems = $$('.navlinks a');
  const sections = $$('section[id]');

  function updateNavH(){
    document.documentElement.style.setProperty('--nav-h', navbar.offsetHeight + 'px');
  }
  updateNavH();
  window.addEventListener('resize', updateNavH);

  const progressBar = $('#progressBar');
  function onScroll(){
    // shrink navbar after scrolling
    (window.scrollY > 50) ? navbar.classList.add('shrink') : navbar.classList.remove('shrink');
    updateNavH();

    // progress bar
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
    const ratio = window.scrollY / max;
    progressBar.style.width = (ratio * 100).toFixed(2) + '%';

    const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= doc.scrollHeight - 2;
    const navBottomDoc = window.scrollY + navbar.offsetHeight;

    let active = sections[0];
    if (atBottom) {
      active = sections[sections.length - 1];
    } else {
      for (const sec of sections) {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (navBottomDoc >= top && navBottomDoc < bottom) { active = sec; break; }
      }
    }

    // highlight active nav item
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      const targetId = href ? href.substring(1) : '';
      item.classList.toggle('active', targetId === active.id);
    });
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // smooth scroll
  navItems.forEach(item=>{
    item.addEventListener('click', e=>{
      e.preventDefault();
      const href = item.getAttribute('href');
      if(!href || !href.startsWith('#')) return;

      const targetSection = $(href);
      if(!targetSection) return;

      const sectionTop = targetSection.offsetTop;
      const shrunkHeight = 14 + 24 + 2; // font-size + padding + progress bar
      const scrollPosition = sectionTop - shrunkHeight;

      window.scrollTo({ top: scrollPosition, behavior:'smooth' });
    });
  });

  // carousel
  (function(){
    const root = $('.carousel');
    if(!root) return;
    const track = $('.carousel__track', root);
    const slides = $$('.slide', root);
    const prev = $('.carousel__arrow.prev', root);
    const next = $('.carousel__arrow.next', root);
    let i = 0;
    const go = (n)=>{ i = (n + slides.length) % slides.length; track.style.transform = `translateX(-${i*100}%)`; };
    prev.addEventListener('click', ()=> go(i-1));
    next.addEventListener('click', ()=> go(i+1));
  })();

  // modal 
  (function(){
    const modal = $('#modal');
    const content = $('.modal__content', modal);
    document.addEventListener('click', (e)=>{
      if(e.target.matches('.link[data-modal]')){
        content.textContent = e.target.getAttribute('data-modal');
        modal.classList.add('open');
      }
      if(e.target.matches('.modal__close') || e.target === modal){
        modal.classList.remove('open');
      }
    });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') modal.classList.remove('open'); });
  })();

  // fade in animation
  (function(){
    const aboutSection = $('#about');
    const aboutTitle = $('.about-title');
    const aboutText = $('.about-text');
    const aboutSocial = $('.about-social');

    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          aboutTitle.classList.add('animate');
          aboutText.classList.add('animate');
          aboutSocial.classList.add('animate');
        } else {
          aboutTitle.classList.remove('animate');
          aboutText.classList.remove('animate');
          aboutSocial.classList.remove('animate');
        }
      });
    }, { threshold: 0.3 });

    if(aboutSection) {
      io.observe(aboutSection);
    }
  })();


});