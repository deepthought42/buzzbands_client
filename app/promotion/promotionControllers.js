'use strict';

angular.module('buzzbands_client.promotion', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('promotionIndex', {
    url: '/promotions',
    templateUrl: 'promotion/index.html',
    controller: 'PromotionIndexCtrl'
  });
}])

.controller('PromotionIndexCtrl', [function() {

}]);
