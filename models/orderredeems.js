module.exports = (sequelize, Sequelize) => {  
    const Order = require("./order.js")(sequelize, Sequelize);  
    const Redeem = require("./redeem.js")(sequelize, Sequelize);
  
    const OrderRedeems = sequelize.define("orderredeems", {
      id: {
        type: Sequelize.UUID,
        primaryKey : true
      },
      order_id: {
        type: Sequelize.UUID,
        references: {
          model: Order,
          key: "id"
        },
        allowNull: false,
      },
      redeem_id: {
        type: Sequelize.UUID,
        references: {
          model: Redeem,
          key: "id"
        },
        allowNull: false,
      }
    }, {
        timestamps: false
    });
    
    OrderRedeems.belongsTo(Order, {as: 'Order', foreignKey: 'order_id', onDelete : 'CASCADE'}); // Adds order_id to OrderRedeems
    OrderRedeems.belongsTo(Redeem, {as: 'Redeem', foreignKey: 'redeem_id'}); // Adds redeem_id to OrderRedeems
  
    return OrderRedeems;
  };