'use strict';

var venue = angular.module('buzzbands.VenueControllers',
  ['ui.router', 'buzzbands.VenueService', 'mwl.confirm']);

venue.config(['$stateProvider', function($stateProvider) {

}]);

venue.controller('VenueIndexController',
  ['$scope', 'Venue', '$state', '$sessionStorage', '$rootScope', '$timeout', '$stateParams',
    function($scope, Venue, state, $sessionStorage, $rootScope, $timeout, $stateParams) {

      this._init = function(){
        $scope.venueLoaded = false;
        $scope.session = $sessionStorage;
        $scope.venue = {};
        $scope.venueList = $scope.queryVenues();

        if($stateParams.createdVenue){
          $scope.showSuccessMsg();
          $timeout(function () { $scope.hideSuccessMsg(); }, 3000);
        }
        else{
          $scope.hideSuccessMsg();
        }
      };

      $scope.hasPermission = function(role){
        return $scope.session.user !== undefined && $scope.session.user.role == role;
      };

      $scope.queryVenues = function(){
        Venue.query().$promise
          .then(function(data){
            $scope.venueList = data;
            $scope.session.venues = $scope.venueList;
          })
          .catch(function(data){
            //console.log("error querying venues")
          });
      };

      $scope.deleteVenue = function(venueId){
        Venue.remove({id: venueId}).$promise
          .then(function(data){
            $scope.venueList = $scope.queryVenues();
            state.go("adminDashboard.venues");
          })
          .catch(function(data){
            //console.log("an error occurred while deleting venue");
          });
      };

      $scope.deleteVenues = function(){
        for(var i=0; i<$scope.venueList.length; i++){
          if($scope.venueList[i].selected){
            Venue.remove({id: $scope.venueList[i].id}).$promise
              .then(function(data){
                $scope.venueList = $scope.queryVenues();
                $scope.session.venues = $scope.venueList;
              })
              .catch(function(data){
                //console.log("an error occurred while deleting venue");
              });
            }
          }
      };

      $scope.editVenue = function(venueId){
        $scope.session.last_venue_id = venueId;
        state.go("adminDashboard.editVenue", {venue_id: venueId});
      };

      $scope.showCreatePanel = function(venue){
        $scope.venueLoaded = false;
        $scope.venue = {};
      };

      $scope.showPromotionsList = function(venueId){
        $scope.session.activeViewId = 3;
        state.go("adminDashboard.venuePromotions", {venue_id: venueId});
      };

      $scope.isActive = function(object) {
        return object.active === true;
      };

      $scope.selectAll = function(selected){
        for(var i=0; i<$scope.venueList.length; i++){
          $scope.venueList[i].selected = selected;
        }
      };

      $scope.previewImage = function(files){
        var reader = new FileReader();
        if(typeof files[0] === 'object' && typeof files[1] == 'Blob'){
          reader.readAsDataURL(files[0]);
        }
        reader.onload = function(event){
          $scope.venue.url = files[0].url;
          $scope.$apply();
        }
      };

      $scope.showSuccessMsg = function(){
        $scope.isVenueCreatedSuccessfully = true;
      }

      $scope.hideSuccessMsg = function(){
        $scope.isVenueCreatedSuccessfully = false;
      }

      this._init();
    }
  ]
);

venue.controller('VenueCreationController',
  ['$scope', 'Venue', '$state', '$stateParams', '$auth', '$rootScope', '$sessionStorage',
    function($scope, Venue, state, $stateParams, $auth, $rootScope, $sessionStorage) {
      this._init = function(){
        $scope.session = $sessionStorage;
        $auth.validateUser();
        $scope.categories = ["Bar","Night Club"];
        $scope.venue = {};
        $scope.errors = [];
      };

      $scope.hasPermission = function(role){
        return $scope.session.user !== undefined && $scope.session.user.role == role;
      };

      $scope.createVenue = function(venueValid){
        if(venueValid){
          Venue.save($scope.venue).$promise
            .then(function(data){
              state.go("adminDashboard.venues", {createdVenue: true});
            })
            .catch(function(data){
              $scope.errors.push("There was an error creating venue");
              $scope.showError = true;
            console.log("there was an error creating venue : "+Object.keys(data)+ " :: " +data.status+"  :: "+data.headers);
            });

        }
      };

      $scope.previewImage = function(files){
        $scope.venue.url = files[0].url;

        var reader = new FileReader();
        if(typeof files[0] == 'Blob'){
          reader.readAsDataURL(files[0]);
        }
        reader.onload = function(event){
          $scope.venue.url = files[0].url;
          $scope.$apply();
        }
      };

      $scope.showErrorMsg = function(){
        $scope.showError = true;
      }

      $scope.hideErrorMsg = function(){
        $scope.showError = false;
      }

      this._init();
    }
  ]
);

venue.controller('VenueDetailsController',
  ['$scope', 'Venue', '$state', '$stateParams', '$auth', '$rootScope',
    function($scope, Venue, state, stateParams, $auth, $rootScope)
    {
      $auth.validateUser();
      $scope.categories = ["Bar","Night Club","Brewery"];
      $scope.errors = [];

      $scope.loadVenue = function(){
        Venue.get({id: stateParams.venue_id}).$promise
          .then(function(data){
            $scope.venue = data;
          })
          .catch(function(data){
            $scope.errors.push("An error occurred while updating venue");
            $scope.showError = true;
          });
      };

      $scope.updateVenue = function(venueValid){
        if(venueValid){
          Venue.update($scope.venue).$promise.then(function(data){
            state.go("adminDashboard.venues");
          })
          .catch(function(data){
            $scope.errors.push(data.errors);
          });
        }
      };

      $scope.previewImage = function(files){
        $scope.venue.url = files[0].url;
      };

      $scope.loadVenue();
    }
  ]
);

venue.controller('VenuePromotionsIndexController',
  ['$scope', 'VenuePromotion', '$stateParams','$sessionStorage',
    function($scope, VenuePromotion, stateParams, $sessionStorage) {
      VenuePromotion.getNearMe({venue_id: stateParams.venue_id}).$promise
        .then(function(data){
          $scope.promotionList = data;
        })
        .catch(function(data){
          $scope.errors.push(data.errors);
          //console.log("error querying venues")
        });
    }
  ]
)
