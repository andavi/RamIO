// functions to insert and delete into gameHistory table
var configDB = require('../../config/database.js');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(configDB.url, {
    timestamps: false
});
var User = sequelize.import('../models/user');
var Game = sequelize.import('../models/game');

// var sequelize = new Sequelize('connectionUri', {
//     define: {
//         timestamps: false // true by default
//     }
// });

Game.sync();

module.exports = {
    insert: function (game) {
        Game.build(game)
            .save()
            .then(function(game) {
                console.log('inserted', game);
            })
            .catch(function(e) {
                console.log(e);
            })
    },
    getLastFive: function(req, res) {
        Game.findAll({
            attributes: ['start', 'score'],
            where: {
                id: req.user.id
            },
            limit: 5,
            order: 'start DESC'
        })
            .then(function(scores) {

                req.user.history = scores.map(function(s) {
                    return s.dataValues;
                });
                res.render('profile.ejs', {
                    user: req.user
                });
            })
            .catch(function(e) {
                console.log(e);
            })
    },
    getHighScore: function(req, res, next) {
        Game.findOne({

            attributes: ['score', 'start'],
            where: {
                id: req.user.id
            },
            order: 'score DESC'
        })
            .then(function(max) {
                // console.log( '\n' + max.score + '\n');
                req.user.highScore = {score: max.score, start: max.start};
                // res.render('profile.ejs', {
                //     user: req.user
                // });
                next(req, res);
        })
            .catch(function(e) {
                console.log(e);
            })
    }
};


function insertTestGameLogs () {

    var gameLog = require('./game');

    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    User.findAll().then(function(users) {

        users = users.map(function(u) {
            return u.dataValues;
        });

        console.log(users);

        for (i=0; i<users.length; i++) {
            var numScores = Math.ceil(Math.random() * 5);
            var id = users[i].id;
            for (j=0; j<numScores; j++) {
                var score = Math.floor(Math.random() * 1000);
                var start = randomDate(new Date(2016, 7, 13), new Date());
                gameLog.insert({id: id, start: start, score: score});
            }
        }
    });
}

games = require('./game.js');
// insertTestGameLogs();
// games.getHighScore();