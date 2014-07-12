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
		.otherwise({
			redirectTo: '/home'
		});

	$locationProvider.html5Mode(true);
})
.run(function($rootScope) {

});