module.exports = (sequelize, Sequelize) => {
    const ProductType = require("./producttype.js")(sequelize, Sequelize);
    const Section = require("./section.js")(sequelize, Sequelize);
    const User = require("./user.js")(sequelize, Sequelize);

    const Product = sequelize.define("product", {
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
          allowNull: false
      },
      section_id: {
        type: Sequelize.UUID,
        references: {
            model: Section,
            key: "id"
        },
        allowNull: false
      },
      weight : {
        type : Sequelize.INTEGER,
        allowNull : false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },      
      name_mm: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category_label: {
        type: Sequelize.STRING,
        allowNull: false,
      },      
      category_label_mm: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sub_category_label: {
        type: Sequelize.STRING,
        allowNull: false,
      },      
      sub_category_label_mm: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(800),
        allowNull: false
      },
      description_mm: {
        type: Sequelize.STRING(800),
        allowNull: false
      },
      photo_url : {
        type : Sequelize.STRING,
        allowNull : false
      },
      is_active : {
        type : Sequelize.BOOLEAN,
        defaultValue : false
      },
      auto_pay : {
        type : Sequelize.BOOLEAN,
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

    Product.belongsTo(Section, {as: 'Section', foreignKey: 'section_id'}); // Adds section_id to Product
    Product.belongsTo(ProductType, {as: 'ProductType', foreignKey: 'product_type_id'}); // Adds product_type_id to Product
    Product.belongsTo(User, {as: 'CreatedUser', foreignKey: 'created_by'}); // Adds created_by to Product
    Product.belongsTo(User, {as: 'UpdatedUser', foreignKey: 'updated_by'}); // Adds updated_by to Product
  
    return Product;
  };