var services = angular.module('buzzbands.RoleServices', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('Role', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
    return [{id:1, name: "User"},
            {id:2, name: "Worker"},
            {id:3, name: "Admin"},
            {id:4, name: "BuzzBands Employee"}];
  }
]);
