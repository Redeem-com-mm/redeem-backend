module.exports = (sequelize, Sequelize) => {  
  const Category = require("./category.js")(sequelize, Sequelize);  
  const User = require("./user.js")(sequelize, Sequelize);
  const Field = sequelize.define("field", {
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
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name_mm: {
      type: Sequelize.STRING,
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

  Field.belongsTo(Category, {as: 'Category', foreignKey: 'category_id'}); // Adds category_id to Field
  Field.belongsTo(User, {as: 'FieldCreatedUser', foreignKey: 'created_by'}); // Adds created_by to Field
  Field.belongsTo(User, {as: 'FieldUpdatedUser', foreignKey: 'updated_by'}); // Adds updated_by to Field

  return Field;
};