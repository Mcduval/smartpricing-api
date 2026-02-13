const express = require('express');
const router = express.Router();

// Controllers
const pricingController = require('../controllers/pricingController');
const driverController = require('../controllers/driverController');
const rideController = require('../controllers/rideController');
const ratingController = require('../controllers/ratingController');

// ==================== PRICING ====================
router.post('/estimate', pricingController.estimatePrice);

// ==================== DRIVERS ====================
router.get('/drivers/nearby', driverController.getNearbyDrivers);
router.get('/drivers/:id', driverController.getDriverById);
router.put('/drivers/:id/location', driverController.updateDriverLocation);
router.patch('/drivers/:id/availability', driverController.toggleAvailability);

// ==================== RIDES ====================
router.post('/rides', rideController.createRide);
router.patch('/rides/:id/accept', rideController.acceptRide);
router.patch('/rides/:id/start', rideController.startRide);
router.patch('/rides/:id/complete', rideController.completeRide);
router.get('/rides/user/:userId', rideController.getUserRides);
router.get('/rides/driver/:driverId', rideController.getDriverRides);

// ==================== RATINGS ====================
router.post('/ratings', ratingController.createRating);
router.get('/ratings/driver/:driverId', ratingController.getDriverRatings);
router.get('/ratings/user/:userId', ratingController.getUserRatings);

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

module.exports = router;