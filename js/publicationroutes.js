var request = require("request");
var notifier = require('node-notifier');
var path = require('path');

module.exports = function (app) {
    app.get("/publications", function (req, res) {
        request({
            uri: "http://magazine.dev/api/publication/liste",
            method: "GET"
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            if (!responseBody.error) {
                var publications = responseBody.result;
            }
            var model = {publication: publications, cookie: req.cookies.token};
            res.render("publication/publications", model);
        });
    });

    app.get("/publication/:id", function (req, res) {

        request({
            uri: "http://magazine.dev/api/publication/detail?id=" + [req.params.id],
            method: "GET"
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            if (!responseBody.error) {
                var publications = responseBody.result;
            }
            var model = {publication: publications, cookie: req.cookies.token};
            res.render("publication/information", model);
        });


    });
};
function viewname(req) {
    return req.originalUrl.replace(/^\//, '');
}