module.exports = (sequelize, Sequelize) => {    
    const User = require("./user.js")(sequelize, Sequelize);
    const Slider = sequelize.define('slider', {
        id: {
          type: Sequelize.UUID,
          primaryKey : true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING
        },
        name_mm: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description_mm: {
          type: Sequelize.STRING
        },
        photo_url : {
          type : Sequelize.STRING,
          allowNull : false
        },
        destination_url : {
          type : Sequelize.STRING,
          allowNull : false
        },
        is_active : {
          type : Sequelize.BOOLEAN,
          defaultValue : true
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

    Slider.belongsTo(User, {as : "SliderCreatedUser", foreignKey : "created_by"});
    Slider.belongsTo(User, {as : "SliderUpdatedUser", foreignKey : "updated_by"});

    return Slider; 
}