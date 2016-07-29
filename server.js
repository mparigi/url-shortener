var mongo = require("mongodb").MongoClient;
var express = require("express");
var mdware = require("mdware");

var url = process.env.MONGOLAB_URI;

var app = express();


/*
entries to urls:
        
{
    _id: the identification number,
    srcUrl: the original url
}

*/


app.use(mdware({
    dir: __dirname + "/static",
    url: "/"
}));

app.use("/", function (req, res, next) {
    console.log("test");
    res.send(req.mdware.html);
    next();
});




//creation
app.get("/new/*", function (req, res) {
    var newUrl = req.originalUrl.toString().slice(5);
    
    if (invalidUrl(newUrl)) {
        return res.end(JSON.stringify({"error": "invalid url"}));
    }
    
    mongo.connect(url, function (err, db) {
        if (err) throw err;
        console.log("connected to db (creation)");
        var urls = db.collection("urls");
        
        urls.find({
            srcUrl: newUrl
        }).toArray(function(err, data) {
            if (err) throw err;
            if (!data.length) { //the requested url does not already exist
                console.log("requested url doesn't exist");
                //create new entry
                urls.count(function (err, cnt) {
                    if (err) throw err;
                    
                    urls.insert({
                        _id: cnt, //assign consecutive number
                        srcUrl: newUrl
                    }, function (err, results) {
                        if (err) throw err;
                        res.end(JSON.stringify({
                            "original_url": results.ops[0].srcUrl,
                            "short_url": "https://" + req.hostname + "/redir/" + results.ops[0]._id.toString()
                        }));
                        db.close();
                    });
                    
                });
                
            } else { //the requested url already exists
                console.log("requested url does exist");
                res.end(JSON.stringify({
                    "original_url": data[0].srcUrl,
                    "short_url": "https://" + req.hostname + "/redir/" + data[0]._id.toString()
                }));
                db.close();
            }
        });
        
    });
    
});


app.get("/redir/:requestNum", function (req, res) {
    var requestNum = req.params.requestNum;
    console.log("received request, requestNum: " + requestNum);
    
    mongo.connect(url, function (err, db) {
        if (err) throw err;
        console.log("connected to db (redirection)");
        var urls = db.collection("urls");
        urls.find({
            _id: Number(requestNum)
        }).toArray(function (err, data) {
            if (err) throw err;
            if (!data.length) {
                res.end("not valid");
            }
            res.redirect(data[0].srcUrl)
            db.close();
        });
        
    });
    
});


app.listen(process.env.PORT || 8080);






function invalidUrl (url) {
    var reg = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    if (reg.exec(url)) {
        return false;
    } else {
        return true;
    }
}


