'use strict';

angular.module('buzzbands.DashboardControllers', ['ui.router', 'stripe.checkout'])

.config(['$stateProvider', 'StripeCheckoutProvider',
  function($stateProvider, StripeCheckoutProvider) {

    $stateProvider.state('adminDashboard', {
        url: '/admin',
        abstract: true,
        templateUrl: 'app/views/dashboard/admin.html',
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
      })
      .state('analytics.adminDashboard', {
        url: '',
        parent: 'adminDashboard',
        templateUrl: 'app/views/analytics/index.html',
        controller: 'AnalyticsController',
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
      })
      .state('venues.adminDashboard', {
        url: '/venues/:id',
        parent: 'adminDashboard',
        views: {
          '':{
            templateUrl: 'app/views/venue/index.html',
            controller: 'VenueIndexController',
          },
          'new.venue@venues.adminDashboard': {
            templateUrl: 'app/views/venue/new.html',
            controller: 'VenueCreationController'
          },
          'edit.venue@venues.adminDashboard': {
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
      .state('adminDashboard.newVenue', {
        url: '/venues',
        parent: 'adminDashboard',
        views: {
          '':{
            templateUrl: 'app/views/venue/new.html',
            controller: 'VenueCreationController'
          },
        },
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
      })

      .state('adminDashboard.promotions', {
        url: '/promotions',
        parent: 'adminDashboard',
        views: {
          '':{
            templateUrl: 'app/views/promotion/index.html',
            controller: 'PromotionIndexController'
          }
        },
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
      })
      .state('adminDashboard.venuePromotions', {
        url: '/venue/:venue_id/promotions',
        parent: 'adminDashboard',
        views: {
          '':{
            templateUrl: 'app/views/promotion/index.html',
            controller: 'PromotionIndexController'
          }
        },
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
      })
      .state('adminDashboard.shopBands', {
          url: '/shopBands',
          parent: 'adminDashboard',
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
        .state('adminDashboard.users', {
            url: '/users',
            parent: 'adminDashboard',
            views: {
              '':{
                templateUrl: 'app/views/user/index.html',
                controller: 'UserIndexController'
              }
            },
            resolve: {
                auth: function($auth, $sessionStorage) {
                  //ensure user has admin role
                  return $auth.validateUser() && $sessionStorage.role == 'admin';
                }
              }
          })
          .state('adminDashboard.editUser', {
              url: '/admin/users/edit/:userId',
              parent: 'adminDashboard',
              views: {
                '':{
                  templateUrl: 'app/views/user/edit.html',
                  controller: 'UserDetailsController'
                }
              },
              resolve: {
                auth: function($auth) {
                  return $auth.validateUser();
                },
                userId: ['$stateParams', function($stateParams){
                    return $stateParams.userId;
                }]
              }
            })
            .state('adminDashboard.newPromotion', {
                url: '/promotions/new/:promotionId',
                parent: 'adminDashboard',
                views: {
                  '':{
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
              .state('adminDashboard.editPromotion', {
                  url: '/promotions/edit/:promotionId',
                  parent: 'adminDashboard',
                  views: {
                    '':{
                      templateUrl: 'app/views/promotion/edit.html',
                      controller: 'PromotionDetailsController'
                    }
                  },
                  resolve: {
                    auth: function($auth) {
                      return $auth.validateUser();
                    },
                    promotionId: ['$stateParams', function($stateParams){
                        return $stateParams.promotionId;
                    }]
                  }
                });
  }
])

.controller('DashboardController', ['$scope', '$sessionStorage', '$state', function($scope, $sessionStorage, state) {
  $scope.$session = $sessionStorage;
  $scope.tog = $scope.$session.activeViewId;
  $scope.hasPermission = function(role){
    return $scope.$session.user.role === role;
  }

  $scope.setPage = function(pageVal){
    $scope.tog = pageVal;
    $scope.$session.activeViewId = pageVal;
  }
}])
