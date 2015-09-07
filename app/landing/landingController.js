'use strict';

angular.module('buzzbands_client.LandingControllers', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('landing', {
    views: {
      'register@landing': {
        templateUrl: 'app/views/user/signup.html',
        controller: 'UserAuthController'
      },
      'login@landing': {
        templateUrl: 'app/views/user/login.html',
        controller: 'UserAuthController'
      }
    }
  })
}])

.controller('LandingController', ['$scope', function($scope) {
  $scope.showLogin = function(){
    $scope.registerViewVisible = false;
    $scope.loginViewVisible = true;
  }

  $scope.showRegistration = function(){
    $scope.registerViewVisible = true;
    $scope.loginViewVisible = false;
  }

  $scope.showRegistration();
}])
