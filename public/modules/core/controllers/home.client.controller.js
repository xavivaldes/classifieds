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
	setTimeout(function() {
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

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Classifieds',
	function ($scope, Authentication, Classifieds) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.loadAdditionalInfo = function () {
			$scope.classifieds = Classifieds.query();
			console.log($scope.classifieds);
		};
	}
]).directive('masonryitem', function () {
	return {
		restrict: 'AC',
		link: function (scope, elem) {
			elem.parents('.masonry').imagesLoaded(executeMasonry);
		}
	};
}).directive('ngReallyClick', [function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				var message = attrs.ngReallyMessage;
				if (message && confirm(message)) {
					scope.$apply(attrs.ngReallyClick);
				}
			});
		}
	}
}]);
