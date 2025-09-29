export const getSensorsData = (firebaseData) => [
    {
        sensorName: 'Temperatura',
        sensorNumber: `${firebaseData.Sensores?.Temperatura ?? '--'} °C`,
        time: new Date().toLocaleString(),
        status: firebaseData.Sensores?.Temperatura >= 25 ? 'Ruim' : 'Médio'
    },
    {
        sensorName: 'Umidade',
        sensorNumber: `${firebaseData.Sensores?.Umidade ?? '--'} %`,
        time: new Date().toLocaleString(),
        status: firebaseData.Sensores?.Umidade < 30 ? 'Ruim' : 'Médio'
    },
    {
        sensorName: 'Água',
        sensorNumber: `${firebaseData.Sensores?.Agua ?? '--'} Ls`,
        time: new Date().toLocaleString(),
        status: firebaseData.Sensores?.Agua < 5 ? 'Ruim' : 'Ok'
    }
];
