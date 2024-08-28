const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur du serveur', error: err.message });
};

module.exports = errorHandler;