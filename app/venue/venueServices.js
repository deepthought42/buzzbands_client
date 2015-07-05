var services = angular.module('buzzbands.VenueService', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('Venue', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/venues/:id.json', {id: '@id'}, {
    save: { method: 'PUT'}
  });
}]);
