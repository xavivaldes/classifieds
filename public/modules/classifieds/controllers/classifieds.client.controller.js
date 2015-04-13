'use strict';

// Classifieds controller
angular.module('classifieds').controller('ClassifiedsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Classifieds', 'Categories', 'Families',
	function($scope, $stateParams, $location, Authentication, Classifieds, Categories, Families) {
		$scope.authentication = Authentication;

		// Create new Classified
		$scope.create = function() {
			// Create new Classified object
			var classified = new Classifieds ({
				name: this.name
			});

			// Redirect after save
			classified.$save(function(response) {
				$location.path('classifieds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Classified
		$scope.remove = function(classified) {
			if ( classified ) {
				classified.$remove();

				for (var i in $scope.classifieds) {
					if ($scope.classifieds [i] === classified) {
						$scope.classifieds.splice(i, 1);
					}
				}
			} else {
				$scope.classified.$remove(function() {
					$location.path('classifieds');
				});
			}
		};

		// Update existing Classified
		$scope.update = function() {
			var classified = $scope.classified;

			classified.$update(function() {
				$location.path('classifieds/' + classified._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Classifieds
		$scope.find = function() {
			$scope.classifieds = Classifieds.query();
		};

		$scope.loadAdditionalInfo = function() {
			$scope.categories = Categories.query();
			$scope.families = Families.query();
		};

		// Find existing Classified
		$scope.findOne = function() {
			$scope.classified = Classifieds.get({
				classifiedId: $stateParams.classifiedId
			});
		};

		$scope.$watch('family', function(newVal) {
			if(newVal) $scope.instrumentTypes = InstrumentTypes.;
		});
	}
]);
