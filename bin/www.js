/**
 * Created by Ludovic on 21/06/2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var passport = require('passport');
var session = require('express-session');
var exphbrs = require('express-handlebars');
var paginate = require('express-paginate');
var async = require("async");


var app = express();

app.use(cookieParser()); // read cookies (obligatoire pour l'authentification)
app.use(cookieSession({keys: ['exemplecourssecretkey']}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev')); // toute les requêtes HTTP dans le log du serveur

// passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// handlebars template engine
app.engine('.html', exphbrs({extname: '.html', defaultLayout: 'template'}));
app.set('view engine', '.html');

// require('../js/passport.js')(app);
require('../js/personneapi.js')(app);
require('../routes.js')(app, passport);
require('../js/personneroutes.js')(app);
require('../js/messageroutes.js')(app);
require('../js/messageapi.js')(app);
require('../js/userapi.js')(app);
require('../js/userroutes.js')(app);
require('../js/challengeapi.js')(app);
require('../js/challengeroutes.js')(app);
require('../js/account.js')(app);

app.listen(3333);