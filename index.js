const app = require('./app');
const connectDB = require('./src/configs/db.config');
const http = require('http');
require('dotenv').config();
const PORT = process.env.PORT;

connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log('El servidor está corriendo en el puerto: ' + PORT);
});
