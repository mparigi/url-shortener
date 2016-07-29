var mongo = require("mongodb").MongoClient;
var express = require("express");

var app = express();

app.get("/new/:url", function (req, res) {
    var newUrl = req.params.url;
    
    if (invalidUrl(newUrl)) {
        res.end(JSON.stringify({"error": "invalid url"}))
    }
    
    mongo.connect('mongodb://localhost:27017/url-shortener', function (err, db) {
        if (err) throw err;
        
        var urls = db.collection("urls");
        
        /*
        entries to urls:
        
        {
            _id: the identification number,
            origUrl: the original url
        }
        */
        
        
        
        urls.find({
            "origUrl": newUrl
        }).toArray(function(err, data) {
            if (err) throw err;
            if (!data) { //the new url does not already exist
                
            } else {
                console.log(data);
                db.close()
            }
        });
        
    });
    
});






function invalidUrl (url) {
    var reg = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    if (reg.exec(url)) {
        return false;
    } else {
        return true;
    }
}


