var services = angular.module('buzzbands.RoleServices', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('Role', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
    return [{id:1, name: "user"},
            {id:2, name: "worker"},
            {id:3, name: "manager"},
            {id:4, name: "admin"}];
  }
]);
