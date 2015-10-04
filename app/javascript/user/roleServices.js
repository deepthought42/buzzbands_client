var services = angular.module('buzzbands.RoleServices', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('Role', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
    return ["user","worker","manager","admin"];
  }
]);
