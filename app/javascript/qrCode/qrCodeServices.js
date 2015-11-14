var services = angular.module('buzzbands.QrCodeService', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('QrCode', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/qrCode/:id.json', {id: '@id'}, {
    update: { method: 'PUT'}
  });
}]);
