'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Classifieds',
	function($scope, Authentication, Classifieds) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.loadAdditionalInfo = function () {
			$scope.classifieds = Classifieds.query();
			console.log($scope.classifieds);
		};
	}
]);
