
(() => {
  const sideLinks = Array.from(document.querySelectorAll('.terms-side a'));
  const panels = Array.from(document.querySelectorAll('.term-panel[id]'));
  if (!sideLinks.length || !panels.length) return;

  const byId = new Map(sideLinks.map(link => [link.getAttribute('href')?.slice(1), link]));
  const setActive = id => {
    sideLinks.forEach(link => link.classList.toggle('is-active', link === byId.get(id)));
  };

  sideLinks.forEach(link => {
    link.addEventListener('click', () => {
      const panel = document.getElementById(link.getAttribute('href').slice(1));
      if (panel && !panel.open) panel.open = true;
    });
  });

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(visible.target.id);
  }, { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] });

  panels.forEach(panel => observer.observe(panel));
  setActive(panels[0].id);
})();
