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

var eventCreateFunction = function($scope, $modal, $modalInstance, $http) {

		$scope.gPlace;

		$scope.updatePac = function() {
			console.log("Change");
			$('.pac-container').css('z-index', '9999');
		};

	$scope.submitEvent = function(event_name, event_details, event_place, event_start_date, event_end_date) {
		var msg_body = {
			event_name: event_name,
			event_details: event_details,
			event_place: event_place,
			event_start_date: event_start_date,
			event_end_date: event_end_date
		}

		$http.post('/test/event', msg_body).success(function(res) {
			//console.log(msg_body);
			//$modalInstance.close();
			$scope.cancel();
			$scope.nextEventPage();
		});
	
	};

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  // notes editing
  $scope.nextEventPage = function () {
    var modalInstance = $modal.open({
      templateUrl: 'nextEventPage.html',
      controller: eventCreateNextFunction,
      resolve: {
        orders: function () {
          return $scope.order;
        }
      }
    });

    modalInstance.result.then(function() {
    	location.reload(); 
		});
  };

	// calendar
  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

   // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };
  $scope.initDate = new Date('2016-15-20');
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  // calendar
  $scope.open2 = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened2 = true;
  };

   // Disable weekend selection
  $scope.disabled2 = function(date2, mode2) {
    return ( mode2 === 'day' && ( date2.getDay() === 0 || date2.getDay() === 6 ) );
  };

   $scope.dateOptions2 = {
    formatYear: 'yy',
    startingDay: 1
  };
  $scope.initDate2 = new Date('2016-15-20');
  $scope.formats2 = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format2 = $scope.formats2[0];
}

var eventCreateNextFunction = function($scope, $modalInstance) {
  $scope.eventDone = function() {
    $modalInstance.close();
  }
};
