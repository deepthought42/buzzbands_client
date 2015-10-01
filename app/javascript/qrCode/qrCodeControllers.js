'use strict';

angular.module('buzzbands_client.QrCodeControllers', ['ui.router', 'buzzbands.QrCodeService', 'qrScanner'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('qrCodeReader', {
      url: '/qr',
      templateUrl: 'app/views/qrCode/reader.html',
      controller: 'QrCodeController'
    });
}])
.controller('qrCodeController', ['$scope', 'QrCode', '$state', '$sessionStorage',
  function($scope, QrCode, state, session) {

    $scope.onSuccess = function(data) {
        console.log(data);
    };
    $scope.onError = function(error) {
        console.log(error);
    };
    $scope.onVideoError = function(error) {
        console.log(error);
    };
  }
]);
