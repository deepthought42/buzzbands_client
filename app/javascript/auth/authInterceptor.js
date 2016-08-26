'use strict';

var auth = angular.module('AuthInterceptor', [])
  .config(['$httpProvider',
    function($httpProvider){
      $httpProvider.interceptors.push('AuthInterceptor');
    }
  ]);

// register the interceptor as a service
auth.factory('AuthInterceptor', ['$q', '$rootScope', function($q, $rootScope) {
  return {
    // optional method
    'request': function(config) {
      // do something on success
      return config;
    },

    // optional method
   'requestError': function(rejection) {

      return $q.reject(rejection);
    },



    // optional method
    'response': function(response) {
      // do something on success
      return response;
    },

    // optional method
   'responseError': function(rejection) {
      if(rejection.status === 401){
        $rootScope.$broadcast("auth:unauthorized");
      }
      return $q.reject(rejection);
    }
  };
} ]);
