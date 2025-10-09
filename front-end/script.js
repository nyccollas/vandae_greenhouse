import {service} from "./firebaseConnect.js"

service.user = "Vandae"

const load_data = async () => {
    const data = await service.load();
}
load_data()


// ----------------------- EXEMPLO COLOCANDO DADOS NO FIREBASE ----------------------
const set_data = () => {
    service.set({"Acionadores" : {"Valvula" : "0", "Bomba" : "0", "Irrigacao" : "0"}})
}


// ----------------------------------------------------------------------------------
setInterval(() => {
    load_data();

}, 10000);

