'use strict';

angular.module('buzzbands.AnalyticsControllers', ['ui.router', 'buzzbands.VenueService'])

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

.controller('AnalyticsController', ['$scope', 'Venue', function($scope, Venue) {
  
  $scope._init = function(){
    $scope.promotionCount;
    $scope.bandsOrdered;
    $scope.activeAccounts = Venue.query();
    $scope.totalScans;
    $scope.topAccounts;
    $scope.topPromotions;
  }

  $scope._init();
}])
