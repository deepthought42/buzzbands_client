'use strict';

angular.module('buzzbands_client.VenueControllers', ['ui.router', 'buzzbands.VenueService', 'mwl.confirm'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('venues', {
      url: '/venues',
      templateUrl: 'app/views/venue/index.html',
      controller: 'VenueIndexController'
    });
}])

.controller('VenueIndexController', ['$scope', 'Venue', '$state', '$sessionStorage', function($scope, Venue, state, session) {
  $scope.userLoaded = false;

  $scope.queryVenues = function(){
    Venue.query().$promise
      .then(function(data){
        console.log("successfully queried venues :: "+data);
        $scope.venueList = data;
      })
      .catch(function(data){
        console.log("error querying venues")
      });
  }

  $scope.deleteVenue = function(venueId){
    Venue.remove({id: venueId}).$promise
      .then(function(data){
        $scope.venueList = $scope.queryVenues();
        state.go("venues");
      })
      .catch(function(data){
        console.log("an error occurred while deleting venue");
      });
  }

  $scope.editVenue = function(venue){
    $scope.userLoaded = true;
    $scope.venue = venue;
  }

  $scope.showPromotionsList = function(venueId){
    state.go("promotions", {"venueId": venueId});
  }

  $scope.$on("refreshVenuesList", function(event, data){
    $scope.venueList = $scope.queryVenues();
  })
  $scope.venueList = $scope.queryVenues();
}])

.controller('VenueCreationController', ['$scope', 'Venue', '$state', '$auth', '$rootScope',
  function($scope, Venue, state, $auth, $rootScope) {
  //$scope.venue = {};
  $auth.validateUser();
  $scope.createVenue = function(venueValid){
    if(venueValid){
      console.log("SAVING VENUE..");
      Venue.save($scope.venue).$promise
        .then(function(data){
          $rootScope.$broadcast("refreshVenuesList");
          //clear fields
        })
        .catch(function(data){
          console.log("there was an error creating venue");
        });
    }
  }
}])

.controller('VenueDetailsController', ['$scope', 'Venue', '$state', '$stateParams', '$auth',
  function($scope, Venue, state, stateParams, $auth)
  {
    $auth.validateUser();
    console.log("EDITING VENUE: "+$scope.venue);
    $scope.loadVenue = function(){
      if(stateParams.id){
        console.log("ID FOUND FOR VENUE");
        Venue.get({id: stateParams.id}).$promise
          .then(function(data){
            $scope.venue = data;
          })
          .catch(function(data){
            console.log("ERR  :: "+ data)
          });
      }
    }

    $scope.updateVenue = function(venueValid){
      if(venueValid){
        Venue.update($scope.venue)
      }
    }
  }
])
