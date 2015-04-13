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
