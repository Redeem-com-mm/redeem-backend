module.exports = (sequelize, Sequelize) => {
    const PaymentType = sequelize.define("paymenttype", {
      id: {
        type: Sequelize.UUID,
        primaryKey : true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      photo_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING
      }
    }, {
        timestamps: false
    });
  
    return PaymentType;
  };