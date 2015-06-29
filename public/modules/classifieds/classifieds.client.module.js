'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('classifieds');

function removeElement(parentId, elementId) {
	document.getElementById(parentId).removeChild(elementId);
}
