const { Sequelize } = require('sequelize');
const database = require("../config/db.js")

const Umidade = database.define("umidade_tb", {
    leitura_id : {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    valor : {
        type: Sequelize.FLOAT,
        allowNull: false
    }
});

module.exports = Umidade;
