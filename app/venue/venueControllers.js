'use strict';

angular.module('buzzbands_client.VenueControllers', ['ui.router', 'buzzbands.VenueService'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('venues', {
    url: '/venues',
    templateUrl: 'app/venue/index.html',
    controller: 'VenueIndexController'
  })
  .state('venue/edit',{
    url: '/venues/edit',
    templateUrl: 'app/venue/edit.html',
    controller: 'VenueCreationController'
  });
}])

.controller('VenueIndexController', ['$scope', 'Venue', '$state', function($scope, Venue, state) {
  $scope.venueList = Venue.query();

  $scope.addVenue = function(){
    state.go('venue/edit')
  }
}])

.controller('VenueCreationController', ['$scope', 'Venue', function($scope, Venue) {
  $scope.venue = {};

  $scope.updateVenue = function(venueValid){
    if(venueValid){
      Venue.save($scope.venue)
    }
  }
}]);
