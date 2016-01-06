'use strict';

angular.module('buzzbands.PromotionControllers', ['ui.router', 'buzzbands.PromotionService', 'buzzbands.VenueService', 'ui.bootstrap', 'ngMaterial', 'angularMoment'])

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

.controller('PromotionIndexController', ['$scope', 'Promotion', '$state', '$stateParams', 'VenuePromotion', 'Venue', '$sessionStorage',
  function($scope, Promotion, state, $stateParams, VenuePromotion, Venue, $sessionStorage) {
    this.init = function(){
      $scope.$session = $sessionStorage;
      $scope.promoPanel='index';
      $scope.promotion = {};
      $scope.venues = $scope.$session.venues;
      $scope.promotionLoaded = true;
      $scope.visibleTab = "thumbnail";
      $scope.time = '';
    }

    $scope.editPromotion = function(id){
      state.go("adminDashboard.editPromotion", {"promotionId": id})
    }

    $scope.deletePromotion = function(id){
      Promotion.remove(id);
      $scope.promotionList = $scope.getPromotionList();
    }

    $scope.getPromotionList = function(){
      return Promotion.query();
    }

    $scope.getVenuePromotionList = function(venue_id){
      return VenuePromotion.query({venue_id: venue_id});
    }

    $scope.getVenueName = function(venue_id){
      for(var i =0; i<$scope.venues.length ;i++){
        if($scope.venues[i].id == venue_id){
          return $scope.venues[i].url;
        }
      }
    }

    $scope.createPromotion = function(){
      $scope.promoPanel='create';
      console.log("CREATE PROMOTION CICKED");
      //state.go("new@promotions.dashboard");
    }

    if(!$stateParams.venue_id){
      //Show all promotions
      $scope.promotionList = $scope.getPromotionList();
    }
    else{
      //show promotions for the venuw with the provided ID
      $scope.promotionList = $scope.getVenuePromotionList($stateParams.venue_id);
    }

    $scope.deletePromotions = function(){
      for(var i =0;i < $scope.promotionList.length; i++){
        if($scope.promotionList[i].selected){
          Promotion.remove({id:$scope.promotionList[i].id}).$promise.
          then(function(){
            $scope.promotionList = $scope.getPromotionList();
          })
          .catch(function(data){
            console.log("an error occurred while deleting promotion");
          });
        }
      }
    }

    $scope.selectAll = function(selected){
      console.log("selecting all");
      for(promotion in promotionList){
        promotion.selected = selected
      }
    }

    this.init();
  }
])

.controller('PromotionCreationController', ['$scope', 'Promotion', 'Venue', '$sessionStorage',
  function($scope, Promotion, Venue, $sessionStorage) {
    this.init = function(){
      $scope.promotion = {};
      $scope.venues = $sessionStorage.venues;
    }

    $scope.createPromotion = function(promotion){
      Promotion.save(promotion);
      //state.go("new@promotions.dashboard");
    }

    $scope.previewImage = function(files){
      $scope.setUrl(files);
      var reader = new FileReader();
      if(typeof files[0] === 'Blob'){
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

    this.init();
  }
])

.controller('PromotionDetailsController',
  ['$scope', 'Promotion', 'Venue', '$state', '$stateParams', '$auth', '$sessionStorage',
    function($scope, Promotion, Venue, $state, stateParams, $auth, $sessionStorage)
    {

      this.init = function(){
        $auth.validateUser();
        $scope.loadPromotion();
        $scope.venues = $sessionStorage.venues;
      }

      $scope.loadPromotion = function(){
        if(stateParams.promotionId){
          Promotion.get({id: stateParams.promotionId}).$promise
            .then(function(data){
              $scope.promotion = data;
              $scope.promotion.start_time = new Date($scope.promotion.start_time );
              $scope.promotion.end_time = new Date($scope.promotion.end_time );
            })
            .catch(function(data){
              console.log("ERR  :: "+ data)
            });
        }
      }

      $scope.updatePromotion = function(promotion){
        console.log("Updateing promotion");
        promotion.start_time = new Date(promotion.start_time);
        promotion.end_time = new Date(promotion.end_time);
          Promotion.update(promotion).$promise.then(function(data){
            $scope.promotion = {};
            console.log("promotion updated");
            $state.go("adminDashboard.promotions");
          });
      }

      $scope.open = function($event) {
          $scope.status.opened = true;
        };

      $scope.previewImage = function(files){
        $scope.promotion.ad_location = files[0].url;

        var reader = new FileReader();
        if(typeof files[0] === 'object' || typeof files[0] == 'Blob'){
          reader.readAsDataURL(files[0]);
        }
        reader.onload = function(event){
          $scope.logo_url = reader.result;
          $scope.promotion.ad_location = files[0].url;
          $scope.$apply()
        }
      }

    $scope.status = {
      opened: false
    };
    this.init();
  }
])


.controller('timectrl', function ($scope, $log) {
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
});
