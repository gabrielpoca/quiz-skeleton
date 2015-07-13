(function() {
  angular
    .module('starter')
    .service('Users', Users);

  function Users($http, ENV, $stream) {
    var _users = [];

    return {
      all: all,
      find: find,
      whereId: whereId,
      sync: sync,
    };


    function all(options) {
      return _users;
    }

    function find(id) {
      var _user = null;

      _users.forEach( (user) => {
        if (user.id === id)
          _user = user;
      });

      return _user;
    }

    function whereId(ids) {
      var users = [];
      ids.forEach((winnerId) => {
        users.push(find(winnerId));
      });
      return users;
    }

    function sync() {
      return $http.get(`${ENV.HOST}/users`)
        .then(function(response) {
          _users = response.data;
          return _users;
        });
    }
  }
})();
