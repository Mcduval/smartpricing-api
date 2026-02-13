const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    ride_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: { model: 'rides', key: 'id' }
    },
    from_user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' }
    },
    from_driver_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'drivers', key: 'id' }
    },
    to_driver_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'drivers', key: 'id' }
    },
    to_user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' }
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('passenger_to_driver', 'driver_to_passenger'),
        allowNull: false
    }
}, {
    tableName: 'ratings',
    timestamps: true,
    underscored: true
});

module.exports = Rating;