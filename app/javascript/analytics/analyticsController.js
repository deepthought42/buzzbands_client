'use strict';

angular.module('buzzbands.AnalyticsControllers', ['ui.router',
                                                  'buzzbands.VenueService',
                                                  'buzzbands.OrderService'])

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

.controller('AnalyticsController', ['$scope', 'Venue','Promotion', 'Order', function($scope, Venue, Promotion, Order) {

  $scope._init = function(){
    $scope.promotions = Promotion.query();
    $scope.bandsOrdered = Order.getPreviousMonthOrders();
    $scope.activeAccounts = Venue.query();
    $scope.totalScans;
    $scope.topAccounts;
    $scope.topPromotions;
  }

  $scope._init();
}])
