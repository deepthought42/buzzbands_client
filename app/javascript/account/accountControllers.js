'use strict';

angular.module('buzzbands.AccountControllers',
  ['ui.router', 'buzzbands.AccountService', 'mwl.confirm', 'angularPayments'])
  .config(['$stateProvider',
    function($stateProvider) {

      $stateProvider
        .state('account', {
          url: '/signup',
          views: {
            '':{
              templateUrl: 'app/views/account/new.html',
              controller: 'AccountCreationController'
            },
            'signup@account':{
              templateUrl: 'app/views/auth/register.html'
            },
            'info@account':{
              templateUrl: 'app/views/account/info.html'
            },
            'checkout@account':{
              templateUrl: 'app/views/shop/stripeCheckout.html',
              controller : 'AccountCreationController'
            }
          }
        })
    }
  ])
.controller('AccountIndexController',
  ['$scope', 'Account', '$state', '$sessionStorage', '$rootScope',
    function($scope, Account, state, $sessionStorage, $rootScope) {
      this._init = function(){
        $scope.accountLoaded = false;
        $scope.session = $sessionStorage;
        $scope.account = {};
        $scope.accountList = $scope.queryAccounts();
      }

      $scope.hasPermission = function(role){
        return $scope.session.user !== undefined && $scope.session.user.role == role;
      }

      $scope.queryAccounts = function(){
        Account.query().$promise
          .then(function(data){
            $scope.accountList = data;
            $scope.session.accounts = $scope.accountList;
          })
          .catch(function(data){
            console.log("error querying accounts")
          });
      }

      $scope.deleteAccount = function(accountId){
        Account.remove({id: accountId}).$promise
          .then(function(data){
            $scope.accountList = $scope.queryAccounts();
            state.go("adminDashboard.accounts");
          })
          .catch(function(data){
            console.log("an error occurred while deleting account");
          });
      }

      $scope.deleteAccounts = function(){
        for(var i=0; i<$scope.accountList.length; i++){
          if($scope.accountList[i].selected){
            Account.remove({id: $scope.accountList[i].id}).$promise
              .then(function(data){
                $scope.accountList = $scope.queryAccounts();
                $scope.session.accounts = $scope.accountList;
              })
              .catch(function(data){
                console.log("an error occurred while deleting account");
              });
            }
          }
      }

      $scope.edit = function(accountId){
        $scope.session.last_account_id = accountId;
        state.go("adminDashboard.editAccount", {account_id: accountId});
      }

      $scope.showCreatePanel = function(account){
        $scope.accountLoaded = false;
        $scope.account = {};
      }

      $scope.isActive = function(object) {
        return object.active === true;
      }

      $scope.selectAll = function(selected){
        for(var i=0; i<$scope.accountList.length; i++){
          $scope.accountList[i].selected = selected
        }
      }

      this._init();
    }
  ]
)

.controller('AccountCreationController',
  ['$scope', 'Account', '$state', '$stateParams', '$auth', '$rootScope', '$sessionStorage',
    function($scope, Account, state, $stateParams, $auth, $rootScope, $sessionStorage) {
      this._init = function(){
        $scope.session = $sessionStorage;
        $scope.session.registered = false;
        $auth.validateUser();
        $scope.categories = ["Bar","Night Club"];
        $scope.account = {};
      }

      $scope.hasPermission = function(role){
        return $scope.session.user.role == role;
      }

      $scope.createAccount = function(accountValid){
        if(accountValid){
          Account.save($scope.account).$promise
            .then(function(data){
              state.go("adminDashboard.accounts");
            })
            .catch(function(data){
              console.log("there was an error creating account");
            });
        }
      }

      $scope.submitPayment = function(status, response){
        if(response.error) {
          console.log("an error occurred while processing payment");
          // there was an error. Fix it.
        } else {
          // got stripe token, now charge it or smt
          $scope.account.stripeToken = response.id
          Account.save({account: $scope.account});

          if($scope.$session.user.role == 'admin' || $scope.$session.user.role == 'buzzbands_employee'){
            $state.go("adminDashboard.analytics");
          }
          else{
            $state.go("adminDashboard.veneus");
          }
        }
      }

      this._init();
    }
  ]
)

.controller('AccountDetailsController',
  ['$scope', 'Account', '$state', '$stateParams', '$auth', '$rootScope',
    function($scope, Account, state, stateParams, $auth, $rootScope)
    {
      this._init = function(){
        $auth.validateUser();
        $scope.loadAccount();
      }

      $scope.loadAccount = function(){
        Account.get({id: stateParams.account_id}).$promise
          .then(function(data){
            $scope.account = data;
          })
          .catch(function(data){
            console.log("ERR  :: "+ data)
          });
      }

      $scope.updateAccount = function(accountValid){
        if(accountValid){
          Account.update($scope.account).$promise.then(function(data){
            state.go("adminDashboard.accounts");
          });
        }
      }

      this._init();
    }
  ]
)
