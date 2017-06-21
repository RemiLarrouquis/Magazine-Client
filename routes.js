/**
 * Created by Ludovic on 24/03/2016.
 */
module.exports = function (app, passport) {
    console.log('dirname', __dirname);
    var public = __dirname + '/public/';
    var css = public + '/stylesheets/';
    var js = public + '/js/';
    var img = public + '/img/';
    //LocalStrategy = require("passport-local").Strategy
    // var path = require('path');
    //
    // app.use(express.static(path.resolve('./public')));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    app.get(['/', '/login', '/newusers'], function (req, res) {
        if (req.originalUrl === '/') {
            req.originalUrl = 'index';
        }
        var model = {user: req.user};
        res.render(viewname(req), model);
    });

    app.get(['/welcome'], isLoggedIn, function (req, res) {
        var model = {user: req.user};
        res.render(viewname(req), model);
    });

    //passport.use('local-login', new LocalStrategy({
    //    usernameField: 'login',
    //    passwordField: 'password',
    //    passReqToCallback: true
    //}, function (req, login, password, done) {
    //    User.findOne({'local.login': email}, function (err, user) {
    //        if(err){
    //            return done(err);
    //        }
    //        if(!user){
    //            return done(null,false,req.flash('loginMessage',"Identifiant incorrecte"));
    //        }
    //        if(!user.validPassword(password)){
    //            return done(null,false,req.flash('loginMessage','Mot de passe incorrecte'));
    //        }
    //
    //        return done(null,user);
    //    });
    //}));


    app.post('/authenticate',
        passport.authenticate('local-login', {
            successRedirect: '/welcome',
            failureRedirect: '/login',
            failureFlash: true
        })
    );

    //****************************************************************
    //****************************************************************
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/welcome',
            failureRedirect: '/login'
        }));

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('*.css', function (req, res) {
        res.sendFile(css + req.originalUrl);
    });

    app.get('*.js', function (req, res) {
        res.sendFile(js + req.originalUrl);
    });

    app.get('*.png', function (req, res) {
        res.sendFile(img + req.originalUrl);
    });

    app.get('*.jpg', function (req, res) {
        res.sendFile(img + req.originalUrl);
    });

};

function viewname(req) {
    return req.originalUrl.replace(/^\//, '');
};

function isLoggedIn(req, res, next) {
    // si utilisateur authentifié, continuer
    if (req.isAuthenticated()) {
        return next();
    }
    // sinon afficher formulaire de login
    res.redirect('/login');
}