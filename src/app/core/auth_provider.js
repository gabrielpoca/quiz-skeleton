(function() {
  angular
    .module('starter')
    .service('authProvider', authProvider);

  function authProvider($q, $http, localStorageService, ENV) {
    var _loggedIn = false,
      _me = null;

    setAuthorizationHeadersFromStore();
    me()

    return {
      register: register,
      login: login,
      me: me,
      logout: logout,
      loggedIn: loggedIn,
      loaded: loaded
    };

    function loaded() {
      if (_loggedIn) return $q.when(true);
      else return me()
    }

    function me() {
      if(_me) return $q.when(_me);

      return $http.get(`${ENV.HOST}/me`)
        .then(setMe.bind(this));
    }

    function login(username, password) {
      setAuthorizationHeaders(username, password);
      return me();
    }

    function register(username, password) {
      var params = {
        username: username,
        password: password
      };

      logout();
      return $http.post(`${ENV.HOST}/register`, params)
        .then(setMe.bind(this))
        .then(setAuthorizationHeaders.bind(this, username, password));
    }

    function logout() {
      _me = false;
      _me = false;
      saveTokenToStore(null);
      setLoggedIn(false);
    }

    function loggedIn() {
      return _loggedIn;
    }

    function setMe(response) {
      setLoggedIn();
      _me = response.data;
      return _me;
    }

    function setLoggedIn(value = true) {
      _loggedIn = value;
    }

    function setAuthorizationHeaders(username, password) {
      if (username && password) {
        var token = btoa(username + ':' + password);
        $http.defaults.headers.common.Authorization = 'Basic ' + token;
        saveTokenToStore(token);
      }
    }

    function setAuthorizationHeadersFromStore() {
      if (tokenFromStore())
        $http.defaults.headers.common.Authorization = 'Basic ' + tokenFromStore();
    }

    function saveTokenToStore(token = null) {
      localStorageService.set('authorizationToken', token);
    }

    function tokenFromStore() {
      return localStorageService.get('authorizationToken');
    }
  }
})();
