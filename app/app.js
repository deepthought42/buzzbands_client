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
  $urlRouterProvider.otherwise('/');
}])
.config(function($authProvider) {

  // the following shows the default values. values passed to this method
  // will extend the defaults using angular.extend

  $authProvider.configure({
    apiUrl:                  'http://localhost:3000/api',
  });
});
