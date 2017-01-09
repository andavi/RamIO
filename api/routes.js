// app/routes.js
var game_server = require('../game-server');
var path = require('path');
var gameStats = require('./controllers/game');

// var pg = require('pg');
// var client = new pg.Client();



module.exports = function(app, passport, io, Game) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        gameStats.getHighScore(req, res, gameStats.getLastFive, Game);
    });
    // app.get('/profile', function(req, res) {
    //     res.render('profile.ejs', {
    //         user: {id: 24, username: 'griffin', highScore: 55, }
    //     });
    // });

    // =====================================
    // GAME ==============================
    // =====================================
    app.get('/game', isLoggedIn, function(req, res) {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
        // console.log('\n' + req.user + '\n');
        game_server(io, req.user);
    });
    // api.get('/gameLogger', function(req, res) {
    //     res.sendFile(path.join(__dirname, '../public', 'index.html'));
    //     gameLogger(io, {id: 4, username: 'chris', password: 'mypassword'});
    // });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}