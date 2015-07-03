'use strict';

// Declare app level module which depends on views, and components
angular.module('buzzbands_client', [
  'ngRoute',
  'ngResource',
  'ui.bootstrap',
  'ipCookie',
  'ng-token-auth',
  'ngStorage',
  'ngMessages',
  'buzzbands_client.UserControllers',
  'buzzbands_client.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/register'});
}])
.config(function($authProvider) {

  // the following shows the default values. values passed to this method
  // will extend the defaults using angular.extend

  $authProvider.configure({
    apiUrl:                  'http://localhost:3000/api',
  });
});
