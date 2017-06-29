
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
        var base = "10.0.10.120";
        return "http://" + base + "/api" + route;
    }

};

module.exports = commons;
