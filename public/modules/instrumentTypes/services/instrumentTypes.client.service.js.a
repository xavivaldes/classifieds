'use strict';

//InstrumentTypes service used to communicate InstrumentTypes REST endpoints
angular.module('instrumentTypes').factory('InstrumentTypes', ['$resource',
	function($resource) {
		return $resource('instrumentTypes/:instrumentTypeId', { instrumentTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
