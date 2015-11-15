'use strict';

angular.module('buzzbands.PromotionControllers', ['ui.router', 'buzzbands.PromotionService'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('promotions', {
    url: '/promotions/:promotionId',
    templateUrl: 'app/views/promotion/index.html',
    controller: 'PromotionIndexController'
  })
  .state('promotion/edit',{
    url: '/promotions/:id',
    templateUrl: 'app/views/promotion/edit.html',
    controller: 'PromotionDetailsController'
  })
  .state('promotion/new',{
    url: '/promotion/new',
    templateUrl: 'app/views/promotion/new.html',
    controller: 'PromotionCreationController'
  });
}])

.controller('PromotionIndexController', ['$scope', 'Promotion', '$state', '$stateParams',
  function($scope, Promotion, state, stateParams) {
    $scope.promoPanel='index';
    $scope.promotion = {};
    $scope.promotionLoaded = true;

    $scope.editPromotion = function(id){
      state.go("adminDashboard.editPromotion", {"promotionId": id})
    }

    $scope.deletePromotion = function(id){
      Promotion.delete(id);
      $scope.promotionList = getPromotionList();
    }

    $scope.getPromotionList = function(){
      return Promotion.query({id: stateParams.promotionId});
    }

    $scope.createPromotion = function(){
      $scope.promoPanel='create';
      console.log("CREATE PROMOTION CICKED");
      //state.go("new@promotions.dashboard");
    }

    $scope.promotionList = $scope.getPromotionList();
  }
])

.controller('PromotionCreationController', ['$scope', 'Promotion', function($scope, Promotion) {
  $scope.promotion = {}

  $scope.createPromotion = function(promotion){
    Promotion.save($scope.promotion);
  }

  $scope.previewImage = function(files){
    $scope.setUrl(files);
    var reader = new FileReader();
    if(typeof files[0] === 'object'){
      reader.readAsDataURL(files[0]);
    }
    reader.onload = function(event){
      $scope.logo_url = reader.result;
      $scope.promotion.ad_location = files[0].url;
      $scope.$apply()
    }
  }

  $scope.setUrl = function(files){
    $scope.promotion.ad_location = files[0].url;
  }
}])

.controller('PromotionDetailsController', ['$scope', 'Promotion', '$state', '$stateParams', '$auth', '$rootScope',
  function($scope, Promotion, state, stateParams, $auth, $rootScope)
  {
    $auth.validateUser();

    $scope.loadPromotion = function(){
      if(stateParams.promotionId){
        Promotion.get({id: stateParams.promotionId}).$promise
          .then(function(data){
            $scope.promotion = data;
          })
          .catch(function(data){
            console.log("ERR  :: "+ data)
          });
      }
    }

    $scope.updatePromotion = function(promotionValid){
      if(promotionValid){
        Promotion.update($scope.promotion).$promise.then(function(data){
          $scope.promotion = {};
          $rootScope.$broadcast("showCreatePromotionView");
        });
      }
    }

    $scope.loadPromotion();
  }
]);
