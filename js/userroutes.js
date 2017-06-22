module.exports = function (app, db) {
    app.get("/user/:id", function (req, res) {
        var users = undefined;
        var challenge = [];
        db.each("SELECT user.id,user.login,user.firstname,user.lastname,user.password,count(interact.id) as nblike FROM user LEFT JOIN interact ON user.id = interact.id_user WHERE user.id = ? GROUP BY user.id,user.login,user.firstname,user.lastname,user.password", [req.params.id],
            function (err, row) {
                users = row;
            }, function () {
                if (users === undefined) {
                    res.status(404).end();
                } else {
                    db.each("SELECT * FROM challenge WHERE id_user = ?", [req.params.id],
                        function (err, row) {
                            challenge.push(row);
                        }, function () {
                            var model = {user: req.user, users: users, challenges: challenge};
                            res.render('user/detail', model);
                        }
                    );
                }
            })
    });
    app.get("/listuser", function (req, res) {
        var users = [];
        db.each("SELECT * FROM user",
            function (err, row) {
                users.push(row);
                console.log('--',row);
            }, function () {
                var model = {user: req.user, users: users};
                res.render('user/listuser', model);
            });
    });



    app.get("/newusers/profil", function (req, res) {
        console.log("req profil",req.body);
        var model = {user: req.user};
        res.render('newusers', model);
    });

    app.get("/newusers/account", function (req, res) {
        console.log("req account",res);

        var model = {user: req.user};
        res.render('newusers', model);
    });
};