require('dotenv').config();

const express = require('express');
const cors = require('cors');

const sequelize = require('./config/database');
const Cliente = require('./models/Cliente');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// =========================
// GET /clientes
// =========================

app.get('/clientes', async (req, res) => {

  try {

    const clientes = await Cliente.findAll();

    res.json(clientes);

  } catch (error) {

    res.status(500).json({
      ok: false,
      mensaje: error.message
    });

  }

});


// =========================
// POST /clientes
// =========================

app.post('/clientes', async (req, res) => {

  try {

    const { nombre, email } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        ok: false,
        mensaje: "Nombre y email son obligatorios"
      });
    }

    const nuevoCliente = await Cliente.create({
      nombre,
      email
    });

    res.status(201).json(nuevoCliente);

  } catch (error) {

    res.status(400).json({
      ok: false,
      mensaje: error.message
    });

  }

});

// =========================
// PUT /clientes/:id
// =========================

app.put('/clientes/:id', async (req, res) => {

  try {

    const { id } = req.params;
    const { nombre, email } = req.body;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        mensaje: "Cliente no encontrado"
      });
    }

    cliente.nombre = nombre;
    cliente.email = email;

    await cliente.save();

    res.json(cliente);

  } catch (error) {

    res.status(400).json({
      ok: false,
      mensaje: error.message
    });

  }

});

// =========================
// DELETE /clientes/:id
// =========================

app.delete('/clientes/:id', async (req, res) => {

  try {

    const { id } = req.params;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        mensaje: "Cliente no encontrado"
      });
    }

    await cliente.destroy();

    res.json({
      ok: true,
      mensaje: "Cliente eliminado"
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      mensaje: error.message
    });

  }

});


// =========================
// INICIAR SERVIDOR
// =========================

async function iniciarServidor() {

  try {

    await sequelize.authenticate();
    console.log("Conectado a PostgreSQL");

    await sequelize.sync();
    console.log("Tablas sincronizadas");

    app.listen(process.env.PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
    });

  } catch (error) {

    console.error("Error al iniciar:", error);

  }

}

iniciarServidor();