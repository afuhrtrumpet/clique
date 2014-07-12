var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var yelp = require("yelp").createClient({
  consumer_key: "Y1whZCeinKIfZwH4pX4BCA", 
  consumer_secret: "V1eQ-GgP9K9bRAemYDgzUDAKkcg",
  token: "DHtTJJAdzCZB55KY64qaUIUkZPEWBwTg",
  token_secret: "WnPKoKFykMY-Bu3ivFUx_SmnZKU"
});
var async = require("async");

var FB = require("fb");

var addPlaceHelper = function(data, placelocation){
                for (var i = 0; i < data.businesses.length; i++) {
                        var place = data.businesses[i];
                        var query =
                                        'MATCH (n {yelpId: {yelpID} }) RETURN n.yelpId';
                        var params = {
                                yelpID : place.id
                        };
 
                        db.query(query, params, function(err, results) {
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
                                                yelpPhoneNo: place['display_phone'],
																								yelpLocation: placelocation
                                                //yelpCategories: place['categories'],
                                                //yelpLocation: '"'+place.location.coordinate.longitude+","+place.location.coordinate.latitude+'"'
                                                });
                                        node.save(function(err, node) {
                                                if (err) {
                                                        console.log('Error saving new place node to db');
                                                } else {
                                                        console.log('Saved new place node to db');
                                                }
                                        });
                                }
                                //console.log({yelpID: place.id, yelpRating:place.rating,                               //categories: place.categories, location: place.location});
                        });
                }
        };

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
	//var facebookId = req.param('facebookId');
	var facebookId = '4';
	console.log(req.user);
	FB.setAccessToken(req.user.accessToken);
	FB.api('/me/friends', {fields : ['id', 'name']},  function(res) {
		// Iterate through all friends and add them to graph if not added already
			friendlist = res['data'];
			console.log(res);
			for ( i = 0; i < friendlist.length; ++i ) {
			var friend = friendlist[i];
			var query = 'match (n {facebookId : {facebookID} }) CREATE UNIQUE (n)-[r:KNOWS]->(x {name: {friendName} , facebookId: {friendFacebokID} }) CREATE UNIQUE (x)-[r:KNOWS]->(n) return r';
			var params = {
				facebookID : req.user.facebookId,
				friendName : friend.name,
				friendFacebookID : friend.id
			};
			db.query(query, params, function(err, results) {
				if (err) {
					console.log(err);
				}	
			}); // end db.query
			} // end for  loop
		}); // end FB.api
	}, // end addFriends

	addPlaces: function(req, res) {
		var place_name = req.param('place');
		//place_name = "Mountain View"; // for debugging only
		//scraping yelp
		for(o= 0; o<100; o+= 20){
			// See http://www.yelp.com/developers/documentation/v2/search_api
			yelp.search({term: "restaurant", location: place_name, offset: o}, 
				function(error, data) {
				if (data.businesses==undefined) console.log(data);
				addPlaceHelper(data, place_name);	
			/*
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
						}); } });
						//console.log({yelpID: place.id, yelpRating:place.rating,				//categories: place.categories, location: place.location});
					}*/ 
}); 
	}
		//return places;
	},

addRatings: function (req,res) {
		
	res.send(200);
},

createSimilarity : function(req, res) {
		// Return a list of suggested places by the recommendation algorithm
		FB.setAccessToken(req.user.accessToken);
		var alocation = req.param('location');
		var query = " MATCH (n {yelpLocation: {location} ) return n; ";
		var params = { location : alocation };
		db.query(query, params, function(err, results) {
			for ( var i = 0; i < results.length; i++) {
				var place = results[i].n._data.data;
				var categories = place['yelpCategories'];
				var point = 0;
				for ( var j = 0; j < categories.length; j++ ) {
					var category = categories[j][0];
					FB.api('/me/likes', {fields : ['name']}, function(res) {
						for ( var k = 0; k < res['data'].length; k++) {
							var item = res['data'][k]['name'];
							if (item == category ) point++; 
						}
					});
					
				}	
				var reviewCount = place['yelpReviewCount'];
				var rating = (point) * ((reviewCount/1000) + 1);
				var query = "START n = node(*), m = node(*) WHERE HAS(n.tmpnode) AND HAS(n.facebookId) AND HAS(m.yelpId) AND n.facebookId = {facebookId} AND m.yelpId = {yelpID} CREATE UNIQUE (n)-[r:RATED { rating : {Rating} } ]->(m) RETURN r";
				var params = {
					facebookId : req.user.facebookId,
					yelpId : place['yelpId'],
					Rating : rating
				};
				db.query(query, params, function(err, result) { 
					if(err) { console.log(err); }
				});
			}
		});
var query = "MATCH (p {facebookId : {facebookID}, tmpnode:true})-[x:RATED]->(n)<-[y:RATED]-(p2 {tmpnode: true}) WITH SUM(x.rating*y.rating) AS xyDotProduct, SQRT(REDUCE(xDot = 0, a IN COLLECT(x.rating) | xDot + a^2)) AS xLength, SQRT(REDUCE(yDot = 0, b in COLLECT(y.rating) | yDot + b^2)) AS yLength, p,p2 CREATE UNIQUE (p)-[s:SIMILARITY]-(p2) SET s.similarity = (xyDotProduct / (xLength * yLength))";
var params = {
		facebookID : req.user.facebookId,
	}
db.query(query,params, function(err, res) { if(err) console.log(err); });
res.send(200);
},

