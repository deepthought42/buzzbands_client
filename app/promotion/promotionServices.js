var services = angular.module('buzzbands.PromotionService', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('Promotion', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/promotions/:id.json', {id: '@id'}, {
    update: { method: 'PUT'}
  });
}]);
