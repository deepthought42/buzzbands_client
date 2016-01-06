'use strict';

angular.module('buzzbands.BandsControllers', ['ui.router',
                                              'buzzbands.BandsService',
                                              'buzzbands.VenueService',
                                              'stripe.checkout'])

.config(['StripeCheckoutProvider',
  function(StripeCheckoutProvider) {
    // You can use the provider to set defaults for all handlers
    // you create. Any of the options you'd pass to
    // StripeCheckout.configure() are valid.
    StripeCheckoutProvider.defaults({
      key: "YOUR PUBLISHABLE STRIPE KEY"
    });
}]).run(function( StripeCheckout) {
  // Setting defaults
  StripeCheckout.defaults({
    opened: function() {
    //  $log.debug("Stripe Checkout opened");
    },
    closed: function() {
    //  $log.debug("Stripe Checkout closed");
    }
  });
})
.controller('BuyBandsController', ['$scope',
                                   'Bands',
                                   'Packages',
                                   '$state',
                                   '$sessionStorage',
  function($scope, Bands, Packages, state, session) {
    // You should configure a handler when the view is loaded,
   // just as you would if you were using checkout.js directly.
   var handler = StripeCheckout.configure({
       name: "Buy Bands",
       token: function(token, args) {
         $log.debug("Got stripe token: " + token.id);
       }
   });

  /**
   * Initializes controller
   */
   this.init = function(){
     $scope.bandColors = this.getBandColors();
     $scope.venues = session.venues;
     $scope.order = {};

     Packages.query().$promise.then(function(data){
       $scope.packages = data;
       $scope.order.package = $scope.packages[0];
     });
   }

   this.doCheckout = function(token) {
       alert("Got Stripe token: " + token.id);
   };

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

   this.init();
}]);
