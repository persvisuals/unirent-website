/* UniRent v14 — tiny QA helpers */
(function(){
  function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();}
  ready(function(){
    // Add a scroll state hook for future styling without changing layout now.
    var onScroll=function(){document.body.classList.toggle('ur-scrolled', window.scrollY>24);};
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});

    // Keep mobile menu from staying open after orientation/resize changes.
    var closeMenus=function(){
      document.querySelectorAll('.navlinks.is-open').forEach(function(el){el.classList.remove('is-open');});
      document.querySelectorAll('.menu[aria-expanded="true"]').forEach(function(btn){btn.setAttribute('aria-expanded','false');});
    };
    window.addEventListener('resize', closeMenus, {passive:true});

    // Make generated floating CTA more explicit for screen readers.
    document.querySelectorAll('.floating-reserve').forEach(function(a){
      a.setAttribute('aria-label','Rezervišite vozilo');
    });

    // Lazy-load non-critical article and card images where not already defined.
    document.querySelectorAll('main img, section img').forEach(function(img){
      if(!img.hasAttribute('loading') && !img.closest('.hero,.hero-sub,.home-hero-v13')) img.setAttribute('loading','lazy');
      if(!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
    });
  });
})();
