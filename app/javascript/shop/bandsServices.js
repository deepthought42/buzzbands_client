var services = angular.module('buzzbands.BandsService', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('Bands', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/bands/:id.json', {id: '@id'}, {
    update: { method: 'PUT'}
  });
}]);
