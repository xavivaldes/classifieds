'use strict';

//Setting up route
angular.module('instrumentTypes').config(['$stateProvider',
	function($stateProvider) {
		// InstrumentTypes state routing
		$stateProvider.
		state('listInstrumentTypes', {
			url: '/instrumentTypes',
			templateUrl: 'modules/instrumentTypes/views/list-instrumentTypes.client.view.html'
		}).
		state('createInstrumentType', {
			url: '/instrumentTypes/create',
			templateUrl: 'modules/instrumentTypes/views/create-instrumentType.client.view.html'
		}).
		state('viewInstrumentType', {
			url: '/instrumentTypes/:instrumentTypeId',
			templateUrl: 'modules/instrumentTypes/views/view-instrumentType.client.view.html'
		}).
		state('editInstrumentType', {
			url: '/instrumentTypes/:instrumentTypeId/edit',
			templateUrl: 'modules/instrumentTypes/views/edit-instrumentType.client.view.html'
		});
	}
]);