generateSuggestions : function(req, res) {
	var query = "MATCH (b {tmpnode:true} )-[r:RATED]->(m), (b)-[s:SIMILARITY]-(a {tmpnode:true, facebookId: {facebookID} }) WHERE NOT((a)-[:RATED}->(m)) WITH m,s.similarity AS similariy, r.rating AS rating ORDER BY m.yelpName, similarity DESC return m, similarity";
	var params = {
		facebookID : req.user.facebookId
	};
	var data = [];
	db.query(query, params, function(err, results) { if(err) console.log(err);
	for(var i = 0; i < results.length; i++) {
		var t = results[i].m.data._data;
		data.push(t);
	}
	res.send(data);
	
	
 });

},
addSuggestions : function(req, res) {
	// Add a suggestion by a user
	console.log(req.params);

},

joinEvent : function(req, res) {
	var eventId = req.param('event_id');
	var tmpNode = db.createNode({
		facebookId : req.user.facebookId,
		name : req.user.name,
		tmpnode : true,
		});
	tmpNode.save(function(err,node) { 
		if(err) { console.log(err);}
		else {
	var query = ' START n = node(*), m=node(*) WHERE HAS(n.tmpnode) AND HAS(n.facebookId) AND HAS(m.eventId) AND n.facebookId = {facebookID} AND m.eventId = {eventID} CREATE UNIQUE (n)-[r:ATTENDING]->(m) RETURN r';
	var params = {
		facebookID : req.user.facebookId,
		eventID : eventId
	};
	db.query(query, params, function(err, results) {
		if ( err )  { console.log(err); }
	});
	}
	});
},


updateEvent: function(req , res) {
	var eventId = req.param('eventId');
	
},

createEvent : function(req, res) {
	console.log("Function called : createEvent");	
	var eName = req.param('event_name');
	var ePlace = req.param('event_place');
	var eCreatorId = req.user.facebookId;
	var eDetails = req.param('event_details');
	var eStart = req.param('event_start_date');
	var eEnd = req.param('event_end_date');
	var eId = eCreatorId + eName + "--";
	 
	// get creatorId, eventId, eventName, array<userIds>
	 var eventNode = db.createNode({ creatorId: eCreatorId,
			eventId: eId,
			eventName: eName,
			eventLocation : ePlace,
			eventDetails : eDetails,
			eventStart: eStart,
			eventEnd : eEnd
	  });
	eventNode.save(function(err, node) {
		if (err) { console.log("Error saving new event node"); } else { console.log("Created event node"); }
	
	// Invite people to event 
	/*
		for ( var i = 0; i < e.userIds.length; ++i ) {
		var userId = e.userIds[i];
		var query = 'MATCH (n {facebookId: {userID} }) CREATE (
	}
*/
res.send(200);
});
},
	
getEvent : function(req, res) {
	var query = "MATCH (e {creatorId : {creatorID} } ) return e";
	var params = { creatorID : req.user.facebookId };
	var jsonArray = [];
	db.query(query, params, function (err, results) {
		for ( var i = 0; i < results.length; ++i) {
			var d = results[i].e._data.data;
			jsonArray.push(d);
		}
	//	console.log(results[0].e.db);
	res.send(jsonArray);
	});
		
},
}

