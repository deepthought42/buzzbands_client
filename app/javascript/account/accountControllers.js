'use strict';

angular.module('buzzbands.AccountControllers',
  ['ui.router', 'buzzbands.AccountService', 'mwl.confirm', 'angularPayments', 'hypedrive.Package', 'hypedrive.UserServices'])
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
  ['$scope', 'Account', '$state', '$stateParams', '$auth', '$rootScope', '$sessionStorage', 'Package', 'User',
    function($scope, Account, state, $stateParams, $auth, $rootScope, $sessionStorage, Package, User) {

      this._init = function(){
        $scope.session = $sessionStorage;
        $auth.validateUser();
        $scope.account = {};
        $scope.showNewUserReg = true;
        $scope.showExistingUsers = false;
        $scope.packages = Package.query();
        $scope.users = User.query();
      }

      $scope.hasPermission = function(role){
        return $scope.session.user.role == role;
      }

      $scope.register = function(isValid){
        var randomstring = Math.random().toString(36).slice(-8);
        var credentials = {user: {
          email: $scope.registrationForm.email,
          password: randomstring,
          password_confirmation: randomstring
        }};

        if(isValid){
          $auth.submitRegistration(credentials).then(function(registeredUser) {
            //$scope.session.user = registeredUser.data.data;
            $scope.successfulRegistration = true;

            //show payment form
            $scope.session.registered = true;
          }, function(error) {
            //console.log("Something went wrong during registration. Womp womp");
          });

          $scope.$on('auth:registration-email-success', function(event, user) {
            //$rootScope.$broadcast('userRegistered', user);
            //$scope.user = user;
            $scope.account.user_id = user.id;
            $scope.registrationForm={}
            $scope.userRegistration.$submitted = false;
            //$state.go('analytics.adminDashboard')
          });
        }
      };

      $scope.createAccount = function(accountValid){

        if($scope.hasPermission('hypedrive_employee')){
          Account.save($scope.account).$promise
            .then(function(data){
              //state.go("adminDashboard.accounts");
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
          Account.save($scope.account);

          if($scope.$session.user.role == 'admin' || $scope.$session.user.role == 'hypedrive_employee'){
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
