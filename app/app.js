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
  'buzzbands_client.AnalyticsControllers'
]).
config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
  $stateProvider.state('authenticate', {
    templateUrl: 'app/views/user/login.html',
    controller: 'UserAuthController'
  })
  $urlRouterProvider.otherwise('/');
}])
.config(function($authProvider) {

  // the following shows the default values. values passed to this method
  // will extend the defaults using angular.extend

  $authProvider.configure({
    apiUrl:                  'http://localhost:3000/api',
  });
})
.config([
  '$httpProvider', function($httpProvider){
    //$httpProvider.defaults.headers.common['X-CSRF-Token'] =
		//	$('meta[name=csrf-token]').attr('content');
  /*
   Response interceptors are stored inside the
   $httpProvider.responseInterceptors array.
   To register a new response interceptor is enough to add
   a new function to that array.
  */

  $httpProvider.interceptors.push(
	function() {
		return {
    	'request': function(config) {
				if (config.headers['access-token'] && !$httpProvider.defaults.headers.common['Access-Token']) {
		    	$httpProvider.defaults.headers.common['Access-Token'] = config.headers['access-token'];
					$httpProvider.defaults.headers.common['Token-Type'] = config.headers['token-type'];
			    $httpProvider.defaults.headers.common['Client'] = config.headers['client'];
					$httpProvider.defaults.headers.common['Expiry'] = config.headers['expiry'];
					$httpProvider.defaults.headers.common['Uid'] = config.headers['uid'];
		    }
		    return config;
			}
		};
  });
}]);
