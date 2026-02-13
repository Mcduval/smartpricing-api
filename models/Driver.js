const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    vehicle_type: {
        type: DataTypes.ENUM('taxi', 'moto'),
        allowNull: false
    },
    vehicle_plate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicle_color: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 4.0,
        validate: { min: 0, max: 5 }
    },
    total_rides: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    location: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    last_seen: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'drivers',
    timestamps: true,
    underscored: true
});

module.exports = Driver;