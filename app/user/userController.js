'use strict';

angular.module('buzzbands_client.UserControllers', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('register', {
    url: '/register',
    templateUrl: 'app/user/signup.html',
    controller: 'UserRegisterController'
  });
}])

.controller('UserRegisterController', ['$scope', '$rootScope', '$auth', '$sessionStorage',
	function ($scope, $rootScope, $auth, $sessionStorage ) {
		$scope.$session = $sessionStorage;

		$scope.register = function(isValid){
			var credentials = {
				email: $scope.registrationForm.email,
				password: $scope.registrationForm.password,
				password_confirmation: $scope.registrationForm.confirmation_password
			};

			if(isValid){
				$auth.submitRegistration(credentials).then(function(registeredUser) {
					$auth.validateUser();
					$scope.successfulRegistration = true;
					//show some sort of statement that indicates they are welcome to enjoy
				}, function(error) {
					alert("Something went wrong during registration. Womp womp");
				});

				$scope.$on('auth:registration-email-success', function(event, user) {
					$rootScope.$broadcast('userRegistered', user);
					$scope.registrationForm={}
					$scope.userRegistration.$submitted = false;
				});
			}
		}
	}
]);
