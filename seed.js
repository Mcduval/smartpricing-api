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
            { phone: '690123456', name: 'Alice', rating: 4.9, total_rides: 24 },
            { phone: '691234567', name: 'Bob', rating: 4.7, total_rides: 15 },
            { phone: '692345678', name: 'Charlie', rating: 5.0, total_rides: 8 },
            { phone: '693456789', name: 'Diana', rating: 4.8, total_rides: 32 }
        ]);
        console.log(`✅ ${users.length} utilisateurs créés`);
        
        // 2. Création des conducteurs
        const drivers = await Driver.bulkCreate([
            {
                name: 'Jean Kamga',
                phone: '694567890',
                vehicle_type: 'taxi',
                vehicle_plate: 'LT123AB',
                vehicle_color: 'Jaune',
                rating: 4.8,
                total_rides: 245,
                location: { lat: 4.0511, lng: 9.7679 },
                is_available: true
            },
            {
                name: 'Marie Ndi',
                phone: '695678901',
                vehicle_type: 'moto',
                vehicle_plate: 'RT456CD',
                vehicle_color: 'Rouge',
                rating: 4.2,
                total_rides: 89,
                location: { lat: 4.0421, lng: 9.6989 },
                is_available: true
            },
            {
                name: 'Paul Tamo',
                phone: '696789012',
                vehicle_type: 'taxi',
                vehicle_plate: 'LT789EF',
                vehicle_color: 'Bleu',
                rating: 3.9,
                total_rides: 567,
                location: { lat: 4.0581, lng: 9.6949 },
                is_available: true
            },
            {
                name: 'Sandra Ebosse',
                phone: '697890123',
                vehicle_type: 'moto',
                vehicle_plate: 'RT012GH',
                vehicle_color: 'Verte',
                rating: 4.9,
                total_rides: 156,
                location: { lat: 4.0456, lng: 9.7123 },
                is_available: true
            }
        ]);
        console.log(`✅ ${drivers.length} conducteurs créés`);
        
        // 3. Création de quelques courses d'exemple
        const rides = await Ride.bulkCreate([
            {
                user_id: users[0].id,
                driver_id: drivers[0].id,
                start_location: { address: 'Bonapriso', lat: 4.0511, lng: 9.7679 },
                end_location: { address: 'Akwa', lat: 4.0421, lng: 9.6989 },
                distance: 5.2,
                duration: 18,
                price: 1850,
                breakdown: [
                    { label: 'Prix de base (5.2km × 500F)', value: 2600 },
                    { label: 'Majoration nuit', value: 650 },
                    { label: 'Réduction périphérie', value: -400 }
                ],
                status: 'completed',
                started_at: new Date(Date.now() - 3600000),
                completed_at: new Date(Date.now() - 1800000)
            },
            {
                user_id: users[1].id,
                driver_id: drivers[1].id,
                start_location: { address: 'Centre', lat: 4.0581, lng: 9.6949 },
                end_location: { address: 'Bonapriso', lat: 4.0511, lng: 9.7679 },
                distance: 3.8,
                duration: 12,
                price: 1140,
                breakdown: [
                    { label: 'Prix de base (3.8km × 300F)', value: 1140 }
                ],
                status: 'completed',
                started_at: new Date(Date.now() - 7200000),
                completed_at: new Date(Date.now() - 6000000)
            }
        ]);
        console.log(`✅ ${rides.length} courses créées`);
        
        // 4. Création des notations
        const ratings = await Rating.bulkCreate([
            {
                ride_id: rides[0].id,
                from_user_id: users[0].id,
                to_driver_id: drivers[0].id,
                score: 5,
                comment: 'Très professionnel, voiture propre',
                type: 'passenger_to_driver'
            },
            {
                ride_id: rides[0].id,
                from_driver_id: drivers[0].id,
                to_user_id: users[0].id,
                score: 5,
                comment: 'Passagère agréable',
                type: 'driver_to_passenger'
            },
            {
                ride_id: rides[1].id,
                from_user_id: users[1].id,
                to_driver_id: drivers[1].id,
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