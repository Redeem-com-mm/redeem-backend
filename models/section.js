module.exports = (sequelize, Sequelize) => {  
  const User = require("./user.js")(sequelize, Sequelize);
  const Section = sequelize.define("section", {
    id: {
      type: Sequelize.UUID,
      primaryKey : true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name_mm: {
      type: Sequelize.STRING,
      allowNull: false
    },
    photo_url: {
      type: Sequelize.STRING
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

  Section.belongsTo(User, {as: 'SectionCreatedUser', foreignKey: 'created_by'}); // Adds created_by to Section
  Section.belongsTo(User, {as: 'SectionUpdatedUser', foreignKey: 'updated_by'}); // Adds updated_by to Section

  return Section;
};