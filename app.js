const express = require("express");
var path = require('path');
//var cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const cors = require("cors");
//var csrf = require('csurf')
//const morgan = require('morgan');
const morganBody = require('morgan-body');
require('dotenv').config();

const app = express();
var http = require('http').Server(app);

const io = require('socket.io')(http, {
  cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

require('./services/notification.js').Noti(io);

// parse cookies
// we need this because "cookie" is true in csrfProtection
//app.use(cookieParser());
//app.use(csrf({ cookie: true }));

const db = require("./models");
db.sequelize.sync();

/* var corsOptions = {
  origin: "http://localhost:3000"
}; */

//app.use(cors(corsOptions));
//app.use(morgan('dev'));

console.log('Dir : ' + __dirname);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

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

var sessionsMap = [];

/* io.on('connection', (socket) => {
  console.log('a user connected');
  
  io.to(socket.id).emit('newclientconnect', { description: 'Hey, welcome! ' + socket.id});
}); */

app.set('io', io);

app.use(function(req, res, next) {
  req.io = io;
  next();
});

require("./routes/role")(app);
require("./routes/user")(app);
require("./routes/login")(app, io);
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
require("./routes/slider")(app);
require("./routes/fileupload")(app);
require("./routes/order")(app);
require("./routes/section")(app);
require("./routes/page")(app);

app.get('/', function(req, res, next) {
  res.end('Home page');
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
