const {Model} = require('sequelize');

// Quiz model definition:

module.exports = (sequelize, DataTypes) => {
    
    class Quiz extends Model {}

    Quiz.init(
        {
            question: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Question can't be empty"}}
            },
            answer: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Answer can't be empty"}}
            }
        },
        {
            sequelize
        }
    );

    return Quiz;
};
