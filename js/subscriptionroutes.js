var request = require("request");
var notifier = require('node-notifier');
var path = require('path');

module.exports = function (app) {
    app.get("/subscription", function (req, res) {
        request({
            uri: "http://magazine.dev/api/abonnement/liste",
            method: "POST",
            form: {
                token: req.cookies.token
            }
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            console.log("responseBody",responseBody);
            if (!responseBody.error) {
                var model = {abonnements: responseBody.abonnements, cookie: req.cookies.token};
                res.render("subscription/liste", model);
            } else {
                if (responseBody.result == "Erreur d'authentification") {
                    res.render("/login");
                }
            }

        });
    });

};
function viewname(req) {
    return req.originalUrl.replace(/^\//, '');
}