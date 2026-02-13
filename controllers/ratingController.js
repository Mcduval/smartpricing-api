const { Rating, Driver, User, Ride } = require('../models');
const { sequelize } = require('../models');

exports.createRating = async (req, res, next) => {
    try {
        const { rideId, fromUserId, fromDriverId, toDriverId, toUserId, score, comment, type } = req.body;
        
        // Vérifier que la course existe
        const ride = await Ride.findByPk(rideId);
        if (!ride) {
            return res.status(404).json({ error: 'Course non trouvée' });
        }
        
        // Créer la notation
        const rating = await Rating.create({
            ride_id: rideId,
            from_user_id: fromUserId,
            from_driver_id: fromDriverId,
            to_driver_id: toDriverId,
            to_user_id: toUserId,
            score,
            comment,
            type
        });
        
        // Mettre à jour la note moyenne
        if (toDriverId) {
            const driverRatings = await Rating.findAll({
                where: { to_driver_id: toDriverId },
                attributes: [[sequelize.fn('AVG', sequelize.col('score')), 'avgRating']]
            });
            
            const avgRating = parseFloat(driverRatings[0].dataValues.avgRating) || 4.0;
            
            await Driver.update(
                { rating: Math.round(avgRating * 10) / 10 },
                { where: { id: toDriverId } }
            );
        }
        
        if (toUserId) {
            const userRatings = await Rating.findAll({
                where: { to_user_id: toUserId },
                attributes: [[sequelize.fn('AVG', sequelize.col('score')), 'avgRating']]
            });
            
            const avgRating = parseFloat(userRatings[0].dataValues.avgRating) || 5.0;
            
            await User.update(
                { rating: Math.round(avgRating * 10) / 10 },
                { where: { id: toUserId } }
            );
        }
        
        res.status(201).json({
            success: true,
            rating
        });
        
    } catch (error) {
        next(error);
    }
};

exports.getDriverRatings = async (req, res, next) => {
    try {
        const { driverId } = req.params;
        
        const ratings = await Rating.findAll({
            where: { 
                to_driver_id: driverId,
                type: 'passenger_to_driver'
            },
            include: [{
                model: User,
                as: 'rater_user',
                attributes: ['id', 'name', 'rating']
            }],
            order: [['created_at', 'DESC']]
        });
        
        // Statistiques
        const stats = await Rating.findAll({
            where: { to_driver_id: driverId, type: 'passenger_to_driver' },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('score')), 'average'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'total']
            ]
        });
        
        res.json({
            success: true,
            count: ratings.length,
            average: parseFloat(stats[0].dataValues.average) || 0,
            ratings
        });
        
    } catch (error) {
        next(error);
    }
};

exports.getUserRatings = async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        const ratings = await Rating.findAll({
            where: { 
                to_user_id: userId,
                type: 'driver_to_passenger'
            },
            include: [{
                model: Driver,
                as: 'rater_driver',
                attributes: ['id', 'name', 'vehicle_type', 'rating']
            }],
            order: [['created_at', 'DESC']]
        });
        
        res.json({
            success: true,
            count: ratings.length,
            ratings
        });
        
    } catch (error) {
        next(error);
    }
};