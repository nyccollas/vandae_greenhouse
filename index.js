const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
})


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