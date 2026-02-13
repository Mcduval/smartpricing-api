const { Driver, Rating } = require('../models');
const { Op } = require('sequelize');

exports.getNearbyDrivers = async (req, res, next) => {
    try {
        const { lat, lng, vehicleType, maxDistance = 5 } = req.query;
        
        const whereClause = {
            is_available: true
        };
        
        if (vehicleType && vehicleType !== 'all') {
            whereClause.vehicle_type = vehicleType;
        }
        
        const drivers = await Driver.findAll({
            where: whereClause,
            order: [
                ['rating', 'DESC'],
                ['total_rides', 'DESC']
            ],
            attributes: { exclude: ['last_seen', 'created_at', 'updated_at'] }
        });
        
        // Simulation de distance pour la démo
        const nearbyDrivers = drivers.map(driver => {
            const driverData = driver.toJSON();
            driverData.distance = Number((Math.random() * 3 + 0.5).toFixed(1));
            driverData.estimated_arrival = Math.round(driverData.distance * 12);
            return driverData;
        })
        .filter(d => d.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);
        
        res.json({
            success: true,
            count: nearbyDrivers.length,
            drivers: nearbyDrivers
        });
        
    } catch (error) {
        next(error);
    }
};

exports.getDriverById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const driver = await Driver.findByPk(id, {
            include: [{
                model: Rating,
                as: 'received_ratings',
                limit: 10,
                order: [['created_at', 'DESC']]
            }]
        });
        
        if (!driver) {
            return res.status(404).json({ error: 'Conducteur non trouvé' });
        }
        
        res.json({ success: true, driver });
        
    } catch (error) {
        next(error);
    }
};

exports.updateDriverLocation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { lat, lng } = req.body;
        
        const driver = await Driver.findByPk(id);
        
        if (!driver) {
            return res.status(404).json({ error: 'Conducteur non trouvé' });
        }
        
        driver.location = { lat, lng };
        driver.last_seen = new Date();
        await driver.save();
        
        res.json({ success: true, driver });
        
    } catch (error) {
        next(error);
    }
};

exports.toggleAvailability = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const driver = await Driver.findByPk(id);
        
        if (!driver) {
            return res.status(404).json({ error: 'Conducteur non trouvé' });
        }
        
        driver.is_available = !driver.is_available;
        await driver.save();
        
        res.json({ 
            success: true, 
            is_available: driver.is_available 
        });
        
    } catch (error) {
        next(error);
    }
};