'use strict'

/* global logisticsApp */ 

cliqueApp
	.controller('dashboardController', function($scope, $modal, $http) {
		
		// notes editing
	  $scope.createEvent = function () {
	    var modalInstance = $modal.open({
	      templateUrl: 'createEvent.html',
	      controller: eventCreateFunction,
	      resolve: {
	        orders: function () {
	          return $scope.order;
	        }
	      }
	    });

	    modalInstance.result.then(function() {
	    	location.reload(); 
			});
		}
	});

	var eventCreateFunction = function($scope, $modalInstance) {

	$scope.submitEvent = function(event_name, event_details, event_place, event_start_date, event_end_date) {
		var msg_body = {
			event_name: event_name,
			event_details: event_details,
			event_place: event_place,
			event_start_date: event_start_date,
			event_end_date: event_end_date
		}

		$http.post('/test/event', msg_body).success(function(res) {
			$modalInstance.close();
		});
	
	};

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}