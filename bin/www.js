/**
 * Created by Ludovic on 21/06/2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
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
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));

// handlebars template engine
app.engine('.html', exphbrs({extname: '.html', defaultLayout: 'template'}));
app.set('view engine', '.html');

require('../routes.js')(app);

//Api
require('../js/userapi.js')(app);

//Routing
require('../js/subscriptionroutes')(app);
require('../js/publicationroutes')(app);
require('../js/paiementroutes')(app);

app.listen(3333);