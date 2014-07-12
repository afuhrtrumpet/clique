'use strict';

cliqueApp
	.controller('createEventController', function($scope, $http) {
		$scope.location = "";
		$('#location_picker').geocomplete();

		$scope.submit = function() {
			console.log("Button clicked");
		};
	});
