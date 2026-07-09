/* Cenovnik filtering + mobile/table status */

function applyMobileTableLabels(){
  document.querySelectorAll('.pricing-table').forEach(function(table){
    const labels = Array.from(table.querySelectorAll('thead th')).map(function(th){return th.textContent.trim();});
    table.querySelectorAll('tbody tr').forEach(function(row){
      Array.from(row.children).forEach(function(cell, index){
        if(labels[index]) cell.setAttribute('data-label', labels[index]);
      });
    });
  });
}
applyMobileTableLabels();

const search=document.getElementById('search');
const group=document.getElementById('groupFilter');
const statusEl=document.getElementById('priceResultStatus');
function filterTables(){
  if(!search||!group) return;
  const q=search.value.toLowerCase().trim();
  const g=group.value;
  let visible=0;
  document.querySelectorAll('.pricing-table tbody tr, tbody tr').forEach(tr=>{
    const okText=tr.textContent.toLowerCase().includes(q);
    const okGroup=g==='all'||tr.dataset.group===g;
    const show=okText&&okGroup;
    tr.style.display=show?'':'none';
    if(show) visible++;
  });
  if(statusEl){
    statusEl.textContent = visible ? `${visible} dostupnih redova` : 'Nema rezultata za izabrane filtere';
  }
}
if(search) search.addEventListener('input',filterTables);
if(group) group.addEventListener('change',filterTables);
filterTables();
