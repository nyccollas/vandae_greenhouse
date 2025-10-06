npm init -y > $null
npm i express mssql sequelize nodemon cors

$json_content = Get-Content -Path "./package.json" -Raw
$json_obj = $json_content | ConvertFrom-Json

if (-not $json_obj.scripts.PSObject.Properties.Match("dev")) {
    $json_obj.scripts | Add-Member -MemberType NoteProperty -Name dev -Value "nodemon server.js"
}
if (-not $json_obj.scripts.PSObject.Properties.Match("start")) {
$json_obj.scripts | Add-Member -MemberType NoteProperty -Name start -Value "node server.js"
}

$json_obj | ConvertTo-Json -Depth 10 | Set-Content -Path "./package.json"

New-Item -Path "./controllers" -ItemType Directory > $null
New-Item -Path "./controllers/example.js" > $null
Set-Content -Path "./controllers/example.js" -Value @'
const <ENTITY> = require('../models/<ENTITY>.js')

module.exports = {

    async <FUNCAO>(req,res)
    {
        res.status(200).json({ message: "Success!" });
    }
}
'@ > $null

New-Item -Path "./config" -ItemType Directory > $null
Set-Content -Path "./config/db.js" -Value @"
const { Sequelize } = require('sequelize');

const database = new Sequelize('<DATABASE_NAME>', '<LOGIN>', '<PASSWORD>', {
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
"@ > $null


New-Item -Path "./models" -ItemType Directory > $null
New-Item -Path "./models/example.js" > $null
Set-Content -Path "./models/example.js" -Value @'
const { Sequelize } = require('sequelize');
const database = require("../config/db.js")

const <NOME> = database.define("<NOME>_tb", {

    <NOME>_id : {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
})

module.exports = <NOME>;
'@ > $null

New-Item -Path "./server.js" > $null
Set-Content -Path "./server.js" -Value @'
const express = require("express");
const app  = express();
const database = require("./config/db.js")
const routes = require("./route.js")

const cors = require('cors');
app.use(cors({
    origin: '*'
}));
app.use(routes)

const port = 8080

/* EXAMPLE
require("./models/<ENTITY>.js");
*/

database.sync({alter : true});
const server = app.listen(port, () => console.log(`Listening on port http://localhost:${port}`));

module.exports = server;
'@ > $null


New-Item -Path "./routes.js" > $null
Set-Content -Path "./routes.js" -Value @'
const express = require('express')
const routes = express.Router()

/* EXAMPLE
const cidade = require('./controllers/<ENTITY>.js')
routes.<METHOD>('/<ROUTE>', <ENTTTY>.<FUNCAO>)
*/

module.exports = routes
'@ > $null


New-Item -Path "./.gitignore" > $null
Set-Content -Path "./.gitignore" -Value "node_modules" > $null

netstat -ano | findstr "1433"
netstat -ano | findstr "sqlserver"