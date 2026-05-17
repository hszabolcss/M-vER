/* ── ROUTE DATA ── */
const STATIONS = {
  'Budapest Keleti':  [47.5005, 19.0838],
  'Budapest Nyugati': [47.5099, 19.0567],
  'Budapest Déli':    [47.4969, 19.0357],
  'Kelenföld':        [47.4667, 19.0186],
  'Tatabánya':        [47.5868, 18.3964],
  'Komárom':          [47.7236, 18.1192],
  'Győr':             [47.6875, 17.6504],
  'Celldömölk':       [47.2560, 17.1540],
  'Szombathely':      [47.2307, 16.6218],
  'Székesfehérvár':   [47.1886, 18.4221],
  'Veszprém':         [47.1028, 17.9093],
  'Dombóvár':         [46.3766, 18.1312],
  'Pécs':             [46.0727, 18.2323],
  'Szolnok':          [47.1762, 20.1813],
  'Püspökladány':     [47.3220, 21.1234],
  'Debrecen':         [47.5316, 21.6273],
  'Nyíregyháza':      [47.9553, 21.7170],
  'Hatvan':           [47.6688, 19.6764],
  'Füzesabony':       [47.7433, 20.4157],
  'Eger':             [47.9025, 20.3772],
  'Miskolc':          [48.1035, 20.7784],
  'Kecskemét':        [46.9019, 19.6897],
};

const ROUTES = [
  {
    key: 'bp-gyor', from:'Budapest Keleti', to:'Győr',
    trains: [
      { name:'IC 801 Arrabona', type:'InterCity', stops:[
        {s:'Budapest Keleti', dep:'07:00'},{s:'Tatabánya',dep:'07:38'},{s:'Komárom',dep:'08:05'},{s:'Győr',dep:'08:22'}]},
      { name:'S50 személyvonat', type:'Személyvonat', stops:[
        {s:'Budapest Keleti',dep:'08:30'},{s:'Tatabánya',dep:'09:12'},{s:'Komárom',dep:'09:45'},{s:'Győr',dep:'10:10'}]},
      { name:'IC 805 Rába', type:'InterCity', stops:[
        {s:'Budapest Keleti',dep:'11:00'},{s:'Tatabánya',dep:'11:38'},{s:'Komárom',dep:'12:05'},{s:'Győr',dep:'12:22'}]},
    ]
  },
  {
    key:'bp-pecs', from:'Budapest Keleti', to:'Pécs',
    trains:[
      {name:'IC 600 Mecsek', type:'InterCity', stops:[
        {s:'Budapest Keleti',dep:'07:15'},{s:'Kelenföld',dep:'07:25'},{s:'Székesfehérvár',dep:'08:02'},{s:'Dombóvár',dep:'08:58'},{s:'Pécs',dep:'09:50'}]},
      {name:'IC 604 Orfű', type:'InterCity', stops:[
        {s:'Budapest Keleti',dep:'11:15'},{s:'Kelenföld',dep:'11:25'},{s:'Székesfehérvár',dep:'12:02'},{s:'Dombóvár',dep:'12:58'},{s:'Pécs',dep:'13:50'}]},
    ]
  },
  {
    key:'bp-debrecen', from:'Budapest Keleti', to:'Debrecen',
    trains:[
      {name:'IC 700 Hajdú', type:'InterCity', stops:[
        {s:'Budapest Keleti',dep:'06:40'},{s:'Szolnok',dep:'07:45'},{s:'Püspökladány',dep:'08:30'},{s:'Debrecen',dep:'09:00'}]},
      {name:'IC 704 Déri', type:'InterCity', stops:[
        {s:'Budapest Keleti',dep:'10:40'},{s:'Szolnok',dep:'11:45'},{s:'Püspökladány',dep:'12:30'},{s:'Debrecen',dep:'13:00'}]},
    ]
  },
  {
    key:'bp-miskolc', from:'Budapest Keleti', to:'Miskolc',
    trains:[
      {name:'IC 500 Bükk', type:'InterCity', stops:[
        {s:'Budapest Keleti',dep:'06:05'},{s:'Hatvan',dep:'07:00'},{s:'Füzesabony',dep:'07:35'},{s:'Miskolc',dep:'08:15'}]},
      {name:'IC 502 Mátra', type:'InterCity', stops:[
        {s:'Budapest Keleti',dep:'08:05'},{s:'Hatvan',dep:'09:00'},{s:'Füzesabony',dep:'09:35'},{s:'Miskolc',dep:'10:15'}]},
    ]
  },
  {
    key:'bp-nyh', from:'Budapest Keleti', to:'Nyíregyháza',
    trains:[
      {name:'IC 710 Tisza', type:'InterCity', stops:[
        {s:'Budapest Keleti',dep:'07:40'},{s:'Szolnok',dep:'08:45'},{s:'Püspökladány',dep:'09:30'},{s:'Debrecen',dep:'10:00'},{s:'Nyíregyháza',dep:'10:28'}]},
    ]
  },
  {
    key:'bp-szombathely', from:'Budapest Keleti', to:'Szombathely',
    trains:[
      {name:'IC 810 Savaria', type:'InterCity', stops:[
        {s:'Budapest Keleti',dep:'07:10'},{s:'Tatabánya',dep:'07:48'},{s:'Győr',dep:'08:32'},{s:'Celldömölk',dep:'09:05'},{s:'Szombathely',dep:'09:40'}]},
    ]
  },
  {
    key:'bp-eger', from:'Budapest Keleti', to:'Eger',
    trains:[
      {name:'S20 személyvonat', type:'Személyvonat', stops:[
        {s:'Budapest Keleti',dep:'07:35'},{s:'Hatvan',dep:'08:30'},{s:'Füzesabony',dep:'09:05'},{s:'Eger',dep:'09:22'}]},
      {name:'S22 személyvonat', type:'Személyvonat', stops:[
        {s:'Budapest Keleti',dep:'11:35'},{s:'Hatvan',dep:'12:30'},{s:'Füzesabony',dep:'13:05'},{s:'Eger',dep:'13:22'}]},
    ]
  },
];

