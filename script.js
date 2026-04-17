const products = [
    { id: 1, type: 'jegy', name: 'Budapest - Győr jegy', price: 2450, desc: '2. osztály, teljes árú' },
    { id: 2, type: 'jegy', name: 'InterCity pótjegy', price: 950, desc: 'Helyjeggyel együtt' },
    { id: 3, type: 'berlet', name: 'Országbérlet', price: 18900, desc: '30 napos, érvényes minden vonatra' },
    { id: 4, type: 'berlet', name: 'Pest Vármegyebérlet', price: 9450, desc: '30 napos vármegyei érvényesség' }
];

let selectedProduct = null;

// Szekciók váltása
function showSection(id) {
    document.querySelectorAll('.page-step').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'account-section') renderMyTickets();
}

// Termékek megjelenítése
function filterProducts(type) {
    const list = document.getElementById('product-list');
    list.innerHTML = '';
    
    // Tab gombok stílusa
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.toggle('active', b.innerText.toLowerCase().includes(type));
    });

    products.filter(p => p.type === type).forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="p-info">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
            </div>
            <div class="p-action">
                <span class="price">${p.price.toLocaleString()} Ft</span>
                <button class="buy-btn" onclick="startCheckout(${p.id})">Kiválasztom</button>
            </div>
        `;
        list.appendChild(card);
    });
}

// Fizetés megkezdése
function startCheckout(id) {
    selectedProduct = products.find(p => p.id === id);
    const info = document.getElementById('selected-item-info');
    info.innerHTML = `
        <div class="summary-header">Kiválasztott termék</div>
        <h4>${selectedProduct.name}</h4>
        <p>${selectedProduct.desc}</p>
        <div class="final-price">${selectedProduct.price.toLocaleString()} Ft</div>
    `;
    showSection('checkout-section');
}

// Vásárlás és QR generálás
document.getElementById('purchase-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('cust-name').value;
    const idCard = document.getElementById('cust-id').value;
    
    // QR kód tartalom: termék + név + okmány + időbélyeg
    const qrData = `MÁV_TICKET|${selectedProduct.name}|${name}|${idCard}|${Date.now()}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

    const newTicket = {
        productName: selectedProduct.name,
        owner: name,
        id: idCard,
        date: new Date().toLocaleDateString('hu-HU'),
        qr: qrUrl
    };

    // Mentés localStorage-ba
    const savedTickets = JSON.parse(localStorage.getItem('my_mav_tickets') || '[]');
    savedTickets.push(newTicket);
    localStorage.setItem('my_mav_tickets', JSON.stringify(savedTickets));

    alert('Sikeres vásárlás! A jegyed bekerült a fiókodba.');
    showSection('account-section');
});

// Jegyeim listázása
function renderMyTickets() {
    const container = document.getElementById('my-tickets');
    const tickets = JSON.parse(localStorage.getItem('my_mav_tickets') || '[]');
    
    if(tickets.length === 0) {
        container.innerHTML = '<p class="empty">Még nincs megvásárolt jegyed.</p>';
        return;
    }

    container.innerHTML = tickets.map(t => `
        <div class="ticket-item">
            <div class="t-details">
                <span class="t-badge">E-JEGY</span>
                <h4>${t.productName}</h4>
                <p>Utas: <strong>${t.owner}</strong></p>
                <p>Okmány: ${t.id} | Dátum: ${t.date}</p>
            </div>
            <div class="t-qr">
                <img src="${t.qr}" alt="QR Code">
            </div>
        </div>
    `).join('');
}

// Inicializálás
document.addEventListener('DOMContentLoaded', () => {
    filterProducts('jegy');
});