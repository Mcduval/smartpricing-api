const errorHandler = (err, req, res, next) => {
    console.error('❌ Erreur:', err);
    
    // Erreur de validation Sequelize
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: 'Erreur de validation',
            details: err.errors.map(e => e.message)
        });
    }
    
    // Erreur de contrainte unique
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            error: 'Cette ressource existe déjà',
            details: err.errors.map(e => e.message)
        });
    }
    
    // Erreur par défaut
    res.status(500).json({
        error: 'Erreur interne du serveur',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = errorHandler;