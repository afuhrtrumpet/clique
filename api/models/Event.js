/**
 * Event
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
		creatorId : {
			type : 'string',
			required : true,
			unique : false 
		},

		userIds : {
			type: 'array',
			required : false,
			unique : false
		},
			
		location: {
			type : 'string',
			required: true,
			unique: false
		},

		 	
  	/* e.g.
  	nickname: 'string'
  	*/
    
  }

};
