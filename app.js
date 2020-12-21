const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//const morgan = require('morgan');
const morganBody = require('morgan-body');
require('dotenv').config();

const app = express();

const db = require("./models");
db.sequelize.sync();

/* var corsOptions = {
  origin: "http://localhost:8081"
}; */

//app.use(cors(corsOptions));
//app.use(morgan('dev'));

app.use(cors());
morganBody(app);

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ecommerce application." });
});


require("./routes/role")(app);
require("./routes/user")(app);
require("./routes/login")(app);
require("./routes/otp")(app);
require("./routes/producttype")(app);
require("./routes/product")(app);
require("./routes/category")(app);
require("./routes/subcategory")(app);
require("./routes/redeem")(app);
require("./routes/field")(app);
require("./routes/categoryfield")(app);
require("./routes/paymenttype")(app);
require("./routes/producttypepayment")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
