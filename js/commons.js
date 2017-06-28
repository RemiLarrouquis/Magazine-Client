
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
    }

};

module.exports = commons;
