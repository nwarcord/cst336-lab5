const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const tools = require("./tools");
const pool = require("./database"); // Connection pool

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

// Route to update favorite images
app.get("/api/updateFavorites", function(req, res) {

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

    pool.query(sql, sqlParams, function(err, result) {
        if (err) throw err;
    });

});

// Display keywords from database and render favs page
app.get("/displayKeywords", async function(req, res) {

    let imageURLs = await tools.getRandomImages('', 1);
    var sql = "SELECT DISTINCT keyword FROM `favorites` ORDER BY keyword";

    pool.query(sql, function(err, result) {
        if (err) throw err;
        res.render("favorites", {rows: result, imageURLs});
    });

});

// Favorite picture by keyword
app.get("/api/displayFavorites", function(req, res) {

    var sql = "SELECT imageURL FROM favorites WHERE keyword = ?";
    var sqlParams = [req.query.keyword];

    pool.query(sql, sqlParams, function(err, results) {
        if (err) throw err;
        res.send(results)
    });

});

// Server listener
// app.listen("8081", "127.0.0.1", function() {
//     console.log("Express server is running...");
// });

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Running Express Server...");
});