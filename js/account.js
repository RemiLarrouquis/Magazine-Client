module.exports = function (app, db) {
    app.get("/moncompte", isLoggedIn, function (req, res) {
        var user = undefined;
        db.each("SELECT * FROM user WHERE id = ?", [req.user.identifiant.id],
            function (err, row) {
                user = row;
                console.log('hihi',row);
            }, function () {
                var model = {user: req.user, users: user};
                res.render("user/account", model);
            });
    })
};
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).end();
}