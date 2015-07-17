'use strict';

angular.module('buzzbands_client.PromotionControllers', ['ui.router', 'buzzbands.PromotionService'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('promotions', {
    url: '/promotions/:venueId',
    templateUrl: 'app/promotion/index.html',
    controller: 'PromotionIndexController'
  })
  .state('promotion/edit',{
    url: '/promotions/:id',
    templateUrl: 'app/promotion/edit.html',
    controller: 'PromotionDetailsController'
  })
  .state('promotion/new',{
    url: '/promotion/new',
    templateUrl: 'app/promotion/new.html',
    controller: 'PromotionCreationController'
  });
}])

.controller('PromotionIndexController', ['$scope', 'Promotion', '$state', '$stateParams',
  function($scope, Promotion, state, stateParams) {
    $scope.editPromotion = function(id){
      state.go("promotion/edit", {"promotionId": id})
      $scope.promotionList = getPromotionList();
    }

    $scope.deletePromotion = function(id){
      Promotion.delete(id);
      $scope.promotionList = getPromotionList();
    }

    $scope.getPromotionList = function(){
      return Promotion.query({id: stateParams.venueId});
    }

    $scope.createPromotion = function(){
        state.go("promotion/new");
    }

    $scope.getPromotionList();
  }
])

.controller('PromotionCreationController', ['$scope', 'Promotion', function($scope, Promotion) {
  $scope.promotion = {}

  $scope.createPromotion = function(promotion){
    Promotion.save(promotion)
      .success(function(data){

      })
      .error(function(data){

      })
  }

  $scope.previewImage = function(files){
    var reader = new FileReader();
    if(typeof files[0] === 'object'){
      reader.readAsDataURL(files[0]);
    }
    reader.onload = function(event){
      $scope.logo_url = reader.result;
      $scope.promotion.cover_img = files[0];
      $scope.$apply()
    }
  }
}]);
