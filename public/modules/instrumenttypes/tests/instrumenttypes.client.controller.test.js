'use strict';

(function() {
	// InstrumentTypes Controller Spec
	describe('InstrumentTypes Controller Tests', function() {
		// Initialize global variables
		var InstrumentTypesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the InstrumentTypes controller.
			InstrumentTypesController = $controller('InstrumentTypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one InstrumentType object fetched from XHR', inject(function(InstrumentTypes) {
			// Create sample InstrumentType using the InstrumentTypes service
			var sampleInstrumentType = new InstrumentTypes({
				name: 'New InstrumentType'
			});

			// Create a sample InstrumentTypes array that includes the new InstrumentType
			var sampleInstrumentTypes = [sampleInstrumentType];

			// Set GET response
			$httpBackend.expectGET('instrumentTypes').respond(sampleInstrumentTypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.instrumentTypes).toEqualData(sampleInstrumentTypes);
		}));

		it('$scope.findOne() should create an array with one InstrumentType object fetched from XHR using a instrumentTypeId URL parameter', inject(function(InstrumentTypes) {
			// Define a sample InstrumentType object
			var sampleInstrumentType = new InstrumentTypes({
				name: 'New InstrumentType'
			});

			// Set the URL parameter
			$stateParams.instrumentTypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/instrumentTypes\/([0-9a-fA-F]{24})$/).respond(sampleInstrumentType);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.instrumentType).toEqualData(sampleInstrumentType);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(InstrumentTypes) {
			// Create a sample InstrumentType object
			var sampleInstrumentTypePostData = new InstrumentTypes({
				name: 'New InstrumentType'
			});

			// Create a sample InstrumentType response
			var sampleInstrumentTypeResponse = new InstrumentTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New InstrumentType'
			});

			// Fixture mock form input values
			scope.name = 'New InstrumentType';

			// Set POST response
			$httpBackend.expectPOST('instrumentTypes', sampleInstrumentTypePostData).respond(sampleInstrumentTypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the InstrumentType was created
			expect($location.path()).toBe('/instrumentTypes/' + sampleInstrumentTypeResponse._id);
		}));

		it('$scope.update() should update a valid InstrumentType', inject(function(InstrumentTypes) {
			// Define a sample InstrumentType put data
			var sampleInstrumentTypePutData = new InstrumentTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New InstrumentType'
			});

			// Mock InstrumentType in scope
			scope.instrumentType = sampleInstrumentTypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/instrumentTypes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/instrumentTypes/' + sampleInstrumentTypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid instrumentTypeId and remove the InstrumentType from the scope', inject(function(InstrumentTypes) {
			// Create new InstrumentType object
			var sampleInstrumentType = new InstrumentTypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new InstrumentTypes array and include the InstrumentType
			scope.instrumentTypes = [sampleInstrumentType];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/instrumentTypes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleInstrumentType);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.instrumentTypes.length).toBe(0);
		}));
	});
}());