function findRoute(from, to) {
  const norm = s => s.trim().toLowerCase();
  return ROUTES.find(r =>
    (norm(r.from)===norm(from) && norm(r.to)===norm(to)) ||
    (norm(r.from)===norm(to)   && norm(r.to)===norm(from))
  ) || null;
}

/* ── LEAFLET MAP ── */
let leafletMap = null;

function initMap(stops, reversed) {
  const list = reversed ? [...stops].reverse() : stops;
  const coords = list.map(s => STATIONS[s.s] || [47.5, 19.0]);

  if (leafletMap) { leafletMap.remove(); leafletMap = null; }

  leafletMap = L.map('route-map').setView(coords[0], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors', maxZoom: 18
  }).addTo(leafletMap);

  L.polyline(coords, { color:'#0071e3', weight:4, opacity:.85 }).addTo(leafletMap);

  list.forEach((stop, i) => {
    const c = STATIONS[stop.s];
    if (!c) return;
    const isEnd = i === 0 || i === list.length-1;
    const icon = L.divIcon({
      html: `<div style="width:${isEnd?16:12}px;height:${isEnd?16:12}px;background:${isEnd?'#0071e3':'#fff'};border:3px solid #0071e3;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.25);"></div>`,
      iconSize:[20,20], iconAnchor:[10,10], className:''
    });
    L.marker(c, {icon}).addTo(leafletMap)
      .bindPopup(`<b>${stop.s}</b><br>${stop.dep}`);
  });

  leafletMap.fitBounds(L.polyline(coords).getBounds(), {padding:[30,30]});
  
  setTimeout(() => {
    if (leafletMap) leafletMap.invalidateSize();
  }, 100);
}

