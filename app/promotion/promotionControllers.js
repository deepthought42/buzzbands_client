'use strict';

angular.module('buzzbands_client.promotion', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/promotions', {
    templateUrl: 'promotion/index.html',
    controller: 'PromotionIndexCtrl'
  });
}])

.controller('PromotionIndexCtrl', [function() {

}]);
