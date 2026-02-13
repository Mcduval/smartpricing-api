const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ride = sequelize.define('Ride', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    driver_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'drivers', key: 'id' }
    },
    start_location: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    end_location: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    distance: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'FCFA'
    },
    breakdown: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'started', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    requested_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    started_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    completed_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'rides',
    timestamps: true,
    underscored: true
});

module.exports = Ride;