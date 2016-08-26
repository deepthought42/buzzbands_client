'use strict';

var auth = angular.module('hypedrive.AuthControllers', ['ui.router']);

auth.config(['$stateProvider', '$httpProvider',
  function($stateProvider, $httpProvider) {

    $stateProvider.state('passwordReset', {
        url: '/passwordReset',
        templateUrl: 'app/javascript/auth/templates/passwordReset.html',
        controller: 'passwordResetController'
    });

    $stateProvider.state('updatePassword', {
        url: '/updatePassword',
        templateUrl: 'app/javascript/auth/templates/changePassword.html',
        controller: 'passwordChangeController'
    });

    $stateProvider.state('register', {
      url: '/register',
      templateUrl: 'app/javascript/auth/templates/register.html',
      controller: 'UserAuthController'
    });

    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'app/javascript/auth/templates/login.html',
      controller: 'UserAuthController'
    });
}]);

auth.controller('passwordResetController', ['$scope', '$sessionStorage', '$state', '$auth',
  function($scope, $rootScope, $sessionStorage, state, $auth) {
    this._init = function(){

    }

    this._init();

    $scope.resetPasssword = function(pwdResetForm) {
      $auth.requestPasswordReset(pwdResetForm)
        .then(function(resp) {
          // handle success response
        })
        .catch(function(resp) {
          // handle error response
        });
    };
  }
]);

auth.controller('passwordChangeController', ['$scope', '$sessionStorage', '$state', '$auth',
  function($scope, $rootScope, $sessionStorage, state, $auth) {
    this._init = function(){

    }

    this._init();

    $scope.updatePassword = function(updatePasswordForm) {
      $auth.updatePassword(updatePasswordForm)
        .then(function(resp) {
          // handle success response
        })
        .catch(function(resp) {
          // handle error response
        });
    };
  }
]);
