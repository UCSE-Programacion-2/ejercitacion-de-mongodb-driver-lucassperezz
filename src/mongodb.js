const { MongoClient } = require('mongodb');

// Para versiones de Node 24.14.0 o superior
const dns = require('dns');
dns.setServers(['8.8.8.8']);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';

// Cliente de MongoDB
const client = new MongoClient(MONGO_URI);

async function connectDB() {
    try {
        await client.connect();
        console.log('Conectado correctamente a MongoDB');
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
    }
}

async function closeDB() {
    await client.close();
}

module.exports = { client, connectDB, closeDB };