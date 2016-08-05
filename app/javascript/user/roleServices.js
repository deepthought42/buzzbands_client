var services = angular.module('buzzbands.RoleServices', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('Role', function () {
    return [
      {
        id: "0",
        name: "user"
      },
      {
        id: "2",
        name: "admin"
      },
      {
        id : "3",
        name: "hypedrive_employee"
      }
    ];
  }
);
