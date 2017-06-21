/**
 * Created by Ludovic on 25/03/2016.
 */
module.exports = function (app, db) {

    app.get(['/listepersonnes'], function (req, res) {
        var result = [];
        db.each("SELECT * FROM user ORDER BY nom,prenom",
            function (err, row) {
                result.push(row);
            },
            function () {
                var model = {user: req.user, personnes: result};
                res.render('personne/liste', model);
            }
        );
    });

    app.get("/detailpersonne/:id", function (req, res) {
        var personne = undefined;
        db.each("SELECT * FROM user WHERE id_user = ?", [req.params.id],
            function (err, row) {
                personne = row;
            },
            function () {
                if (personne === undefined) {
                    res.status(404).end();
                } else {
                    var model = {user: req.user, personne: personne, ok: false};
                    if (req.isAuthenticated()) {
                        res.render('personne/edit', model);
                    } else {
                        res.render('personne/detail', model);
                    }
                }
            }
        );
    });

    app.post("/updatepersonne", isLoggedIn, function (req, res) {
        var personne = req.body;
        if (personne.nom === undefined || personne.prenom === undefined) {
            res.status(400).end();
            return;
        }
        var stmt = db.prepare("UPDATE personne SET nom=?,prenom=? WHERE id=?");
        stmt.run(personne.nom, personne.prenom, personne.id);
        stmt.finalize();
        var model = {user: req.user, personne: personne, ok: true};
        res.render('personne/edit', model);
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