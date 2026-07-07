(function(){
  function ready(fn){document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();}
  ready(function(){
    const form = document.getElementById('contactForm');
    const status = document.getElementById('contactStatus');
    if(!form || !status) return;
    form.addEventListener('submit', function(){
      status.classList.add('is-success');
    });
  });
})();
