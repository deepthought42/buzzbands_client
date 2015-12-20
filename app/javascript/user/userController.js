'use strict';

angular.module('buzzbands.UserControllers', ['ui.router','ngMorph','buzzbands.UserServices'])
.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('authenticate', {
    url: '/authenticate',
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
.controller('UserIndexController', ['$scope', '$rootScope', '$auth',
                                   '$sessionStorage', '$state', 'User', 'Role',
	function ($scope, $rootScope, $auth, $sessionStorage, state, User, Role) {
    $scope.$session = $sessionStorage;
    $scope.roles = Role;
    $scope.getUserList = function(){
      User.query().$promise
        .then(function(data){
          console.log("successfully queried users :: "+data);
          return $scope.userList = data;
        })
        .catch(function(data){
          console.log("error querying users")
        });
    }

    /**
    * Deletes user account.
    *
    * @role admin only
    */
    $scope.delete = function(user_id){
      if($sessionStorage.roles[0].name == 'admin'){}
        User.delete({id: user_id}).$promise.then(function(){
          $scope.getUserList();
        });
      }

    $scope.editUser = function(id){
      if($scope.hasPermission(2)){
        state.go("adminDashboard.editUser", {"userId": id})
      }
    }

    $scope.hasPermission = function(role){
     if ($scope.$session.user.role == role) {return true;}
     return false;
    }
    $scope.getUserList();
  }
])
.controller('UserDetailsController', ['$scope', 'User', '$state', '$stateParams', '$auth', '$rootScope','$sessionStorage',
  function($scope, User, state, stateParams, $auth, $rootScope, $sessionStorage)
  {
    $scope.$session = $sessionStorage;
    $auth.validateUser();
    $scope.loadUser = function(){
      console.log(stateParams.userId);
      if(stateParams.userId != $scope.$session.user.id){
        $scope.user = User.query({id: stateParams.userId});
      }
      else{
        $scope.user = $scope.$session.user;
      }
      return $scope.user
    }

    $scope.updateUser = function(userValid){
      if(userValid){
        User.update($scope.user).$promise.then(function(data){
          $scope.user = {};
          state.go("adminDashboard.analytics", {"userId": id})
        });
      }
    };

    $scope.user = $scope.loadUser();
    $scope.hasPermission = function(role){
      return $scope.$session.user.role == role;
    }
  }
])

.controller('UserAccountAccessController', ['$scope', 'User', '$state', '$stateParams', '$auth', '$rootScope','$sessionStorage',
  function($scope, User, state, stateParams, $auth, $rootScope, $sessionStorage)
  {
    $scope.$session = $sessionStorage;
    $auth.validateUser();

    $scope.editMyAccount = function(){
      state.go('adminDashboard.editUser', {"userId": $scope.$session.user.id});
    }
  }
])
.controller('UserAuthController', ['$scope', '$rootScope', '$auth', '$sessionStorage', '$state', 'User',
	function ($scope, $rootScope, $auth, $sessionStorage, $state, User) {

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
        $state.go("analytics.adminDashboard");
    }

		$scope.register = function(isValid){
			var credentials = {
				email: $scope.registrationForm.email,
				password: $scope.registrationForm.password,
				password_confirmation: $scope.registrationForm.confirmation_password
			};

			if(isValid){
				$auth.submitRegistration(credentials).then(function(registeredUser) {
          $scope.$session.user = registeredUser.data.data;
          $scope.$session.user.signedIn = $auth.validateUser();
					$scope.successfulRegistration = true;
          $state.go("analytics.adminDashboard");
					//show some sort of statement that indicates they are welcome to enjoy
				}, function(error) {
					alert("Something went wrong during registration. Womp womp");
				});

				$scope.$on('auth:registration-email-success', function(event, user) {
					$rootScope.$broadcast('userRegistered', user);
					$scope.registrationForm={}
					$scope.userRegistration.$submitted = false;
          $state.go('analytics.adminDashboard')
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
				$auth.validateUser()
        $state.go('analytics.adminDashboard');
			});

			$scope.$on('auth:login-error', function(event, currentUser) {
				alert("Error logging in");
			});
		}
	}
]);
