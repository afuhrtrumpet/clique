/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:1337');

module.exports = {

  attributes: {
  	
		facebookId: {
			type: 'string',
			required: true,
			unique: true
		},

		name: {
			type: 'string',
			required: true,
			unique: false
		},

		accessToken: {
			type: 'string',
			required: false,
			unique: false
		}

  },

	//Lifecycle callbacks
  beforeCreate: function(values, next) {
		var node =  db.createNode({ facebookId : values.facebookId,
																name: values.name });
		node.save(function(err, node) {
			if (err) {
				console.log('Error saving new node to db!');
			} else {
				console.log('Saved node to db');
			}
		});
	next();
	}
		
};
