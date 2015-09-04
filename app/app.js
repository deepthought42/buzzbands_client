'use strict';

// Declare app level module which depends on views, and components
angular.module('buzzbands_client', [
  'ngResource',
  'ui.router',
  'ui.bootstrap',
  'ipCookie',
  'ng-token-auth',
  'ngStorage',
  'ngMessages',
  'buzzbands_client.UserControllers',
  'buzzbands_client.PromotionControllers',
  'buzzbands_client.VenueControllers',
  'buzzbands_client.LandingControllers',
  'buzzbands_client.version',
  'buzzbands_client.DashboardControllers',
  'buzzbands_client.NavigationControllers'
]).
config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
  $stateProvider.state('home', {
    url: '/dashboard',
    views: {
      '':{
        templateUrl: 'app/dashboard/home.html',
      },
      'dashboard@home': {
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardController'
      },
      'navigation@home': {
        templateUrl: 'app/navigation/navigation.html',
        controller: 'NavigationController'
      }
    }
  })
  $urlRouterProvider.otherwise('/');
}])
.config(function($authProvider) {

  // the following shows the default values. values passed to this method
  // will extend the defaults using angular.extend

  $authProvider.configure({
    apiUrl:                  'http://localhost:3000/api',
  });
});
