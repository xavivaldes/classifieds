'use strict';

//Setting up route
angular.module('instrumenttypes').config(['$stateProvider',
	function($stateProvider) {
		// Instrumenttypes state routing
		$stateProvider.
		state('listInstrumenttypes', {
			url: '/instrumenttypes',
			templateUrl: 'modules/instrumenttypes/views/list-instrumenttypes.client.view.html'
		}).
		state('createInstrumenttype', {
			url: '/instrumenttypes/create',
			templateUrl: 'modules/instrumenttypes/views/create-instrumenttype.client.view.html'
		}).
		state('viewInstrumenttype', {
			url: '/instrumenttypes/:instrumenttypeId',
			templateUrl: 'modules/instrumenttypes/views/view-instrumenttype.client.view.html'
		}).
		state('editInstrumenttype', {
			url: '/instrumenttypes/:instrumenttypeId/edit',
			templateUrl: 'modules/instrumenttypes/views/edit-instrumenttype.client.view.html'
		});
	}
]);