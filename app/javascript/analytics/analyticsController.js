'use strict';

angular.module('buzzbands.AnalyticsControllers', ['ui.router',
                                                  'buzzbands.VenueService',
                                                  'buzzbands.OrderService',
                                                  'nvd3'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('analytics', {
    views: {
      '': {
        templateUrl: 'app/views/analytics/index.html',
        controller: 'AnalyticsController'
      }
    }
  })
}])

.controller('AnalyticsController', ['$scope', 'Venue','Promotion', 'Order',
  function($scope, Venue, Promotion, Order) {

  $scope._init = function(){
    $scope.promotions = Promotion.query();
    $scope.bandsOrdered = Order.getPreviousMonthOrders();
    $scope.activeAccounts = Venue.query();
    $scope.totalScans = [{values:[{x:1,y:1},{x:2,y:2},{x:3,y:3}], key: 'Scans', //key  - the name of the series.
                    color: '#ff7f0e'}];
    $scope.topAccounts;
    $scope.topPromotions;
  }
  $scope._init();

  $scope.options = {
        chart: {
            type: 'lineChart',
            height: 200,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: true,
            dispatch: {
                stateChange: function(e){ console.log("stateChange"); },
                changeState: function(e){ console.log("changeState"); },
                tooltipShow: function(e){ console.log("tooltipShow"); },
                tooltipHide: function(e){ console.log("tooltipHide"); }
            },
            xAxis: {
                axisLabel: 'Time'
            },
            yAxis: {
                axisLabel: 'Scans',
                axisLabelDistance: -10
            },
            callback: function(chart){
                console.log("!!! lineChart callback !!!");
            }
        }
    };

  $scope.data = $scope.totalScans;
}])
