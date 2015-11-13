'use strict';

angular.module('buzzbands.UserDashboardControllers', ['ui.router', 'stripe.checkout'])

.config(['$stateProvider', 'StripeCheckoutProvider',
  function($stateProvider, StripeCheckoutProvider) {

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
      .state('qrReader.userDashboard', {
        url: '',
        parent: 'userDashboard',
        views: {
          '':{
            templateUrl: 'app/views/qrCode/reader.html',
            controller: 'QrCodeController',
          },
        },
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
    return $scope.$session.user.role == role;
  }
}])
