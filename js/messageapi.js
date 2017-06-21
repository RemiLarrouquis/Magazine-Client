/**
 * Created by Ludovic on 24/03/2016.
 */
module.exports = function (app, db) {
    app.post("/responsemessage/:id", isLoggedIn, function (req, res) {
        var message = req.body;
        if (message.content === undefined) {
            res.status(400).end();
            return;
        }
        var stmt = db.prepare("INSERT INTO message(content_message, auteur_message, fk_message) VALUES(?, ?, ?)");
        stmt.run(message.content, req.user.identifiant, req.params.id);
        stmt.finalize();
        res.redirect("/message/" + req.params.id);
    });
    app.post("/updatemessage/:id", isLoggedIn, function (req, res) {
        var message = req.body;
        if (message.content === undefined) {
            res.status(400).end();
            return;
        }
        var stmt = db.prepare("UPDATE message SET content_message = ? WHERE id_message = ?");
        stmt.run(message.content, req.params.id);
        stmt.finalize();
        res.redirect("/listmessage?page=0");
    });
    app.post("/listmessage", isLoggedIn, function (req, res) {
        var message = req.body;
        if (message.content === undefined) {
            res.status(400).end();
            return;
        }
        var stmt = db.prepare("INSERT INTO message(content_message, auteur_message) VALUES(?, ?)");
        stmt.run(message.content, req.user.identifiant);
        stmt.finalize();
        res.redirect("/listmessage?page=0");
    });
    app.post("/deletepost/:id", isLoggedIn, function (req, res) {
        var stmt = db.prepare("DELETE FROM message WHERE id_message = ?");
        stmt.run(req.params.id);
        stmt.finalize();
        res.redirect("/listmessage?page=0");
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).end();
}