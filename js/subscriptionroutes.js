var request = require("request");
var notifier = require('node-notifier');
var path = require('path');
var common = require(__dirname + '/commons');

module.exports = function (app) {
    app.get("/subscription", function (req, res) {
        request({
            uri: common.url("/abonnement/liste"),
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
                var messages = req.session.messages;
                req.session.messages = undefined;
                var model = {abonnements: responseBody.abonnements, cookie: req.cookies.token, messages :messages};
                res.render("subscription/liste", model);
            } else {
                req.session.messages = responseBody;
                res.redirect(common.redirect(req.cookies.token, "/publications"));
            }
        });
    });

    app.get("/subscription/detail/:id", function (req, res) {
        request({
            uri: common.url("/abonnement/detail"),
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
                req.session.messages = responseBody;
                res.redirect(common.redirect(req.cookies.token, "/subscription"));
            }
        })
    });

    app.get("/subscription/new/:id", function (req, res) {
        request({
            uri: common.url("/abonnement/new"),
            method: "POST",
            form: {
                id: req.params.id,
                token: req.cookies.token
            }
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            if (responseBody.error) {
                req.session.messages = responseBody;
                res.redirect("login");
            } else {
                console.log("responseBody",responseBody);
                var model = {cookie: req.cookies.token, messages: responseBody};
                res.render("subscription/success", model);
            }
        })
    });

    app.get("/subscription/stop/:id", function (req, res) {
        request({
            uri: common.url("/abonnement/new"),
            method: "POST",
            form: {
                id: req.params.id,
                token: req.cookies.token
            }
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            req.session.messages = responseBody;
            if (responseBody.error) {
                res.redirect("login");
            } else {
                res.redirect("/subscription")
            }
        })
    });

    app.get("/subscription/renew/:id", function (req, res) {
        request({
            uri: common.url("/abonnement/relance"),
            method: "POST",
            form: {
                id: req.params.id,
                token: req.cookies.token
            }
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            req.session.messages = responseBody;
            if (responseBody.error) {
                res.redirect("login");
            } else {
                res.redirect("/subscription")
            }
        })
    });

    app.get("/subscription/old", function (req, res) {
        request({
            uri: common.url("/abonnement/liste"),
            method: "GET",
            qs: {
                token: req.cookies.token,
                filterEnCours: false
            }
        }, function (error, response, body) {
            var responseOldBody = JSON.parse(body);
            if (!responseOldBody.error) {
                request({
                    uri: common.url("/abonnement/liste"),
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
                            uri: common.url("/abonnement/liste"),
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
                                req.session.messages = responsePauseBody;
                                res.redirect(common.redirect(req.cookies.token, "/subscription"));
                            }
                        });
                    } else {
                        req.session.messages = responseStopBody;
                        res.redirect(common.redirect(req.cookies.token, "/subscription"));
                    }
                });
            } else {
                req.session.messages = responseOldBody;
                res.redirect(common.redirect(req.cookies.token, "/subscription"));
            }

        });
    })
};
