const { User } = require('../models');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            order: [['created_at', 'DESC']]
        });
        
        res.json({
            success: true,
            count: users.length,
            users
        });
        
    } catch (error) {
        next(error);
    }
};