(function() {
  'use strict';

  angular
    .module('starter')
    .config(Router)
    .config(handleUnauthorizedResponse)
    .run(authorizeRoutes);

  function handleUnauthorizedResponse($httpProvider) {
    var handleUnauthorized = ['$q', '$location', function ($q, $location) {
      return {
        responseError: handleError
      };

      function handleError(response) {
        if (response.status === 401)
          $location.path('/login');

        return $q.reject(response);
      }
    }];

    $httpProvider.interceptors.push(handleUnauthorized);
  }

  function authorizeRoutes($rootScope, authProvider, $state) {
    authProvider.loaded()
      .then(function() {
        $rootScope.$on('$stateChangeStart', function(event, next) {
          if (next.name.indexOf('login') == -1 && !authProvider.loggedIn()) {
            event.preventDefault();
            $state.go('login');
          }
        });
      });
  }

  function ensureAuthentication($q, $timeout, $state, authProvider) {
    if (!authProvider.loggedIn()) {
      $timeout(() => $state.go('login'));
      return $q.reject();
    }
    return $q.when();
  }

  function Router($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl as ctrl'
      })
      .state('game', {
        url: '/game',
        abstract: true,
        templateUrl: 'app/layout/layout.html',
        resolve: {
          ensureAuthentication: ensureAuthentication
        }
      })
      .state('game.users', {
        url: '/users',
        views: {
          'game-users': {
            templateUrl: 'app/users/users.html',
            controller: 'UsersCtrl as ctrl'
          }
        }
      })
      .state('game.current', {
        url: '/current',
        views: {
          'game-current': {
            templateUrl: 'app/current/current.html',
            controller: 'CurrentCtrl as ctrl'
          }
        }
      })
      .state('game.account', {
        url: '/account',
        views: {
          'game.account': {
            templateUrl: 'app/account/account.html',
            controller: 'AccountCtrl as ctrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/login');
  }
})();
