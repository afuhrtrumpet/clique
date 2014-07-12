var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var yelp = require("yelp").createClient({
  consumer_key: "Y1whZCeinKIfZwH4pX4BCA", 
  consumer_secret: "V1eQ-GgP9K9bRAemYDgzUDAKkcg",
  token: "DHtTJJAdzCZB55KY64qaUIUkZPEWBwTg",
  token_secret: "WnPKoKFykMY-Bu3ivFUx_SmnZKU"
});
var async = require("async");
var asyncTasks = [];

module.exports = {
	createUser : function(req, res) {
		var node =  db.createNode({ yelpId : '123',
																yelpRating: 123 });
		node.save(function(err, node) {
			if (err) {
				console.log('Error saving new node to db!');
			} else {
				console.log('Saved node to db');
			}
		});
	},

	addFriends : function(req, res) { 
	//TODO(implement)
	},

	addPlaces: function(req, res) {
		//var place_name = req.param('place');
		place_name = "Mountain View"; // for debugging only
		//scraping yelp
		for(o= 0; o<1000; o+= 20){
			// See http://www.yelp.com/developers/documentation/v2/search_api
			yelp.search({term: "restaurant", location: place_name, offset: o}, 
				function(error, data) {
				if (data.businesses==undefined) console.log(data);
				for (var i = 0; i < data.businesses.length; i++) {
					var place = data.businesses[i];
					var query = 
						'MATCH (n {yelpId: {yelpID} }) RETURN n.yelpId';
					var params = {
						yelpID : place.id
					};
		
					db.query( query, params, function(err, results) {
						if (err) {
							console.log(err);
							throw err;
						}
					
						if (results.length <= 0) {
					
					var node = db.createNode({
						yelpId: place['id'],
						yelpRating:place['rating'], 
						yelpName: place['name'],
						yelpReviewCount: place['review_count'],
						yelpImageUrl: place['image_url'],
						yelpPhoneNo: place['display_phone']
					//	yelpCategories: place['categories'],
				//		yelpLocation: '"'+place.location.coordinate.longitude+","+place.location.coordinate.latitude+'"'
						});
						node.save(function(err, node) {
							if (err) { 
								console.log('Error saving new place node to db');
							} else {
								console.log('Saved new place node to db');
							}
						});
						}
					});
						//console.log({yelpID: place.id, yelpRating:place.rating, 
						//categories: place.categories, location: place.location});
					}
				});
		}
		//return places;
	},
		
}

