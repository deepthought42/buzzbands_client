'use strict';

angular.module('buzzbands.LandingControllers', ['ui.router','ngMorph'])
.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('landing', {
        url: '/',
        templateUrl: 'app/views/landing/index.html',
        controller: 'LandingController'
      })
  }
])
.controller('LandingController', ['$scope', '$state', '$sessionStorage',
function($scope, $state, $sessionStorage) {
  $scope.settings = {
     closeEl: '.close',
     modal: {
       templateUrl: 'app/views/auth/login.html',
       position: {
        top: '30%',
        left: '20%'
       },
       fade: false
     }
   }

  $scope.$session = $sessionStorage;

  $scope.signInSettings = {
         closeEl: '.close',
         modal: {
           templateUrl: 'app/views/auth/login.html',
           position: {
            top: '30%'
           },
           fade: true
         }
       };

   $scope.signUpSettings = {
          closeEl: '.close',
          modal: {
            templateUrl: 'app/views/auth/register.html',
            position: {
             top: '30%'
            },
            fade: true
          }
        };

  $scope.showRegistrationPage = function(){
    $state.go('account');
  }
}])
