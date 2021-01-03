const express = require("express");
//var cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const cors = require("cors");
//var csrf = require('csurf')
//const morgan = require('morgan');
const morganBody = require('morgan-body');
require('dotenv').config();

const app = express();

// parse cookies
// we need this because "cookie" is true in csrfProtection
//app.use(cookieParser());
//app.use(csrf({ cookie: true }));

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

// error handler
/* app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
  res.status(403)
  res.send('Form Error')
}) */

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
//require("./routes/slider")(app);
require("./routes/fileupload")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
