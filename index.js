const app = require('./app');
const connectDB = require('./src/configs/db.config');
const http = require('http');
const configureSocket = require('./src/configs/socket.io');
require('dotenv').config();
const PORT = process.env.PORT;

connectDB();

const server = http.createServer(app);
const io = configureSocket(server);



server.listen(PORT, () =>{
    console.log('El servidor está corriendo en el puerto: ' + PORT);
});


module.exports ={
    io
}