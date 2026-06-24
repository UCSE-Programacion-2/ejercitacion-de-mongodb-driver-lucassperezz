const express = require('express');
const { ObjectId } = require('mongodb');
const { client, connectDB, closeDB } = require('./src/mongodb');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Middleware para inyectar la base de datos
app.use((req, res, next) => {
    req.db = client.db('MundialDB');
    req.collection = req.db.collection('equipos');
    next();
});

// GET /equipos
app.get('/equipos', async (req, res) => {
    const equipos = await req.collection.find().toArray();
    return res.status(200).json(equipos);
});

// GET /equipos/buscar - DEBE IR ANTES QUE /equipos/:id
app.get('/equipos/buscar', async (req, res) => {
    const { tecnico } = req.query;
    const filtro = tecnico ? { tecnico: { $regex: tecnico, $options: 'i' } } : {};
    const equipos = await req.collection.find(filtro).toArray();
    return res.status(200).json(equipos);
});

// GET /equipos/:id
app.get('/equipos/:id', async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    const equipo = await req.collection.findOne({ _id: new ObjectId(id) });
    if (!equipo) {
        return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    return res.status(200).json(equipo);
});

if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    });
}

module.exports = { app, closeDB, client, connectDB };