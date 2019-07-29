
$(document).ready(function () {
    
    $(".favorite-icon").on("click", function() {
        
        var imageURL = $(this).prev().attr("src");

        if ($(this).attr("src") == "img/favorite.png") {
            $(this).attr("src", "img/favorite_on.png");
            updateFavorite("add", imageURL); // Inserts a new record
        }
        else {
            $(this).attr("src", "img/favorite.png");
            updateFavorite("delete", imageURL); // Deletes record
        }

    });

    $(".keyword-link").on("click", function() {

        $.ajax({
            method: "GET",
            url: "/api/displayFavorites",
            data: {
                "keyword": $(this).text().trim()
            },
            success: function(rows, status) {
                $("#favorites").html("");
                rows.forEach(function(row) {
                    $("#favorites").append(`<img class="image" src="${row.imageURL}" width="150" height="150"><img class="favorite-icon" src="img/favorite_on.png" width="20">`);
                });
            }
        });

    });

    function updateFavorite(action, imageURL) {

        $.ajax({
            method: "GET",
            url: "/api/updateFavorites",
            data: {
                imageURL,
                "keyword": $("#keyword").val(),
                action
            }
        });

    }
});