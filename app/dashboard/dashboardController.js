'use strict';

angular.module('buzzbands_client.DashboardControllers', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('dashboard', {
    views: {
      
    }
  })
}])

.controller('DashboardController', ['$scope', function($scope) {
  $scope.promotionCount;
  $scope.bandsOrdered;
  $scope.activeAccounts;
  $scope.totalScans;
  $scope.topAccounts;
  $scope.topPromotions;
}])
