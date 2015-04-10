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