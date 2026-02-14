const { Ride, Driver, User } = require('../models');

exports.createRide = async (req, res, next) => {
    try {
        const { userId, driverId, startLocation, endLocation, distance, price, breakdown, vehicleType, zone } = req.body;
        
        // Validation des données requises
        if (!userId || !driverId || !startLocation || !endLocation || !price) {
            return res.status(400).json({ 
                success: false, 
                message: 'Informations manquantes (passager, conducteur, trajet ou prix).' 
            });
        }

        // Vérification de l'existence du passager et du conducteur pour éviter le crash 500
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Passager introuvable (ID: ' + userId + '). Avez-vous initialisé la base de données ?' });
        }

        const driver = await Driver.findByPk(driverId);
        if (!driver) {
            return res.status(404).json({ success: false, message: 'Conducteur introuvable.' });
        }

        const ride = await Ride.create({
            user_id: userId,
            driver_id: driverId,
            start_location: startLocation,
            end_location: endLocation,
            distance,
            price,
            breakdown: breakdown || [], // Valeur par défaut pour éviter les erreurs
            status: 'pending',
            requested_at: new Date(),
            vehicle_type: vehicleType,
            zone: zone
        });
        
        res.status(201).json({
            success: true,
            ride
        });
        
    } catch (error) {
        console.error('Erreur createRide:', error);
        // Renvoyer une réponse JSON propre au lieu de laisser le serveur planter
        res.status(500).json({ 
            success: false, 
            message: 'Une erreur serveur est survenue lors de la création de la course. Vérifiez les logs du backend.' 
        });
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

exports.cancelRide = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const ride = await Ride.findByPk(id);
        
        if (!ride) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }
        
        ride.status = 'cancelled';
        ride.cancelled_at = new Date();
        await ride.save();
        
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

exports.getRideById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const ride = await Ride.findByPk(id, {
            include: [
                {
                    model: Driver,
                    as: 'driver',
                    attributes: ['id', 'name', 'vehicle_type', 'vehicle_plate', 'rating', 'phone']
                },
                {
                    model: User,
                    as: 'passenger',
                    attributes: ['id', 'name', 'phone', 'rating']
                }
            ]
        });
        
        if (!ride) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }
        
        res.json({ success: true, ride });
        
    } catch (error) {
        next(error);
    }
};

exports.getPendingRides = async (req, res, next) => {
    try {
        const rides = await Ride.findAll({
            where: { status: 'pending' },
            include: [{
                model: User,
                as: 'passenger',
                attributes: ['id', 'name', 'phone', 'rating']
            }],
            order: [['created_at', 'DESC']]
        });
        
        res.json({ success: true, rides });
        
    } catch (error) {
        next(error);
    }
};