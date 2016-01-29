var services = angular.module('buzzbands.AccountService', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('Account', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/accounts/:id.json', {id: '@id'}, {
    update: { method: 'PUT'}
  });
}]);
