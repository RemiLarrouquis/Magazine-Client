module.exports = function (app, db) {
    var request = require("request");
    var notifier = require('node-notifier');
    var path = require('path');

    app.post("/createuser", function (req, res) {
        var formuser = req.body;
        request({
            uri: "http://magazine.dev/api/user/exist",
            method: "POST",
            form: {
                email: formuser.email
            }
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            if (!responseBody.exist) {
                formuser.password = formuser.password1;
                formuser.is_client = true;
                request({
                    uri: "http://magazine.dev/api/register",
                    method: "POST",
                    form: formuser
                }, function (error, response, body) {
                    console.log("body",body)
                    var responseBody = JSON.parse(body);
                    req.session.messages = responseBody;
                    res.redirect("/login");

                });
            } else {
                req.session.messages = responseBody;
                res.redirect("/register");
            }
        });
    });


    app.get("/account", function (req, res) {
        request({
            uri: "http://magazine.dev/api/user/details",
            method: "GET",
            qs: {
                token: req.cookies.token
            }
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            if (!responseBody.error) {
                var model = {users: responseBody.result, cookie: req.cookies.token};
                res.render("user/account", model);
            }
        });
    });


    app.post("/edituser/:id", function (req, res) {
        var formuser = req.body;
        formuser.token = req.cookies.token;
        formuser.id = req.params.id;
        request({
            uri: "http://magazine.dev/api/user/edit",
            method: "POST",
            form: formuser
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            req.session.messages = responseBody;
            if(!responseBody.error){
                res.clearCookie("token");
                res.cookie('token', responseBody.result, {maxAge: 9000000, httpOnly: true});
                res.redirect("/account");
            }
        });
    });

    /**
     * Utilisé lors de la validation AJAX du formulaire.
     */
    app.get("/existuser", function (req, res) {
        var email = req.param('email');
        request({
            uri: "http://magazine.dev/api/user/exist",
            method: "POST",
            form: {
                email: email
            }
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            res.setHeader('Content-Type', 'application/json');
            if (responseBody.exist) {
                res.send(false);
            } else {
                res.send(true);
            }
        });
    });

};