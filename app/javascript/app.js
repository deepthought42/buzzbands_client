'use strict';

// Declare app level module which depends on views, and components
angular.module('buzzbands', [
  'ngResource',
  'ui.router',
  'ui.bootstrap',
  'ipCookie',
  'ng-token-auth',
  'ngStorage',
  'ngMessages',
  'buzzbands.UserControllers',
  'buzzbands.PromotionControllers',
  'buzzbands.VenueControllers',
  'buzzbands.LandingControllers',
  'buzzbands.version',
  'buzzbands.DashboardControllers',
  'buzzbands.AnalyticsControllers',
  'buzzbands.BandsControllers',
  'buzzbands.RoleServices',
  'buzzbands.UserDashboardControllers',
  'buzzbands.QrCodeControllers',
  'filepicker',
  'ngCordova'
]).
config(['$urlRouterProvider', '$stateProvider', '$authProvider', '$httpProvider',
 function($urlRouterProvider, $stateProvider, $authProvider, $httpProvider) {

  $urlRouterProvider.otherwise('/user');
  // the following shows the default values. values passed to this method
  // will extend the defaults using angular.extend

  $authProvider.configure({
    apiUrl:                  'http://localhost:3000/api'
  });
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
}])
.run(function($rootScope, $state){
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    if(error.status == 401){
      console.log("EXPERIENCED 401 err");
      $state.go("authenticate");
    }
    else{
      console.log("EXPERIENCED 404 err");
      $state.go("authenticate");
      //handle 400, 404, 500, etc here
    }
  })
});
