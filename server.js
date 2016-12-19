// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3001;

var http = require('http').Server(app);
var io = require('socket.io')(http);

var passport = require('passport');
var flash    = require('connect-flash'); // store and retrieve messages in session store

var morgan       = require('morgan'); // logger
var cookieParser = require('cookie-parser'); // parse cookies
var bodyParser   = require('body-parser'); // parse posts
var session      = require('express-session'); // session middleware

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'zomaareenstukjetekstDatjenietzomaarbedenkt',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./api/routes.js')(app, passport, io); // load our routes and pass in our api and fully configured passport
app.use(express.static('public'));

// launch ======================================================================
// api.listen(port);
http.listen(port);
console.log('The magic happens on port ' + port);