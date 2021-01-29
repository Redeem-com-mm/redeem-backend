module.exports = (sequelize, Sequelize) => {  
    const Role = require("./role.js")(sequelize, Sequelize);  
    const User = require("./user.js")(sequelize, Sequelize);
  
    const NotiUsers = sequelize.define("notiusers", {
      id: {
        type: Sequelize.UUID,
        primaryKey : true
      },
      socket_id: {
        type: Sequelize.STRING,
        allowNull : false
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: User,
          key: "id"
        },
        allowNull: false,
      },
      role_id: {
        type: Sequelize.UUID,
        references: {
          model: Role,
          key: "id"
        },
        allowNull: false,
      }
    }, {
        timestamps: false
    });
    
    NotiUsers.belongsTo(User, {as: 'User', foreignKey: 'user_id', onDelete : 'CASCADE'}); // Adds user_id to NotiUsers
    NotiUsers.belongsTo(Role, {as: 'Role', foreignKey: 'role_id', onDelete : 'CASCADE'}); // Adds role_id to NotiUsers
  
    return NotiUsers;
  };