const app = require('./app');
const connectDB = require('./src/configs/db.config');
require('dotenv').config();
const PORT = 8080;

connectDB();
app.listen(PORT, () =>{
    console.log('El servidor está corriendo en el puerto: ' + PORT);
});
