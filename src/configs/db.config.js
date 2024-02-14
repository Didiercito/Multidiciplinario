const mongoose = require('mongoose');
require('dotenv').config();



async function connetDB () {
    try {
        await mongoose.connect('mongodb://localhost:27017/didi', {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('Conexión exitosa con la base de datos');
    } catch (error) {
        console.log('Erorr al momento de conecta a la base datos')
        console.error(error);
    }
};


module.exports = connetDB;