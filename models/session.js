const {Model} = require('sequelize');

// Session model definition
module.exports = (sequelize, DataTypes) => {
    
    class Session extends Model {}

    Session.init(
        {
            sid: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            expires : {
                type: DataTypes.DATE
            },
            data: {
                type: DataTypes.STRING(50000)
            }
        },
        {
            sequelize
        }
    );
    return Session
};
