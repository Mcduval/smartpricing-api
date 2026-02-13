const User = require('./User');
const Driver = require('./Driver');
const Ride = require('./Ride');
const Rating = require('./Rating');
const sequelize = require('../config/database');

// --- Relations User ---
User.hasMany(Ride, { as: 'rides', foreignKey: 'user_id' });
Ride.belongsTo(User, { as: 'passenger', foreignKey: 'user_id' });

User.hasMany(Rating, { as: 'given_ratings', foreignKey: 'from_user_id' });
Rating.belongsTo(User, { as: 'rater_user', foreignKey: 'from_user_id' });

User.hasMany(Rating, { as: 'received_ratings', foreignKey: 'to_user_id' });
Rating.belongsTo(User, { as: 'rated_user', foreignKey: 'to_user_id' });

// --- Relations Driver ---
Driver.hasMany(Ride, { as: 'rides', foreignKey: 'driver_id' });
Ride.belongsTo(Driver, { as: 'driver', foreignKey: 'driver_id' });

Driver.hasMany(Rating, { as: 'received_ratings', foreignKey: 'to_driver_id' });
Rating.belongsTo(Driver, { as: 'rated_driver', foreignKey: 'to_driver_id' });

Driver.hasMany(Rating, { as: 'given_ratings', foreignKey: 'from_driver_id' });
Rating.belongsTo(Driver, { as: 'rater_driver', foreignKey: 'from_driver_id' });

// --- Relations Ride ---
Ride.hasMany(Rating, { as: 'ratings', foreignKey: 'ride_id' });
Rating.belongsTo(Ride, { as: 'ride', foreignKey: 'ride_id' });

module.exports = {
    User,
    Driver,
    Ride,
    Rating,
    sequelize
};