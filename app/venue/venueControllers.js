'use strict';

angular.module('buzzbands_client.VenueControllers', ['ui.router', 'buzzbands.VenueService'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('venues', {
    url: '/venues',
    templateUrl: 'app/venue/index.html',
    controller: 'VenueIndexController'
  })
  .state('venue/edit', @id, {
    url: '/venues/:id',
    templateUrl: 'app/venue/edit.html',
    controller: 'VenueUpdateController'
  })
  .state('venue/new',{
    url: '/venues/new',
    templateUrl: 'app/venue/new.html',
    controller: 'VenueCreationController'
  });
}])

.controller('VenueIndexController', ['$scope', 'Venue', '$state', function($scope, Venue, state) {
  $scope.venueList = Venue.query();

  $scope.addVenue = function(){
    state.go('venue/edit');
  }

  $scope.deleteVenue = function(venueId){
    Venue.delete(venueId);
  }

  $scope.editVenue = function(venueId){
    state.go("venue/edit", venueId);
  }
}])

.controller('VenueCreationController', ['$scope', 'Venue', function($scope, Venue) {
  $scope.venue = {};

  $scope.createVenue = function(venueValid){
    if(venueValid){
      Venue.save($scope.venue)
    }
  }

}]);

.controller('VenueDetailsController', ['$scope', 'Venue', '$state', function($scope, Venue, state) {
  $scope.venueList = Venue.get(1);

  $scope.updateVenue = function(venueValid){
    if(venueValid){
      Venue.update($scope.venue)
    }
  }
}])
