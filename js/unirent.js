/* UniRent shared behavior (v6)
   - renders one shared navigation and footer
   - handles mobile nav, image fallbacks, reveal animations, reservation URL flow, floating CTA, and static contact feedback
*/
(function(){
  function ready(fn){document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();}

  const NAV_ITEMS = [
    ['home','Početna','index.html'],
    ['uslovi','Uslovi najma','uslovi-najma.html'],
    ['vozni','Vozni park','vozni-park.html'],
    ['rezervacija','Rezervacija vozila','rezervacija-vozila.html'],
    ['cenovnik','Cenovnik','cenovnik.html'],
    ['blog','Blog','blog.html'],
    ['kontakt','Kontakt','kontakt.html']
  ];

  function renderNav(){
    document.querySelectorAll('[data-unirent-nav]').forEach(function(target){
      const active = target.getAttribute('data-active') || '';
      const links = NAV_ITEMS.map(function(item){
        const isActive = item[0] === active;
        return '<a href="'+item[2]+'"'+(isActive?' class="active" aria-current="page"':'')+'>'+item[1]+'</a>';
      }).join('');
      target.innerHTML = '<nav class="nav"><a class="logo logo-image" href="index.html" aria-label="UniRent rent-a-car početna"><img class="brand-logo" src="assets/logo/unirent-logo.png" alt="UniRent Rent a Car"/><span class="sr-only">UniRent Rent a Car</span></a><div class="navlinks" id="primary-navigation">'+links+'</div><button class="menu" type="button" aria-label="Otvori meni" aria-controls="primary-navigation" aria-expanded="false">Meni</button></nav>';
    });
  }

  function renderFooter(){
    document.querySelectorAll('[data-unirent-footer]').forEach(function(target){
      target.innerHTML = '<footer id="kontakt" class="footer footer-v22"><div class="container"><div class="footer-grid"><div class="footer-brand"><a class="footer-logo-link" href="index.html" aria-label="UniRent rent-a-car početna"><img class="footer-brand-logo" src="assets/logo/unirent-logo.png" alt="UniRent Rent a Car"/></a><p>Pouzdan rent-a-car u Beogradu. Jasne cene, pregledan cenovnik i jednostavan tok rezervacije za gradske, poslovne i duže vožnje.</p></div><nav class="foot-links" aria-label="Footer navigacija"><div><a href="index.html">Početna</a><a href="vozni-park.html">Vozni park</a><a href="cenovnik.html">Cenovnik</a><a href="rezervacija-vozila.html">Rezervacija vozila</a></div><div><a href="uslovi-najma.html">Uslovi najma</a><a href="blog.html">Blog</a><a href="kontakt.html">Kontakt</a></div></nav></div><div class="copy">© 2026 UniRent. Sva prava zadržana.</div></div></footer>';
    });
  }

  function setupMobileNavs(){
    document.querySelectorAll('.nav').forEach(function(nav, index){
      const links = nav.querySelector('.navlinks');
      const btn = nav.querySelector('.menu,.hamb');
      if(!links || !btn) return;
      if(!links.id || index > 0) links.id = 'primary-navigation-' + index;
      btn.classList.add('menu');
      btn.type = 'button';
      btn.setAttribute('aria-controls', links.id);
      btn.setAttribute('aria-expanded','false');
      if(!btn.textContent.trim() || btn.textContent.trim()==='☰' || btn.textContent.trim()==='Menu') btn.textContent='Meni';
      const setOpen = function(open){
        links.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? 'Zatvori' : 'Meni';
        document.body.classList.toggle('nav-menu-open', open);
      };
      setOpen(false);
      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        setOpen(!links.classList.contains('is-open'));
      });
      links.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click', function(){setOpen(false);});
        a.addEventListener('touchstart', function(){setOpen(false);}, {passive:true});
      });
      document.addEventListener('click', function(e){if(!nav.contains(e.target)) setOpen(false);});
      document.addEventListener('keydown', function(e){if(e.key === 'Escape') setOpen(false);});
      window.addEventListener('pageshow', function(){setOpen(false);});
      window.addEventListener('pagehide', function(){setOpen(false);});
      window.addEventListener('resize', function(){setOpen(false);}, {passive:true});
    });
  }

  function setupImageFallbacks(){
    document.querySelectorAll('img[data-fallback]').forEach(function(img){
      const slot = img.closest('.image-slot');
      const ph = slot ? slot.querySelector('.placeholder,.slot') : null;
      const loaded = function(){
        if(img.naturalWidth > 0){
          img.classList.remove('is-missing');
          if(slot) slot.classList.add('has-image');
          if(ph) ph.style.display = 'none';
        } else missing();
      };
      const missing = function(){
        img.classList.add('is-missing');
        if(slot) slot.classList.remove('has-image');
        if(ph) ph.style.display = 'flex';
      };
      img.addEventListener('load', loaded);
      img.addEventListener('error', missing);
      if(img.complete){ img.naturalWidth > 0 ? loaded() : missing(); }
    });
  }

  function setupReveal(){
    const els = document.querySelectorAll('.reveal');
    if(!els.length) return;
    if(!('IntersectionObserver' in window)){
      els.forEach(function(el){el.classList.add('in');});
      return;
    }
    const io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){ if(entry.isIntersecting) entry.target.classList.add('in'); });
    }, {threshold:.12});
    els.forEach(function(el){io.observe(el);});
  }

  function setupReservationFlow(){
    const p = new URLSearchParams(window.location.search);
    ['pickupDate','pickupTime','returnDate','returnTime'].forEach(function(id){
      const el = document.getElementById(id);
      if(el && p.get(id)) el.value = p.get(id);
    });

    const vehicle = p.get('vehicle');
    if(vehicle){
      const title = document.getElementById('selectedTitle');
      const info = document.getElementById('selectedInfo');
      const panel = document.getElementById('selectedPanel');
      if(title && info && panel){
        const details = [];
        if(p.get('group')) details.push(p.get('group'));
        if(p.get('price')) details.push('od ' + p.get('price') + ' / dan');
        title.textContent = vehicle;
        info.textContent = details.length ? details.join(' • ') + '. Proverite datume i nastavite rezervaciju.' : 'Vozilo je prosleđeno iz ponude. Proverite datume i završite rezervaciju.';
        if(p.get('source') === 'cenovnik') panel.classList.add('from-price-list');
        panel.classList.add('show');
        if(p.get('source') !== 'cenovnik') setTimeout(function(){panel.classList.remove('show');}, 4200);
      }
    }

    document.querySelectorAll('.car-card .more,.card .more').forEach(function(btn){
      const card = btn.closest('.car-card,.card');
      if(!card || location.pathname.endsWith('rezervacija-vozila.html') || btn.classList.contains('vehicle-primary')) return;
      const titleNode = card.querySelector('h3') || card.querySelector('.car-title');
      const name = titleNode ? titleNode.textContent.trim() : '';
      if(!name) return;
      btn.textContent = 'Rezerviši →';
      btn.type = 'button';
      btn.addEventListener('click', function(){
        const q = new URLSearchParams({vehicle:name});
        ['pickupDate','pickupTime','returnDate','returnTime'].forEach(function(id){
          const el = document.getElementById(id);
          if(el && el.value) q.set(id, el.value);
        });
        window.location.href = 'rezervacija-podaci.html?' + q.toString();
      });
    });

    const pd = document.getElementById('pickupDate');
    const rd = document.getElementById('returnDate');
    if(pd && rd){
      const sync = function(){rd.min = pd.value; if(rd.value && pd.value && rd.value < pd.value) rd.value = pd.value;};
      pd.addEventListener('change', sync);
      sync();
    }
  }

  function setupFloatingCTA(){
    if(location.pathname.endsWith('rezervacija-vozila.html') || location.pathname.endsWith('rezervacija-podaci.html') || location.pathname.endsWith('cenovnik.html')) return;
    const a = document.createElement('a');
    a.className = 'floating-reserve';
    a.href = 'rezervacija-vozila.html';
    a.textContent = 'Rezervišite vozilo →';
    document.body.appendChild(a);
    const show = function(){a.classList.toggle('is-visible', window.scrollY > 520);};
    show();
    window.addEventListener('scroll', show, {passive:true});
  }

  function setupContactForm(){
    const form = document.getElementById('contactForm');
    if(!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const msg = document.getElementById('contactStatus');
      if(msg) msg.textContent = 'Upit je pripremljen. Povežite formu sa mejlom ili CRM-om pre objave sajta.';
    });
  }

  ready(function(){
    renderNav();
    renderFooter();
    setupMobileNavs();
    setupImageFallbacks();
    window.addEventListener('load', setupImageFallbacks);
    setupReveal();
    setupReservationFlow();
    setupFloatingCTA();
    setupContactForm();
  });
})();
