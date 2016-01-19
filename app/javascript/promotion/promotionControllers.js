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

.controller('PromotionIndexController', ['$scope', 'Promotion', '$state',
                                         '$stateParams', 'VenuePromotion',
                                         'Venue', '$sessionStorage', '$log',
  function($scope, Promotion, state, $stateParams,
            VenuePromotion, Venue, $sessionStorage, $log) {
    this.init = function(){
      $scope.$session = $sessionStorage;
      $scope.promoPanel='index';
      $scope.promotion = {};
      $scope.venues = $scope.$session.venues || Venue.query();
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

    $scope.hasPermission = function(role){
      return $scope.$session.user !== undefined && $scope.$session.user.role >= role;
    }

    this.init();
  }
])

.controller('PromotionCreationController', ['$scope', 'Promotion', 'Venue',
                                            '$sessionStorage', '$log',
  function($scope, Promotion, Venue, $sessionStorage, $log) {
    this.init = function(){
      $scope.promotion = {};
      $scope.venues = Venue.query();
      $scope.start_time = new Date();
      $scope.end_time = new Date();

      $scope.hstep = 1;
      $scope.mstep = 1;

      $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
      };

      $scope.ismeridian = true;
    }

    $scope.createPromotion = function(promotion, isValid){
      console.log("VALID PROMOTION");
      promotion.start_time = new Date(promotion.start_time);
      promotion.start_time.setHours($scope.start_time.getHours());
      promotion.start_time.setMinutes($scope.start_time.getMinutes());

      promotion.end_time = new Date(promotion.end_time);
      promotion.end_time.setHours($scope.end_time.getHours());
      promotion.end_time.setMinutes($scope.end_time.getMinutes());

      if(promotion.start_time > promotion.end_time){
        //promotion.start_time = promotion.end_time;
        $log.log("start time is after end time");
        //display error
        isValid = false;
        return;
      }

      if(isValid){
        Promotion.save(promotion);
      }
      state.go("adminDashboard.promotions");
    }
    $scope.toggleMode = function() {
      $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.update = function() {

    };

    //executed with hour:minutes changes
    $scope.changed = function () {

    };

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

    $scope.hasPermission = function(role){
      return $scope.$session.user !== undefined && $scope.$session.user.role >= role;
    }

    this.init();
  }
])

.controller('PromotionDetailsController',
  ['$scope', 'Promotion', 'Venue', '$state', '$stateParams', '$auth', '$sessionStorage', '$log',
    function($scope, Promotion, Venue, $state, stateParams, $auth, $sessionStorage, $log)
    {

      this.init = function(){
        $auth.validateUser();
        $scope.loadPromotion();
        $scope.venues = Venue.query();

        $scope.hstep = 1;
        $scope.mstep = 1;

        $scope.options = {
          hstep: [1, 2, 3],
          mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
      }

      $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
      };

      $scope.update = function() {

      };

      $scope.changed = function () {
        //$log.log('Time changed to: ' + $scope.start_time);
      };

      $scope.loadPromotion = function(){
        if(stateParams.promotionId){
          Promotion.get({id: stateParams.promotionId}).$promise
            .then(function(data){
              $scope.promotion = data;
              $scope.promotion.start_time = new Date($scope.promotion.start_time );
              $scope.promotion.end_time = new Date($scope.promotion.end_time );

              $scope.start_time = new Date($scope.promotion.start_time);
              $scope.end_time = new Date($scope.promotion.end_time);
            })
            .catch(function(data){
              console.log("ERR  :: "+ data)
            });
        }
      }

      $scope.updatePromotion = function(promotion){

        promotion.start_time = new Date(promotion.start_time);
        promotion.start_time.setHours($scope.start_time.getHours());
        promotion.start_time.setMinutes($scope.start_time.getMinutes());

        promotion.end_time = new Date(promotion.end_time);
        promotion.end_time.setHours($scope.end_time.getHours());
        promotion.end_time.setMinutes($scope.end_time.getMinutes());

        if(promotion.start_time > promotion.end_time){
          promotion.start_time = promotion.end_time;
          $log.log("start time is after end time");
          //display error
          return;
        }
        Promotion.update(promotion).$promise.then(function(data){
          $scope.promotion = {};
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

      $scope.hasPermission = function(role){
        return $scope.$session.user !== undefined && $scope.$session.user.role >= role;
      }

    $scope.status = {
      opened: false
    };
    this.init();
  }
])
