module.exports = (sequelize, Sequelize) => {
    const ProductType = sequelize.define("producttype", {
      id: {
        type: Sequelize.UUID,
        primaryKey : true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING
      }
    }, {
        timestamps: false
    });
  
    return ProductType;
  };