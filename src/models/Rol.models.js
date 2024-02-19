const mongoose = require('mongoose')


const rolSchema = new mongoose.Schema({
    name:{type: String, require: true}
});


const Rol = mongoose.model('Rol', rolSchema);

module.exports = Rol