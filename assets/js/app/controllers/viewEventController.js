'use strict'

/* global logisticsApp */

cliqueApp
	.controller('viewEventController', function($scope, $http) {
		$scope.totalSeconds = 300;
		$scope.hours = Math.floor($scope.totalSeconds / 3600);
		$scope.minutes = Math.floor(($scope.totalSeconds - $scope.hours * 3600) / 60);
		$scope.seconds = $scope.totalSeconds - $scope.hours * 3600 - $scope.minutes * 60;

		setInterval(function() {
			$scope.totalSeconds--;
			$scope.hours = Math.floor($scope.totalSeconds / 3600);
			$scope.minutes = Math.floor(($scope.totalSeconds - $scope.hours * 3600) / 60);
			$scope.seconds = $scope.totalSeconds - $scope.hours * 3600 - $scope.minutes * 60;
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		}, 1000);
	});
