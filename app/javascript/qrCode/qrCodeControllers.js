'use strict';

angular.module('buzzbands.QrCodeControllers', ['ui.router', 'buzzbands.QrCodeService', 'qrScanner'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('qrReader', {
    views: {
      '': {
        templateUrl: 'app/views/qrCode/reader.html',
        controller: 'QrCodeController'
      }
    }
  })
}])
.controller('QrCodeController', ['$scope', 'QrCode', '$state', '$sessionStorage',
  function($scope, QrCode, state, session) {
    console.log("qr code reader controller initialized");
    $scope.onSuccess = function(data) {
        console.log(data);
    };
    $scope.onError = function(error) {
        console.log("An error has occurred" +error);
    };
    $scope.onVideoError = function(error) {
        console.log(error);
        console.log("VIDEO ERROR...");
    };
  }
]);
