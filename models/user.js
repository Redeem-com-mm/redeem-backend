module.exports = (sequelize, Sequelize) => {  
    const Role = require("./role.js")(sequelize, Sequelize);

    const User = sequelize.define("user", {
      id: {
        type: Sequelize.UUID,
        primaryKey : true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING
      },
      phone_no: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      township: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      social_id: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue : true
      },
      updated_date: {
        type : Sequelize.DATE
      }
    }, {
      timestamps: false
  });
  
  User.belongsTo(Role, {as: 'Role', foreignKey: 'role_id'}); // Adds role_id to Product

  return User;
};