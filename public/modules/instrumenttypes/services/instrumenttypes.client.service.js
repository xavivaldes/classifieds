'use strict';

//Instrumenttypes service used to communicate Instrumenttypes REST endpoints
angular.module('instrumenttypes').factory('Instrumenttypes', ['$resource',
	function($resource) {
		return $resource('instrumenttypes/:instrumenttypeId', { instrumenttypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);