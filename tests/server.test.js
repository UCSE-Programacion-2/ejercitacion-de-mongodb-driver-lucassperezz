const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
let app, closeDB, client;

jest.setTimeout(60000); // Dar tiempo para descargar los binarios de MongoDB en memoria la primera vez

let mongoServer;

beforeAll(async () => {
    // Inicializar servidor en memoria
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    process.env.MONGO_URI = mongoUri;
    process.env.PORT = 0; // random port para evitar colisiones
    
    // Cargar el servidor DESPUÉS de configurar la URI de memoria para que use el entorno correcto
    const server = require('../server');
    app = server.app;
    closeDB = server.closeDB;
    client = server.client;

    // Ejecutar connectDB manualmente para inicializar las variables globales db y collection en server.js
    await server.connectDB();
    
    const db = client.db('MundialDB');
    const collection = db.collection('equipos');
    
    // Poblamos la DB con datos iniciales
    await collection.insertMany([
        { _id: require('mongodb').ObjectId.createFromHexString('5f9b3b3b3b3b3b3b3b3b3b31'), equipo: 'Argentina', tecnico: 'Lionel Scaloni', continente: 'Sudamérica', campeonatos_mundiales: 3 },
        { _id: require('mongodb').ObjectId.createFromHexString('5f9b3b3b3b3b3b3b3b3b3b32'), equipo: 'Francia', tecnico: 'Didier Deschamps', continente: 'Europa', campeonatos_mundiales: 2 },
        { _id: require('mongodb').ObjectId.createFromHexString('5f9b3b3b3b3b3b3b3b3b3b33'), equipo: 'México', tecnico: 'Lionel Perez', continente: 'Norteamérica', campeonatos_mundiales: 0 },
    ]);
});

afterAll(async () => {
    await closeDB();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe('Endpoints de Equipos con MongoDB', () => {

    test('GET /equipos debería retornar 200 y una lista de equipos', async () => {
        const response = await request(app).get('/equipos');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(3);
    });

    test('GET /equipos/buscar?tecnico=lionel debería filtrar correctamente', async () => {
        const response = await request(app).get('/equipos/buscar?tecnico=lionel');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        const equipos = response.body.map(e => e.equipo);
        expect(equipos).toContain('Argentina');
        expect(equipos).toContain('México');
    });

    test('GET /equipos/buscar debería retornar lista vacía si no hay coincidencias', async () => {
        const response = await request(app).get('/equipos/buscar?tecnico=guardiola');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });

    test('GET /equipos/:id con ID válido existente debería retornar 200 y el equipo', async () => {
        const response = await request(app).get('/equipos/5f9b3b3b3b3b3b3b3b3b3b32');
        expect(response.status).toBe(200);
        expect(response.body.equipo).toBe('Francia');
    });

    test('GET /equipos/:id con ID válido inexistente debería retornar 404', async () => {
        const response = await request(app).get('/equipos/5f9b3b3b3b3b3b3b3b3b3b39');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Equipo no encontrado');
    });

    test('GET /equipos/:id con ID inválido debería retornar 400', async () => {
        const response = await request(app).get('/equipos/123');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('ID inválido');
    });

});
