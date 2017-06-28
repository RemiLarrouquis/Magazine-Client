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
            var responseBody = JSON.parse(body);
            // console.log(responseBody)
            if (!responseBody.error) {
                responseBody.abonnements.forEach(function (abonnement) {
                    var myDate = abonnement.date_fin.toString();
                    myDate = myDate.split("-");
                    var newDate = myDate[1] + "," + myDate[2] + "," + myDate[0];
                    if (new Date(newDate).getTime() < Date.now() + 5270000000) {
                        abonnement.warn = true;
                    }
                });
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
            var responseBody = JSON.parse(body);
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
            var responseBody = JSON.parse(body);
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
        request({
            uri: "http://magazine.dev/api/abonnement/relance",
            method: "POST",
            form: {
                id: req.params.id,
                token: req.cookies.token
            }
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            if (responseBody.error) {
                res.render("login");
            } else {
                if (responseBody.result == "Success") {
                    notifier.notify({
                        title: 'Merci pour votre confiance !',
                        message: "Une année d'abonnement supplémentaire a été ajouté à votre magazine",
                        sound: true, // Only Notification Center or Windows Toasters
                        wait: true // Wait with callback, until user action is taken against notification
                    }, function (err, response) {
                        // Response is response from notification
                    });
                    res.redirect("/subscription")
                }
            }
        })
    })
    app.get("/subscription/old", function (req, res) {
        request({
            uri: "http://magazine.dev/api/abonnement/liste",
            method: "GET",
            qs: {
                token: req.cookies.token,
                filterEnCours: false
            }
        }, function (error, response, body) {
            var responseOldBody = JSON.parse(body);
            if (!responseOldBody.error) {
                request({
                    uri: "http://magazine.dev/api/abonnement/liste",
                    method: "GET",
                    qs: {
                        token: req.cookies.token,
                        filterEnCours: true,
                        filterEtat: 5
                    }
                }, function (error, response, body) {
                    var responseStopBody = JSON.parse(body);
                    if (!responseStopBody.error) {
                        request({
                            uri: "http://magazine.dev/api/abonnement/liste",
                            method: "GET",
                            qs: {
                                token: req.cookies.token,
                                filterEnCours: true,
                                filterEtat: 6
                            }
                        }, function (error, response, body) {
                            var responsePauseBody = JSON.parse(body);
                            if (!responsePauseBody.error) {
                                var model = {
                                    old: responseOldBody.abonnements,
                                    stop: responseStopBody.abonnements,
                                    pause: responsePauseBody.abonnements,
                                    cookie: req.cookies.token
                                };
                                res.render("subscription/history", model);
                            } else {
                                if (responsePauseBody.result == "Erreur d'authentification") {
                                    res.render("/login");
                                }
                            }
                        });
                    } else {
                        if (responseStopBody.result == "Erreur d'authentification") {
                            res.render("/login");
                        }
                    }
                });
            } else {
                if (responseOldBody.result == "Erreur d'authentification") {
                    res.render("/login");
                }
            }

        });
    })
};
function viewname(req) {
    return req.originalUrl.replace(/^\//, '');
}