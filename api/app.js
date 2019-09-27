process.title = 'apiApp';

const createError = require('http-errors');
const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser');
// helps with logging message during development
const logger = require('morgan');
// need for backend to communicate with frontend
const cors = require("cors");

// handles authentication
const passport = require('passport');
require('./config/auth').auth(passport)

// handles sessions
const expressSession = require('express-session');
const flash = require('connect-flash')

// routes
const indexRouter = require('./routes/index');
const authentication = require("./routes/authentication");
const protected = require('./routes/protected')
const search = require('./routes/search')
const profile = require('./routes/profile')

const app = express();

const expressLayouts = require('express-ejs-layouts')

//app.use(expressLayouts)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));
app.use(logger('dev'));

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//session & cookieParser
app.use(cookieParser());
app.use(expressSession({
    secret:'whatver',
    resave:false,
    saveUninitialized:false,
    //cookie:{secure:true}
}))

// connect flash ( redirect messages)
app.use(flash());

// global variables for flash messages
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.user = req.flash('user')
    next()

})
// need to be after express session
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

const db = require('./models/seq')


app.use('/', indexRouter);
app.use("/auth", authentication);
app.use("/protected", protected);
app.use("/search", search);
app.use("/profile", profile);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
/*
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{page:'Error', menuId:''});
});
*/
module.exports = app;
