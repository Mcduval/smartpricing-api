const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', apiRoutes);

// Route de santé
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        time: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

// Gestion des erreurs (doit être DERNIER)
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion BDD établie avec succès');
        
        await sequelize.sync({ alter: true });
        console.log('✅ Modèles synchronisés');
        
        app.listen(PORT, () => {
            console.log(`🚀 API démarrée sur http://localhost:${PORT}`);
            console.log(`📡 Environnement: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Erreur de démarrage:', error);
        process.exit(1);
    }
}

startServer();