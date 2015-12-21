'use strict';

angular.module('buzzbands.PromotionControllers', ['ui.router', 'buzzbands.PromotionService', 'ui.bootstrap'])

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
    $scope.promotionLoaded = true;
    $scope.visibleTab = 'thumbnail';

    $scope.editPromotion = function(id){
      state.go("adminDashboard.editPromotion", {"promotionId": id})
    }

    $scope.deletePromotion = function(id){
      Promotion.delete(id);
      $scope.promotionList = $scope.getPromotionList();
    }

    $scope.getPromotionList = function(){
      return Promotion.query();
    }

    $scope.createPromotion = function(){
      $scope.promoPanel='create';
      console.log("CREATE PROMOTION CICKED");
      //state.go("new@promotions.dashboard");
    }

    $scope.setActiveTab = function(tabName){
      $scope.visibleTab = tabName;
    }

    $scope.promotionList = $scope.getPromotionList();

    $scope.deletePromotions = function(){
      for(var i =0;i < $scope.promotionList.length; i++){
        if($scope.promotionList[i].selected){
          Promotion.remove({id:$scope.promotionList[i].id}).$promise.
          then(function(data){
            $scope.promotionList = $scope.getPromotionList();
          })
          .catch(function(data){
            console.log("an error occurred while deleting promotion");
          });
        }
      }
    }

    $scope.setShowContent = function(promotion){
      for(var i = 0; i < $scope.promotionList.length; i++){
        if($scope.promotionList[i] == promotion){
          $scope.promotionList[i].showContent = true;
        }
        else{
          $scope.promotionList[i].showContent = false;
        }
      }
    }

    $scope.selectAll = function(selected){
      console.log("selecting all");
      for(promotion in promotionList){
        promotion.selected = selected
      }
    }
  }
])

.controller('PromotionCreationController', ['$scope', 'Promotion', function($scope, Promotion) {
  $scope.promotion = {}

  $scope.createPromotion = function(isValid){
    console.log("Creating program...");
    if(isValid){
      Promotion.save($scope.promotion);
    }
    else{
      console.log("FAILDED TO CREATE PROGRAM!!!!!!!");
    }
  }

  $scope.previewImage = function(files){
    $scope.setUrl(files);
    var reader = new FileReader();

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

    $scope.open = function($event) {
        $scope.status.opened = true;
      };

    $scope.status = {
      opened: false
    };
    $scope.loadPromotion();

  }
]);
