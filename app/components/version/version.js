'use strict';

angular.module('buzzbands_client.version', [
  'buzzbands_client.version.interpolate-filter',
  'buzzbands_client.version.version-directive'
])

.value('version', '0.1');
