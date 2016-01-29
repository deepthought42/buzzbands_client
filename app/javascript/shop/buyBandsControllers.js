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
.controller('BuyBandsController', ['$scope',
                                   'Bands',
                                   'BandPackages',
                                   'Order',
                                   'Venue',
                                   '$state',
                                   '$sessionStorage',
  function($scope, Bands, BandPackages, Order, Venue, state, session) {
  /**
   * Initializes controller
   */
   this.init = function(){
     $scope.$session = session;
     $scope.bandColors = this.getBandColors();
     $scope.venues = $scope.$session.venues || Venue.query();
     $scope.order = {};

     BandPackages.query().$promise.then(function(data){
       $scope.packages = data;
       //$scope.order.package = $scope.packages[0];
     });
   }

   $scope.submitPayment = function(status, response){
     if(response.error) {
       // there was an error. Fix it.
     } else {
       // got stripe token, now charge it or smt
       session.order.paymentToken = response.id

       Order.save(session.order);

       session.order = {};
     }
   }

   $scope.placeOrder = function(order){
     order.price = $scope.package.price;
     order.band_count = $scope.package.count;
     order.user_id = session.user.id;
     order.status = "submitted";
     session.order = order;

     state.go("adminDashboard.checkout");
   }

   this.getBandColors = function(){
     return [
       {id:'Yellow',
        href:'./images/yellow.png'},
       {id:'Red',
        href:'./images/red.png'},
       {id:'Green',
        href:'./images/green.png'},
       {id:'Orange',
        href:'./images/orange.png'},
       {id:'Blue',
        href:'./images/blue.png'},
        {id:'White',
         href:'./images/white.png'}];
   };

   $scope.hasPermission = function(role){
    return session.user && session.user.role == role;
   }

   this.init();
}]);
