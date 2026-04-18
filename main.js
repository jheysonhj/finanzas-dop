const API_KEY = '30c066082e6837506c02951c';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/DOP`;

const monedas = [
    { código: 'USD', color: 'azul' },
    { código: 'EUR', color: 'púrpura' },
    { código: 'GBP', color: 'verde' },
    { código: 'JPY', color: 'azul' },
    { código: 'CAD', color: 'púrpura' },
    { código: 'CHF', color: 'verde' },
    { código: 'MXN', color: 'azul' },
    { código: 'BRL', color: 'verde' }
];

let rates = {};

async function init() {
    try {
        const res = await fetch(BASE_URL);
        const data = await res.json();
        if (data.result === "success") {
            rates = data.conversion_rates;
            render();
        }
    } catch (e) { console.error("Error API", e); }
}

function render() {
    const grid = document.getElementById('currencyGrid');
    const cantidad = parseFloat(document.getElementById('masterInput').value) || 0;
    grid.innerHTML = '';

    monedas.forEach(m => {
        // Lógica: La API devuelve 1 DOP = X Moneda. 
        // Para obtener el valor en Pesos: Monto / tasa_api
        const rateAgainstDop = 1 / rates[m.código];
        const total = (cantidad * rateAgainstDop).toLocaleString('en-US', { minimumFractionDigits: 2 });

        const colorText = m.color === 'azul' ? 'info' : (m.color === 'púrpura' ? 'purple' : 'success');

        grid.innerHTML += `
            <div class="col-md-4">
                <div class="cyber-card neon-border-${m.color}">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <img src="https://flagcdn.com/w80/${m.código.toLowerCase().substring(0,2)}.png" class="flag-img">
                        <h4 class="Orbitron m-0">${m.código}</h4>
                    </div>
                    <div class="mb-2">
                        <small class="text-muted d-block small">Monto Calculado:</small>
                        <span class="fs-4 fw-bold text-${colorText}">RD$ ${total}</span>
                        <small class="d-block text-muted" style="font-size:0.7rem">Tasa: 1 ${m.código} = RD$ ${rateAgainstDop.toFixed(2)}</small>
                    </div>
                    <div id="chart-${m.código}"></div>
                </div>
            </div>
        `;
    });

    monedas.forEach(m => drawChart(m.código, m.color, 1 / rates[m.código]));
}

function drawChart(code, color, base) {
    const hex = color === 'azul' ? '#00f3ff' : (color === 'púrpura' ? '#bc13fe' : '#39ff14');
    const data = Array.from({length: 6}, () => (base * (0.98 + Math.random() * 0.04)).toFixed(2));

    new ApexCharts(document.querySelector(`#chart-${code}`), {
        series: [{ data }],
        chart: { type: 'line', height: 80, sparklines: { enabled: true }, animations: { enabled: false } },
        stroke: { curve: 'smooth', width: 2 },
        colors: [hex],
        tooltip: { theme: 'dark' }
    }).render();
}

document.getElementById('masterInput').addEventListener('input', render);
init();