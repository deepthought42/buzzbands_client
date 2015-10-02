var services = angular.module('buzzbands.UserServices', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('User', function ($resource) {
    return $resource(config.basePath +'/users/:id.json', {id: '@id'}, {
        save: { method: 'PUT'}
    });
});
