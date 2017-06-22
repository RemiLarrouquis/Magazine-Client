// /**
//  * Created by Ludovic on 24/03/2016.
//  */
// var LocalStrategy = require('passport-local').Strategy;
// var TwitterStrategy = require('passport-twitter').Strategy;
//
// var configAuth = require('./auth.js');
//
// module.exports = function (passport,db) {
//
//     var utilisateur = function (login) {
//         this.identifiant = login;
//     };
//
//     // objet utilisateur -> identifiant de session
//     passport.serializeUser(function (user, done) {
//         done(null, user.identifiant);
//     });
//
//     // identifiant de session -> objet utilisateur
//     passport.deserializeUser(function (login, done) {
//         done(null, new utilisateur(login));
//     });
//
//     //****************************************************************
//     //****************************************************************
//     passport.use('local-login', new LocalStrategy({
//             // champs du formulaire login
//             usernameField: 'login',
//             passwordField: 'password',
//             passReqToCallback: true
//         },
//         function (req, login, password, done) {
//             console.log("login",login);
//             console.log("password",password);
//             db.each("SELECT count(id) as nb,login,id FROM user WHERE login = ? AND password = ?",[login,password],
//                 function(err,row){
//                     console.log(row);
//                     console.log(row.nb);
//                     if (row.nb != 0) {
//                         return done(null, new utilisateur(row));
//                     }
//                     return done(null, false);
//                 }
//             );
//
//         }));
//
//     //****************************************************************
//     //****************************************************************
//     passport.use(new TwitterStrategy({
//             consumerKey: configAuth.twitterAuth.consumerKey,
//             consumerSecret: configAuth.twitterAuth.consumerSecret,
//             callbackURL: configAuth.twitterAuth.callbackURL
//
//         },
//         function (token, tokenSecret, profile, done) {
//             process.nextTick(function () {
//                 console.log("twitter auth: " + profile.username);
//                 return done(null, new utilisateur(profile.username));
//             });
//
//         }));
// };