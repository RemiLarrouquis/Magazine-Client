var request = require("request");
var notifier = require('node-notifier');
var path = require('path');

module.exports = function (app) {
    app.get("/publications", function (req, res) {
        console.log("hihi");

        var model = {};
        request({
            uri: "http://magazine.dev/api/publication/liste",
            method: "GET"
        }, function (error, response, body) {
            var responseBody = JSON.parse(body);
            if (!responseBody.error) {
                var publications = responseBody.result;
            }
            model = {publication: publications};
            console.log(model);
            res.render("publication/publications", model);

        });

    });
};
function viewname(req) {
    return req.originalUrl.replace(/^\//, '');
}