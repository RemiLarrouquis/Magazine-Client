/**
 * Created by Ludovic on 24/03/2016.
 */
var express = require('express');
var path = require('path');
var request = require("request");
var http = require('http');

module.exports = function (app, passport) {
    var public = __dirname + '/public/';
    var css = public + '/stylesheets/';
    var js = public + '/js/';
    var img = public + '/img/';

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
            var responsebody = JSON.parse(body);
            if (responsebody.result !== "Erreur d'identifiant ou mot de passe.") {
                res.redirect("/publications");
            }
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.use(express.static(path.join(__dirname, 'public')));
};

function viewname(req) {
    return req.originalUrl.replace(/^\//, '');
}

function isLoggedIn(req, res, next) {
    // si utilisateur authentifié, continuer
    if (req.isAuthenticated()) {
        return next();
    }
    // sinon afficher formulaire de login
    res.redirect('/login');
}