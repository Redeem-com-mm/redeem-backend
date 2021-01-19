module.exports = (sequelize, Sequelize) => {
    const Product = require("./product.js")(sequelize, Sequelize);
    const ProductType = require("./producttype.js")(sequelize, Sequelize);
    const User = require("./user.js")(sequelize, Sequelize);    
    const Category = require("./category.js")(sequelize, Sequelize);
    const SubCategory = require("./subcategory.js")(sequelize, Sequelize);
    const PaymentType = require("./paymenttype.js")(sequelize, Sequelize);

    const Order = sequelize.define("order", {
        id: {
            type: Sequelize.UUID,
            primaryKey : true
        },
        order_no: {
            type: Sequelize.STRING,
            allowNull : false
        },
        tran_id: {
            type: Sequelize.STRING
        },
        payment_status: {
            type: Sequelize.STRING
        },
        merchant_tran_id: {
            type: Sequelize.STRING
        },
        merchant_request: {
            type: Sequelize.STRING
        },
        merchant_response: {
            type: Sequelize.STRING
        },
        consumer_no: {
            type: Sequelize.STRING,
            allowNull : false
        },
        payment_slip: {
            type: Sequelize.STRING
        },        
        quantity: {
            type: Sequelize.INTEGER,
            allowNull : false,
            defaultValue : 1
        },
        user_id : {
            type : Sequelize.UUID,
            references: {
                model: User,
                key: "id"
            },
            allowNull: false
        },
        product_type_id: {
            type: Sequelize.UUID,
            references: {
                model: ProductType,
                key: "id"
            },
            allowNull: false
        },
        product_id: {
            type: Sequelize.UUID,
            references: {
                model: Product,
                key: "id"
            },
            allowNull: false
        },
        category_id: {
            type: Sequelize.UUID,
            references: {
                model: Category,
                key: "id"
            },
            allowNull: false
        },
        sub_category_id: {
            type: Sequelize.UUID,
            references: {
                model: SubCategory,
                key: "id"
            },
            allowNull: false
        },
        payment_type_id: {
            type: Sequelize.UUID,
            references: {
                model: PaymentType,
                key: "id"
            },
            allowNull: false
        },  
        tran_date : {
            type : Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        tran_status: {
            type: Sequelize.STRING,
            allowNull : false,
            defaultValue : "Pending"
        },
        product_name: {
            type: Sequelize.STRING,
            allowNull : false
        },
        product_name_mm: {
            type: Sequelize.STRING,
            allowNull : false
        },
        category_name: {
            type: Sequelize.STRING,
            allowNull : false
        },
        sub_category_name: {
            type: Sequelize.STRING,
            allowNull : false
        },        
        paid_price: {
            type: Sequelize.DECIMAL(10,2),
            allowNull : false
        },
        remark: {
            type: Sequelize.STRING
        },
        admin_remark: {
            type: Sequelize.STRING
        },               
        udf1: {
            type: Sequelize.STRING
        },               
        udf2: {
            type: Sequelize.STRING
        },               
        udf3: {
            type: Sequelize.STRING
        },               
        udf4: {
            type: Sequelize.STRING
        },               
        udf5: {
            type: Sequelize.STRING
        },               
        udf6: {
            type: Sequelize.STRING
        },               
        udf7: {
            type: Sequelize.STRING
        },               
        udf8: {
            type: Sequelize.STRING
        },               
        udf9: {
            type: Sequelize.STRING
        },               
        udf10: {
            type: Sequelize.STRING
        },               
        label1: {
            type: Sequelize.STRING
        },               
        label2: {
            type: Sequelize.STRING
        },               
        label3: {
            type: Sequelize.STRING
        },               
        label4: {
            type: Sequelize.STRING
        },               
        label5: {
            type: Sequelize.STRING
        },               
        label6: {
            type: Sequelize.STRING
        },               
        label7: {
            type: Sequelize.STRING
        },               
        label8: {
            type: Sequelize.STRING
        },               
        label9: {
            type: Sequelize.STRING
        },               
        label10: {
            type: Sequelize.STRING
        },
        updated_date : {
            type : Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updated_by : {
            type : Sequelize.UUID,
            references: {
                model: User,
                key: "id"
            },
            allowNull: false
        }
    },  {
            timestamps: false
    });

    Order.belongsTo(ProductType, {as: 'ProductType', foreignKey: 'product_type_id'}); // Adds product_type_id to Order
    Order.belongsTo(Category, {as: 'Category', foreignKey: 'category_id'}); // Adds category_id to Order
    Order.belongsTo(SubCategory, {as: 'SubCategory', foreignKey: 'sub_category_id'}); // Adds sub_category_id to Order
    Order.belongsTo(PaymentType, {as: 'PaymentType', foreignKey: 'payment_type_id'}); // Adds payment_type_id to Order
    Order.belongsTo(Product, {as: 'Product', foreignKey: 'product_id'}); // Adds product_id to Order
    Order.belongsTo(User, {as: 'OrderUser', foreignKey: 'user_id'}); // Adds user_id to Order
    Order.belongsTo(User, {as: 'CategoryUpdatedUser', foreignKey: 'updated_by'}); // Adds updated_by to Order
  
    return Order;
  };