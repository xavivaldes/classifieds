'use strict';

(function() {
	// Instrumenttypes Controller Spec
	describe('Instrumenttypes Controller Tests', function() {
		// Initialize global variables
		var InstrumenttypesController,
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

			// Initialize the Instrumenttypes controller.
			InstrumenttypesController = $controller('InstrumenttypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Instrumenttype object fetched from XHR', inject(function(Instrumenttypes) {
			// Create sample Instrumenttype using the Instrumenttypes service
			var sampleInstrumenttype = new Instrumenttypes({
				name: 'New Instrumenttype'
			});

			// Create a sample Instrumenttypes array that includes the new Instrumenttype
			var sampleInstrumenttypes = [sampleInstrumenttype];

			// Set GET response
			$httpBackend.expectGET('instrumenttypes').respond(sampleInstrumenttypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.instrumenttypes).toEqualData(sampleInstrumenttypes);
		}));

		it('$scope.findOne() should create an array with one Instrumenttype object fetched from XHR using a instrumenttypeId URL parameter', inject(function(Instrumenttypes) {
			// Define a sample Instrumenttype object
			var sampleInstrumenttype = new Instrumenttypes({
				name: 'New Instrumenttype'
			});

			// Set the URL parameter
			$stateParams.instrumenttypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/instrumenttypes\/([0-9a-fA-F]{24})$/).respond(sampleInstrumenttype);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.instrumenttype).toEqualData(sampleInstrumenttype);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Instrumenttypes) {
			// Create a sample Instrumenttype object
			var sampleInstrumenttypePostData = new Instrumenttypes({
				name: 'New Instrumenttype'
			});

			// Create a sample Instrumenttype response
			var sampleInstrumenttypeResponse = new Instrumenttypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Instrumenttype'
			});

			// Fixture mock form input values
			scope.name = 'New Instrumenttype';

			// Set POST response
			$httpBackend.expectPOST('instrumenttypes', sampleInstrumenttypePostData).respond(sampleInstrumenttypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Instrumenttype was created
			expect($location.path()).toBe('/instrumenttypes/' + sampleInstrumenttypeResponse._id);
		}));

		it('$scope.update() should update a valid Instrumenttype', inject(function(Instrumenttypes) {
			// Define a sample Instrumenttype put data
			var sampleInstrumenttypePutData = new Instrumenttypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Instrumenttype'
			});

			// Mock Instrumenttype in scope
			scope.instrumenttype = sampleInstrumenttypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/instrumenttypes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/instrumenttypes/' + sampleInstrumenttypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid instrumenttypeId and remove the Instrumenttype from the scope', inject(function(Instrumenttypes) {
			// Create new Instrumenttype object
			var sampleInstrumenttype = new Instrumenttypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Instrumenttypes array and include the Instrumenttype
			scope.instrumenttypes = [sampleInstrumenttype];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/instrumenttypes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleInstrumenttype);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.instrumenttypes.length).toBe(0);
		}));
	});
}());