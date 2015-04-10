'use strict';

// Instrumenttypes controller
angular.module('instrumenttypes').controller('InstrumenttypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Instrumenttypes',
	function($scope, $stateParams, $location, Authentication, Instrumenttypes) {
		$scope.authentication = Authentication;

		// Create new Instrumenttype
		$scope.create = function() {
			// Create new Instrumenttype object
			var instrumenttype = new Instrumenttypes ({
				name: this.name
			});

			// Redirect after save
			instrumenttype.$save(function(response) {
				$location.path('instrumenttypes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Instrumenttype
		$scope.remove = function(instrumenttype) {
			if ( instrumenttype ) { 
				instrumenttype.$remove();

				for (var i in $scope.instrumenttypes) {
					if ($scope.instrumenttypes [i] === instrumenttype) {
						$scope.instrumenttypes.splice(i, 1);
					}
				}
			} else {
				$scope.instrumenttype.$remove(function() {
					$location.path('instrumenttypes');
				});
			}
		};

		// Update existing Instrumenttype
		$scope.update = function() {
			var instrumenttype = $scope.instrumenttype;

			instrumenttype.$update(function() {
				$location.path('instrumenttypes/' + instrumenttype._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Instrumenttypes
		$scope.find = function() {
			$scope.instrumenttypes = Instrumenttypes.query();
		};

		// Find existing Instrumenttype
		$scope.findOne = function() {
			$scope.instrumenttype = Instrumenttypes.get({ 
				instrumenttypeId: $stateParams.instrumenttypeId
			});
		};
	}
]);