(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.getElementById('nav');
  const heroBg = document.getElementById('heroBg');
  const hero = document.getElementById('hero');

  // Parallax + nav shadow (requestAnimationFrame za glatkoću)
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 10);
    if (!reduce && y < hero.offsetHeight) heroBg.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  // Mobilni meni
  const burger = document.getElementById('burger');
  const links = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open'); burger.setAttribute('aria-expanded', false);
  }));

  // Reveal pri skrolu
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Korpa
  const countEl = document.getElementById('cartCount');
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const render = () => {
    countEl.textContent = cart.length;
    countEl.classList.toggle('show', cart.length > 0);
  };
  render();

  document.querySelectorAll('.add').forEach(btn => {
    btn.addEventListener('click', () => {
      cart.push(btn.dataset.name);
      localStorage.setItem('cart', JSON.stringify(cart));
      render();
      countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump');
      const old = btn.textContent;
      btn.textContent = 'Dodato ✓';
      btn.classList.add('done');
      setTimeout(() => { btn.textContent = old; btn.classList.remove('done'); }, 1400);
    });
  });
})();
