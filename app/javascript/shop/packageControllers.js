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
.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('servicePackage', {
    url: '/servicePackage',
    templateUrl: 'app/views/shop/packageSelection.html',
    controller: 'BuyPackageController'
  })
}])
.controller('BuyPackageController', ['$scope',
                                   'Bands',
                                   'Packages',
                                   '$state',
                                   '$sessionStorage',
  function($scope, Bands, Packages, Order, state, session) {
  /**
   * Initializes controller
   */
   this.init = function(){
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
       console.log("ERROR :: "+response.error);
     } else {
       $scope.account.stripeToken = response.id
       Account.save($scope.account.stripeToken);
     }
   }

   $scope.orderPackage = function(chosenPackage){
     session.package = chosenPackage;

     state.go("adminDashboard.checkout");
   }

   this.init();
}]);
