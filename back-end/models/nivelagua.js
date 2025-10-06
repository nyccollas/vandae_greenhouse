const { Sequelize } = require('sequelize');
const database = require("../config/db.js")

const NivelAgua = database.define("nivelagua_tb", {
    leitura_id : {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    valor: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
});

module.exports = NivelAgua;
