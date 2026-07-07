
(function(){
function initCheckoutV25(){
  const params = new URLSearchParams(window.location.search);
  const fallback = {
    vehicle:'Izabrano vozilo', group:'Grupa vozila', price:'72 €',
    pickup:'Aerodrom Nikola Tesla', pickupDate:'2026-01-19', pickupTime:'09:00', returnDate:'2026-01-23', returnTime:'12:00'
  };
  const vehicle = params.get('vehicle') || fallback.vehicle;
  const group = params.get('group') || fallback.group;
  const price = params.get('price') || fallback.price;
  const pickup = params.get('pickup') || fallback.pickup;
  const imgMap = {
    'Hyundai Santa Fe 4x4':'assets/cars/fleet/hyundai-santa-fe.png',
    'VW Taigo Automatic TSI':'assets/cars/fleet/vw-taigo.png',
    'Skoda Superb 4x4':'assets/cars/fleet/skoda-superb.png',
    'Volvo XC90 4x4':'assets/cars/fleet/volvo-xc90.png',
    'Toyota RAV4 4x4':'assets/cars/fleet/toyota-rav4.png',
    'Hyundai Tucson 4x4':'assets/cars/fleet/hyundai-tucson.png'
  };
  function id(x){return document.getElementById(x)}
  function setText(x,v){const el=id(x); if(el) el.textContent=v;}
  function setValue(x,v){const el=id(x); if(el && v) el.value=v;}
  function formatDate(value){
    if(!value) return '—';
    const parts=value.split('-');
    return parts.length===3 ? parts[2]+'.'+parts[1]+'.'+parts[0]+'.' : value;
  }
  function priceNumber(v){
    const cleaned=String(v||'').replace(',', '.').match(/[0-9]+(?:\.[0-9]+)?/);
    return cleaned ? Number(cleaned[0]) : 0;
  }
  function diffDays(){
    const pd=id('checkoutPickupDate')?.value;
    const rd=id('checkoutReturnDate')?.value;
    if(!pd || !rd) return 1;
    const ms = new Date(rd+'T12:00:00') - new Date(pd+'T12:00:00');
    return Math.max(1, Math.ceil(ms/86400000));
  }
  function selectedExtrasPerDay(){
    return [...document.querySelectorAll('[data-extra]:checked')].reduce((sum,el)=>sum+Number(el.dataset.extra||0),0);
  }
  function selectedExtrasNames(){
    return [...document.querySelectorAll('[data-extra]:checked')].map(el=>el.value);
  }
  function updateSummary(){
    const days=diffDays();
    const baseDay=priceNumber(price);
    const extrasDay=selectedExtrasPerDay();
    const baseTotal=baseDay*days;
    const extrasTotal=extrasDay*days;
    const total=baseTotal+extrasTotal;
    setText('sumPickup', id('checkoutPickup')?.value || pickup);
    setText('sumPeriod', formatDate(id('checkoutPickupDate')?.value)+' – '+formatDate(id('checkoutReturnDate')?.value));
    setText('sumTime', (id('checkoutPickupTime')?.value || '—')+' – '+(id('checkoutReturnTime')?.value || '—'));
    setText('sumDays', days);
    setText('sumBase', baseDay ? baseTotal.toFixed(0)+' €' : 'Po upitu');
    setText('sumExtras', extrasTotal ? extrasTotal.toFixed(0)+' €' : '0 €');
    setText('sumTotal', total ? total.toFixed(0)+' €' : 'Po upitu');
    const rd=id('checkoutReturnDate'), pd=id('checkoutPickupDate');
    if(rd && pd){ rd.min=pd.value; if(rd.value && pd.value && rd.value < pd.value) rd.value=pd.value; }
  }
  const image = imgMap[vehicle] || (vehicle.includes('SUV') || group.includes('SUV') ? 'assets/cars/hero/reservation-hero-car.png' : 'assets/cars/hero/feature-car.png');
  ['vehicleHeroImage','summaryVehicleImage'].forEach(key=>{const el=id(key); if(el) el.src=image;});
  setText('vehicleNameHero', vehicle);
  setText('summaryVehicleName', vehicle);
  setText('vehicleGroupHero', group);
  setText('summaryVehicleGroup', group+' • od '+price+' / dan');
  setText('vehiclePriceHero', 'od '+price+' / dan');
  setText('vehicleMetaHero', group+' • Automatik • 5 vrata');
  setValue('checkoutPickup', pickup);
  ['pickupDate','pickupTime','returnDate','returnTime'].forEach(name=>{
    const target = {pickupDate:'checkoutPickupDate',pickupTime:'checkoutPickupTime',returnDate:'checkoutReturnDate',returnTime:'checkoutReturnTime'}[name];
    setValue(target, params.get(name) || fallback[name]);
  });
  ['checkoutPickup','checkoutReturnLocation','checkoutPickupDate','checkoutPickupTime','checkoutReturnDate','checkoutReturnTime'].forEach(key=>id(key)?.addEventListener('change',updateSummary));
  document.querySelectorAll('[data-extra]').forEach(el=>el.addEventListener('change',updateSummary));
  id('reservationNextForm')?.addEventListener('submit', function(e){
    e.preventDefault();
    const extras=selectedExtrasNames();
    const status=id('checkoutStatus');
    if(status){
      status.textContent='Zahtev je spreman za slanje: '+vehicle+' • '+(id('driverName')?.value || 'korisnik')+(extras.length?' • dodatno: '+extras.join(', '):'')+'. Povezati sa email servisom ili backend endpointom pre objave.';
    }
  });
  updateSummary();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initCheckoutV25);}else{initCheckoutV25();}
})();
