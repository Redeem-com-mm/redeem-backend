module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
      id: {
        type: Sequelize.UUID,
        primaryKey : true
      },
      name: {
        type: Sequelize.STRING
      }
    }, {
        timestamps: false
    });
  
    return Role;
  };