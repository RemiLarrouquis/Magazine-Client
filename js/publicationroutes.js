var request = require("request");
var notifier = require('node-notifier');
var path = require('path');
var common = require(__dirname + '/commons');

module.exports = function (app) {
    app.get("/publications", function (req, res) {
        request({
            uri: common.url("/publication/liste"),
            method: "GET",
            qs: {token: req.cookies.token}
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);

            if (!responseBody.error) {
                var publications = responseBody.result;
            }
            var messages = req.session.messages;
            req.session.messages = undefined;
            var model = {publication: publications, cookie: req.cookies.token, messages: messages};
            res.render("publication/publications", model);
        });
    });

    app.get("/publication/:id", function (req, res) {

        request({
            uri: common.url("/publication/detail"),
            method: "GET",
            qs: {
                id: req.params.id,
                token: req.cookies.token
            }
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            if (!responseBody.error) {
                responseBody.result.forEach(function (pub) {
                    pub.inprogress = true;
                });
                var publications = responseBody.result;
            }
            var messages = req.session.messages;
            req.session.messages = undefined;
            var model = {publication: publications, cookie: req.cookies.token, messages: messages};
            res.render("publication/information", model);
        });
    });
};