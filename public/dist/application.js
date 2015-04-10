'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils'];

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

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('articles');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('categories');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('classifieds');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('families');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('instrumenttypes');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('subcategories');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		// Create new Article
		$scope.create = function() {
			// Create new Article object
			var article = new Articles({
				title: this.title,
				content: this.content
			});

			// Redirect after save
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Article
		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		// Update existing Article
		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Articles
		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		// Find existing Article
		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
angular.module('classifieds').controller('ClassifiedsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Classifieds',
	function($scope, $stateParams, $location, Authentication, Classifieds) {
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

		// Find existing Classified
		$scope.findOne = function() {
			$scope.classified = Classifieds.get({ 
				classifiedId: $stateParams.classifiedId
			});
		};
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


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
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
angular.module('instrumenttypes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Instrumenttypes', 'instrumenttypes', 'dropdown', '/instrumenttypes(/create)?');
		Menus.addSubMenuItem('topbar', 'instrumenttypes', 'List Instrumenttypes', 'instrumenttypes');
		Menus.addSubMenuItem('topbar', 'instrumenttypes', 'New Instrumenttype', 'instrumenttypes/create');
	}
]);
'use strict';

//Setting up route
angular.module('instrumenttypes').config(['$stateProvider',
	function($stateProvider) {
		// Instrumenttypes state routing
		$stateProvider.
		state('listInstrumenttypes', {
			url: '/instrumenttypes',
			templateUrl: 'modules/instrumenttypes/views/list-instrumenttypes.client.view.html'
		}).
		state('createInstrumenttype', {
			url: '/instrumenttypes/create',
			templateUrl: 'modules/instrumenttypes/views/create-instrumenttype.client.view.html'
		}).
		state('viewInstrumenttype', {
			url: '/instrumenttypes/:instrumenttypeId',
			templateUrl: 'modules/instrumenttypes/views/view-instrumenttype.client.view.html'
		}).
		state('editInstrumenttype', {
			url: '/instrumenttypes/:instrumenttypeId/edit',
			templateUrl: 'modules/instrumenttypes/views/edit-instrumenttype.client.view.html'
		});
	}
]);
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
'use strict';

//Instrumenttypes service used to communicate Instrumenttypes REST endpoints
angular.module('instrumenttypes').factory('Instrumenttypes', ['$resource',
	function($resource) {
		return $resource('instrumenttypes/:instrumenttypeId', { instrumenttypeId: '@_id'
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
angular.module('subcategories').controller('SubcategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Subcategories',
	function($scope, $stateParams, $location, Authentication, Subcategories) {
		$scope.authentication = Authentication;

		// Create new Subcategory
		$scope.create = function() {
			// Create new Subcategory object
			var subcategory = new Subcategories ({
				name: this.name
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

		// Find existing Subcategory
		$scope.findOne = function() {
			$scope.subcategory = Subcategories.get({ 
				subcategoryId: $stateParams.subcategoryId
			});
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