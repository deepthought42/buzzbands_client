'use strict';

angular.module('buzzbands_client.PromotionControllers', ['ui.router', 'buzzbands.PromotionService'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('promotions', {
    url: '/promotions',
    templateUrl: 'app/promotion/index.html',
    controller: 'PromotionIndexController'
  });
}])

.controller('PromotionIndexController', ['$scope', 'Promotion', function($scope, Promotion) {
  $scope.promotionList = Promotion.query();
}])

.controller('PromotionCreationController', ['$scope', 'Promotion', function($scope, Promotion) {
  $scope.promotion = Promotion.new();
}]);
