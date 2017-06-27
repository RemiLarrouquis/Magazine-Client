var request = require("request");
var notifier = require('node-notifier');
var path = require('path');

module.exports = function (app) {
    app.get("/subscription", function (req, res) {
        request({
            uri: "http://magazine.dev/api/abonnement/liste",
            method: "GET",
            qs: {
                token: req.cookies.token,
                filterEtat: 4,
                filterEnCours: true
            }
        }, function (error, response, body) {
            console.log("body", body);
            var responseBody = JSON.parse(body);
            console.log("responseBody", responseBody);
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

    app.get("/subscription/detail/:id", function (req, res) {
        request({
            uri: "http://magazine.dev/api/abonnement/detail",
            method: "GET",
            qs: {
                id: req.params.id,
                token: req.cookies.token
            }
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            if (!responseBody.error) {
                var model = {publication: responseBody.result, abonnement: true, cookie: req.cookies.token};
                console.log("model", model);
                res.render("publication/information", model);
            } else {
                if (responseBody.result == "Erreur d'authentification") {
                    res.render("/login");
                }
            }
        })
    });

    app.get("/subscription/detail/:id/", function (req, res) {
        request({
            uri: "http://magazine.dev/api/abonnement/detail?id=" + [req.params.id] + "&token=" + req.cookies.token,
            method: "GET"
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            if (!responseBody.error) {
                var model = {publication: responseBody.result, abonnement: true, cookie: req.cookies.token};
                console.log("model", model);
                res.render("publication/information", model);
            } else {
                if (responseBody.result == "Erreur d'authentification") {
                    res.render("/login");
                }
            }
        })
    });

    app.get("/subscription/new/:id", function (req, res) {
        request({
            uri: "http://magazine.dev/api/abonnement/new",
            method: "POST",
            form: {
                id: req.params.id,
                token: req.cookies.token
            }
        }, function (error, response, body) {
            // console.log("body",body);
            var responseBody = JSON.parse(body);
            console.log("responseBody", responseBody);
            if (responseBody.error) {
                res.render("login");
            } else {
                if (responseBody.result == "Success") {
                    var model = {cookie: req.cookies.token};
                    res.render("subscription/success", model);
                }
            }
        })
    });

    app.get("/subscription/stop/:id", function (req, res) {
        request({
            uri: "http://magazine.dev/api/abonnement/new",
            method: "POST",
            form: {
                id: req.params.id,
                token: req.cookies.token
            }
        }, function (error, response, body) {
            // console.log("body",body);
            var responseBody = JSON.parse(body);
            console.log("responseBody", responseBody);
            if (responseBody.error) {
                res.render("login");
            } else {
                if (responseBody.result == "Success") {
                    res.redirect("/subscription")
                }
            }
        })
    });

    app.get("/subscription/renew/:id", function (req, res) {
        console.log("req.params.id",req.params.id);
        request({
            uri: "http://magazine.dev/api/abonnement/relance",
            method: "POST",
            form: {
                id: req.params.id,
                token: req.cookies.token
            }
        }, function (error, response, body) {
            console.log("body",body)
            var responseBody = JSON.parse(body);
            if (responseBody.error) {
                res.render("login");
            } else {
                // if (responseBody.result == "Success") {
                //     notifier.notify({
                //         title: 'Merci pour votre confiance !',
                //         message: "Une année d'abonnement supplémentaire a été ajouté à votre magazine",
                //         sound: true, // Only Notification Center or Windows Toasters
                //         wait: true // Wait with callback, until user action is taken against notification
                //     }, function (err, response) {
                //         // Response is response from notification
                //     });
                //     res.redirect("/subscription")
                // }
            }
        })
    })
};
function viewname(req) {
    return req.originalUrl.replace(/^\//, '');
}