/* ── ROUTE SEARCH ── */
function searchRoute() {
  const from = document.getElementById('from-station').value.trim();
  const to   = document.getElementById('to-station').value.trim();
  const date = document.getElementById('travel-date').value;

  if (!from || !to) { alert('Kérjük, adja meg az indulási és érkezési állomást!'); return; }

  const defaultDiv  = document.getElementById('default-products');
  const routeDiv    = document.getElementById('route-section');
  const resultsDiv  = document.getElementById('route-results');
  const productList = document.getElementById('product-list');

  defaultDiv.style.display = 'none';
  routeDiv.style.display   = 'block';

  const route = findRoute(from, to);

  if (!route) {
    resultsDiv.innerHTML = `<div class="no-route"><div style="font-size:3rem;margin-bottom:12px;">🔍</div><p style="font-weight:700;margin-bottom:6px;">Nincs közvetlen járat</p><p>${from} → ${to} útvonalon nem találtunk közvetlen járatot.</p></div>`;
    document.getElementById('route-map').innerHTML = '<div class="no-route" style="height:380px;display:flex;align-items:center;justify-content:center;">Nincs megjeleníthető útvonal</div>';
    productList.innerHTML = '';
    return;
  }

  const reversed = route.from.toLowerCase() !== from.toLowerCase();
  const displayFrom = reversed ? route.to : route.from;
  const displayTo   = reversed ? route.from : route.to;
  const dateLabel   = date ? new Date(date).toLocaleDateString('hu-HU', {year:'numeric',month:'long',day:'numeric'}) : 'Ma';

  // Render train cards
  resultsDiv.innerHTML = `<div style="margin-bottom:14px;font-size:.88rem;color:#6e6e73;">📅 ${dateLabel} | ${displayFrom} → ${displayTo}</div>` +
    route.trains.map((t,i) => {
      const stops = reversed ? [...t.stops].reverse() : t.stops;
      const dep   = stops[0].dep;
      const arr   = stops[stops.length-1].dep;
      const typeBadge = t.type === 'InterCity' ? '#0071e3' : '#34c759';
      return `
        <div class="route-result" style="cursor:pointer;" onclick="expandTrain(${i})">
          <div class="route-header">
            <div>
              <span class="route-train-badge" style="background:${typeBadge};">${t.type}</span>
              <div style="font-weight:700;font-size:1rem;margin-top:6px;">${t.name}</div>
            </div>
            <div style="text-align:right;">
              <div class="route-duration">${dep} → ${arr}</div>
              <div style="font-size:.82rem;color:#6e6e73;">${stops.length-1} megálló</div>
            </div>
          </div>
          <div class="stops-timeline" id="train-stops-${i}" style="display:none;">
            ${stops.map((s,si) => `
              <div class="stop-row">
                <div class="stop-dot${si===0||si===stops.length-1?' end':''}"></div>
                <div><div class="stop-name">${s.s}</div><div class="stop-arr">${si===0?'Indul':si===stops.length-1?'Érkezik':'Áthalad'}</div></div>
                <div class="stop-time">${s.dep}</div>
              </div>`).join('')}
          </div>
          <div style="font-size:.82rem;color:#0071e3;margin-top:10px;">▼ Részletek</div>
        </div>`;
    }).join('');

  // Show on map - first train's stops
  initMap(route.trains[0].stops, reversed);

  // Product list filtered for this route
  renderRouteProducts(displayFrom, displayTo);
}

function expandTrain(i) {
  const el = document.getElementById(`train-stops-${i}`);
  if (!el) return;
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// Registry so inline onclick can reference products safely
window._rp = {};

function renderRouteProducts(from, to) {
  const list = document.getElementById('product-list');
  if (!list) return;
  const name = from + ' – ' + to;
  const items = [
    { id:'rp0', name, desc:'2. osztály, teljes árú menetjegy', price:2450 },
    { id:'rp1', name:name+' (1. osztály)', desc:'1. osztály, teljes árú menetjegy', price:3800 },
    { id:'rp2', name:name+' diákjegy', desc:'Diák kedvezményes menetjegy (50%)', price:1225 },
  ];
  items.forEach(p => { window._rp[p.id] = p; });
  list.innerHTML = items.map(p =>
    '<div class="product-card">'+
      '<div><h3>'+p.name+'</h3><p class="pdesc">'+p.desc+'</p></div>'+
      '<div><span class="price">'+p.price.toLocaleString('hu-HU')+' Ft</span>'+
      '<button class="buy-btn" onclick="startCheckoutById(\'' + p.id + '\')">Kiválasztom &rarr;</button></div>'+
    '</div>'
  ).join('');
}
