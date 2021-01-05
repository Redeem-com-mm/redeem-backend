module.exports = (sequelize, Sequelize) => {    
  const User = require("./user.js")(sequelize, Sequelize);
  const PaymentType = sequelize.define("paymenttype", {
    id: {
      type: Sequelize.UUID,
      primaryKey : true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    merchant_name: {
      type: Sequelize.STRING,
      allowNull: false
    },      
    merchant_code: {
      type: Sequelize.STRING,
      allowNull: false
    },  
    type: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING
    },
    qr_url: {
      type: Sequelize.STRING
    },
    logo_url: {
      type: Sequelize.STRING
    },
    api_url: {
      type: Sequelize.STRING
    },
    user_id : {
      type: Sequelize.STRING
    },
    user_password : {
      type: Sequelize.STRING
    },
    token_url : {
      type: Sequelize.STRING
    },
    is_active: {
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

  PaymentType.belongsTo(User, {as: 'PaymentTypeCreatedUser', foreignKey: 'created_by'}); // Adds created_by to Category
  PaymentType.belongsTo(User, {as: 'PaymentTypeUpdatedUser', foreignKey: 'updated_by'}); // Adds updated_by to Category

  return PaymentType;
};