'use strict';

angular.module('buzzbands_client.NavigationControllers', ['ui.router'])
.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
  $stateProvider.state('navigation', {
    views: {

    }
  })
}])
.controller('NavigationController', ['$scope', function($scope) {
  $scope.tog=1;
}])
