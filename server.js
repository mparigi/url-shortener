var mongo = require("mongodb").MongoClient;

mongo.connect('mongodb://localhost:27017/url-shortener', function (err, db) {
    if (err) throw err;
});