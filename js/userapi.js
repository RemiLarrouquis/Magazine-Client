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
                    console.log("body", body);
                    var responsebody = JSON.parse(body);
                    if (responsebody.result) {
                        notifier.notify({
                            title: 'Bienvenue chez nous !',
                            message: 'Un email de confirmation a été envoyé à votre adresse email pour valider votre compte !',
                            sound: true, // Only Notification Center or Windows Toasters
                            wait: true // Wait with callback, until user action is taken against notification
                        }, function (err, response) {
                            // Response is response from notification
                        });
                    }
                    res.redirect("/login");

                });
            } else {
                notifier.notify({
                    title: 'Oups ...',
                    message: 'Cet adresse email existe déjà',
                    sound: true, // Only Notification Center or Windows Toasters
                    wait: true // Wait with callback, until user action is taken against notification
                }, function (err, response) {
                    // Response is response from notification
                });
            }
        });
    });

};