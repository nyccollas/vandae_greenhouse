const pool = require("../startup/db");

class SensorsController {
  static async create(req, res) {
    const { umidade, temperatura, luminosidade, nivelDeAgua } = req.body;
    if (!umidade && !temperatura && !luminosidade && !nivelDeAgua)
      return res.status(400).send({ message: "Dados inválidos" });

    try {
      const [result] = await pool.execute(
        "INSERT INTO Sensors (umidade, temperatura, luminosidade, nivelDeAgua, date ) VALUES (?, ?, ?, ?, now())",
        [umidade, temperatura, luminosidade, nivelDeAgua]
      );

      return res.status(201).send({
        message: "Sensor inserida com sucesso",
        body: { id: result.insertId, umidade, temperatura, luminosidade, nivelDeAgua },
      });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

  static async getAllPeople(req, res) {
    try {
      const [rows] = await pool.execute("SELECT * FROM Sensors");
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).send({ message: "No id provided" });

    try {
      const [rows] = await pool.execute("SELECT * FROM Sensors WHERE id = ?", [
        id,
      ]);
      if (rows.length === 0)
        return res.status(404).send({ message: "Sensor não encontrado" });

      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

  static async updateById(req, res) {
    const { id } = req.params;
    const { umidade, temperatura, luminosidade, nivelDeAgua } = req.body;

    if (!umidade)
      return res
        .status(400)
        .send({ message: "Dados de sensor de humidade não informados" });
    if (!temperatura)
      return res
        .status(400)
        .send({ message: "Dados de sensor de temperatura não informados" });
    if (!luminosidade)
      return res
        .status(400)
        .send({ message: "Dados de sensor de luminosidade não informados" });
    if (!nivelDeAgua)
      return res
        .status(400)
        .send({ message: "Dados de sensor de tanque de água não informados" });

    try {
      const [result] = await pool.execute(
        "UPDATE OnlinePage SET umidade = ?, temperatura = ?, luminosidade = ?, b_door = ? WHERE id = ?",
        [umidade, temperatura, luminosidade, nivelDeAgua, id]
      );

      if (result.affectedRows === 0)
        return res.status(404).send({ message: "Sensor não encontrado" });

      return res.status(200).send({ message: "Dados atualizados" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

  static async deleteById(req, res) {
    const { id } = req.params;

    try {
      const [result] = await pool.execute("DELETE FROM sensors WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows === 0)
        return res.status(404).send({ message: "Sensor não encontrado" });

      return res.status(200).send({ message: "Sensor removido com sucesso" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
  static async getLatest(req, res) {
    try {
      const [rows] = await pool.execute(`
                SELECT * FROM Sensors
                ORDER BY date DESC
                LIMIT 1
            `);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Nenhum dado encontrado" });
      }

      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
}

module.exports = SensorsController;
