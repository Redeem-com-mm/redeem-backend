module.exports = (sequelize, Sequelize) => {  
  const ProductType = require("./producttype.js")(sequelize, Sequelize);  
  const PaymentType = require("./paymenttype.js")(sequelize, Sequelize);
  const User = require("./user.js")(sequelize, Sequelize);

  const ProductTypePayment = sequelize.define("producttypepayment", {
    id: {
      type: Sequelize.UUID,
      primaryKey : true
    },
    product_type_id: {
      type: Sequelize.UUID,
      references: {
        model: ProductType,
        key: "id"
      },
      allowNull: false,
    },
    payment_type_id: {
      type: Sequelize.UUID,
      references: {
        model: PaymentType,
        key: "id"
      },
      allowNull: false,
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
  
  ProductTypePayment.belongsTo(PaymentType, {as: 'PaymentType', foreignKey: 'payment_type_id'}); // Adds payment_type_id to ProductTypePayment
  ProductTypePayment.belongsTo(ProductType, {as: 'ProductType', foreignKey: 'product_type_id'}); // Adds product_type_id to ProductTypePayment
  ProductTypePayment.belongsTo(User, {as: 'CategoryCreatedUser', foreignKey: 'created_by'}); // Adds created_by to ProductTypePayment
  ProductTypePayment.belongsTo(User, {as: 'CategoryUpdatedUser', foreignKey: 'updated_by'}); // Adds updated_by to ProductTypePayment

  return ProductTypePayment;
};