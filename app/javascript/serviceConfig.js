// Module specific configuration
angular.module('buzzbands.serviceConfig', [])
  .value('buzzbands.serviceConfig', {
    devBasePath: 'http://localhost:3000',// Set your base path here
    productionBasePath: 'https://hypedrive-api.herokuapp.com',
    basePath: 'http://localhost:3000'
  });
