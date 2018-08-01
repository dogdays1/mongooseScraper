var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 7000;
//var PORT = 7000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to the Mongo DB
//mongoose.connect("mongodb://localhost/bbcscraper");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/bbcscraper";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


console.log("scrape each time server starts\n\n");
request("https://www.bbc.com/news", function (error, response, html) {

    // Load cheerio
    var $ = cheerio.load(html);

    // Empty array to save our scraped data
    var result = {};

    $("a.gs-c-promo-heading").each(function (i, element) {
        let bbc = "";
        bbc = "https://www.bbc.com/news/"
        result.title = $(this)
            .children("h3")
            .text();
        //  console.log("title " + result.title)
        result.link = bbc + $(this)
            // .children("a")
            .attr("href");
        result.summary = $(this)
            .next("p.gs-c-promo-summary")
            .text();

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
            .then(function (dbArticle) {
             //   console.log("dbArticle  " + dbArticle);
        
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
             //   return res.json(err);
            // console.log(err)
            });
    });

});


// Route for getting all Articles 
app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
    });
    
    // Route for grabbing an article and it's notes
    app.get("/articles/:id", function (req, res) {
        console.log(req.params)
        db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            console.log(dbArticle);
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
    });

// Route for saving a Note
app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id },{ $push: { note: dbNote._id }}, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});
// Route for deleting a Note
app.delete("/articles/:id", function (req, res) {
    console.log("got to delete")
    db.Note.findOneAndDelete({ _id: req.params.id }, { $pull: { note: dbNote._id }});
});
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});



