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