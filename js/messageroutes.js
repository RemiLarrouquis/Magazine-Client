/**
 * Created by Ludovic on 25/03/2016.
 */
module.exports = function (app, db) {
    app.get(['/listmessage'], function (req, res) {
        var result = [];
        var count = [];
        var paginate = req.query.page * 10;
        var pagination = {'actuel': req.query.page, 'next': parseInt(req.query.page) + 1, 'prev': req.query.page - 1};
        db.each("SELECT * FROM message WHERE fk_message is null ORDER BY date_message desc LIMIT ?,?", [paginate, paginate + 10],
            function (err, row) {
                var tmp = row;
                result.push(tmp);
                db.each("SELECT fk_message,count(id_message) as nb FROM message WHERE fk_message = ?", [row.id_message],
                    function (err, row) {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].id_message == row.fk_message) {
                                result[i].count = row.nb;
                            }
                        }
                        db.each("SELECT * FROM message WHERE fk_message = ? ORDER BY date_message desc LIMIT 0,1", [row.fk_message],
                            function (err, row) {
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i].id_message == row.fk_message) {
                                        result[i].lastpost = row.content_message;
                                        result[i].lastauteur = row.auteur_message;
                                    }
                                }
                            })
                    })
            },
            function () {
                if (result.length < 10) {
                    pagination.dernier = false;
                } else {
                    pagination.dernier = true;
                }
                if (pagination.actuel > 0) {
                    pagination.retour = true;
                } else {
                    pagination.retour = false;
                }
                var model = {user: req.user, messages: result, paginate: pagination};
                res.render('message/liste', model);
            }
        );
    });
    app.get(['/updatepost/:id'], function (req, res) {
        db.each("SELECT * FROM message WHERE id_message = ?", [req.params.id],
            function (err, row) {
                message = row;
            },
            function () {
                var model = {user: req.user, message: message};
                res.render('message/updatemessage', model);
            }
        );
    });
    app.get("/message/:id", function (req, res) {
        var message = undefined;
        var messages = [];
        var reponse = [];
        db.each("SELECT * FROM message WHERE id_message = ?", [req.params.id],
            function (err, row) {
                message = row;
            },
            function () {
                if (message === undefined) {
                    res.status(404).end();
                } else {
                    db.each("SELECT * FROM message WHERE fk_message = ?", [req.params.id],
                        function (err, row) {
                            messages.push(row);
                        },
                        function () {
                            var model = {user: req.user, messages: messages, message: message};
                            res.render('message/message', model);
                        }
                    );
                }
            }
        );
    });
    app.get("/mesposts", isLoggedIn, function (req, res) {
        var messages=[];
        db.each("SELECT * FROM message WHERE auteur_message = ? AND fk_message IS NULL ORDER BY date_message desc", [req.user.identifiant],
            function (err, row) {
                messages.push(row);
            },
            function () {
                var model = {user: req.user, messages: messages};
                res.render('message/mylistpostes',model);
            })
    });
    app.get("/mesreponses", isLoggedIn, function (req, res) {
        var messages=[];
        db.each("SELECT * FROM message WHERE auteur_message = ? AND fk_message IS NOT NULL ORDER BY date_message desc", [req.user.identifiant],
            function (err, row) {
                messages.push(row);
            },
            function () {
                var model = {user: req.user, messages: messages};
                res.render('message/mylistmessages',model);
            })
    });
};

function isLoggedIn(req, res, next) {
    // si utilisateur authentifié, continuer
    if (req.isAuthenticated()) {
        return next();
    }
    // sinon afficher formulaire de login
    res.redirect('/login');
}