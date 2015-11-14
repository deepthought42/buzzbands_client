'use strict';

angular.module('buzzbands.BandsControllers', ['ui.router', 'buzzbands.BandsService', 'stripe.checkout'])

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
     return [
       {'id':'Yellow',
        'href':''},
       {'id':'Red',
        'href':'//href here for image'},
       {'id':'Green',
        'href':''},
       {'id':'Orange',
        'href':''},
       {'id':'Blue',
        'href':''}];
   };

   var getPackages = function(){
     return [{
       count: '250',
       price: '-25.00'
     },{
       count: '500',
       price: '-50.00'
     },{
       count: '750',
       price: '-75.00'
     },{
       count: '1000',
       price: '-100.00'
     },{
       count: '10000',
       price: '-1000.00'
     }]
   };

   $scope.bandPackages = getPackages();
   $scope.bandColors = getBandColors();

}]);
