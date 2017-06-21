/**
 * Created by Ludovic on 24/03/2016.
 */
//https://scotch.io/tutorials/easy-node-authentication-setup-and-local
module.exports = function (app, db) {
    app.get('/scriptsql', function (req, res) {
        db.run("CREATE TABLE user(id INTEGER PRIMARY KEY," +
            "login VARCHAR(50) NOT NULL," +
            "firstname VARCHAR(50) NOT NULL," +
            "lastname VARCHAR(50) NOT NULL," +
            "password VARCHAR(50) NOT NULL);");
        db.run("CREATE TABLE challenge(id INTEGER PRIMARY KEY," +
            "id_user INTEGER NOT NULL," +
            "entitled TEXT NOT NULL," +
            "hidden BOOLEAN," +
            "success BOOLEAN," +
            "date DATE DEFAULT (datetime('now','localtime'))," +
            "FOREIGN KEY(id_user) REFERENCES user(id));");
        db.run("CREATE TABLE comment(id INTEGER PRIMARY KEY," +
            "id_user INTEGER NOT NULL," +
            "id_challenge INTEGER NOT NULL," +
            "commentary TEXT," +
            "validchallenge BOOLEAN," +
            "photo VARCHAR(255)," +
            "approuve BOOLEAN," +
            "FOREIGN KEY(id_user) REFERENCES user(id)," +
            "FOREIGN KEY (id_challenge) REFERENCES challenge(id));");
        db.run("CREATE TABLE interact(id INTEGER PRIMARY KEY," +
            "id_user INTEGER NOT NULL," +
            "id_challenge INTEGER NOT NULL," +
            "liked BOOLEAN," +
            "FOREIGN KEY(id_user) REFERENCES user(id)," +
            "FOREIGN KEY (id_challenge) REFERENCES challenge(id));");
        db.run("CREATE TABLE suivi(id INTEGER PRIMARY KEY," +
            "id_user INTEGER NOT NULL," +
            "id_challenge INTEGER NOT NULL," +
            "FOREIGN KEY(id_user) REFERENCES user(id)," +
            "FOREIGN KEY (id_challenge) REFERENCES challenge(id));");
        db.run("CREATE TABLE parameter(id INTEGER PRIMARY KEY," +
            "name VARCHAR(100));");
        db.run("CREATE TABLE user_has_parameter(id_user INTEGER," +
            "id_parameter INTEGER," +
            "value VARCHAR(100) NOT NULL," +
            "FOREIGN KEY(id_user) REFERENCES user(id)," +
            "FOREIGN KEY(id_parameter) REFERENCES challenge(id));");
    });
    app.get("/personnes", function (req, res) {
        var result = [];
        db.each("SELECT * FROM personne ORDER BY nom,prenom",
            function (err, row) {
                result.push(row);
            },
            function () {
                res.json(result);
            }
        );
    });

    app.get("/personne/:id", function (req, res) {
        var personne = undefined;
        db.each("SELECT * FROM personne WHERE id = ?", [req.params.id],
            function (err, row) {
                personne = row;
            },
            function () {
                if (personne === undefined) {
                    res.status(404).end();
                } else {
                    res.json(personne);
                }
            }
        );
    });
    app.post("/newuser", function (req, res) {
        var user = req.body;
        if (user.nom === undefined || user.prenom === undefined || user.mail === undefined || user.password === undefined) {
            res.status(400).end();
            return;
        }
        if (user.mdp === user.password) {
            var stmt = db.prepare("INSERT INTO user(prenom, nom, mail, mdp) VALUES(?, ?, ?, ?)");
            stmt.run(user.prenom, user.nom, user.mail, user.password);
            stmt.finalize();
        }
        res.render("login");
    });
    app.post("/personne", isLoggedIn, function (req, res) {
        var personne = req.body;
        if (personne.nom === undefined || personne.prenom === undefined) {
            res.status(400).end();
            return;
        }
        var stmt = db.prepare("INSERT INTO personne(nom,prenom) VALUES(?, ?)");
        stmt.run(personne.nom, personne.prenom);
        stmt.finalize();
        res.status(200).end();
    });

    app.delete("/personne/:id", isLoggedIn, function (req, res) {
        var stmt = db.prepare("DELETE FROM personne WHERE id=?");
        stmt.run(req.params.id);
        stmt.finalize();
        res.status(200).end();
    });

    app.put("/personne/:id", isLoggedIn, function (req, res) {
        var personne = req.body;
        if (personne.nom === undefined || personne.prenom === undefined) {
            res.status(400).end();
            return;
        }
        var stmt = db.prepare("UPDATE personne SET nom=?,prenom=? WHERE id=?");
        stmt.run(personne.nom, personne.prenom, req.params.id);
        stmt.finalize();
        res.status(200).end();
    });
};

function isLoggedIn(req, res, next) {
    // si utilisateur authentifié, continuer
    if (req.isAuthenticated()) {
        return next();
    }
    // sinon erreur 'Unauthorized'
    res.status(401).end();
}