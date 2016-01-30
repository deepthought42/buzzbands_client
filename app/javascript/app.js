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
  'buzzbands.UserControllers',
  'buzzbands.PromotionControllers',
  'buzzbands.VenueControllers',
  'buzzbands.LandingControllers',
  'buzzbands.version',
  'buzzbands.DashboardControllers',
  'buzzbands.AnalyticsControllers',
  'buzzbands.BandsService',
  'buzzbands.BandsControllers',
  'buzzbands.UserDashboardControllers',
  'buzzbands.OrderService',
  'buzzbands.AccountControllers',
  'filepicker',
  'wu.masonry'
]).
config(['$urlRouterProvider', '$stateProvider', '$authProvider', '$httpProvider', '$provide', '$injector',
 function($urlRouterProvider, $stateProvider, $authProvider, $httpProvider, $provide, $injector) {

  $urlRouterProvider.otherwise('/authenticate');
  // the following shows the default values. values passed to this method
  // will extend the defaults using angular.extend

  $authProvider.configure({
     apiUrl:                  'http://localhost:3000/api',
     forceValidateToken:      false,
     validateOnPageLoad:      true,
     proxyUrl:                '/proxy',
     omniauthWindowType:      'sameWindow',
     authProviderPaths: {
       github:   '/auth/github',
       facebook: '/auth/facebook',
       google:   '/auth/google'
     },
     tokenFormat: {
       "access-token": "{{ token }}",
       "token-type":   "Bearer",
       "client":       "{{ clientId }}",
       "expiry":       "{{ expiry }}",
       "uid":          "{{ uid }}"
     },
     parseExpiry: function(headers) {
       // convert from UTC ruby (seconds) to UTC js (milliseconds)
       return (parseInt(headers['expiry']) * 1000) || null;
     },
     handleLoginResponse: function(response) {
       return response.data;
     },
     handleAccountUpdateResponse: function(response) {
       return response.data;
     },
     handleTokenValidationResponse: function(response) {
       return response.data;
     }
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
	function($q) {
		return {
    	'request': function(config) {
        var injector = angular.injector(['ipCookie']);
        var cookies = injector.get('ipCookie');
        var auth_headers = cookies('auth_headers');

				if ((config.headers['access-token'] || (auth_headers && auth_headers['access-token'])) && !$httpProvider.defaults.headers.common['access-token']) {
          console.log("Config :: " + config.headers['access-token']);

		    	$httpProvider.defaults.headers.common['Access-Token'] = config.headers['access-token'] || auth_headers['access-token'];
					$httpProvider.defaults.headers.common['Token-Type'] = config.headers['token-type'] || auth_headers['token-type'];
			    $httpProvider.defaults.headers.common['Client'] = config.headers['client'] || auth_headers['client'];
					$httpProvider.defaults.headers.common['Expiry'] = config.headers['expiry'] || auth_headers['expiry'];
					$httpProvider.defaults.headers.common['Uid'] = config.headers['uid'] || auth_headers['uid'];
		    }
		    return config;
			},

      'responseError': function(response) {

        return response;
      }

		};
  });
}])
.run(function($rootScope, $state, ipCookie){
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    if(error.status == 401){
      var cookie = ipCookie.get('auth-headers');
      console.log("EXPERIENCED 401 err");
      console.log("COOKIE CONTENTS :: " + cookie['access-token']);
      $state.go("authenticate");
    }
    else{
      console.log("EXPERIENCED 404 err");
      $state.go("authenticate");
      //handle 400, 404, 500, etc here
    }
  })

  $rootScope.$on('auth:validation-error', function (ev, error) {
       //i don't really use alert() but you get the idea
       alert('You need to be logged in!');
       // here you might want to redirect a user
       // I think ui-router uses something like $state.go('login');
   });
});
