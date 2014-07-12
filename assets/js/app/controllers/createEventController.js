'use strict';

cliqueApp
	.controller('createEventController', function($scope, $http) {
		$scope.location = "";

		$scope.gPlace;

		//$('#location_picker').geocomplete();

		$scope.submit = function() {
			$http({
				method: 'POST',
				url: '/event/create',
				data: {'location': $scope.location}
			}).success(function(data, status, headers, config) {
				console.log(data);
			});
			console.log("Button clicked");
		};

		$scope.update = function() {
			console.log("Update");
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		};
	});
