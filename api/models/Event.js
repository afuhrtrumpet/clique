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
			type : string,
			required : true,
			unique : true
		},

		eventid : {
			type: string,
			required: true,
			unique: true
		},

		userIds : {
			type: array,
			required : false,
			unique : false
		},
			

		 	
  	/* e.g.
  	nickname: 'string'
  	*/
    
  }

};
