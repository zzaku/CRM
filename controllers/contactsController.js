const Contact = require('../models/Contact');

exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).send('Erreur du serveur');
    }
};

exports.createContact = async (req, res) => {
    const { firstname, lastname, email, phone } = req.body;
    try {
        const contact = new Contact({
            firstname,
            lastname,
            email,
            phone
        });
        await contact.save();
        res.json(contact);
    } catch (err) {
        res.status(500).send('Erreur du serveur');
    }
};

exports.updateContact = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, phone } = req.body;
    try {
        const contact = await Contact.findByIdAndUpdate(
            id,
            { firstname, lastname, email, phone },
            { new: true, runValidators: true }
        );
        if (!contact) {
            return res.status(404).json({ message: 'Contact non trouvé' });
        }
        res.json(contact);
    } catch (err) {
        res.status(500).send('Erreur du serveur');
    }
};

exports.deleteContact = async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact non trouvé' });
        }
        res.json({ message: 'Contact supprimé avec succès' });
    } catch (err) {
        res.status(500).send('Erreur du serveur');
    }
};
