module.exports = (sequelize, Sequelize) => {  
    const User = require("./user.js")(sequelize, Sequelize);
  
    const Page = sequelize.define("pages", {
      id: {
        type: Sequelize.UUID,
        primaryKey : true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title_mm: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      menu: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      menu_mm: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      permalink: {
        type: Sequelize.STRING,
        allowNull: false,
        unique : true
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      body_mm: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_active : {
        type : Sequelize.BOOLEAN,
        defaultValue : true
      },
      created_date : {
        type : Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_date : {
        type : Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      created_by : {
        type : Sequelize.UUID,
        references: {
          model: User,
          key: "id"
        },
        allowNull: false
      },
      updated_by : {
        type : Sequelize.UUID,
        references: {
          model: User,
          key: "id"
        },
        allowNull: false
      }
    }, {
        timestamps: false
    });
    
    Page.belongsTo(User, {as: 'PageCreatedUser', foreignKey: 'created_by'}); // Adds created_by to Page
    Page.belongsTo(User, {as: 'PageUpdatedUser', foreignKey: 'updated_by'}); // Adds updated_by to Page
  
    return Page;
  };