'use strict';


angular.module('buzzbands_client.UserControllers', ['ui.router', 'ngMorph'])

angular.module('buzzbands_client.UserControllers', ['ui.router','ngMorph'])




.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('authenticate', {
    templateUrl: 'app/views/landing/index.html',
    controller: 'UserAuthController'
  })
  .state('register', {
    url: '/register',
    templateUrl: 'app/views/auth/signup.html',
    controller: 'UserAuthController'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'app/views/auth/login.html',
    controller: 'UserAuthController'
  });
}])

.controller('UserAuthController', ['$scope', '$rootScope', '$auth', '$sessionStorage', '$state',
	function ($scope, $rootScope, $auth, $sessionStorage, $state) {

    $scope.settings = {
       closeEl: '.close',
       modal: {
         templateUrl: 'app/views/auth/login.html',
         position: {
          top: '30%',
          left: '20%'
         },
         fade: false
       }
     }

		$scope.$session = $sessionStorage;
    $scope.$session.signedIn = $auth.validateUser();

    $scope.signInSettings = {
           closeEl: '.close',
           modal: {
             templateUrl: 'app/views/auth/login.html',
             position: {
              top: '30%',
           
             },
             fade: true
           }
         };

     $scope.signUpSettings = {
            closeEl: '.close',
            modal: {
              templateUrl: 'app/views/auth/register.html',
              position: {
               top: '30%',
              
              },
              fade: true
            }
          };

    if($scope.$session.signedIn === true){
        $state.go("dashboard");
    }

		$scope.register = function(isValid){
			var credentials = {
				email: $scope.registrationForm.email,
				password: $scope.registrationForm.password,
				password_confirmation: $scope.registrationForm.confirmation_password
			};

			if(isValid){
				$auth.submitRegistration(credentials).then(function(registeredUser) {
          $scope.$session.user = registeredUser;
          $scope.$session.user.signedIn = $auth.validateUser();
					$scope.successfulRegistration = true;
					//show some sort of statement that indicates they are welcome to enjoy
				}, function(error) {
					alert("Something went wrong during registration. Womp womp");
				});

				$scope.$on('auth:registration-email-success', function(event, user) {
					$rootScope.$broadcast('userRegistered', user);
					$scope.registrationForm={}
					$scope.userRegistration.$submitted = false;
          $state.go('dashboard')
				});
			}
		}

    $scope.logout = function(user){
			$auth.signOut()
			$scope.$on('auth:logout-success', function(event, oldCurrentUser) {
				$('#editProfileForm').hide();
				delete $scope.$session.user;
			});

			$scope.$on('auth:logout-error', function(event, reason){
				delete $scope.$session.user;
				console.log("There was an error signing you out. REASON :: "+reason);
			})
		}

    /**
    * @param loginForm {User}
    */
    $scope.signIn = function(loginForm){
			var credentials = {
				email: $scope.loginForm.email,
				password: $scope.loginForm.password
			};

			//Authenticate with user credentials
			$auth.submitLogin(credentials).then(function(response) {
				//$scope.$session.user = response.data;
				console.log(response.data)
				console.log($scope.$session.user); // => {id: 1, ect: '...'}
			}, function(error) {
				alert("Failed to log in");
			});

			$scope.$on('auth:login-success', function(event, currentUser) {
				$scope.$session.user = currentUser;
				$auth.validateUser();
        $state.go('analytics.dashboard');
			});

			$scope.$on('auth:login-error', function(event, currentUser) {
				alert("Error logging in");
			});
		}
	}
]);
