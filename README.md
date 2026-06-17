# Ejercitación: MongoDB Driver en Node.js

Bienvenido a la ejercitación práctica sobre **Integración de MongoDB con Node.js**.

## Objetivo
Implementar un servidor web usando **Express JS** que exponga una API REST para consultar la colección de `equipos` del mundial, conectándose a una base de datos en **MongoDB Atlas** utilizando el **Driver Oficial de MongoDB para Node.js**. 

A diferencia del ejercicio de Fundamentos, aquí no usaremos el FileSystem, sino que nos conectaremos a la base de datos `MundialDB` que usaste en la ejercitación anterior, donde ya importaste los datos.

## Requisitos previos
- Node.js instalado en tu equipo (`>= 20.6.0` recomendado para usar `--env-file`).
- Una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) con tu IP habilitada para conectarse.
- Haber completado la importación del archivo `world-cup.json` en la base de datos `MundialDB`, colección `equipos`, tal como se hizo en la ejercitación anterior.

## Instalación y Configuración

1. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

2. Configura tus variables de entorno:
   - Duplica el archivo `.env.example` y renómbralo a `.env`.
   - Reemplaza `<usuario>`, `<password>`, `<cluster>`, y `<NombreApp>` por los datos reales de tu conexión a MongoDB Atlas.

3. Levanta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

## Tareas a realizar

Abre el archivo `server.js`. Allí encontrarás comentarios `TODO` que indican dónde debes codificar:

1. **Inicializar Conexión**: Usa `MongoClient` para conectarte a tu cluster y asigna la base de datos `MundialDB` a la variable `db`, y la colección `equipos` a la variable `collection`.
2. **Endpoint `GET /equipos`**: Usa `collection.find()` para obtener todos los equipos, conviértelos a un arreglo con `toArray()` y devuélvelos con status `200`.
3. **Endpoint `GET /equipos/buscar`**: Usa el operador de expresiones regulares (`$regex`) para buscar equipos por `tecnico` sin distinguir mayúsculas ni minúsculas. El parámetro de consulta se llamará `tecnico`.
4. **Endpoint `GET /equipos/:id`**: Valida que el parámetro sea un `ObjectId` válido usando `ObjectId.isValid()`. Si lo es, búscalo con `collection.findOne()`.

## Validación manual

Puedes verificar el funcionamiento a nivel de código utilizando el archivo `api.http` provisto. 
- Instala la extensión **REST Client** en VS Code.
- Abre `api.http` y haz click en `Send Request` sobre cada bloque para probar las respuestas en formato JSON contra tu servidor corriendo y tu base de datos MongoDB real.

## Autoevaluación

El proyecto incluye tests automáticos que usan una base de datos temporal en memoria (`mongodb-memory-server`) para que no necesites internet al evaluarlo. Una vez que hayas completado los puntos en `server.js`, puedes ejecutar:

```bash
npm test
```

Asegúrate de que todos los tests pasen exitosamente antes de realizar el `commit` y `push` final, ya que estos mismos tests evaluarán tu entrega en GitHub Classroom.
