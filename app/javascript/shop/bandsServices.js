var services = angular.module('buzzbands.BandsService', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('Bands', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/bands', {}, {
    update: { method: 'PUT'}
  });
}]);

/**
 *  Service for Packages
 */
services.factory('Packages', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/packages', {}, {
  
  });
}]);
