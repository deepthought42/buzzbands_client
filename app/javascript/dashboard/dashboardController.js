'use strict';

angular.module('buzzbands.DashboardControllers', ['ui.router', 'stripe.checkout'])

.config(['$stateProvider', 'StripeCheckoutProvider',
  function($stateProvider, StripeCheckoutProvider) {
    $stateProvider.state('dashboard', {
        url: '/',
        abstract: true,
        templateUrl: 'app/views/dashboard/index.html',
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
      })
      .state('analytics.dashboard', {
        url: '',
        parent: 'dashboard',
        templateUrl: 'app/views/analytics/index.html',
        controller: 'AnalyticsController',
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
      })
      .state('venues.dashboard', {
        url: '/venues',
        parent: 'dashboard',
        views: {
          '':{
            templateUrl: 'app/views/venue/index.html',
            controller: 'VenueIndexController',
          },
          'new.venue@venues.dashboard': {
            templateUrl: 'app/views/venue/new.html',
            controller: 'VenueCreationController'
          },
          'edit.venue@venues.dashboard': {
            templateUrl: 'app/views/venue/edit.html',
            controller: 'VenueDetailsController'
          }
        },
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
      })
      .state('promotions.dashboard', {
        url: '/promotions',
        parent: 'dashboard',
        views: {
          '':{
            templateUrl: 'app/views/promotion/index.html',
            controller: 'PromotionIndexController'
          },
          'promotion.new@promotions.dashboard': {
            templateUrl: 'app/views/promotion/new.html',
            controller: 'PromotionCreationController'
          }
        },
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
      })
      .state('dashboard.shopBands', {
          url: '/shopBands',
          parent: 'dashboard',
          views: {
            '':{
              templateUrl: 'app/views/shop/bandSelection.html',
              controller: 'BuyBandsController'
            }
          },
          resolve: {
              auth: function($auth) {
                return $auth.validateUser();
              },
              // checkout.js isn't fetched until this is resolved.
              stripe: StripeCheckoutProvider.load
            }
        })
        .state('users.dashboard', {
            url: '/users',
            parent: 'dashboard',
            views: {
              '':{
                templateUrl: 'app/views/user/index.html',
                controller: 'UserIndexController'
              }
            },
            resolve: {
                auth: function($auth) {
                  return $auth.validateUser();
                },
              }
          });
  }
])

.controller('DashboardController', ['$scope', function($scope) {
  $scope.mainView = 'analytics';
  $scope.showVenues = function(){
    $scope.mainView = 'venues';
  }
}])
