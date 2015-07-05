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

.controller('VenueIndexController', ['$scope', 'Venue', function($scope, Venue) {
  $scope.venueList = Venue.query();
}])

.controller('VenueCreationController', ['$scope', 'Venue', function($scope, Venue) {
  $scope.venue = Venue.new();
}]);
