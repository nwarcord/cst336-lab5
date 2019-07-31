const request = require("request");

module.exports = {
    /**
     * Return random image URLs from an API
     * @param {*} keyword - search term
     * @param {*} imageCount - number of random images
     * @returns array of image URLs
     */
    getRandomImages: function(keyword, imageCount) {
        var requestURL = `https://api.unsplash.com/photos/random/?query=${keyword}&count=${imageCount}&orientation=landscape&client_id=702a5423588b3a102b6c3a8a2802738e8a825865b1238b157945aec4f878cc71`;

        return new Promise(function(resolve, reject) {
            request(requestURL, function(error, response, body) {
                if (!error) {
                    let photoData = JSON.parse(body);
                    let imageURLs = photoData.map(photo => photo.urls.regular);
                    resolve(imageURLs);
                }
                else {
                    console.log("error: ", error);
                }
            });
        });

    }

}