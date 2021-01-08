module.exports = (sequelize, Sequelize) => {  
  const Category = require("./category.js")(sequelize, Sequelize);  
  const Field = require("./field.js")(sequelize, Sequelize);
  const User = require("./user.js")(sequelize, Sequelize);

  const CategoryField = sequelize.define("categoryfield", {
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
      allowNull: false,
    },
    field_id: {
      type: Sequelize.UUID,
      references: {
        model: Field,
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
  
  //CategoryField.belongsTo(Field, {as: 'Field', foreignKey: 'field_id'}); // Adds field_id to CategoryField
  CategoryField.belongsTo(Category, {as: 'Category', foreignKey: 'category_id'}); // Adds category_id to CategoryField
  CategoryField.belongsTo(User, {as: 'CategoryCreatedUser', foreignKey: 'created_by'}); // Adds created_by to CategoryField
  CategoryField.belongsTo(User, {as: 'CategoryUpdatedUser', foreignKey: 'updated_by'}); // Adds updated_by to CategoryField

  return CategoryField;
};