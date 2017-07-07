
var commons = {

    viewname: function (req) {
        return req.originalUrl.replace(/^\//, '');
    },

    redirect: function (token, urlConnected) {
        if (token) {
            return urlConnected;
        } else {
            return "/login";
        }
    },

    url: function (route) {
        // var base = "magazine.dev";

        //Ligne à changer pour faire marcher le projet
        //Modifier l'ip par l'ip sur lequel le serveur laravel tourne
        var base = "10.0.10.120/Magazine/public";

        return "http://" + base + "/api" + route;
    }

};

module.exports = commons;
