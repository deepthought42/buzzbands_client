var venueService = angular.module('buzzbands.VenueService', ['ngResource', 'buzzbands.serviceConfig']);

venueService.factory('Venue', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/venues/:id.json', {id: '@id'}, {
    update: { method: 'PUT'}
  });
}]);
venueService.factory('VenuePromotion', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/venues/:venue_id/promotions',
    {venue_id: '@venue_id'},
    {
      update: { method: 'PUT'}
    });
}]);
