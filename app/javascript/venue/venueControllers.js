'use strict';

angular.module('buzzbands.VenueControllers', ['ui.router', 'buzzbands.VenueService', 'mwl.confirm'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('venues', {
      url: '/venues',
      templateUrl: 'app/views/venue/index.html',
      controller: 'VenueIndexController'
    });
}])

.controller('VenueIndexController', ['$scope', 'Venue', '$state', '$localStorage','$sessionStorage', function($scope, Venue, state, session) {
  $scope.venueLoaded = false;

  $scope.queryVenues = function(){
    Venue.query().$promise
      .then(function(data){
        console.log("successfully queried venues :: "+data);
        $scope.venueList = data;
      })
      .catch(function(data){
        console.log("error querying venues")
      });
  }

  $scope.deleteVenue = function(venueId){
    Venue.remove({id: venueId}).$promise
      .then(function(data){
        $scope.venueList = $scope.queryVenues();
        state.go("venues");
      })
      .catch(function(data){
        console.log("an error occurred while deleting venue");
      });
  }

  $scope.editVenue = function(venue){
    $scope.venueLoaded = true;
    $scope.venue = venue;
  }


  $scope.showCreatePanel = function(venue){
    $scope.venueLoaded = false;
    $scope.venue = {};
  }

  $scope.showPromotionsList = function(venueId){
    state.go("promotions.dashboard", {"venueId": venueId});
  }

  $scope.isActive = function(object) {
    return object.active === true;
  }

  $scope.$on("refreshVenuesList", function(event, data){
    $scope.venueList = $scope.queryVenues();
  })

  $scope.$on("showCreateVenueView", function(event, data){
    $scope.venueLoaded = false;
  })
  $scope.venueList = $scope.queryVenues();
}])

.controller('VenueCreationController', ['$scope', 'Venue', '$state', '$auth', '$rootScope', '$sessionStorage',
  function($scope, Venue, state, $auth, $rootScope, $sessionStorage) {
    $scope.$session = $sessionStorage;
    $auth.validateUser();

    $scope.hasPermission = function(role){0
      return $scope.$session.roles[0].name == role;
    }

  $scope.createVenue = function(venueValid){
    if(venueValid){
      Venue.save($scope.venue).$promise
        .then(function(data){
          $rootScope.$broadcast("refreshVenuesList");
          $scope.venue = {};

          //clear fields
        })
        .catch(function(data){
          console.log("there was an error creating venue");
        });
    }

  }
  $scope.previewImage = function(files){
    $scope.setUrl(files);
    var reader = new FileReader();
    if(typeof files[0] === 'object'){
      reader.readAsDataURL(files[0]);
    }
    reader.onload = function(event){
      $scope.logo_url = reader.result;
      $scope.venue.url = files[0].url;
      $scope.$apply()
    }
  }

  $scope.setUrl = function(files){
    $scope.venue.url = files[0].url;
  }

}])

.controller('VenueDetailsController', ['$scope', 'Venue', '$state', '$stateParams', '$auth', '$rootScope',
  function($scope, Venue, state, stateParams, $auth, $rootScope)
  {
    $auth.validateUser();
    $scope.loadVenue = function(){
      if(stateParams.id){
        Venue.get({id: stateParams.id}).$promise
          .then(function(data){
            $scope.venue = data;
          })
          .catch(function(data){
            console.log("ERR  :: "+ data)
          });
      }
    }

    $scope.updateVenue = function(venueValid){
      if(venueValid){
        Venue.update($scope.venue).$promise.then(function(data){
          $scope.venue = {};
          $rootScope.$broadcast("showCreateVenueView");
        });
      }
    }

  }
])
