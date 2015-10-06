'use strict';

angular.module('buzzbands.LandingControllers', ['ui.router'])
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
