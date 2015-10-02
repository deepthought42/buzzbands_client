var services = angular.module('buzzbands.UserServices', ['ngResource']);

services.factory('User', function ($resource) {
    return $resource('/users/:id.json', {id: '@id'}, {
        save: { method: 'PUT'}
    });
});
