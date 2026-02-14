const { User, Driver } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'smartpricing_secret_key_123'; // À mettre dans .env en prod

// Générer un token
const generateToken = (id, type) => {
    return jwt.sign({ id, type }, JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res, next) => {
    try {
        const { name, phone, password, role, vehicleType, vehiclePlate } = req.body;

        // Vérifier si l'utilisateur existe déjà
        if (role === 'driver') {
            const existingDriver = await Driver.findOne({ where: { phone } });
            if (existingDriver) return res.status(400).json({ success: false, message: 'Ce numéro est déjà utilisé par un conducteur.' });

            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Générer une position aléatoire autour de Douala pour que le conducteur soit visible sur la carte
            // Centre de Douala (Akwa/Bonapriso)
            const baseLat = 4.0511;
            const baseLng = 9.7679;
            // Variation aléatoire d'environ +/- 2km pour disperser les nouveaux inscrits
            const randomLat = baseLat + (Math.random() - 0.5) * 0.04;
            const randomLng = baseLng + (Math.random() - 0.5) * 0.04;

            const driver = await Driver.create({
                name,
                phone,
                password: hashedPassword,
                vehicle_type: vehicleType || 'taxi',
                vehicle_plate: vehiclePlate || 'LT-000-AA',
                location: { lat: randomLat, lng: randomLng }, // Localisation initiale
                is_available: true
            });

            res.status(201).json({
                success: true,
                user: { ...driver.toJSON(), type: 'driver' },
                token: generateToken(driver.id, 'driver')
            });
        } else {
            const existingUser = await User.findOne({ where: { phone } });
            if (existingUser) return res.status(400).json({ success: false, message: 'Ce numéro est déjà utilisé.' });

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                name,
                phone,
                password: hashedPassword
            });

            res.status(201).json({
                success: true,
                user: { ...user.toJSON(), type: 'passenger' },
                token: generateToken(user.id, 'passenger')
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { phone, password, role } = req.body;

        let user;
        if (role === 'driver') {
            user = await Driver.findOne({ where: { phone } });
        } else {
            user = await User.findOne({ where: { phone } });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Mot de passe incorrect.' });
        }

        res.json({
            success: true,
            user: { ...user.toJSON(), type: role === 'driver' ? 'driver' : 'passenger' },
            token: generateToken(user.id, role === 'driver' ? 'driver' : 'passenger')
        });

    } catch (error) {
        next(error);
    }
};
