var services = angular.module('buzzbands.UserServices', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('User', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
    return $resource(config.basePath +'/users/:id.json', {id: '@id'}, {
        save: { method: 'PUT'}
    });
  }
]);
