'use strict';

angular.module('buzzbands_client.DashboardControllers', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('dashboard', {
          url: '/',
          abstract: true,
          templateUrl: 'app/views/dashboard/index.html',
        })
        .state('analytics.dashboard', {
          url: '',
          parent: 'dashboard',
          templateUrl: 'app/views/analytics/index.html',
          controller: 'AnalyticsController'
        })
        .state('venues.dashboard', {
          url: '/venues',
          parent: 'dashboard',

          views: {
            '':{
              templateUrl: 'app/views/venue/index.html',
              controller: 'VenueIndexController',
            },
            'new.venues@venues.dashboard': {
              templateUrl: 'app/views/venue/new.html',
              controller: 'VenueCreationController'
            }
          }
        })

        .state('promotions.dashboard', {
          url: '/promotions',
          parent: 'dashboard',
          templateUrl: 'app/views/promotion/index.html',
          controller: 'PromotionIndexController'
        })

}])

.controller('DashboardController', ['$scope', function($scope) {
  $scope.mainView = 'analytics';
  console.log($scope.mainView);
  $scope.showVenues = function(){
    $scope.mainView = 'venues';
  }
}])
