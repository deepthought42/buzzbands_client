var services = angular.module('buzzbands.OrderService', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('Order', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/orders/:id.json', {id: '@id'}, {
    update: { method: 'PUT'},
    getPreviousMonthOrders: { method: "GET",
                              url: config.basePath+"/orders/analytics/previousMonthBandOrders",
                              isArray:true}
  });
}]);
