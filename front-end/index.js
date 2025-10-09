/* - - - - - - - - - - - - - - - - Log Sensores - - - - - - - - - - - - - - - - */
const sideMenu = document.querySelector("aside");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");

import { service } from "./firebaseConnect.js";

/* - - - - - - - - - - - - - - - - Modo Escuro - - - - - - - - - - - - - - - - */

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode-variables");
    } else {
        document.body.classList.remove("dark-mode-variables");
    }

    const darkMode = document.querySelector(".dark-mode");
    if (darkMode) {
        darkMode.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode-variables");

            const currentTheme = document.body.classList.contains(
                "dark-mode-variables"
            )
                ? "dark"
                : "light";
            localStorage.setItem("theme", currentTheme);

            const spans = darkMode.querySelectorAll("span");
            if (spans.length >= 2) {
                spans[0].classList.toggle("active");
                spans[1].classList.toggle("active");
            }
        });
    }
});

/* - - - - - - - - - - - - - - - - Botoes - - - - - - - - - - - - - - - - */

document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = [
        document.getElementById('button2'),
        document.getElementById('button3'),
        document.getElementById('button4')
    ];

    toggleButtons.forEach(button => {
        if (button) {
            const statusIcon = button.querySelector('.content .material-icons-sharp');

            button.addEventListener('click', () => {
                button.classList.toggle('deactive');

                const isDeactive = button.classList.contains('deactive');

                if (statusIcon) {
                    if (isDeactive) {
                        // Se DESATIVADO, usa o ícone 'unchecked' (vazio)
                        statusIcon.textContent = 'radio_button_unchecked';
                    } else {
                        // Se ATIVO, usa o ícone 'checked' (preenchido)
                        statusIcon.textContent = 'radio_button_checked';
                    }
                }

                const buttonName = button.querySelector('h3').textContent;
                console.log(`${buttonName} agora está: ${isDeactive ? 'DESATIVADO' : 'ATIVO'}`);
            });
        }
    });
});


/* - - - - - - - - - - - - - - - - Circulos - - - - - - - - - - - - - - - - */

const CIRCUMFERENCE = 251.3; // 2 * PI * 40 ≈ 251.3

function updateCircleProgress(selector, percentage) {
    const circleElement = document.querySelector(selector);
    if (!circleElement) {
        return;
    }

    const clampedPercentage = Math.min(100, Math.max(0, percentage));

    const offset = CIRCUMFERENCE - (clampedPercentage / 100) * CIRCUMFERENCE;

    circleElement.style.strokeDashoffset = offset;
}


/* - - - - - - - - - - - - - - - - Dados na FireBase - - - - - - - - - - - - - - - - */

const urlDoEndpoint =
    "https://greengarden-fd823-default-rtdb.firebaseio.com/Vandae.json";
const urlDaAPI = "http://localhost:8080";
async function buscarDados() {
    try {
        const resposta = await fetch(urlDoEndpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!resposta.ok) {
            throw new Error(
                `Erro na requisição: ${resposta.status} - ${resposta.statusText}`
            );
        }

        const dados = await resposta.json();

        return dados; 
    } catch (erro) {
        console.error("Ocorreu um erro ao buscar os dados:", erro);
    }
}

console.log(buscarDados());

/* - - - - - - - - - - - - - - - - Dados na FireBase - - - - - - - - - - - - - - - - */

service.user = "Vandae";
let data = {};

let is_button1 = 0;
let is_button2 = 0;
let is_button3 = 0;
let is_button4 = 0;

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const button4 = document.getElementById("button4");

const temperatura = document.getElementById("temperatura-valor");
const umidade = document.getElementById("umidade-valor");
const nivelagua = document.getElementById("nivel-de-agua-valor");

const set_data = async () => {
    data = {
        Acionadores: {
            Comporta: is_button1,
            Bomba: is_button2,
            Cooler: is_button3,
            Luz: is_button4,
        },
    };
    service.set(data);
};

button1.addEventListener("click", () => {
    is_button1 = !is_button1;
    set_data();
});
button2.addEventListener("click", () => {
    is_button2 = !is_button2;
    set_data();
});
button3.addEventListener("click", () => {
    is_button3 = !is_button3;
    set_data();
});
button4.addEventListener("click", () => {
    is_button4 = !is_button4;
    set_data();
});

const updateSensorTable = async () => {
    const sensorData = await getSensorsData();

    // --- LÓGICA DE ATUALIZAÇÃO DOS CÍRCULOS E VALORES DE TEXTO ---

    if (sensorData && sensorData.dadosCombinados && sensorData.dadosCombinados.length > 0) {
        const latestSensor = sensorData.dadosCombinados[0];

        const temperaturaValor = parseInt(latestSensor.temperatura) || 0;
        const umidadeValor = parseInt(latestSensor.umidade) || 0;
        const nivelAguaValor = parseInt(latestSensor.nivelagua) || 0;

        temperatura.textContent = `${temperaturaValor} °C`;
        umidade.textContent = `${umidadeValor} %`;
        nivelagua.textContent = `${Math.floor(nivelAguaValor)} %`; 

        updateCircleProgress('.temperature svg circle', temperaturaValor);
        updateCircleProgress('.visits svg circle', umidadeValor);
        updateCircleProgress('.searches svg circle', nivelAguaValor);
    }
    // --- FIM DA LÓGICA DE ATUALIZAÇÃO DOS CÍRCULOS E VALORES DE TEXTO ---

    // Lógica original de preenchimento da tabela
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = ""; // limpa tabela antes de inserir
    if (sensorData && sensorData.dadosCombinados) {
        (sensorData.dadosCombinados).forEach((sensor) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <td class="${
                (sensor.temperatura >= 22 && sensor.temperatura <= 28)
                    ? "success"
                    : (sensor.temperatura >= 19 && sensor.temperatura < 22)
                    ? "warning"
                    : "danger"
            }">${sensor.temperatura}</td>
                <td class="${
                    (sensor.umidade >= 50 && sensor.umidade <= 70)
                        ? "success"
                        : (sensor.umidade >= 40 && sensor.umidade < 50)
                        ? "warning"
                        : "danger"
                }">${sensor.umidade}</td>
                <td class="${
                    sensor.nivelagua === "Ruim"
                        ? "danger"
                        : sensor.nivelagua === "Médio"
                        ? "warning"
                        : "dark"
                }">${Math.floor(sensor.nivelagua)}</td>
                <td class="primary">${formatarData(sensor.createdAt)}</td>
            `;
            tbody.appendChild(tr);
        });
    }
};

/* - - - - - - - - - - - - - - - - Arredondar Data - - - - - - - - - - - - - - - - */

function formatarData(isoString) {
    const data = new Date(isoString);

    const pad = (num) => String(num).padStart(2, '0');
    
    const dia = pad(data.getDate());
    const mes = pad(data.getMonth() + 1); // getMonth é baseado em 0 (Jan = 0)
    const ano = String(data.getFullYear()).slice(2); // Pega apenas os dois últimos dígitos do ano

    const hora = pad(data.getHours());
    const minuto = pad(data.getMinutes());
    const segundo = pad(data.getSeconds());

    return `${dia}/${mes}/${ano} - ${hora}:${minuto}:${segundo}`;
}

const getSensorsData = async () => {
    const response = await fetch(urlDaAPI + "/sensors", {
        method: "GET",
        headers: {
            "content-type": "Aplication/json",
        },
    });
    const json = await (response.json());
    return json;
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

setInterval(() => {
    updateSensorTable();
}, 1000); 