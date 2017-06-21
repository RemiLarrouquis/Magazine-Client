module.exports = function (app, db) {
    app.post("/listedefis", isLoggedIn, function (req, res) {
        var challenge = req.body;
        if (challenge.entitled === undefined) {
            res.status(400).end();
            return;
        }
        var stmt = db.prepare("INSERT INTO challenge(entitled,id_user,hidden) VALUES (?,?,?)");
        stmt.run(challenge.entitled, req.user.identifiant.id, false);
        stmt.finalize();
        res.redirect("/listedefis");
        //res.redirect("/challenge/" + req.challenge.id);
    });
    app.post("/responsechallenge/:id", isLoggedIn, function (req, res) {
        var challenge = req.body;
        //var multer = require('multer');
        //var storage = multer.diskStorage({
        //    destination: function (req, file, callback) {
        //        callback(null, '../img/upload');
        //    },
        //    filename: function (req, file, callback) {
        //        callback(null, file.fieldname + "-" + Date.now());
        //    }
        //});
        //var upload = multer({storage: storage}).single('picture');
        //console.log('iiiiiii', challenge);
        if (challenge.content === undefined) {
            res.status(400).end();
            return;
        }
        if (challenge.photo === "") {
            var stmt = db.prepare("INSERT INTO comment (id_user,commentary,id_challenge) VALUES (?,?,?)");
            stmt.run(req.user.identifiant.id, challenge.content, req.params.id);
            stmt.finalize();
            res.redirect("/challenge/" + req.params.id);
        } else {
            //console.log('hhhhhhh',req);
            //upload(req, res, function (err) {
            //    if (err) {
            //        return res.end("Erreur au chargement de la photo")
            //    }
            //});
            var stmt = db.prepare("INSERT INTO comment (id_user,commentary,photo,validchallenge,id_challenge) VALUES (?,?,?,?,?)");
            stmt.run(req.user.identifiant.id, challenge.content, challenge.photo, 1, req.params.id);
            stmt.finalize();
            res.redirect("/challengeaccepted/" + req.params.id);
        }
    });
    app.get("/like/:id", isLoggedIn, function (req, res) {
        var stmt = db.prepare("INSERT INTO interact (id_user,id_challenge,liked) VALUES (?,?,?)");
        stmt.run(req.user.identifiant.id, req.params.id, true);
        stmt.finalize();
        res.redirect("/challenge/" + req.params.id);
    });
    app.get("/likethischall/:id", isLoggedIn, function (req, res) {
        var stmt = db.prepare("INSERT INTO interact(id_user,id_challenge,liked) VALUES(?,?,?)");
        stmt.run(req.user.identifiant.id, req.params.id, true);
        stmt.finalize();
        res.redirect("/listedefis");
    });
    app.get("/deletechallenge/:id", isLoggedIn, function (req, res) {
        var stmt = db.prepare("DELETE FROM challenge WHERE id = ?");
        stmt.run(req.params.id);
        stmt.finalize();
        res.redirect("/mesdefis");
    });
    app.get("/hiddechallenge/:id", isLoggedIn, function (req, res) {
        var stmt = db.prepare("UPDATE challenge SET hidden = ? WHERE id = ?");
        stmt.run(1, req.params.id);
        stmt.finalize();
        res.redirect("/mesdefis");
    });
    app.get("/validedefi/:id/:idchall", isLoggedIn, function (req, res) {
        var stmt = db.prepare("UPDATE challenge SET success = ? WHERE id = ?");
        stmt.run(1, req.params.id);
        stmt.finalize();
        var stmt = db.prepare("UPDATE comment SET approuve = ? WHERE id = ?");
        stmt.run(1, req.params.idchall);
        stmt.finalize();
        res.redirect("/challengeaccepted/"+req.params.id);
    });
    app.get("/seechallenge/:id", isLoggedIn, function (req, res) {
        var stmt = db.prepare("UPDATE challenge SET hidden = ? WHERE id = ?");
        stmt.run(0, req.params.id);
        stmt.finalize();
        res.redirect("/mesdefis");
    });
    app.get("/suivrechall/:id", isLoggedIn, function (req, res) {
        var stmt = db.prepare("INSERT INTO suivi(id_user,id_challenge) VALUES(?,?)");
        stmt.run(req.user.identifiant.id, req.params.id);
        stmt.finalize();
        res.redirect("/listsuivi");
    });
    app.get("/deletesuivi/:id", isLoggedIn, function (req, res) {
        var stmt = db.prepare("DELETE FROM suivi WHERE id_user = ? AND id_challenge = ?");
        stmt.run(req.user.identifiant.id, req.params.id);
        stmt.finalize();
        res.redirect("/listsuivi");
    });
};
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).end();
}