module.exports = function (app, db) {
    var request = require("request");

    app.post("/updateuser", function (req, res) {
        var formuser = req.body;
        console.log(formuser);
        var stmt = db.prepare("UPDATE user SET lastname = ? , firstname = ? , password = ? WHERE id = ?");
        stmt.run(formuser.lastname, formuser.firstname, formuser.password1, req.user.identifiant.id);
        stmt.finalize();
        res.redirect("/moncompte");
    });


    app.post("/createuser", function (req, res) {

        var formuser = req.body;
        formuser.password = formuser.password1;
        formuser.is_client = true;
        request({
            uri: "http://magazine.dev/api/register",
            method: "POST",
            form: formuser
        }, function (error, response, body) {
            console.log("body", body);
            var test = JSON.parse(body);
            if(test.result){
                console.log("hihi");
            }
            console.log("body.result", test.result);
        });
    });
};


// app.post("/createuser", function (req, res) {
//     console.log("blabla");
//     var formuser = req.body;
//     db.each("SELECT count(id) as nb FROM user WHERE login = ?", [formuser.login],
//         function (err, user) {
//             console.log('login',formuser.login);
//             console.log('user',user);
//             if (user.nb != 0) {
//                 console.log('existe déjà');
//                 res.status(404).end();
//             } else {
//                 console.log('existe pas');
//                 var stmt = db.prepare("INSERT INTO user(login,firstname,lastname,password) VALUES (?,?,?,?)");
//                 stmt.run(formuser.login, formuser.firstname, formuser.lastname, formuser.password1);
//                 stmt.finalize();
//                 res.redirect("/login");
//             }
//         });
// });