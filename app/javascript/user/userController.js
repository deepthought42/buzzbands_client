'use strict';

angular.module('buzzbands.UserControllers',
  ['ui.router','buzzbands.UserServices', 'buzzbands.VenueService'])
.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('register', {
      url: '/register',
      templateUrl: 'app/views/auth/register.html',
      controller: 'UserAuthController'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/views/auth/login.html',
      controller: 'UserAuthController'
    });
}])
.controller('UserIndexController', ['$scope', '$rootScope', '$auth',
                                   '$sessionStorage', '$state', 'User',
	function ($scope, $rootScope, $auth, $sessionStorage, state, User) {

    this._init = function(){
      $scope.session = $sessionStorage;
      $scope.getUserList();
      $auth.validateUser();
    }

    /**
    *
    */
    $scope.getUserList = function(){
      $auth.validateUser();

      if($scope.session.user && $scope.session.user.role == 'buzzbands_employee'){
        User.query().$promise
          .then(function(data){
            return $scope.userList = data;
          })
          .catch(function(data){
            console.log("error querying users")
          });
      }
    }

    /**
    * Deletes user account.
    *
    * @role buzzbands_employee only
    */
    $scope.delete = function(user_id){
      if($sessionStorage.user.role == 'buzzbands_employee'){}
        User.delete({id: user_id}).$promise.then(function(){
          $scope.getUserList();
      });
    }

    /**
    * Activates user account.
    *
    * @role buzzbands_employee only
    */
    $scope.activate = function(user_id){
      if($sessionStorage.user.role == 'buzzbands_employee'){}
        User.activate({id: user_id}).$promise.then(function(){
          $scope.getUserList();
      });
    }

    /**
     *
     */
    $scope.editUser = function(id){
      if($scope.hasPermission('buzzbands_employee')){
        state.go("adminDashboard.editUser", {"userId": id})
      }
    }

    $scope.hasPermission = function(role){
     return $scope.session.user && $scope.session.user.role == role
    }

    this._init();
  }
])
.controller('UserDetailsController',
  ['$scope', 'User', 'Role', '$state', '$stateParams', '$auth', '$sessionStorage',
  function($scope, User, Role, state, stateParams, $auth, $sessionStorage)
  {
    console.log(stateParams.userId);

    this._init = function(){
      $scope.session = $sessionStorage;
      $auth.validateUser();
      $scope.roles = Role;
      $scope.loadUser(stateParams.userId);
    }

    $scope.loadUser = function(user_id){
      $scope.user = User.get({id: user_id});
    }

    $scope.updateUser = function(user){
        User.update(user).$promise.then(function(data){
          $scope.user = {};
          if($scope.hasPermission('buzzbands_employee')){
            state.go("adminDashboard.users");
          }
          else{
            state.go("analytics.adminDashboard");
          }
        });
    };

    $scope.updatePassword = function() {
      $auth.updatePassword($scope.updatePasswordForm)
        .then(function(resp) {
          console.log("Sucessfully reset password");
        })
        .catch(function(resp) {
          console.log("FAILED reset password");
        });
    };

    $scope.lessThan = function(prop, val){
        return function(item){
          return item[prop] <= val;
        }
    }

    $scope.previewImage = function(files){
      $scope.user.image = files[0].url;
    }

    $scope.hasPermission = function(role){
      return $scope.session.user.role == role;
    }

    this._init();
  }
])
.controller('UserCreationController',
  ['$scope', 'User', '$state', '$stateParams', '$auth', '$rootScope','$sessionStorage', 'Venue',
  function($scope, User, state, stateParams, $auth, $rootScope, $sessionStorage, Venue)
  {
    this._init = function(){
      $scope.session = $sessionStorage;
      $auth.validateUser();
      $scope.user = {};
      $scope.queryVenues();
    }

    $scope.queryVenues = function(){
      Venue.query().$promise
        .then(function(data){
          console.log("successfully queried venues :: "+data);
          $scope.venues = $scope.session.venues;
        })
        .catch(function(data){
          console.log("error querying venues")
        });
    }

    /**
    * Generate random string of 10 characters for temp password
    */
    $scope.generatePassword = function(){
      var generatedPass = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 10; i++ ){
        generatedPass += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      $scope.user.password = generatedPass;
      $scope.user.password_confirmation = generatedPass;
    }

    $scope.hasPermission = function(role){
      return $scope.session.user.role == role;
    }

    this._init();
  }
])
.controller('UserAccountAccessController', ['$scope', 'User', '$state', '$stateParams', '$auth', '$rootScope','$sessionStorage',
  function($scope, User, state, stateParams, $auth, $rootScope, $sessionStorage)
  {
    $scope.session = $sessionStorage;

    $scope.editMyAccount = function(){
      $scope.session.activeViewId = 10;
      state.go('adminDashboard.editUser', {"userId": $scope.session.user.id});
    }
  }
])
.controller('UserAuthController', ['$scope', '$rootScope', '$auth', '$sessionStorage', '$state', 'User',
	function ($scope, $rootScope, $auth, $sessionStorage, $state, User) {
    $scope.session = $sessionStorage;

    if($scope.session.signedIn === true){
        $state.go("adminDashboard.analytics");
    }

		$scope.register = function(isValid){
			var credentials = {user: {
				email: $scope.registrationForm.email,
				password: $scope.registrationForm.password,
				password_confirmation: $scope.registrationForm.confirmation_password
			}};

			if(isValid){
				$auth.submitRegistration(credentials).then(function(registeredUser) {
          $scope.session.user = registeredUser.data.data;
					$scope.successfulRegistration = true;

          //show payment form
          $scope.session.registered = true;
				}, function(error) {
					console.log("Something went wrong during registration. Womp womp");
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
				delete $scope.session.user;
			});

			$scope.$on('auth:logout-error', function(event, reason){
				delete $scope.session.user;
				console.log("There was an error signing you out. REASON :: "+reason);
			})
		}

    /**
    * @param loginForm {User}
    */
    $scope.signIn = function(isValid){
			//Authenticate with user credentials
			$auth.submitLogin($scope.user).then(function(response) {
				//$scope.session.user = response.data;
			}, function(error) {
				$scope.error = "Failed to log in "+error;
			});

			$scope.$on('auth:login-success', function(event, currentUser) {
				$scope.session.user = currentUser;
        $auth.validateUser();

        if($scope.session.user.role == 'admin' || $scope.session.user.role == 'buzzbands_employee'){
          $state.go("adminDashboard.analytics");
        }
        else{
          $state.go("adminDashboard.venues");
        }
			});

			$scope.$on('auth:login-error', function(event, currentUser) {
				alert("Error logging in");
			});
		}
	}
]);
