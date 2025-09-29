/* - - - - - - - - - - - - - - - - Log Sensores - - - - - - - - - - - - - - - - */
const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

import { getSensorsData } from './sensors.js';
import { service } from "./firebaseConnect.js";

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

/* - - - - - - - - - - - - - - - - Dados na FireBase - - - - - - - - - - - - - - - - */
service.user = "Vandae";
let data = {};

let is_button1 = false;
let is_button2 = false;
let is_button3 = false;
let is_button4 = false;

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const button4 = document.getElementById("button4");

const generateRandomData = () => ({
    Sensores: {
        Temperatura: Math.floor(Math.random() * 30),
        Umidade: Math.floor(Math.random() * 100),
        Agua: Math.floor(Math.random() * 20),
    },
    Acionadores: {
        Comporta: is_button1,
        Bomba: is_button2,
        Cooler: is_button3,
        Luz: is_button4
    }
});

const set_data = async () => {
    data = generateRandomData();
    service.set(data);
};

button1.addEventListener("click", () => { is_button1 = !is_button1; set_data(); });
button2.addEventListener("click", () => { is_button2 = !is_button2; set_data(); });
button3.addEventListener("click", () => { is_button3 = !is_button3; set_data(); });
button4.addEventListener("click", () => { is_button4 = !is_button4; set_data(); });

const updateSensorTable = (firebaseData) => {
    const sensorsArray = getSensorsData(firebaseData);

    const DbTemp = document.querySelector('.dashboard .temperature .status .info h1');
    const DbUmdd = document.querySelector('.dashboard .visits .status .info h1');
    const DbWlvl = document.querySelector('.dashboard .searches .status .info h1');

    DbTemp.innerHTML = `${data.Sensores.Temperatura} °C`;  
    DbUmdd.innerHTML = `${data.Sensores.Umidade} °C`;  
    DbWlvl.innerHTML = `${data.Sensores.Agua} °C`;    

    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = ''; // limpa tabela antes de inserir
    sensorsArray.forEach(sensor => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${sensor.sensorName}</td>
            <td>${sensor.sensorNumber}</td>
            <td>${sensor.time}</td>
            <td class="${sensor.status === 'Ruim' ? 'danger' : sensor.status === 'Médio' ? 'warning' : 'primary'}">${sensor.status}</td>
            <td class="primary">Detalhes</td>
        `;
        tbody.appendChild(tr);
    });
};

setInterval(() => {
    set_data();              
    updateSensorTable(data);  
}, 1000); // 1 sec
