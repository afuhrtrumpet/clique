var yelp = require("yelp").createClient({
  consumer_key: "Y1whZCeinKIfZwH4pX4BCA",
  consumer_secret: "V1eQ-GgP9K9bRAemYDgzUDAKkcg",
  token: "DHtTJJAdzCZB55KY64qaUIUkZPEWBwTg",
  token_secret: "WnPKoKFykMY-Bu3ivFUx_SmnZKU"
});
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase("http://localhost:7474");
var createNode = function(b) {
	var node = db.createNode({
		yelpId: b.id,
		yelpName: b.name,
		yelpRating: b.rating,
		yelpLocation: b.location.city
	});
	node.save(function(err, node) {
		if (err) { console.log("node not saved!" + err);
			} else { console.log("node saved!"); }
	});
}
module.exports = {

getData : function(req, res) {
	yelp.search({term:"restaurants", location:"Mountain View"}, function(err, data) {
		var businesses = data.businesses;
		for (var i = 0; i < businesses.length; ++i) {
			var business = businesses[i];
			console.log(business.name + " : " + business.rating);
			createNode(business);
		}
	});
	yelp.search({term:"bars", location:"Mountain View"}, function(err, data) {
		var businesses = data.businesses;
		for (var i = 0; i < businesses.length; ++i) {
			var business = businesses[i];
			console.log(business.name + " : " + business.rating);
			createNode(business);
		}
	});
	



},
};
