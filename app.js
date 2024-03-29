const path = require('path');
require('dotenv').config({ path: './.env' });
const fs  = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoURI = process.env.MONGODB_URI
const mongoURI1 = process.env.MONGODB_URI
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const morgan = require('morgan');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const Store = new MongoDBStore({
  uri: mongoURI,
  collection: 'sessions'
});
const csrfProtection = csrf();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + file.originalname);
  }
});



const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const accesLog = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accesLog}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: storage, fileFilter: fileFilter })
.single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: Store}));
app.use(csrfProtection);
app.use(flash());

app.use( (req, res, next) => {
  if (!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user){
        return next();
      }
  req.user = user;
  next();
})
  .catch(err => {
    next(new Error(err));
  })
});
app.use((req, res, next) => {

  res.locals.isAuth = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
next();
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.redirect('/500');
  // res.status(500).render('500', {
  //   pageTitle: 'Error',
  //   path: '/500',
  //   isAuth: true
  // });
})

mongoose
  .connect(
    mongoURI1
  )
  .then(result => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });
