module.exports = (sequelize, Sequelize) => {
    const Field = sequelize.define("field", {
      id: {
        type: Sequelize.UUID,
        primaryKey : true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    }, {
        timestamps: false
    });
  
    return Field;
  };