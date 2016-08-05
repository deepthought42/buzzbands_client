var services = angular.module('hypedrive.Package', ['ngResource', 'buzzbands.serviceConfig']);

/**
 *  Service for Packages
 */
services.factory('Package', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/packages', {}, {
  });
}]);
