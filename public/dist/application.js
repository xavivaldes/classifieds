'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('categories');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('classifieds');

function removeElement(parentId, elementId) {
	document.getElementById(parentId).removeChild(elementId);
}

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('families');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('instrumentTypes');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('searches');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('subcategories');

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('categories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Categories', 'categories', 'dropdown', '/categories(/create)?');
		Menus.addSubMenuItem('topbar', 'categories', 'List Categories', 'categories');
		Menus.addSubMenuItem('topbar', 'categories', 'New Category', 'categories/create');
	}
]);
'use strict';

//Setting up route
angular.module('categories').config(['$stateProvider',
	function($stateProvider) {
		// Categories state routing
		$stateProvider.
		state('listCategories', {
			url: '/categories',
			templateUrl: 'modules/categories/views/list-categories.client.view.html'
		}).
		state('createCategory', {
			url: '/categories/create',
			templateUrl: 'modules/categories/views/create-category.client.view.html'
		}).
		state('viewCategory', {
			url: '/categories/:categoryId',
			templateUrl: 'modules/categories/views/view-category.client.view.html'
		}).
		state('editCategory', {
			url: '/categories/:categoryId/edit',
			templateUrl: 'modules/categories/views/edit-category.client.view.html'
		});
	}
]);
'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories',
	function($scope, $stateParams, $location, Authentication, Categories) {
		$scope.authentication = Authentication;

		// Create new Category
		$scope.create = function() {
			// Create new Category object
			var category = new Categories ({
				name: this.name
			});

			// Redirect after save
			category.$save(function(response) {
				$location.path('categories/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Category
		$scope.remove = function(category) {
			if ( category ) { 
				category.$remove();

				for (var i in $scope.categories) {
					if ($scope.categories [i] === category) {
						$scope.categories.splice(i, 1);
					}
				}
			} else {
				$scope.category.$remove(function() {
					$location.path('categories');
				});
			}
		};

		// Update existing Category
		$scope.update = function() {
			var category = $scope.category;

			category.$update(function() {
				$location.path('categories/' + category._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Categories
		$scope.find = function() {
			$scope.categories = Categories.query();
		};

		// Find existing Category
		$scope.findOne = function() {
			$scope.category = Categories.get({ 
				categoryId: $stateParams.categoryId
			});
		};
	}
]);
'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('categories').factory('Categories', ['$resource',
	function($resource) {
		return $resource('categories/:categoryId', { categoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('classifieds').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Classifieds', 'classifieds', 'dropdown', '/classifieds(/create)?');
		Menus.addSubMenuItem('topbar', 'classifieds', 'List Classifieds', 'classifieds');
		Menus.addSubMenuItem('topbar', 'classifieds', 'New Classified', 'classifieds/create');
	}
]);
'use strict';

//Setting up route
angular.module('classifieds').config(['$stateProvider',
	function($stateProvider) {
		// Classifieds state routing
		$stateProvider.
		state('listClassifieds', {
			url: '/classifieds',
			templateUrl: 'modules/classifieds/views/list-classifieds.client.view.html'
		}).
		state('createClassified', {
			url: '/classifieds/create',
			templateUrl: 'modules/classifieds/views/create-classified.client.view.html'
		}).
		state('viewClassified', {
			url: '/classifieds/:classifiedId',
			templateUrl: 'modules/classifieds/views/view-classified.client.view.html'
		}).
		state('editClassified', {
			url: '/classifieds/:classifiedId/edit',
			templateUrl: 'modules/classifieds/views/edit-classified.client.view.html'
		});
	}
]);
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

'use strict';

//Classifieds service used to communicate Classifieds REST endpoints
angular.module('classifieds').factory('Classifieds', ['$resource',
	function($resource) {
		return $resource('classifieds/:classifiedId', { classifiedId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
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

function forceMasonry() {
	var width = getWindowWidth();
	/* Small devices (tablets, 768px and up) */
	/* Medium devices (desktops, 992px and up) */
	/* Large devices (large desktops, 1200px and up) */
	if (width >= MAX_WIDTH) {
		setWidth(205);
	} else if (width >= MED_WIDTH) {
		setWidth(165);
	} else if (width >= MIN_WIDTH) {
		setWidth(150);
	} else {
		setWidth(150);
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

function executeMasonry() {
	setTimeout(function () {
		if (Math.abs(getWindowWidth() - oldWidth) > 10) {
			forceMasonry();
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
			elem.parents('.masonry').imagesLoaded(forceMasonry);
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


$( "#slider-range" ).slider({
	range: true,
	min: 0,
	max: 500,
	values: [ 75, 300 ],
	slide: function( event, ui ) {  $( "#amount" ).val( "$" + ui.values[ 0 ] + " -   $" + ui.values[ 1 ] );
	}
});
$( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) + " - $" + $(  "#slider-range" ).slider( "values", 1 ) );

function ImageResizer(maxWidth, maxHeight) {
	this.maxWidth = maxWidth || 555;
	this.maxHeight = maxHeight || 555;

	this.createImage = function (url, callback) {
		var image = new Image();
		image.onload = function () {
			callback(image);
		};
		image.src = url;
	};

	this.changeImage = function (origImage, callback) {
		resizeArea = document.createElement('canvas');
		resizeArea.style.visibility = 'hidden';

		var ctx = resizeArea.getContext("2d");

		var maxWidth = this.maxWidth;
		var maxHeight = this.maxHeight;

		this.createImage(origImage.url, function (image) {
			var height = image.height;
			var width = image.width;

			// calculate the width and height, constraining the proportions
			if (width > height) {
				if (width > maxWidth) {
					height = Math.round(height * maxWidth / width);
					width = maxWidth;
				}
			} else {
				if (height > maxHeight) {
					width = Math.round(width * maxHeight / height);
					height = maxHeight;
				}
			}

			resizeArea.width = width;
			resizeArea.height = height;

			ctx.drawImage(image, 0, 0, width, height);
			callback(resizeArea.toDataURL('image/png', 0.7));
		});
	};

	this.resize = function (file, callback) {
		var fileReader = new FileReader();

		var imageResult = {
			file: file,
			url: URL.createObjectURL(file)
		};

		var resizer = this;

		fileReader.onload = function (fileLoadedEvent) {
			var deferred = new $.Deferred();
			deferred.resolve(fileLoadedEvent.target.result);
			deferred.promise().then(function (imgUrl) {
				imageResult.dataURL = imgUrl;
				resizer.changeImage(imageResult, callback);
			});
		};
		fileReader.readAsDataURL(file);
	};
}

function renderNavbar() {
	var dynbar = $("#dynbar");
	var arrow = $(".arrow");
	var st = $(window).scrollTop();
	var max = $('.parallax').height();

	if (st > max - 100) {
		showNavbar(true);
	} else {
		showNavbar(false);
	}
	if (st > 20) {
		arrow.css({'opacity': 0});
	} else {
		arrow.css({'opacity': 1});
	}
}

function showNavbar(show) {
	if (show) {
		$("#dynbar").addClass("navbar-solid");
	} else {
		$("#dynbar").removeClass("navbar-solid");
	}
}

window.onscroll = renderNavbar;

/*
$(window).load(function() {
 	$('.container:not(:has(.parallax))').removeClass("container-parallax");
});
*/

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('families').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Families', 'families', 'dropdown', '/families(/create)?');
		Menus.addSubMenuItem('topbar', 'families', 'List Families', 'families');
		Menus.addSubMenuItem('topbar', 'families', 'New Family', 'families/create');
	}
]);
'use strict';

//Setting up route
angular.module('families').config(['$stateProvider',
	function($stateProvider) {
		// Families state routing
		$stateProvider.
		state('listFamilies', {
			url: '/families',
			templateUrl: 'modules/families/views/list-families.client.view.html'
		}).
		state('createFamily', {
			url: '/families/create',
			templateUrl: 'modules/families/views/create-family.client.view.html'
		}).
		state('viewFamily', {
			url: '/families/:familyId',
			templateUrl: 'modules/families/views/view-family.client.view.html'
		}).
		state('editFamily', {
			url: '/families/:familyId/edit',
			templateUrl: 'modules/families/views/edit-family.client.view.html'
		});
	}
]);
'use strict';

// Families controller
angular.module('families').controller('FamiliesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Families',
	function($scope, $stateParams, $location, Authentication, Families) {
		$scope.authentication = Authentication;

		// Create new Family
		$scope.create = function() {
			// Create new Family object
			var family = new Families ({
				name: this.name
			});

			// Redirect after save
			family.$save(function(response) {
				$location.path('families/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Family
		$scope.remove = function(family) {
			if ( family ) { 
				family.$remove();

				for (var i in $scope.families) {
					if ($scope.families [i] === family) {
						$scope.families.splice(i, 1);
					}
				}
			} else {
				$scope.family.$remove(function() {
					$location.path('families');
				});
			}
		};

		// Update existing Family
		$scope.update = function() {
			var family = $scope.family;

			family.$update(function() {
				$location.path('families/' + family._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Families
		$scope.find = function() {
			$scope.families = Families.query();
		};

		// Find existing Family
		$scope.findOne = function() {
			$scope.family = Families.get({ 
				familyId: $stateParams.familyId
			});
		};
	}
]);
'use strict';

//Families service used to communicate Families REST endpoints
angular.module('families').factory('Families', ['$resource',
	function($resource) {
		return $resource('families/:familyId', { familyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('instrumentTypes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'InstrumentTypes', 'instrumentTypes', 'dropdown', '/instrumentTypes(/create)?');
		Menus.addSubMenuItem('topbar', 'instrumentTypes', 'List InstrumentTypes', 'instrumentTypes');
		Menus.addSubMenuItem('topbar', 'instrumentTypes', 'New InstrumentType', 'instrumentTypes/create');
	}
]);

'use strict';

//Setting up route
angular.module('instrumentTypes').config(['$stateProvider',
	function($stateProvider) {
		// InstrumentTypes state routing
		$stateProvider.
		state('listInstrumentTypes', {
			url: '/instrumentTypes',
			templateUrl: 'modules/instrumentTypes/views/list-instrumentTypes.client.view.html'
		}).
		state('createInstrumentType', {
			url: '/instrumentTypes/create',
			templateUrl: 'modules/instrumentTypes/views/create-instrumentType.client.view.html'
		}).
		state('viewInstrumentType', {
			url: '/instrumentTypes/:instrumentTypeId',
			templateUrl: 'modules/instrumentTypes/views/view-instrumentType.client.view.html'
		}).
		state('editInstrumentType', {
			url: '/instrumentTypes/:instrumentTypeId/edit',
			templateUrl: 'modules/instrumentTypes/views/edit-instrumentType.client.view.html'
		});
	}
]);

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

'use strict';

//Setting up route
angular.module('searches').config(['$stateProvider',
	function($stateProvider) {
		// Searches state routing
		$stateProvider.
		state('listSearches', {
			url: '/searches',
			templateUrl: 'modules/searches/views/view-search.client.view.html'
		}).
		state('createSearch', {
			url: '/searches/create',
			templateUrl: 'modules/searches/views/create-search.client.view.html'
		}).
		state('viewSearch', {
			url: '/searches/:searchId',
			templateUrl: 'modules/searches/views/view-search.client.view.html'
		}).
		state('editSearch', {
			url: '/searches/:searchId/edit',
			templateUrl: 'modules/searches/views/edit-search.client.view.html'
		});
	}
]);

'use strict';

// Searches controller
angular.module('searches').controller('SearchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Searches',
	function($scope, $stateParams, $location, Authentication, Searches) {
		$scope.authentication = Authentication;

		// Create new Search
		$scope.create = function() {
			// Create new Search object
			var search = new Searches ({
				name: this.name
			});

			// Redirect after save
			search.$save(function(response) {
				$location.path('searches/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Search
		$scope.remove = function(search) {
			if ( search ) { 
				search.$remove();

				for (var i in $scope.searches) {
					if ($scope.searches [i] === search) {
						$scope.searches.splice(i, 1);
					}
				}
			} else {
				$scope.search.$remove(function() {
					$location.path('searches');
				});
			}
		};

		// Update existing Search
		$scope.update = function() {
			var search = $scope.search;

			search.$update(function() {
				$location.path('searches/' + search._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Searches
		$scope.find = function() {
			$scope.searches = Searches.query();
		};

		// Find existing Search
		$scope.findOne = function() {
			$scope.search = Searches.get({ 
				searchId: $stateParams.searchId
			});
		};
	}
]);
'use strict';

//Searches service used to communicate Searches REST endpoints
angular.module('searches').factory('Searches', ['$resource',
	function($resource) {
		return $resource('searches/:searchId', { searchId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('subcategories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Subcategories', 'subcategories', 'dropdown', '/subcategories(/create)?');
		Menus.addSubMenuItem('topbar', 'subcategories', 'List Subcategories', 'subcategories');
		Menus.addSubMenuItem('topbar', 'subcategories', 'New Subcategory', 'subcategories/create');
	}
]);
'use strict';

//Setting up route
angular.module('subcategories').config(['$stateProvider',
	function($stateProvider) {
		// Subcategories state routing
		$stateProvider.
		state('listSubcategories', {
			url: '/subcategories',
			templateUrl: 'modules/subcategories/views/list-subcategories.client.view.html'
		}).
		state('createSubcategory', {
			url: '/subcategories/create',
			templateUrl: 'modules/subcategories/views/create-subcategory.client.view.html'
		}).
		state('viewSubcategory', {
			url: '/subcategories/:subcategoryId',
			templateUrl: 'modules/subcategories/views/view-subcategory.client.view.html'
		}).
		state('editSubcategory', {
			url: '/subcategories/:subcategoryId/edit',
			templateUrl: 'modules/subcategories/views/edit-subcategory.client.view.html'
		});
	}
]);
'use strict';

// Subcategories controller
angular.module('subcategories').controller('SubcategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Subcategories', 'Categories',
	function($scope, $stateParams, $location, Authentication, Subcategories, Categories) {
		$scope.authentication = Authentication;

		// Create new Subcategory
		$scope.create = function() {
			// Create new Subcategory object
			var subcategory = new Subcategories ({
				name: this.name,
				category: this.category
			});

			// Redirect after save
			subcategory.$save(function(response) {
				$location.path('subcategories/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Subcategory
		$scope.remove = function(subcategory) {
			if ( subcategory ) {
				subcategory.$remove();

				for (var i in $scope.subcategories) {
					if ($scope.subcategories [i] === subcategory) {
						$scope.subcategories.splice(i, 1);
					}
				}
			} else {
				$scope.subcategory.$remove(function() {
					$location.path('subcategories');
				});
			}
		};

		// Update existing Subcategory
		$scope.update = function() {
			var subcategory = $scope.subcategory;

			subcategory.$update(function() {
				$location.path('subcategories/' + subcategory._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Subcategories
		$scope.find = function() {
			$scope.subcategories = Subcategories.query();
		};

		$scope.loadAdditionalInfo = function() {
			$scope.categories = Categories.query();
		};

		// Find existing Subcategory
		$scope.findOne = function() {
			$scope.subcategory = Subcategories.get({
				subcategoryId: $stateParams.subcategoryId
			});
			this.loadAdditionalInfo();
		};
	}
]);

'use strict';

//Subcategories service used to communicate Subcategories REST endpoints
angular.module('subcategories').factory('Subcategories', ['$resource',
	function($resource) {
		return $resource('subcategories/:subcategoryId', { subcategoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window', function($window) {
	var auth = {
		user: $window.user
	};
	
	return auth;
}]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);