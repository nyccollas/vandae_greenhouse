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

    if (!listaDeLeituras || listaDeLeituras.length === 0) {
      console.log("Nenhum dado de leitura encontrado.");
      return; // Encerra a função se não houver dados
    }

    console.log("--- Lista de Leituras Recebidas ---");
    console.log(`Total de registros: ${listaDeLeituras.length}`);

    listaDeLeituras.forEach((leitura) => {
      console.log(`
                ID: ${leitura.leitura_id}
                Data/Hora: ${new Date(leitura.createdAt).toLocaleString()}
                Temperatura: ${leitura.temperatura}°C
                Umidade: ${leitura.umidade}%
                Nível da Água: ${leitura.nivelagua}
            `);
    });

    return listaDeLeituras;
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

  umidade.textContent = sensorData.dadosCombinados[0].umidade;
  nivelagua.textContent = sensorData.dadosCombinados[0].nivelagua;
  temperatura.textContent = sensorData.dadosCombinados[0].temperatura;

  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = ""; // limpa tabela antes de inserir
  (sensorData.dadosCombinados).forEach((sensor) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td class="${
              sensor.temperatura === "Ruim"
                ? "danger"
                : sensor.temperatura === "Médio"
                ? "warning"
                : "primary"
            }">${sensor.temperatura}</td>
             <td class="${
              sensor.umidade === "Ruim"
                ? "danger"
                : sensor.umidade === "Médio"
                ? "warning"
                : "primary"
            }">${sensor.umidade}</td>
             <td class="${
              sensor.nivelagua === "Ruim"
                ? "danger"
                : sensor.nivelagua === "Médio"
                ? "warning"
                : "primary"
            }">${sensor.nivelagua}</td>
            <td class="primary">${sensor.createdAt}</td>
        `;
    tbody.appendChild(tr);
  });
};

const getSensorsData = async () => {
  const response = await fetch(urlDaAPI + "/sensors", {
    method: "GET",
    headers: {
      "content-type": "Aplication/json",
    },
  });
  const json = await(response.json());
  return json;
};

setInterval(() => {
  updateSensorTable();
}, 1000); // 1 sec
