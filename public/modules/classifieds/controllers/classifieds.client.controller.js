'use strict';

// Classifieds controller
angular.module('classifieds').controller('ClassifiedsController', ['$q', '$scope', '$upload', '$stateParams', '$location', 'Authentication', 'Classifieds', 'Categories', 'Families', 'InstrumentTypes',
	function ($q, $scope, $upload, $stateParams, $location, Authentication, Classifieds, Categories, Families, InstrumentTypes) {
		$scope.authentication = Authentication;
		$scope.images = [];

		// Create new Classified
		$scope.create = function () {
			// Create new Classified object
			var classified = new Classifieds({
				shortDescription: this.shortDescription,
				longDescription: this.longDescription,
				price: this.price,
				category: this.category,
				family: this.family,
				instrumentType: this.instrumentType,
				pics: $scope.images
			});

			classified.$save(function(response) {
				$location.path('classifieds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Classified
		$scope.remove = function (classified) {
			if (classified) {
				classified.$remove();

				for (var i in $scope.classifieds) {
					if ($scope.classifieds [i] === classified) {
						$scope.classifieds.splice(i, 1);
					}
				}
			} else {
				$scope.classified.$remove(function () {
					$location.path('classifieds');
				});
			}
		};

		// Update existing Classified
		$scope.update = function () {
			var classified = $scope.classified;

			classified.$update(function () {
				$location.path('classifieds/' + classified._id);
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Classifieds
		$scope.find = function () {
			$scope.classifieds = Classifieds.query();
		};

		$scope.loadAdditionalInfo = function () {
			$scope.categories = Categories.query();
			$scope.families = Families.query();
		};

		// Find existing Classified
		$scope.findOne = function () {
			$scope.classified = Classifieds.get({
				classifiedId: $stateParams.classifiedId
			});
			$scope.loadAdditionalInfo();
		};

		/*
		 $scope.$watch('classified.pic', function () {
		 if ($scope.classified.pic && document.getElementById('image-preview')) {
		 document.getElementById('image-preview').innerHTML = '<img class="img-responsive" src="data:' + $scope.classified.pic.contentType + ';base64,' + $scope.classified.pic.data + '"/>';
		 }
		 });
		 */

		$scope.$watch('family', function (newVal) {
			if (newVal) $scope.instrumentTypes = InstrumentTypes.query({family: newVal});
		});

		$scope.$watch('classified.family', function (newVal) {
			if (newVal) $scope.instrumentTypes = InstrumentTypes.query({family: newVal});
		});

		$scope.$watch('files', function () {
			if ($scope.files && $scope.files.length > 0) {

				for (var i in $scope.files) {
					new ImageResizer().resize($scope.files[i], function (imageUrl) {
						//$scope.images.push(imageUrl);
						$scope.images[0] = imageUrl;
						$scope.$apply();
					});
				}
			}
		});
	}
]);
