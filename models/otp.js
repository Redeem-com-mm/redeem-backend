module.exports = (sequelize, Sequelize) => {
    const OTP = sequelize.define("otp", {
        phone_no: {
        type: Sequelize.STRING,
        primaryKey : true
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at : {
          type : Sequelize.DATE,
          defaultValue: Sequelize.NOW
      }
    }, {
        timestamps: false
    });
  
    return OTP;
};