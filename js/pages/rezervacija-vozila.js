/* UniRent reservation page behavior — v10 booking-flow UX */
(function(){
function initReservationV10(){

const cars=[
  {name:'Hyundai Santa Fe 4x4',cls:'SUV',group:'Grupa SUV',fuel:'Dizel',auto:true,img:'assets/cars/fleet/hyundai-santa-fe.png',price:'95 €'},
  {name:'VW Taigo Automatic TSI',cls:'B',group:'Grupa B',fuel:'Benzin',auto:true,img:'assets/cars/fleet/vw-taigo.png',price:'42 €'},
  {name:'Skoda Superb 4x4',cls:'D',group:'Grupa D',fuel:'Dizel',auto:true,img:'assets/cars/fleet/skoda-superb.png',price:'58 €'},
  {name:'Volvo XC90 4x4',cls:'SUV',group:'Grupa SUV',fuel:'Dizel',auto:true,img:'assets/cars/fleet/volvo-xc90.png',price:'95 €'},
  {name:'Toyota RAV4 4x4',cls:'SUV',group:'Grupa SUV',fuel:'Hybrid',auto:true,img:'assets/cars/fleet/toyota-rav4.png',price:'72 €'},
  {name:'Hyundai Tucson 4x4',cls:'SUV',group:'Grupa SUV',fuel:'Dizel',auto:true,img:'assets/cars/fleet/hyundai-tucson.png',price:'72 €'}
];
let autoOnly=true;
let selectedCar=null;

const grid=document.getElementById('carGrid');
const classFilter=document.getElementById('classFilter');
const fuelFilter=document.getElementById('fuelFilter');
const autoToggle=document.getElementById('autoToggle');
const topReserve=document.getElementById('topReserve');
const selectedPanel=document.getElementById('selectedPanel');
const selectedTitle=document.getElementById('selectedTitle');
const selectedInfo=document.getElementById('selectedInfo');
const summaryCard=document.getElementById('reservationSummary');
const summaryVehicle=document.getElementById('summaryVehicle');
const summaryMeta=document.getElementById('summaryMeta');
const summaryStatus=document.getElementById('summaryStatus');
const summaryAction=document.getElementById('summaryAction');
const contactVehicle=document.getElementById('contactVehicle');
const contactPeriod=document.getElementById('contactPeriod');
const bookingStatus=document.getElementById('bookingStatus');
const steps=[...document.querySelectorAll('.booking-step-v10')];

function slotText(path){return 'Vizual u pripremi'}
function formatDate(value){
  if(!value) return '—';
  const parts=value.split('-');
  if(parts.length!==3) return value;
  return parts[2]+'.'+parts[1]+'.'+parts[0]+'.';
}
function getField(id){return document.getElementById(id)}
function getPeriodText(){
  const pd=getField('pickupDate')?.value || '';
  const rd=getField('returnDate')?.value || '';
  return formatDate(pd)+' – '+formatDate(rd);
}
function getTimesText(){
  const pt=getField('pickupTime')?.value || '—';
  const rt=getField('returnTime')?.value || '—';
  return pt+' – '+rt;
}
function checkoutURL(car){
  const q=new URLSearchParams({
    vehicle:car.name || '',
    group:car.group || (car.cls ? 'Grupa '+car.cls : ''),
    price:car.price || '',
    source:'reservation'
  });
  const pickup=getField('pickup')?.value;
  if(pickup) q.set('pickup', pickup);
  ['pickupDate','pickupTime','returnDate','returnTime'].forEach(id=>{
    const el=getField(id);
    if(el && el.value) q.set(id, el.value);
  });
  return 'rezervacija-podaci.html?'+q.toString();
}
function updateSummaryDetails(){
  const pickup=getField('pickup')?.value || '—';
  const summaryPickup=document.getElementById('summaryPickup');
  const summaryDates=document.getElementById('summaryDates');
  const summaryTimes=document.getElementById('summaryTimes');
  if(summaryPickup) summaryPickup.textContent=pickup;
  if(summaryDates) summaryDates.textContent=getPeriodText();
  if(summaryTimes) summaryTimes.textContent=getTimesText();
  if(contactPeriod) contactPeriod.textContent=getPeriodText()+' • '+getTimesText();
}
function updateStepState(){
  steps.forEach((step,i)=>{
    step.classList.toggle('is-active', i===0 && !selectedCar);
    step.classList.toggle('is-complete', (i===0 && !!selectedCar) || (i===1 && !!selectedCar));
    if(i===1) step.classList.toggle('is-active', !!selectedCar);
  });
}
function updateSelectedUI(car, options={}){
  selectedCar=car;
  if(!car){
    summaryCard?.classList.remove('has-car');
    if(summaryVehicle) summaryVehicle.textContent='Još nije izabrano';
    if(summaryMeta) summaryMeta.textContent='Izaberite vozilo iz ponude ili nastavite iz cenovnika.';
    if(summaryStatus) summaryStatus.textContent='Čeka izbor';
    if(summaryAction){summaryAction.textContent='Pogledajte vozila →'; summaryAction.href='#fleet';}
    if(contactVehicle) contactVehicle.textContent='Vozilo nije izabrano';
    if(topReserve) topReserve.innerHTML='Izaberite vozilo <span>→</span>';
    updateStepState();
    return;
  }
  const group=car.group || (car.cls ? 'Grupa '+car.cls : '');
  const price=car.price || '';
  const meta=[group, price ? 'od '+price+' / dan' : ''].filter(Boolean).join(' • ');
  summaryCard?.classList.add('has-car');
  if(summaryVehicle) summaryVehicle.textContent=car.name;
  if(summaryMeta) summaryMeta.textContent=meta || 'Vozilo je izabrano. Proverite detalje i pošaljite upit.';
  if(summaryStatus) summaryStatus.textContent='Izabrano';
  if(summaryAction){summaryAction.textContent='Nastavite rezervaciju →'; summaryAction.href=checkoutURL(car);}
  if(contactVehicle) contactVehicle.textContent=car.name;
  if(topReserve) topReserve.innerHTML='Nastavite rezervaciju <span>→</span>';
  if(topReserve) topReserve.dataset.checkoutUrl=checkoutURL(car);
  if(selectedTitle) selectedTitle.textContent=car.name;
  if(selectedInfo) selectedInfo.textContent=(meta ? meta+'. ' : '')+'Proverite datume i pošaljite upit.';
  if(selectedPanel){
    selectedPanel.classList.add('show');
    clearTimeout(selectedPanel._timer);
    selectedPanel._timer=setTimeout(()=>selectedPanel.classList.remove('show'), options.persist ? 5200 : 3600);
  }
  document.querySelectorAll('.vehicle-card-v8').forEach(card=>card.classList.toggle('is-selected', card.dataset.name===car.name));
  updateStepState();
}
function renderCars(){
  const cls=classFilter.value, fuel=fuelFilter.value;
  const visible=cars.filter(c=>(cls==='all'||c.cls===cls)&&(fuel==='all'||c.fuel===fuel)&&(!autoOnly||c.auto));
  grid.innerHTML=visible.map(c=>`
    <article class="car-card vehicle-card-v8 reveal in" data-name="${c.name}" data-auto="${c.auto}" data-class="${c.cls}" data-fuel="${c.fuel}">
      <div class="vehicle-card-head">
        <div class="vehicle-title-block"><span class="vehicle-class-pill">${c.group || ('Grupa '+c.cls)}</span><h3>${c.name}</h3></div>
        <span class="vehicle-stock">Dostupno</span>
      </div>
      <div class="tags"><span class="tag">${c.fuel}</span><span class="tag">${c.auto ? 'Automatik' : 'Manuel'}</span><span class="tag">5 vrata</span></div>
      <div class="car-pic"><div class="image-slot fleet-image"><img src="${c.img}" alt="${c.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="placeholder fleet-placeholder" style="display:none"><span>${slotText(c.img)}</span></div></div></div>
      <div class="price"><span class="price-prefix">od</span><strong>${c.price}</strong><span class="price-suffix">/ dan</span></div>
      <div class="vehicle-actions"><button class="card-btn vehicle-primary" type="button" data-select-car="${c.name}">Izaberi →</button><a class="vehicle-secondary" href="cenovnik.html">Cenovnik</a></div>
    </article>`).join('') || `<div class="empty-card-v10">Nema vozila za izabrane filtere.</div>`;

  grid.querySelectorAll('[data-select-car]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const car=cars.find(item=>item.name===btn.dataset.selectCar);
      if(car){
        const chosen={name:car.name, cls:car.cls, group:car.group, price:car.price};
        updateSelectedUI(chosen);
        window.location.href=checkoutURL(chosen);
      }
    });
  });
  if(selectedCar) updateSelectedUI(selectedCar);
}
function hydrateFromURL(){
  const p=new URLSearchParams(window.location.search);
  const vehicle=p.get('vehicle');
  if(vehicle){
    updateSelectedUI({
      name:vehicle,
      group:p.get('group') || '',
      price:p.get('price') || '',
      source:p.get('source') || ''
    }, {persist:p.get('source')==='cenovnik'});
  }else{
    updateSelectedUI(null);
  }
}

if(autoToggle){
  autoToggle.addEventListener('click',()=>{autoOnly=!autoOnly;autoToggle.classList.toggle('off',!autoOnly);renderCars()});
  autoToggle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();autoToggle.click()}});
}
classFilter?.addEventListener('change',renderCars);
fuelFilter?.addEventListener('change',renderCars);
['pickup','pickupDate','pickupTime','returnDate','returnTime'].forEach(id=>getField(id)?.addEventListener('change',updateSummaryDetails));
if(topReserve){
  topReserve.addEventListener('click',()=>{
    if(selectedCar){
      window.location.href=checkoutURL(selectedCar);
    }else{
      document.getElementById('fleet')?.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
}
document.getElementById('bookingContactForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  if(bookingStatus){
    bookingStatus.textContent=selectedCar ? 'Upit je pripremljen za '+selectedCar.name+'. Povežite formu sa mejlom ili CRM-om pre objave sajta.' : 'Upit je pripremljen. Preporuka: izaberite vozilo pre slanja.';
  }
});

renderCars();
updateSummaryDetails();
hydrateFromURL();

}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initReservationV10);
}else{
  initReservationV10();
}
})();
