const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const request = require("request");
const mysql = require("mysql");
const tools = require("./tools.js");

// Routes

// Root route
app.get("/", async function(req, res) {
    let imageURLs = await tools.getRandomImages('', 1);
    res.render("index", {imageURLs});
});

app.get("/search", async function(req, res) {
    let keyword = req.query.keyword;
    let imageURLs = await tools.getRandomImages(keyword, 9);
    res.render("results", {imageURLs, keyword});
});

app.get("/api/updateFavorites", function(req, res) {

    // var conn = mysql.createConnection({
    //     host: "us-cdbr-iron-east-02.cleardb.net",
    //     user: "b2848780ec5752",
    //     password: "36759909",
    //     database: "heroku_8e95a53d7f7ad57"
    // });
    var conn = tools.createConnection();
    var sql;
    var sqlParams;

    if (req.query.action == "add") {
        sql = "INSERT INTO favorites (imageURL, keyword) VALUES (?, ?)";
        sqlParams = [req.query.imageURL, req.query.keyword];
    }
    else {
        sql = "DELETE FROM favorites WHERE imageURL = ?";
        sqlParams = [req.query.imageURL];
    }

    conn.connect(function(err) {
        if (err) throw err;
        conn.query(sql, sqlParams, function(err, result) {
            if (err) throw err;
        });
    });

});

app.get("/displayKeywords", async function(req, res) {

    let imageURLs = await tools.getRandomImages('', 1);
    var conn = tools.createConnection();
    var sql = "SELECT DISTINCT keyword FROM `favorites` ORDER BY keyword";

    conn.connect(function(err) {
        if (err) throw (err);
        conn.query(sql, function(err, result) {
            if (err) throw err;
            res.render("favorites", {rows: result, imageURLs});
        });
    });

});

app.get("/api/displayFavorites", function(req, res) {

    var conn = tools.createConnection();
    var sql = "SELECT imageURL FROM favorites WHERE keyword = ?";
    var sqlParams = [req.query.keyword];

    conn.connect(function(err) {
        if (err) throw (err);
        conn.query(sql, sqlParams, function(err, results) {
            if (err) throw err;
            res.send(results);
        });
    });

});

// Server listener
// app.listen("8081", "127.0.0.1", function() {
//     console.log("Express server is running...");
// });

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Running Express Server...");
});