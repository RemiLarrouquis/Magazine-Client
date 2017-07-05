var request = require("request");
var notifier = require('node-notifier');
var path = require('path');
var common = require(__dirname + '/commons');

module.exports = function (app) {
    app.get("/paiements", function (req, res) {
        request({
            uri: common.url("/abonnement/liste"),
            method: "GET",
            qs: {
                token: req.cookies.token,
                filterEtat: 4,
                filterEnCours: true,
                orderByDateFin: true
            }
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            responseBody.abonnements.forEach(function (abonnement) {
                abonnement.paiement.forEach(function (paie) {
                    paie.aPayer = paie.idEtatPaie == 8;
                })
            });
            var messages = req.session.messages;
            req.session.messages = undefined;
            var model = {publications: responseBody.abonnements, cookie: req.cookies.token, messages: messages};
            res.render("paiement/listepaiement", model);
        });

    });


    app.get("/paiement/esipay/:id", function (req, res) {
        // request({
        //     uri: common.url("/publication/liste"),
        //     method: "GET",
        //     qs: {token: req.cookies.token}
        // }, function (error, response, body) {
        //     console.log("body", body);
        //     var responseBody = JSON.parse(body);
        //     if (!responseBody.error) {
        //         var publications = responseBody.result;
        //     }
        //     var messages = req.session.messages;
        //     req.session.messages = undefined;
        //     var model = {publication: publications, cookie: req.cookies.token, messages: messages};
        var model = {cookie: req.cookies.token};
        res.render("paiement/esipay", model);
        // });
    });

    app.post("/paiement/esipaySave/:id", function (req, res) {
        var formuser = req.body;
        formuser.token = req.cookies.token;
        formuser.id = req.params.id;
        request({
            uri: common.url("/paiement/payer"),
            method: "POST",
            form: formuser
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            console.log("responseBody", responseBody);
            req.session.messages = responseBody;
            res.redirect("/paiements#" + formuser.id);
        });
    });
};