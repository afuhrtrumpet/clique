'use strict';

var cliqueApp = angular.module('cliqueApp', ['ngRoute', 'ngResource', 'ui.bootstrap'])
	.config(function($routeProvider, $locationProvider) {

	$routeProvider
		.when('/home', {
			templateUrl: 'partials/home',
			controller: 'homeController'
		})
		.when('/weee', {
			templateUrl: 'partials/weee',
			controller: 'homeController'
		})
		.when('/dashboard', {
			templateUrl: 'partials/dashboard',
			controller: 'homeController'
		})
		.when('/createEvent', {
			templateUrl: 'partials/eventForm',
			controller: 'createEventController'
		})
		.when('/viewEvent', {
			controller: 'viewEventController'
		})
		.otherwise({
			redirectTo: '/home'
		});

	$locationProvider.html5Mode(true);
})
.run(function($rootScope) {

}).directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());                
                });
            });
        }
    };
});
