const { Ride, Driver, User } = require('../models');

exports.createRide = async (req, res, next) => {
    try {
        const { userId, driverId, startLocation, endLocation, distance, price, breakdown } = req.body;
        
        const ride = await Ride.create({
            user_id: userId,
            driver_id: driverId,
            start_location: startLocation,
            end_location: endLocation,
            distance,
            price,
            breakdown,
            status: 'pending',
            requested_at: new Date()
        });
        
        res.status(201).json({
            success: true,
            ride
        });
        
    } catch (error) {
        next(error);
    }
};

exports.acceptRide = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const ride = await Ride.findByPk(id);
        
        if (!ride) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }
        
        ride.status = 'accepted';
        await ride.save();
        
        res.json({ success: true, ride });
        
    } catch (error) {
        next(error);
    }
};

exports.startRide = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const ride = await Ride.findByPk(id);
        
        if (!ride) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }
        
        ride.status = 'started';
        ride.started_at = new Date();
        await ride.save();
        
        res.json({ success: true, ride });
        
    } catch (error) {
        next(error);
    }
};

exports.completeRide = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const ride = await Ride.findByPk(id);
        
        if (!ride) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }
        
        ride.status = 'completed';
        ride.completed_at = new Date();
        await ride.save();
        
        // Incrémenter le compteur de courses
        await Driver.increment('total_rides', { by: 1, where: { id: ride.driver_id } });
        await User.increment('total_rides', { by: 1, where: { id: ride.user_id } });
        
        res.json({ success: true, ride });
        
    } catch (error) {
        next(error);
    }
};

exports.getUserRides = async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        const rides = await Ride.findAll({
            where: { user_id: userId },
            include: [{
                model: Driver,
                as: 'driver',
                attributes: ['id', 'name', 'vehicle_type', 'vehicle_plate', 'rating']
            }],
            order: [['created_at', 'DESC']],
            limit: 20
        });
        
        res.json({ success: true, count: rides.length, rides });
        
    } catch (error) {
        next(error);
    }
};

exports.getDriverRides = async (req, res, next) => {
    try {
        const { driverId } = req.params;
        
        const rides = await Ride.findAll({
            where: { driver_id: driverId },
            include: [{
                model: User,
                as: 'passenger',
                attributes: ['id', 'name', 'phone', 'rating']
            }],
            order: [['created_at', 'DESC']],
            limit: 20
        });
        
        res.json({ success: true, count: rides.length, rides });
        
    } catch (error) {
        next(error);
    }
};