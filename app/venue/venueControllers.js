'use strict';

angular.module('buzzbands_client.VenueControllers', ['ui.router', 'buzzbands.VenueService', 'mwl.confirm'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('venues', {
    url: '/venues',
    views: {
      '': {
        templateUrl: 'app/views/venue/index.html',
        controller: 'VenueIndexController'
      },
      'new@venues': {
        templateUrl: 'app/views/venue/new.html',
        controller: 'VenueCreationController'
      }
    }
  })
  .state('venue/edit', {
    url: '/venues/:id',
    templateUrl: 'app/views/venue/edit.html',
    controller: 'VenueDetailsController'
  });
}])

.controller('VenueIndexController', ['$scope', 'Venue', '$state', '$sessionStorage', function($scope, Venue, state, session) {
  if (!session.user) {
    state.go("authenticate");
  }

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

  $scope.addVenue = function(){
    state.go('venue/new');
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

  $scope.editVenue = function(venueId){
    state.go("venue/edit", {"id" : venueId});
  }

  $scope.showPromotionsList = function(venueId){
    state.go("promotions", {"venueId": venueId});
  }

  $scope.venueList = $scope.queryVenues();
}])

.controller('VenueCreationController', ['$scope', 'Venue', '$state', function($scope, Venue, state) {
  $scope.venue = {};

  $scope.createVenue = function(venueValid){
    if(venueValid){
      console.log("SAVING VENUE..");
      Venue.save($scope.venue).$promise
        .then(function(data){
          state.go("venues");
        })
        .catch(function(data){
          console.log("there was an error creating venue");
        });
    }
  }
}])

.controller('VenueDetailsController', ['$scope', 'Venue', '$state', '$stateParams',
  function($scope, Venue, state, stateParams)
  {
    $scope.venue={}

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
