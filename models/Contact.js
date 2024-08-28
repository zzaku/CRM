const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Veuillez entrer un email valide.']
    },
    phone: {
        type: String,
        required: false,
    }
});

module.exports = mongoose.model('Contact', ContactSchema);
