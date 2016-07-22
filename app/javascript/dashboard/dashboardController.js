'use strict';

angular.module('buzzbands.DashboardControllers', ['ui.router'])

.config(['$stateProvider',
  function($stateProvider) {

    $stateProvider.state('adminDashboard', {
        url: '/',
        abstract: true,
        templateUrl: 'app/views/dashboard/admin.html'
    })

    .state('adminDashboard.analytics', {
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
    .state('adminDashboard.venues', {
      url: 'venues',
      parent: 'adminDashboard',
      templateUrl: 'app/views/venue/index.html',
      controller: 'VenueIndexController'
    })
    .state('adminDashboard.newVenue', {
      url: '/venues/new',
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
    .state('adminDashboard.editVenue', {
      url: '/venues/:venue_id',
      parent: 'adminDashboard',
      views: {
        '':{
          templateUrl: 'app/views/venue/edit.html',
          controller: 'VenueDetailsController'
        },
      },
      resolve: {
        auth: function($auth) {
          return $auth.validateUser();
        }
      }
    })

    .state('adminDashboard.promotions', {
      url: 'promotions',
      parent: 'adminDashboard',
      views: {
        '':{
          templateUrl: 'app/views/promotion/index.html',
          controller: 'PromotionIndexController'
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
          }
        }
    })
    .state('adminDashboard.checkout', {
        url: '/checkout',
        parent: 'adminDashboard',
        views: {
          '':{
            templateUrl: 'app/views/shop/stripeCheckout.html',
            controller: 'BuyBandsController'
          }
        },
        resolve: {
            auth: function($auth) {
              return $auth.validateUser();
            }
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
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
    })
    .state('adminDashboard.editUser', {
      url: '/users/:userId/edit',
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
    .state('adminDashboard.createUser', {
        url: '/users/new',
        parent: 'adminDashboard',
        views: {
          '':{
            templateUrl: 'app/views/user/new.html',
            controller: 'UserCreationController'
          }
        },
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
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
    })
    .state('edit.venueIndex', {
        url: '/venues/edit/:venue_id',
        parent: 'adminDashboard.venues',
        views: {
          '':{
            templateUrl: 'app/views/venue/edit.html',
            controller: 'VenueDetailsController'
          }
        },
        resolve: {
          venue_id: ['$stateParams', function($stateParams){
              return $stateParams.venue_id;
          }]
        }
      })
      .state('adminDashboard.accounts', {
        url: '/accounts',
        parent: 'adminDashboard',
        views: {
          '':{
            templateUrl: 'app/views/account/index.html',
            controller: 'AccountIndexController'
          }
        },
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
      })
      .state('adminDashboard.editAccount', {
        url: '/accounts/:id/edit',
        parent: 'adminDashboard',
        views: {
          '':{
            templateUrl: 'app/views/account/edit.html',
            controller: 'AccountDetailsController'
          }
        },
        resolve: {
          auth: function($auth) {
            return $auth.validateUser();
          }
        }
      })
      .state('adminDashboard.servicePackage', {
        url: 'servicePackage',
        parent: 'adminDashboard',
        templateUrl: 'app/views/shop/packageSelection.html',
        controller: 'BuyPackageController'
      });

  }
])

.controller('DashboardController', ['$scope', '$rootScope', '$sessionStorage', '$state',
  function($scope, $rootScope, $sessionStorage, state) {
    this._init = function(){
      console.log("loaded dashbaord");
      $scope.session = $sessionStorage;
      $scope.session.activeViewId = $scope.session.activeViewId || 1;
      $scope.loadLastViewedPage();
    }

    $scope.hasPermission = function(role){
      return $scope.session.user && $scope.session.user.role === role;
    }

    $scope.setPage = function(pageVal){
      $scope.session.activeViewId = $scope.tog = pageVal;
    }

    $rootScope.$on('auth:validation-success', function(event, currentUser) {
      console.log("Valid Token");
    });

    $rootScope.$on('auth:validation-error', function(event, currentUser) {
      console.log("VALIDATION ERROR!");
    });

    $rootScope.$on('auth:invalid', function(event, currentUser) {
      console.log("Invalid Token");
    });


    $scope.loadLastViewedPage = function(){
      if($scope.session.activeViewId == 1){
        state.go("adminDashboard.analytics");
      }
      else if($scope.session.activeViewId == 2){
        state.go("adminDashboard.venues");
      }
      else if($scope.session.activeViewId == 3){
        state.go("adminDashboard.promotions");
      }
      else if($scope.session.activeViewId == 4){
        state.go("adminDashboard.users");
      }
      else if($scope.session.activeViewId == 5){
        state.go("adminDashboard.accounts");
      }
    }

    this._init();
  }
])
