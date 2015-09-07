'use strict';

angular.module('buzzbands_client.DashboardControllers', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('analytics', {
    views: {
      '': {
        templateUrl: 'app/views/analytics/index.html',
        controller: 'AnalyticsController'
      }
    }
  })
}])

.controller('AnalyticsController', ['$scope', function($scope) {
  $scope.promotionCount;
  $scope.bandsOrdered;
  $scope.activeAccounts;
  $scope.totalScans;
  $scope.topAccounts;
  $scope.topPromotions;
}])
