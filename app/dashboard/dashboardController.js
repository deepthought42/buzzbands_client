'use strict';

angular.module('buzzbands_client.DashboardControllers', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('dashboard', {
    url: '/dashboard',
    views: {
      '': {
        templateUrl: 'app/dashboard.html',
        controller: 'LandingController'
      }
    }
  })
}])

.controller('LandingController', ['$scope', function($scope) {
  $scope.promotionCount;
  $scope.bandsOrdered;
  $scope.activeAccounts;
  $scope.totalScans;
  $scope.topAccounts;
  $scope.topPromotions;
}])
