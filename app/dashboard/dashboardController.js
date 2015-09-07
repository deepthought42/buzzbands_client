'use strict';

angular.module('buzzbands_client.DashboardControllers', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('dashboard', {
    url: '/',
    views: {
      '': {
        templateUrl: 'app/views/dashboard/dashboard.html',
        controller: 'DashboardController'
      },
      'venue.index@dashboard': {
        templateUrl: 'app/views/venue/index.html',
        controller: 'VenueIndexController'
      },
      'promotion.index@landing': {
        templateUrl: 'app/views/promotion/index.html',
        controller: 'PromotionIndexController'
      }
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
