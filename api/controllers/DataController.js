var yelp = require("yelp").createClient({
  consumer_key: "Y1whZCeinKIfZwH4pX4BCA",
  consumer_secret: "V1eQ-GgP9K9bRAemYDgzUDAKkcg",
  token: "DHtTJJAdzCZB55KY64qaUIUkZPEWBwTg",
  token_secret: "WnPKoKFykMY-Bu3ivFUx_SmnZKU"
});
var neo4j = require('neo4j');

module.exports = {

getData : function(req, res) {
	yelp.search({term:"restaurants", location:"Mountain View"}, function(err, data) {
		console.log(data);
		console.log(data.length);
	});
},
};
