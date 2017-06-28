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
                    var responsebody = JSON.parse(body);
                    req.session.messages = responsebody;
                    res.redirect("/login");

                });
            } else {
                req.session.messages = responsebody;
                res.redirect("/register");
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