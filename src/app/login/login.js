(function() {
  angular
    .module('starter')
    .controller('LoginCtrl', LoginCtrl);

  function LoginCtrl(authProvider, $state, $ionicHistory, $ionicViewSwitcher) {
    var ctrl = this;

    ctrl.state = 'login';

    authProvider.me()
      .then(redirect);

    ctrl.login = function(username, password) {
      authProvider
        .login(username, password)
        .then(redirect);
    };

    ctrl.register = function(username, password) {
      authProvider
        .register(username, password)
        .then(redirect);
    };

    function redirect() {
      $state.go('game.users');
    }
  }
})();
