const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
    // PRODUCTION (Render)
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
            timestamps: true,
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }        
    });

        console.log(process.env.DATABASE_URL);

} else {
    // DÉVELOPPEMENT (localhost)
    sequelize = new Sequelize(
        process.env.DB_DATABASE,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            dialectOptions: process.env.DB_USE_SSL === 'true' ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            } : {},
            logging: console.log,
            define: {
                timestamps: true,
                underscored: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        }
    );

        console.log(process.env.DB_HOST);

}

module.exports = sequelize;