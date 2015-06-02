'use strict';

var oldWidth = 0;

var MAX_WIDTH = 1200;
var MED_WIDTH = 992;
var MIN_WIDTH = 768;

function getContainerWidth() {
	var winWidth = getWindowWidth();
	if (winWidth >= MAX_WIDTH) return 1170;
	if (winWidth >= MED_WIDTH) return 970;
	if (winWidth >= MIN_WIDTH) return 750;
	return winWidth;
}

function getWindowWidth() {
	return $(window).width();
}

function calcGutter() {
	var width = getContainerWidth();
	console.log('gutter: ' + Math.round(width * 0.02));
	return Math.round(width * 0.02);
}

function executeMasonry() {
	setTimeout(function () {
		var width = getWindowWidth();
		var gutter = 0;
		if (Math.abs(getWindowWidth() - oldWidth) > 10) {
			/* Small devices (tablets, 768px and up) */
			/* Medium devices (desktops, 992px and up) */
			/* Large devices (large desktops, 1200px and up) */
			if (width >= MAX_WIDTH) {
				setWidth(205);
				gutter = 20;
			} else if (width >= MED_WIDTH) {
				setWidth(165);
				gutter = 20;
			} else if (width >= MIN_WIDTH) {
				setWidth(150);
				gutter = 15;
			} else {
				setWidth(150);
				gutter = 10;
			}
			var container = document.querySelector('.masonry');
			imagesLoaded(container, function () {
				setTimeout(function () {
					new Masonry(container, {
						columnWidth: ".item",
						itemSelector: ".item",
						isFitWidth: true,
						gutter: calcGutter()
					});
				}, 0);
			});
			oldWidth = getWindowWidth();
		}
	});
}

function setNumOfCols(cols) {
	var width = getContainerWidth();
	//alert(cols + ',' + width);
	var imgWidth = Math.max(Math.round(width / cols - calcGutter() * 2), 120);
	console.log('cols: ' + cols + ' imgW: ' + imgWidth + ' contW: ' + width);
	setWidth(imgWidth);
}

function setWidth(width) {
	$('.item').css('min-width', width + 'px');
	$('.item').css('max-width', width + 'px');
	$('.item > img').css('max-width', width + 'px');
	$('.item > img').css('min-width', width + 'px');
}

$(window).resize(executeMasonry);

