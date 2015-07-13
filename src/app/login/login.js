(function() {
  angular
    .module('starter')
    .controller('LoginCtrl', LoginCtrl);

  function LoginCtrl(authProvider, $state, $ionicViewSwitcher, $ionicPopup) {
    var ctrl = this;

    ctrl.state = 'login';

    authProvider.me()
      .then(redirect);

    ctrl.login = function(username, password) {
      authProvider
        .login(username, password)
        .then(redirect)
        .catch(invalidLogin);
    };

    ctrl.register = function(username, password) {
      authProvider
        .register(username, password)
        .then(redirect)
        .catch(invalidRegister);
    };

    function redirect() {
      $state.go('game.users');
    }

    function invalidLogin() {
      $ionicPopup.alert({
        title: 'Invalid credentials',
        template: 'Either the username or the password is invalid.'
      });
    }

    function invalidRegister() {
      $ionicPopup.alert({
        title: 'Registration failed',
        template: 'Please provide valid information.'
      });
    }
  }
})();
