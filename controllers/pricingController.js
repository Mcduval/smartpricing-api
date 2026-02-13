const { Driver, Ride } = require('../models');

exports.estimatePrice = async (req, res, next) => {
    try {
        const { distance, vehicleType, isNight, zone } = req.body;
        
        // Validation
        if (!distance || !vehicleType) {
            return res.status(400).json({ error: 'Distance et type de véhicule requis' });
        }
        
        // Règles métier
        const baseRate = vehicleType === 'moto' ? 300 : 500;
        const basePrice = distance * baseRate;
        
        let finalPrice = basePrice;
        const breakdown = [{ 
            label: `Prix de base (${distance}km × ${baseRate}F/km)`, 
            value: Math.round(basePrice) 
        }];
        
        // Facteurs contextuels
        if (isNight) {
            const surcharge = Math.round(basePrice * 0.25);
            finalPrice += surcharge;
            breakdown.push({ label: 'Majoration nuit (+25%)', value: surcharge });
        }
        
        if (zone === 'centre') {
            const surcharge = Math.round(basePrice * 0.10);
            finalPrice += surcharge;
            breakdown.push({ label: 'Zone centre-ville (+10%)', value: surcharge });
        } else if (zone === 'périphérie') {
            const discount = Math.round(basePrice * -0.05);
            finalPrice += discount;
            breakdown.push({ label: 'Zone périphérie (-5%)', value: discount });
        }
        
        res.json({
            success: true,
            recommendedPrice: Math.round(finalPrice),
            breakdown,
            currency: 'FCFA',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        next(error);
    }
};