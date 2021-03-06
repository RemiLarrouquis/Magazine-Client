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
                    var myDate = paie.date_fin.toString();
                    myDate = myDate.split("-");
                    var oldDate = myDate[0] - 1;
                    paie.date_debut = oldDate + "-" + myDate[1] + "-" + myDate[2];
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
        request({
            uri: common.url("/paiement/detail"),
            method: "GET",
            qs: {token: req.cookies.token,id:req.params.id}
        }, function (error, response, body) {
            console.log("body",body);
            var responseBody = JSON.parse(body);
            if (!responseBody.error) {
                var paiements = responseBody.result;
            }
            var model = {paiement: paiements, cookie: req.cookies.token};
            res.render("paiement/esipay", model);
        });
    });

    app.post("/paiement/esipaySave/:id", function (req, res) {
        var formuser = req.body;
        formuser.token = req.cookies.token;
        formuser.paie_id = req.params.id;
        request({
            uri: common.url("/paiement/payer"),
            method: "POST",
            form: formuser
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            req.session.messages = responseBody;
            res.redirect("/paiements#" + formuser.id);
        });
    });


    app.get("/paiement/detail/:id", function (req, res) {

        request({
            uri: common.url("/paiement/listByPub"),
            method: "GET",
            qs: {
                pub_id: req.params.id,
                token: req.cookies.token
            }
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            if (!responseBody.error) {
                responseBody.result.forEach(function (paie) {
                    var myDate = paie.date_fin.toString();
                    myDate = myDate.split("-");
                    var oldDate = myDate[0] - 1;
                    paie.date_debut = oldDate + "-" + myDate[1] + "-" + myDate[2];
                    paie.aPayer = paie.idEtatPaie == 8;
                });
                var paiements = responseBody.result;
            }
            var messages = req.session.messages;
            req.session.messages = undefined;
            var model = {paiements: paiements, cookie: req.cookies.token, messages: messages};
            res.render("paiement/detail", model);
        });
    });
};