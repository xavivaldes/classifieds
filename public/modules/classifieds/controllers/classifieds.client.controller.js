'use strict';

// Classifieds controller
angular.module('classifieds').controller('ClassifiedsController', ['$scope', '$upload', '$stateParams', '$location', 'Authentication', 'Classifieds', 'Categories', 'Families', 'InstrumentTypes',
	function ($scope, $upload, $stateParams, $location, Authentication, Classifieds, Categories, Families, InstrumentTypes) {
		$scope.authentication = Authentication;

		$scope.sendFile = function (classifiedId) {
			var file = $scope.files[0];
			console.log(file);
			$scope.upload = $upload.upload({
				url: 'classifieds/pic', //upload.php script, node.js route, or servlet url
				//method: 'POST' or 'PUT',
				//headers: {'header-key': 'header-value'},
				//withCredentials: true,
				data: {classified: classifiedId},
				file: file // or list of files ($files) for html5 only
				//fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
				// customize file formData name ('Content-Desposition'), server side file variable name.
				//fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
				// customize how data is added to formData. See #40#issuecomment-28612000 for sample code
				//formDataAppender: function(formData, key, val){}
			}).progress(function (evt) {
				console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
			}).success(function (data, status, headers, config) {
				// file is uploaded successfully
				console.log(data);
			});
		};

		$scope.sendClassified = function (classified) {
			var file = $scope.files[0];
			console.log(file);
			$scope.upload = $upload.upload({
				url: 'classifieds', //upload.php script, node.js route, or servlet url
				//method: 'POST' or 'PUT',
				//headers: {'header-key': 'header-value'},
				//withCredentials: true,
				data: {classified: classified},
				file: file // or list of files ($files) for html5 only
				//fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
				// customize file formData name ('Content-Desposition'), server side file variable name.
				//fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
				// customize how data is added to formData. See #40#issuecomment-28612000 for sample code
				//formDataAppender: function(formData, key, val){}
			}).progress(function (evt) {
				console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
			}).success(function (data, status, headers, config) {
				// file is uploaded successfully
				console.log(data);
			});
		};

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
				pics: this.pics,
				files: this.files
			});

			$scope.sendClassified(classified);

			// Redirect after save
			/*
			classified.$save(function (response) {

				$scope.sendFile(response._id);

				$location.path('classifieds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			*/
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
		};

		$scope.$watch('family', function (newVal) {
			if (newVal) $scope.instrumentTypes = InstrumentTypes.query({family: newVal});
		});

		$scope.$watch('pics', function (newVal) {
			console.log('pics changed: ' + newVal ? newVal[0] : 'nothing');
		});

		$scope.$watch('files', function (newVal) {
			var files = $scope.files;
			//for (var i = 0; i < files.length; i++) {
				//$scope.sendFile();
			//}
		});
	}
]);
