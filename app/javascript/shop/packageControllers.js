'use strict';

angular.module('buzzbands.BandsControllers', ['ui.router',
                                              'buzzbands.BandsService',
                                              'buzzbands.VenueService',
                                              'buzzbands.OrderService',
                                              'angularPayments'])

.config(
  function() {
    Stripe.setPublishableKey('pk_test_kZbH5pE5QrS1wyz7tHeLYY27');

})
.controller('BuyPackageController', ['$scope',
                                   'Bands',
                                   'Packages',
                                   'Order',
                                   '$state',
                                   '$sessionStorage',
  function($scope, Bands, Packages, Order, state, session) {
  /**
   * Initializes controller
   */
   this.init = function(){
     $scope.bandColors = this.getBandColors();
     $scope.venues = session.venues;
     $scope.order = {};

     Packages.query().$promise.then(function(data){
       $scope.packages = data;
       //$scope.order.package = $scope.packages[0];
     });
   }

    /**
    *
    */
   $scope.submitPayment = function(status, response){
     if(response.error) {
       // there was an error. Fix it.
     } else {
       // got stripe token, now charge it or smt
       session.order.paymentToken = response.id

       Package.save(session.package);
     }
   }

   $scope.orderPackage = function(chosenPackage){
     session.package = chosenPackage;

     state.go("adminDashboard.checkout");
   }

   this.init();
}]);
