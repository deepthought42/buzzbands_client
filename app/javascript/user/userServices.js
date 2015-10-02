var services = angular.module('buzzbands.UserServices', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('User', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
    return $resource(config.basePath +'/admin/users/:id.json', {id: '@id'}, {
        save: { method: 'PUT'},
        getRoles: { url: config.basePath + '/admin/users/:id/roles.json', method: 'GET', isArray: true }
    });
  }
]);
