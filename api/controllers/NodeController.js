var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

module.exports = {
	createUser : function(req, res) {
		var node =  db.createNode({ hello : 'world' });
		node.save(function(err, node) {
			if (err) {
				console.log('Error saving new node to db!');
			} else {
				console.log('Saved node to db');
			}
		});
	}
}

