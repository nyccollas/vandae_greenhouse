const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

if (menuBtn && sideMenu) {
    menuBtn.addEventListener('click', () => {
        sideMenu.style.display = 'block';
    });
}
if (closeBtn && sideMenu) {
    closeBtn.addEventListener('click', () => {
        sideMenu.style.display = 'none';
    });
}

// Dark mode
document.addEventListener('DOMContentLoaded', () => {
    const darkMode = document.querySelector('.dark-mode');

    if (darkMode) {
        darkMode.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode-variables');

            const spans = darkMode.querySelectorAll('span');
            if (spans.length >= 2) {
                spans[0].classList.toggle('active');
                spans[1].classList.toggle('active');
            }
        });
    }
});

// Sensor table data
Sensors.forEach(sensor => {
    const tr = document.createElement('tr');
    const trContent = `
        <td>${sensor.sensorName}</td>
        <td>${sensor.sensorNumber}</td>
        <td>${sensor.time}</td>
        <td class="${sensor.status === 'Ruim' ? 'danger' : sensor.status === 'Médio' ? 'warning' : 'primary'}">${sensor.status}</td>
        <td class="primary">Detalhes</td>
    `;
    tr.innerHTML = trContent;
    document.querySelector('table tbody').appendChild(tr);
});
