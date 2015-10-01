'use strict';

angular.module('buzzbands_client.BandsControllers', ['ui.router', 'buzzbands.BandsService', 'stripe.checkout'])

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
.controller('BuyBandsController', ['$scope', 'Bands', '$state', '$sessionStorage',
  function($scope, Bands, state, session) {
    // You should configure a handler when the view is loaded,
   // just as you would if you were using checkout.js directly.
   var handler = StripeCheckout.configure({
       name: "Buy Bands",
       token: function(token, args) {
         $log.debug("Got stripe token: " + token.id);
       }
   });
   this.doCheckout = function(token) {
       alert("Got Stripe token: " + token.id);
   };

   var getBandColors = function(){
     return ['Yellow', 'Red', 'Green', 'Orange', 'Blue'];
   };

   var getPackages = function(){
     return [{
       count: '250',
       price: '-1.00'
     },{
       count: '500',
       price: '-1.00'
     },{
       count: '750',
       price: '-1.00'
     },{
       count: '1000',
       price: '-1.00'
     },{
       count: '10000',
       price: '-1.00'
     }]
   };

   $scope.bandPackages = getPackages();
   $scope.bandColors = getBandColors();

}]);
