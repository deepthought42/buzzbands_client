var services = angular.module('buzzbands.userServices', ['ngResource']);

services.factory('User', function ($resource) {
    return $resource('/users/:id.json', {id: '@id'}, {
        save: { method: 'PUT'}
    });
});
