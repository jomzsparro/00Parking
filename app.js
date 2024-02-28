const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const mongoose = require('mongoose');

const port = 8080;
const mongoURI = 'mongodb+srv://admin:admin@00parking.wjsj3j3.mongodb.net/?retryWrites=true&w=majority&appName=00parking';

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

connectToDatabase();

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    name: 'sessionId',
    secret: 'mysecretkeythatiwillnottellyou',
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: mongoURI,
      ttl: 1 * 24 * 60 * 60,
    }),
    cookie: {
      secure: false,
      httpOnly: false,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    },
  })
);

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});


app.use("/vehicle",require('./routes/vehicle_info_api'))

app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/pages'));


app.listen(port, function () {
  console.log(`listening on port ${port}...`);
});
