angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('loginCtrl', function($scope, $http, $state) {
  $scope.loginData = {}
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    // authenticate with local passport strategy
    // $http.post('http://localhost:3000/localAuth', $scope.loginData)
    //   .success(function(data) {
    //     console.log(data);
    //     $state.go('tab.dash')
    //
    //   })
    //   .error(function(data) {
    //     console.log('error' + data);
    //   })

    $state.go('repolist')
    }
})

// repo listing controller
  .controller('repoListCtrl', function($scope, $http, $state) {
    $scope.reposSelected = {}
    // go to github API and get list of repos
    $http.get('https://api.github.com/users/thexande/repos')
      .success(function(data){
        console.log(data)
        $scope.repoList = data;
      })
      .error(function(data) {
        console.log('error' + data);
      })
      // get list of repos from form
      $scope.selectReposToWatch = function() {
        console.log($scope.formData)
        $state.go('tab.dash')
      }
  });
