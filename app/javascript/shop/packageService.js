/**
 *  Service for Packages
 */
services.factory('Packages', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/packages', {}, {

  });
}]);