angular.module('core').controller('HomeController', ['$scope', '$rootScope', 'Authentication', 'Classifieds', 'Categories', 'Families', 'InstrumentTypes',
	function ($scope, $rootScope, Authentication, Classifieds, Categories, Families, InstrumentTypes) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.loadAdditionalInfo = function () {
			$scope.classifieds = Classifieds.query();
			$scope.categories = Categories.query();
			$scope.families = Families.query();
		};

		$scope.$watch('filter.family', function (newVal) {
			if (newVal) {
				$scope.instrumentTypes = InstrumentTypes.query({family: newVal});
			} else {
				delete $scope.instrumentType;
			}
		});

		$scope.search = function () {
			$scope.classifieds = Classifieds.query($scope.filter);
		};

		$rootScope.$on('$stateChangeStart',
			function (event, toState, toParams, fromState, fromParams) {
				showNavbar(toState.name != 'home');
				/*
				if (toState.name !== 'login' && !UsersService.getCurrentUser()) {
					event.preventDefault();
					$state.go('login');
				}
				*/
			});
	}
]).directive('masonryitem', function () {
	return {
		restrict: 'AC',
		link: function (scope, elem) {
			elem.parents('.masonry').imagesLoaded(executeMasonry);
		}
	};
}).directive('ngReallyClick', [function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.bind('click', function () {
				var message = attrs.ngReallyMessage;
				if (message && confirm(message)) {
					scope.$apply(attrs.ngReallyClick);
				}
			});
		}
	}
}]).directive('uiSlider', [function (uiSliderConfig) {
	uiSliderConfig = {};
	return {
		require: 'ngModel',
		compile: function () {
			return function (scope, elm, attrs, ngModel) {

				function parseNumber(n, decimals) {
					return (decimals) ? parseFloat(n) : parseInt(n);
				};

				var options = angular.extend(scope.$eval(attrs.uiSlider) || {}, uiSliderConfig);
				// Object holding range values
				var prevRangeValues = {
					min: null,
					max: null
				};

				// convenience properties
				var properties = ['min', 'max', 'step'];
				var useDecimals = (!angular.isUndefined(attrs.useDecimals)) ? true : false;

				var init = function () {
					// When ngModel is assigned an array of values then range is expected to be true.
					// Warn user and change range to true else an error occurs when trying to drag handle
					if (angular.isArray(ngModel.$viewValue) && options.range !== true) {
						console.warn('Change your range option of ui-slider. When assigning ngModel an array of values then the range option should be set to true.');
						options.range = true;
					}

					// Ensure the convenience properties are passed as options if they're defined
					// This avoids init ordering issues where the slider's initial state (eg handle
					// position) is calculated using widget defaults
					// Note the properties take precedence over any duplicates in options
					angular.forEach(properties, function (property) {
						if (angular.isDefined(attrs[property])) {
							options[property] = parseNumber(attrs[property], useDecimals);
						}
					});

					elm.slider(options);
					init = angular.noop;
				};

				// Find out if decimals are to be used for slider
				angular.forEach(properties, function (property) {
					// support {{}} and watch for updates
					attrs.$observe(property, function (newVal) {
						if (!!newVal) {
							init();
							elm.slider('option', property, parseNumber(newVal, useDecimals));
							ngModel.$render();
						}
					});
				});
				attrs.$observe('disabled', function (newVal) {
					init();
					elm.slider('option', 'disabled', !!newVal);
				});

				// Watch ui-slider (byVal) for changes and update
				scope.$watch(attrs.uiSlider, function (newVal) {
					init();
					if (newVal != undefined) {
						elm.slider('option', newVal);
					}
				}, true);

				// Late-bind to prevent compiler clobbering
				setTimeout(init, 0);

				// Update model value from slider
				elm.bind('slide', function (event, ui) {
					ngModel.$setViewValue(ui.values || ui.value);
					scope.$apply();
				});

				// Update slider from model value
				ngModel.$render = function () {
					init();
					var method = options.range === true ? 'values' : 'value';

					if (!options.range && isNaN(ngModel.$viewValue) && !(ngModel.$viewValue instanceof Array)) {
						ngModel.$viewValue = 0;
					}
					else if (options.range && !angular.isDefined(ngModel.$viewValue)) {
						ngModel.$viewValue = [0, 0];
					}

					// Do some sanity check of range values
					if (options.range === true) {

						// Check outer bounds for min and max values
						if (angular.isDefined(options.min) && options.min > ngModel.$viewValue[0]) {
							ngModel.$viewValue[0] = options.min;
						}
						if (angular.isDefined(options.max) && options.max < ngModel.$viewValue[1]) {
							ngModel.$viewValue[1] = options.max;
						}

						// Check min and max range values
						if (ngModel.$viewValue[0] > ngModel.$viewValue[1]) {
							// Min value should be less to equal to max value
							if (prevRangeValues.min >= ngModel.$viewValue[1])
								ngModel.$viewValue[0] = prevRangeValues.min;
							// Max value should be less to equal to min value
							if (prevRangeValues.max <= ngModel.$viewValue[0])
								ngModel.$viewValue[1] = prevRangeValues.max;
						}

						// Store values for later user
						prevRangeValues.min = ngModel.$viewValue[0];
						prevRangeValues.max = ngModel.$viewValue[1];

					}
					elm.slider(method, ngModel.$viewValue);
				};

				scope.$watch(attrs.ngModel, function () {
					if (options.range === true) {
						ngModel.$render();
					}
				}, true);

				function destroy() {
					elm.slider('destroy');
				}

				elm.bind('$destroy', destroy);
			};
		}
	};
}]);
