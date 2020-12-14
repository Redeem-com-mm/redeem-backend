module.exports = (sequelize, Sequelize) => {
    const Product = require("./product.js")(sequelize, Sequelize);
    const User = require("./user.js")(sequelize, Sequelize);

    const Category = sequelize.define("category", {
      id: {
        type: Sequelize.UUID,
        primaryKey : true
      },
      product_id: {
          type: Sequelize.UUID,
          references: {
              model: Product,
              key: "id"
          },
          allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING
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

    Category.belongsTo(Product, {as: 'Product', foreignKey: 'product_id'}); // Adds product_id to Category
    Category.belongsTo(User, {as: 'CategoryCreatedUser', foreignKey: 'created_by'}); // Adds created_by to Category
    Category.belongsTo(User, {as: 'CategoryUpdatedUser', foreignKey: 'updated_by'}); // Adds updated_by to Category
  
    return Category;
  };