const express = require('express');
const router = express.Router();
const { sequelize } = require('../models'); // Import nécessaire pour le reset

// Controllers
const pricingController = require('../controllers/pricingController');
const driverController = require('../controllers/driverController');
const rideController = require('../controllers/rideController');
const ratingController = require('../controllers/ratingController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// ==================== AUTH ====================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// ==================== PRICING ====================
router.post('/estimate', pricingController.estimatePrice);

// ==================== DRIVERS ====================
router.get('/drivers/nearby', driverController.getNearbyDrivers);
router.get('/drivers/:id', driverController.getDriverById);
router.put('/drivers/:id/location', driverController.updateDriverLocation);
router.patch('/drivers/:id/availability', driverController.toggleAvailability);

// ==================== RIDES ====================
router.post('/rides', rideController.createRide);
router.get('/rides/pending', rideController.getPendingRides); // Doit être avant /rides/:id
router.get('/rides/:id', rideController.getRideById);
router.patch('/rides/:id/accept', rideController.acceptRide);
router.patch('/rides/:id/reject', rideController.rejectRide);
router.patch('/rides/:id/start', rideController.startRide);
router.patch('/rides/:id/complete', rideController.completeRide);
router.patch('/rides/:id/cancel', rideController.cancelRide);
router.get('/rides/user/:userId', rideController.getUserRides);
router.get('/rides/driver/:driverId', rideController.getDriverRides);

// ==================== RATINGS ====================
router.post('/ratings', ratingController.createRating);
router.get('/ratings/driver/:driverId', ratingController.getDriverRatings);
router.get('/ratings/user/:userId', ratingController.getUserRatings);

// ==================== USERS ====================
router.get('/users', userController.getAllUsers);

// ==================== TEST ====================
router.get('/test', (req, res) => {
    res.json({ 
        message: 'API SmartPricing fonctionnelle !',
        endpoints: [
            'POST /api/estimate',
            'GET /api/drivers/nearby',
            'GET /api/drivers/:id',
            'POST /api/rides',
            'POST /api/ratings'
        ]
    });
});


// ==================== ADMIN (A SUPPRIMER APRES DEMO) ====================
router.get('/reset-db-hackathon', async (req, res) => {
    try {
        // Vide et recrée toutes les tables
        await sequelize.sync({ force: true });
        res.json({ success: true, message: '♻️ Base de données vidée avec succès ! Prêt pour la démo.' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;