const nivelagua = require('../models/nivelagua.js');
const temperatura = require('../models/temperatura.js');
const umidade = require('../models/umidade.js');

module.exports = {

    async create(req,res)
    {
        try{
            const data = req.body;
            
            const tempCreated = await temperatura.create({ valor: data.temperatura });
            const nivelCreated = await nivelagua.create({ valor: data.nivelagua });
            const umiCreated = await umidade.create({ valor: data.umidade });
            
            res.status(200).json({ message: "Success!" });

            } catch(error){
            res.status(500).json({ message: "Erro interno no servidor!"+error});
        }
    }
}