
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const database = require('./db/index.js');
const dbConfig = require('./config/index.js');
const database2 = require('./db/index2.js');


const defaultThreadPoolSize = 4;;
// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE = dbConfig.dbPool.poolMax + defaultThreadPoolSize;


const initAuthMiddleware = require('./features/login/init-auth-middleware');
const indexRouter = require('./routes/index')


const staticFolder = 'public';
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, staticFolder)));

app.use(bodyParser.urlencoded({limit: '500mb',extended: true}));
app.use(bodyParser.json({ limit: '500mb' }));

const { COOKIE_EXPIRATION_MS } = process.env;
app.use(
  session({
    secret: 'keyboard cat',
    name: process.env.SESSION_COOKIE_NAME,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      expires: Date.now() + parseInt(COOKIE_EXPIRATION_MS, 10),
      maxAge: parseInt(COOKIE_EXPIRATION_MS, 10),
    },
  })
);

initAuthMiddleware(app);

// Middleware used for setting error and success messages as available in _ejs_ templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  if (req.session) {
    res.locals.messages = req.session.messages;
    res.locals.userInfo = req.session.userInfo;
    req.session.messages = {};
  }
  next();
});
try {
  console.log('Initializing uganda database module');
  database.initialize();
  try {
    console.log('Initializing fhop database module');
    database2.initialize();
    // database2.initialize();
  } catch (err) {
    console.error(err);
    process.exit(1); // Non-zero failure code
  }
  // database2.initialize();
} catch (err) {
  console.error(err);
  process.exit(1); // Non-zero failure code
}


app.use('/', indexRouter);

global.__basedir = "http://localhost:8013";

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).render('pages/404');
});

module.exports = app;
