module.exports = (sequelize, Sequelize) => {
    const SubCategory = require("./subcategory.js")(sequelize, Sequelize);
    const User = require("./user.js")(sequelize, Sequelize);

    const Redeem = sequelize.define("redeem", {
      id: {
        type: Sequelize.UUID,
        primaryKey : true
      },
      sub_category_id: {
          type: Sequelize.UUID,
          references: {
              model: SubCategory,
              key: "id"
          },
          allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      serial_number: {
        type: Sequelize.STRING
      },
      expired_date: {
        type: Sequelize.STRING
      },
      is_sold: {
        type: Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : false
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

    Redeem.belongsTo(SubCategory, {as: 'SubCategory', foreignKey: 'sub_category_id', onDelete : 'CASCADE'}); // Adds sub_category_id to Redeem
    Redeem.belongsTo(User, {as: 'RedeemCreatedUser', foreignKey: 'created_by'}); // Adds created_by to Redeem
    Redeem.belongsTo(User, {as: 'RedeemUpdatedUser', foreignKey: 'updated_by'}); // Adds updated_by to Redeem
  
    return Redeem;
  };