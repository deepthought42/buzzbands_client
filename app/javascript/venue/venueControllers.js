'use strict';

angular.module('buzzbands.VenueControllers', ['ui.router', 'buzzbands.VenueService', 'mwl.confirm'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('venues', {
      url: '/venues',
      templateUrl: 'app/views/venue/index.html',
      controller: 'VenueIndexController'
    });
}])

.controller('VenueIndexController',
  ['$scope', 'Venue', '$state', '$sessionStorage', '$rootScope',
    function($scope, Venue, $state, $sessionStorage, $rootScope) {
      this._init = function(){
        $scope.venueLoaded = false;
        $scope.$session = $sessionStorage;
        $scope.venue = {};
        $scope.venueList = $scope.queryVenues();
      }

      $scope.hasPermission = function(role){
        return $scope.$session.user !== undefined && $scope.$session.user.role == role;
      }

      $scope.queryVenues = function(){
        Venue.query().$promise
          .then(function(data){
            $scope.venueList = data;
            $scope.$session.venues = $scope.venueList;
          })
          .catch(function(data){
            console.log("error querying venues")
          });
      }

      $scope.deleteVenue = function(venueId){
        Venue.remove({id: venueId}).$promise
          .then(function(data){
            $scope.venueList = $scope.queryVenues();
            $state.go("venues");
          })
          .catch(function(data){
            console.log("an error occurred while deleting venue");
          });
      }

      $scope.deleteVenues = function(){
        for(var i=0; i<$scope.venueList.length; i++){
          if($scope.venueList[i].selected){
            Venue.remove({id: $scope.venueList[i].id}).$promise
              .then(function(data){
                $scope.venueList = $scope.queryVenues();
                $scope.$session.venues = $scope.venueList;
              })
              .catch(function(data){
                console.log("an error occurred while deleting venue");
              });
            }
          }
      }

      $scope.editVenue = function(venueId){
        $scope.$session.last_venue_id = venueId;
        $state.go("adminDashboard.editVenue", {venue_id: venueId});
      }

      $scope.showCreatePanel = function(venue){
        $scope.venueLoaded = false;
        $scope.venue = {};
      }

      $scope.showPromotionsList = function(venueId){
        $state.go("adminDashboard.venuePromotions", {venue_id: venueId});
      }

      $scope.isActive = function(object) {
        return object.active === true;
      }

      $scope.selectAll = function(selected){
        for(var i=0; i<$scope.venueList.length; i++){
          $scope.venueList[i].selected = selected
        }
      }

      $scope.previewImage = function(files){
        var reader = new FileReader();
        if(typeof files[0] === 'object' && typeof files[1] === 'Blob'){
          reader.readAsDataURL(files[0]);
        }
        reader.onload = function(event){
          $scope.venue.url = files[0].url;
          $scope.$apply()
        }
      }

      this._init();
    }
  ]
)

.controller('VenueCreationController',
  ['$scope', 'Venue', '$state', '$stateParams', '$auth', '$rootScope', '$sessionStorage',
    function($scope, Venue, state, $stateParams, $auth, $rootScope, $sessionStorage) {
      this._init = function(){
        $scope.$session = $sessionStorage;
        $auth.validateUser();
        $scope.categories = ["Bar","Night Club"];
        $scope.venue = {};
      }

      $scope.hasPermission = function(role){
        return $scope.$session.user.role == role;
      }

      $scope.createVenue = function(venueValid){
        if(venueValid){
          Venue.save($scope.venue).$promise
            .then(function(data){
              $state.go("venues");
            })
            .catch(function(data){
              console.log("there was an error creating venue");
            });
        }
      }

      $scope.previewImage = function(files){
        $scope.venue.url = files[0].url;

        var reader = new FileReader();
        if(typeof files[0] == 'Blob'){
          reader.readAsDataURL(files[0]);
        }
        reader.onload = function(event){
          $scope.venue.url = files[0].url;
          $scope.$apply()
        }
      }

      this._init();
    }
  ]
)

.controller('VenueDetailsController',
  ['$scope', 'Venue', '$state', '$stateParams', '$auth', '$rootScope',
    function($scope, Venue, state, stateParams, $auth, $rootScope)
    {
      $auth.validateUser();
      $scope.categories = ["Bar","Night Club"];

      $scope.loadVenue = function(){
        Venue.get({id: stateParams.venue_id}).$promise
          .then(function(data){
            $scope.venue = data;
          })
          .catch(function(data){
            console.log("ERR  :: "+ data)
          });
      }

      $scope.updateVenue = function(venueValid){
        if(venueValid){
          Venue.update($scope.venue).$promise.then(function(data){
            $state.go("venues");
          });
        }
      }

      $scope.previewImage = function(files){
        $scope.venue.url = files[0].url;
      }

      $scope.loadVenue();
    }
  ]
)

.controller('VenuePromotionsIndexController',
  ['$scope', 'VenuePromotion', '$stateParams','$sessionStorage',
    function($scope, VenuePromotion, stateParams, $sessionStorage) {
      VenuePromotion.query({venue_id: stateParams.venue_id}).$promise
        .then(function(data){
          $scope.promotionList = data;
        })
        .catch(function(data){
          console.log("error querying venues")
        });
    }
  ]
)
