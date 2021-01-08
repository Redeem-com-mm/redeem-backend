module.exports = (sequelize, Sequelize) => {
    const Category = require("./category.js")(sequelize, Sequelize);
    const User = require("./user.js")(sequelize, Sequelize);

    const SubCategory = sequelize.define("subcategory", {
      id: {
        type: Sequelize.UUID,
        primaryKey : true
      },
      category_id: {
          type: Sequelize.UUID,
          references: {
              model: Category,
              key: "id"
          },
          allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },
      sale_price: {
        type: Sequelize.DECIMAL(10,2),
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

    SubCategory.belongsTo(Category, {as: 'Category', foreignKey: 'category_id', onDelete : 'CASCADE'}); // Adds category_id to SubCategory
    SubCategory.belongsTo(User, {as: 'CategoryCreatedUser', foreignKey: 'created_by'}); // Adds created_by to SubCategory
    SubCategory.belongsTo(User, {as: 'CategoryUpdatedUser', foreignKey: 'updated_by'}); // Adds updated_by to SubCategory
  
    return SubCategory;
  };