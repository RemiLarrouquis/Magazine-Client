/**
 * Created by Ludovic on 24/03/2016.
 */
var express = require('express');
var path = require('path');

module.exports = function (app, passport) {
    console.log('dirname', __dirname);
    var public = __dirname + '/public/';
    var css = public + '/stylesheets/';
    var js = public + '/js/';
    var img = public + '/img/';


    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    app.get(['/', '/login', '/newusers'], function (req, res) {
        if (req.originalUrl === '/') {
            req.originalUrl = 'index';
        }
        var model = {user: req.user};
        res.render(viewname(req), model);
    });

    app.get(['/welcome'], isLoggedIn, function (req, res) {
        var model = {user: req.user};
        res.render(viewname(req), model);
    });

    app.post('/authenticate',
        passport.authenticate('local-login', {
            successRedirect: '/welcome',
            failureRedirect: '/login',
            failureFlash: true
        })
    );

    //****************************************************************
    //****************************************************************
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/welcome',
            failureRedirect: '/login'
        }));

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.use(express.static(path.join(__dirname, 'public')));


    // app.get('*.css', function (req, res) {
    //     res.sendFile(css + req.originalUrl);
    // });
    //
    // app.get('*.png', function (req, res) {
    //     res.sendFile(js + "/rs-plugin/assets/" + req.originalUrl);
    // });
    //
    // app.get('*.js', function (req, res) {
    //     res.sendFile(js + req.originalUrl);
    // });
    //
    // app.get('*.png', function (req, res) {
    //     res.sendFile(img + req.originalUrl);
    // });
    //
    // app.get('*.jpg', function (req, res) {
    //     res.sendFile(img + req.originalUrl);
    // });

};

function viewname(req) {
    return req.originalUrl.replace(/^\//, '');
};

function isLoggedIn(req, res, next) {
    // si utilisateur authentifié, continuer
    if (req.isAuthenticated()) {
        return next();
    }
    // sinon afficher formulaire de login
    res.redirect('/login');
}