const mongoose = require('mongoose');
require('dotenv').config();
const URI = process.env.MONGO_URI;


async function connetDB () {
    try {
        await mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('Conexión exitosa con la base de datos');
    } catch (error) {
        console.log('Erorr al momento de conecta a la base datos')
        console.error(error);
    }
};


module.exports = connetDB;