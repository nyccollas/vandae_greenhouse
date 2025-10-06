const { Sequelize } = require('sequelize');

const database = new Sequelize('SensorDB', 'NYCOLAS PRADO SEIXA', 'Ny@05091917', {
  dialect: 'mssql',
  host: 'localhost',
  port: 1433, 
  dialectOptions: {
    options: {
      encrypt: false,               
      trustServerCertificate: true,
    }
  }
});

module.exports = database;
