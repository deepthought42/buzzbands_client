'use strict';

angular.module('buzzbands.UserDashboardControllers', ['ui.router'])

.config(['$stateProvider',
  function($stateProvider) {

    $stateProvider.state('userDashboard', {
        url: '/user',
        controller: 'UserDashboardController',
        templateUrl: 'app/views/dashboard/user.html',
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
      })
      .state('venues.userDashboard', {
        url: '/venues',
        parent: 'userDashboard',
        views: {
          '':{
            templateUrl: 'app/views/venue/index.html',
            controller: 'VenueIndexController',
          },
        },
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
      })
      .state('promotions.userDashboard', {
        url: '/promotions',
        parent: 'userDashboard',
        views: {
          '':{
            templateUrl: 'app/views/venue/index.html',
            controller: 'PromotionIndexController',
          },
        },
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
      });
  }
])

.controller('UserDashboardController', ['$scope', '$sessionStorage', '$state', function($scope, $sessionStorage, state) {
  $scope.$session = $sessionStorage;

  $scope.hasPermission = function(role){
    if($scope.$session.user === undefined){
      return false;
    }
    return $scope.$session.user.role == role;
  }
}])
