module.exports = function (app, db) {
    var async = require("async");
    app.get(['/listedefis'], isLoggedIn, function (req, res) {
        var result = [];
        var users = [];
        if(req.query.trier === undefined){
            db.each("SELECT challenge.id,challenge.id_user,challenge.entitled,challenge.hidden,challenge.date,challenge.success,user.login,count(interact.id_user) as nblike FROM challenge LEFT JOIN user ON challenge.id_user = user.id LEFT JOIN interact ON interact.id_challenge = challenge.id GROUP BY challenge.id_user,challenge.entitled,challenge.hidden,challenge.date,user.login ORDER BY challenge.date DESC",
                function (err, challenge) {
                    result.push(challenge);
                }, function () {
                    var model = {user: req.user, challenges: result};
                    res.render('challenge/liste', model);
                });
        }
        if(req.query.trier === "date") {
            db.each("SELECT challenge.id,challenge.id_user,challenge.entitled,challenge.hidden,challenge.date,challenge.success,user.login,count(interact.id_user) as nblike FROM challenge LEFT JOIN user ON challenge.id_user = user.id LEFT JOIN interact ON interact.id_challenge = challenge.id GROUP BY challenge.id_user,challenge.entitled,challenge.hidden,challenge.date,user.login ORDER BY challenge.date DESC",
                function (err, challenge) {
                    result.push(challenge);

                }, function () {

                    var model = {user: req.user, challenges: result};
                    res.render('challenge/liste', model);
                });
        }
        if(req.query.trier === "popularite") {
            db.each("SELECT challenge.id,challenge.id_user,challenge.entitled,challenge.hidden,challenge.date,challenge.success,user.login,count(interact.id_user) as nblike FROM challenge LEFT JOIN user ON challenge.id_user = user.id LEFT JOIN interact ON interact.id_challenge = challenge.id GROUP BY challenge.id_user,challenge.entitled,challenge.hidden,challenge.date,user.login ORDER BY nblike DESC",
                function (err, challenge) {
                    result.push(challenge);

                }, function () {

                    var model = {user: req.user, challenges: result};
                    res.render('challenge/liste', model);
                });
        }
        });
    app.get("/challenge/:id", function (req, res) {
        var challenge = undefined;
        var response = [];
        var successchall = [];
        db.each("SELECT challenge.id,challenge.id_user,challenge.entitled,challenge.hidden,challenge.date,user.login,count(interact.id) as nblike FROM challenge LEFT JOIN user ON challenge.id_user = user.id LEFT JOIN interact ON challenge.id = interact.id_challenge WHERE challenge.id = ? GROUP BY challenge.id,challenge.id_user,challenge.entitled,challenge.hidden,challenge.date,user.login", [req.params.id],
            function (err, row) {
                challenge = row;
            }, function () {
                if (challenge === undefined) {
                    res.status(404).end();
                } else {
                    db.each("SELECT comment.id,comment.id_user,comment.id_challenge,comment.commentary,comment.validchallenge,comment.photo,comment.approuve,user.login,user.lastname,user.firstname FROM comment LEFT JOIN user ON comment.id_user = user.id WHERE id_challenge = ? AND comment.validchallenge IS NULL", [req.params.id],
                        function (err, row) {
                            response.push(row);
                        }, function () {
                            var model = {user: req.user, challenge: challenge, response: response};
                            res.render("challenge/detail", model);
                        }
                    )
                }
            })
    });
    app.get("/challengeaccepted/:id", function (req, res) {
        var challenge = undefined;
        var response = [];
        db.each("SELECT challenge.id,challenge.id_user,challenge.entitled,challenge.hidden,challenge.date,user.login,count(interact.id) as nblike FROM challenge LEFT JOIN user ON challenge.id_user = user.id LEFT JOIN interact ON challenge.id = interact.id_challenge WHERE challenge.id = ? GROUP BY challenge.id,challenge.id_user,challenge.entitled,challenge.hidden,challenge.date,user.login", [req.params.id],
            function (err, row) {
                challenge = row;
            }, function () {
                if (challenge === undefined) {
                    res.status(404).end();
                } else {
                    db.each("SELECT comment.id,comment.id_user,comment.id_challenge,comment.commentary,comment.validchallenge,comment.photo,comment.approuve,user.login,user.lastname,user.firstname FROM comment LEFT JOIN user ON comment.id_user = user.id WHERE id_challenge = ? AND validchallenge = 1", [req.params.id],
                        function (err, row) {
                            response.push(row);
                        }, function () {
                            var model = {user: req.user, challenge: challenge, response: response};
                            res.render("challenge/accepted", model);
                        }
                    )
                }
            })
    });
    app.get("/defireleve/:id",function(req,res){
        var result = [];
        db.each("SELECT comment.id,comment.id_challenge,comment.commentary,comment.photo,user.login FROM comment LEFT JOIN user ON user.id = comment.id_user WHERE comment.id_user = ?",[req.params.id],
            function (err, challenge) {
                result.push(challenge);
            }, function () {
                console.log(result);
                var model = {user: req.user, challenges: result};
                res.render('challenge/listdefireleve', model);
            });
    });

    app.get("/challengelike/:id", function (req, res) {
        var users = undefined;
        var challenges = [];
        db.each("SELECT * FROM user WHERE id = ?", [req.params.id],
            function (err, row) {
                users = row;
            }, function () {
                if (users === undefined) {
                    res.status(404).end();
                } else {
                    db.each("SELECT interact.id , interact.id_challenge,interact.id_user,challenge.entitled,challenge.date,user.login,user.firstname,user.lastname FROM interact LEFT JOIN challenge ON interact.id_challenge = challenge.id LEFT JOIN user ON interact.id_user = user.id WHERE interact.id_user = ?", [req.params.id],
                        function (err, interact) {
                            challenges.push(interact);
                        }, function () {
                            var model = {user: req.user, challenges: challenges, users: users};
                            res.render('challenge/listbylike', model);
                        }
                    )
                }
            });
    });
    app.get("/mesdefis", isLoggedIn, function (req, res) {
        var defis = [];
        db.each("SELECT challenge.id,challenge.id_user,challenge.entitled,challenge.hidden,challenge.date,count(interact.id_user) as nb FROM challenge LEFT JOIN interact ON challenge.id = interact.id_challenge WHERE challenge.id_user = ? GROUP BY challenge.id,challenge.id_user,challenge.entitled,challenge.hidden,challenge.date", [req.user.identifiant.id],
            function (err, row) {
                defis.push(row);
                console.log('hihi', row);
            },
            function () {
                var model = {user: req.user, defis: defis};
                res.render('challenge/mylistchallenge', model);
            })
    });
    app.get("/defilance/:id", isLoggedIn, function (req, res) {
        var defis = [];
        db.each("SELECT challenge.id,challenge.id_user,challenge.entitled,challenge.hidden,challenge.date,count(interact.id_user) as nb FROM challenge LEFT JOIN interact ON challenge.id = interact.id_challenge WHERE challenge.id_user = ? GROUP BY challenge.id,challenge.id_user,challenge.entitled,challenge.hidden,challenge.date", [req.params.id],
            function (err, row) {
                defis.push(row);
            },
            function () {
                var model = {user: req.user, defis: defis};
                res.render('challenge/lance', model);
            })
    });
    app.get("/listsuivi", isLoggedIn, function (req, res) {
        var defis = [];
        db.each("SELECT challenge.id,challenge.id_user,challenge.entitled,challenge.hidden,challenge.date,suivi.id_challenge,user.login,user.firstname,user.lastname,count(interact.id_user) as nb FROM challenge LEFT JOIN suivi ON challenge.id = suivi.id_challenge LEFT JOIN user ON challenge.id_user = user.id LEFT JOIN interact ON interact.id_challenge = challenge.id WHERE suivi.id_user = ? GROUP BY challenge.id,challenge.id_user,challenge.entitled,challenge.hidden,challenge.date,suivi.id_challenge,user.login,user.firstname,user.lastname", [req.user.identifiant.id],
            function (err, row) {
                defis.push(row);
            }, function () {
                var model = {user: req.user, defis: defis};
                res.render('challenge/listsuivi', model);
            }
        )
    });
};
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).end();
}