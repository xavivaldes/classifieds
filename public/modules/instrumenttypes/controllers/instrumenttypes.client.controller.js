'use strict';

// InstrumentTypes controller
angular.module('instrumentTypes').controller('InstrumentTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'InstrumentTypes', 'Families',
	function($scope, $stateParams, $location, Authentication, InstrumentTypes, Families) {
		$scope.authentication = Authentication;

		// Create new InstrumentType
		$scope.create = function() {
			// Create new InstrumentType object
			var instrumentType = new InstrumentTypes ({
				name: this.name,
				family: this.family
			});

			// Redirect after save
			instrumentType.$save(function(response) {
				$location.path('instrumentTypes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing InstrumentType
		$scope.remove = function(instrumentType) {
			if ( instrumentType ) {
				instrumentType.$remove();

				for (var i in $scope.instrumentTypes) {
					if ($scope.instrumentTypes [i] === instrumentType) {
						$scope.instrumentTypes.splice(i, 1);
					}
				}
			} else {
				$scope.instrumentType.$remove(function() {
					$location.path('instrumentTypes');
				});
			}
		};

		// Update existing InstrumentType
		$scope.update = function() {
			var instrumentType = $scope.instrumentType;

			instrumentType.$update(function() {
				$location.path('instrumentTypes/' + instrumentType._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of InstrumentTypes
		$scope.find = function() {
			$scope.instrumentTypes = InstrumentTypes.query();
		};

		$scope.loadAdditionalInfo = function() {
			$scope.families = Families.query();
		};

		// Find existing InstrumentType
		$scope.findOne = function() {
			$scope.instrumentType = InstrumentTypes.get({
				instrumentTypeId: $stateParams.instrumentTypeId
			});
		};
	}
]);
