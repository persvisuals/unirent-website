(function(){
  function ready(fn){document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();}
  ready(function(){
    const buttons = Array.from(document.querySelectorAll('[data-blog-filter]'));
    const cards = Array.from(document.querySelectorAll('#blogGrid [data-category]'));
    const count = document.getElementById('blogCount');
    if(!buttons.length || !cards.length) return;
    function apply(filter){
      let visible = 0;
      cards.forEach(function(card){
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.style.display = show ? '' : 'none';
        if(show) visible += 1;
      });
      buttons.forEach(function(btn){btn.classList.toggle('is-active', btn.getAttribute('data-blog-filter') === filter);});
      if(count) count.textContent = visible + (visible === 1 ? ' tekst' : ' tekstova');
    }
    buttons.forEach(function(btn){btn.addEventListener('click', function(){apply(btn.getAttribute('data-blog-filter'));});});
  });
})();
