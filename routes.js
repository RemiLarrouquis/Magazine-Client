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
        request({
            uri: "http://magazine.dev/api/publication/liste",
            method: "GET"
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            if (!responseBody.error) {
                var publications = responseBody.result;
            }
            var model = {publication: publications};
            res.render(viewname(req), model);
        });

    });

    app.post('/authenticate', function (req, res) {
        var formuser = req.body;
        request({
            uri: "http://magazine.dev/api/login",
            method: "POST",
            form: formuser
        }, function (error, response, body) {
            console.log("body", body);
            var responsebody = JSON.parse(body);
            if (responsebody.result !== "Erreur d'identifiant ou mot de passe.") {
                var cookie = req.cookies.token;
                if (cookie === undefined) {
                    res.cookie('token', responsebody.result, {maxAge: 9000000, httpOnly: true});
                }
                else {
                    res.clearCookie("token");
                    res.cookie('token', responsebody.result, {maxAge: 9000000, httpOnly: true});
                }
                res.redirect("/publications");
            }
        });
    });

    app.get('/logout', function (req, res) {
        res.clearCookie("token");
        res.redirect('/');
    });

    app.use(express.static(path.join(__dirname, 'public')));
};

function viewname(req) {
    return req.originalUrl.replace(/^\//, '');
}