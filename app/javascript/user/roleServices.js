var services = angular.module('buzzbands.RoleServices', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('Role', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
    return [{
      id: 1,
      name: "admin"
    },{
      id: 2,
      name: "regular"
    },{
      id:3,
      name: "manager"
    },{
      id: 4,
      name: "worker"
    }
    ]
  }
]);
