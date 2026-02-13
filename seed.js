require('dotenv').config();
const { sequelize, User, Driver, Ride, Rating } = require('./models');

async function seedDatabase() {
    try {
        console.log('🌱 Début du seed...');
        
        // Reset complet de la BDD
        await sequelize.sync({ force: true });
        console.log('✅ Base de données réinitialisée');
        
        // 1. Création des utilisateurs
        const users = await User.bulkCreate([
            { phone: '690123456', name: 'Alice', rating: 4.9, totalRides: 24 },
            { phone: '691234567', name: 'Bob', rating: 4.7, totalRides: 15 },
            { phone: '692345678', name: 'Charlie', rating: 5.0, totalRides: 8 },
            { phone: '693456789', name: 'Diana', rating: 4.8, totalRides: 32 }
        ]);
        console.log(`✅ ${users.length} utilisateurs créés`);
        
        // 2. Création des conducteurs
        const drivers = await Driver.bulkCreate([
            {
                name: 'Jean Kamga',
                phone: '694567890',
                vehicleType: 'taxi',
                vehiclePlate: 'LT123AB',
                vehicleColor: 'Jaune',
                rating: 4.8,
                totalRides: 245,
                location: { lat: 4.0511, lng: 9.7679 },
                isAvailable: true
            },
            {
                name: 'Marie Ndi',
                phone: '695678901',
                vehicleType: 'moto',
                vehiclePlate: 'RT456CD',
                vehicleColor: 'Rouge',
                rating: 4.2,
                totalRides: 89,
                location: { lat: 4.0421, lng: 9.6989 },
                isAvailable: true
            },
            {
                name: 'Paul Tamo',
                phone: '696789012',
                vehicleType: 'taxi',
                vehiclePlate: 'LT789EF',
                vehicleColor: 'Bleu',
                rating: 3.9,
                totalRides: 567,
                location: { lat: 4.0581, lng: 9.6949 },
                isAvailable: true
            },
            {
                name: 'Sandra Ebosse',
                phone: '697890123',
                vehicleType: 'moto',
                vehiclePlate: 'RT012GH',
                vehicleColor: 'Verte',
                rating: 4.9,
                totalRides: 156,
                location: { lat: 4.0456, lng: 9.7123 },
                isAvailable: true
            }
        ]);
        console.log(`✅ ${drivers.length} conducteurs créés`);
        
        // 3. Création de quelques courses d'exemple
        const rides = await Ride.bulkCreate([
            {
                userId: users[0].id,
                driverId: drivers[0].id,
                startLocation: { address: 'Bonapriso', lat: 4.0511, lng: 9.7679 },
                endLocation: { address: 'Akwa', lat: 4.0421, lng: 9.6989 },
                distance: 5.2,
                duration: 18,
                price: 1850,
                breakdown: [
                    { label: 'Prix de base (5.2km × 500F)', value: 2600 },
                    { label: 'Majoration nuit', value: 650 },
                    { label: 'Réduction périphérie', value: -400 }
                ],
                status: 'completed',
                startedAt: new Date(Date.now() - 3600000),
                completedAt: new Date(Date.now() - 1800000)
            },
            {
                userId: users[1].id,
                driverId: drivers[1].id,
                startLocation: { address: 'Centre', lat: 4.0581, lng: 9.6949 },
                endLocation: { address: 'Bonapriso', lat: 4.0511, lng: 9.7679 },
                distance: 3.8,
                duration: 12,
                price: 1140,
                breakdown: [
                    { label: 'Prix de base (3.8km × 300F)', value: 1140 }
                ],
                status: 'completed',
                startedAt: new Date(Date.now() - 7200000),
                completedAt: new Date(Date.now() - 6000000)
            }
        ]);
        console.log(`✅ ${rides.length} courses créées`);
        
        // 4. Création des notations
        const ratings = await Rating.bulkCreate([
            {
                rideId: rides[0].id,
                fromUserId: users[0].id,
                toDriverId: drivers[0].id,
                score: 5,
                comment: 'Très professionnel, voiture propre',
                type: 'passenger_to_driver'
            },
            {
                rideId: rides[0].id,
                fromDriverId: drivers[0].id,
                toUserId: users[0].id,
                score: 5,
                comment: 'Passagère agréable',
                type: 'driver_to_passenger'
            },
            {
                rideId: rides[1].id,
                fromUserId: users[1].id,
                toDriverId: drivers[1].id,
                score: 4,
                comment: 'Course rapide, mais casque mal ajusté',
                type: 'passenger_to_driver'
            }
        ]);
        console.log(`✅ ${ratings.length} notations créées`);
        
        console.log('🎉 Seed terminé avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur pendant le seed:', error);
    } finally {
        await sequelize.close();
        console.log('🔒 Connexion BDD fermée');
    }
}

// Exécution
seedDatabase();