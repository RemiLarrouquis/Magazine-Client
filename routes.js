/**
 * Created by Ludovic on 24/03/2016.
 */
var express = require('express');
var path = require('path');
var request = require("request");
var http = require('http');

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



    app.get(['/', '/login', '/register'], function (req, res) {
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

    app.post('/authenticate', function (req, res) {
        var formuser = req.body;
        request({
            uri: "http://magazine.dev/api/login",
            method: "POST",
            form: formuser
        }, function (error, response, body) {
            console.log("body",body);
            var responsebody = JSON.parse(body);
            if (responsebody.result !== undefined) {

            }
            res.redirect("/login");

        });
    });

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