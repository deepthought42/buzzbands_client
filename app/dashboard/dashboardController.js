'use strict';

angular.module('buzzbands_client.DashboardControllers', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('dashboard', {
    url: '/',
    views: {
      '': {
        templateUrl: 'app/views/dashboard/index.html',
        controller: 'DashboardController'
      },
      'venue.index@dashboard': {
        templateUrl: 'app/views/venue/index.html',
        controller: 'VenueIndexController'
      },
      'promotion.index@dashboard': {
        templateUrl: 'app/views/promotion/index.html',
        controller: 'PromotionIndexController'
      }
    }
  })
}])

.controller('DashboardController', ['$scope', function($scope) {

}])
