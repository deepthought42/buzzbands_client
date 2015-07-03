var services = angular.module('buzzbands.promoterServices', ['ngResource']);

services.factory('User', function ($resource) {
    return $resource('/users/:id.json', {id: '@id'}, {
        save: { method: 'PUT'}
    });
});
