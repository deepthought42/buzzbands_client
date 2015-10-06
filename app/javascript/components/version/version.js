'use strict';

angular.module('buzzbands.version', [
  'buzzbands.version.interpolate-filter',
  'buzzbands.version.version-directive'
])

.value('version', '0.1');
