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
    $scope.getCurrentLocation = function() {
      // onSuccess Callback
      // This method accepts a Position object, which contains the
      // current GPS coordinates
      //
      var onSuccess = function(position) {
          alert('Latitude: '          + position.coords.latitude          + '\n' +
                'Longitude: '         + position.coords.longitude         + '\n' +
                'Altitude: '          + position.coords.altitude          + '\n' +
                'Accuracy: '          + position.coords.accuracy          + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                'Heading: '           + position.coords.heading           + '\n' +
                'Speed: '             + position.coords.speed             + '\n' +
                'Timestamp: '         + position.timestamp                + '\n');
      };

      // onError Callback receives a PositionError object
      //
      function onError(error) {
          alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
      }

      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
})


.controller('loginCtrl', function($scope, $http, $state) {
    $scope.loginData = {}
        // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);


        // authenticate with local passport strategy
        $http.post('http://commitmap.herokuapp.com/localAuth', $scope.loginData)
            // $http.post('http://localhost:3000/localAuth', $scope.loginData)
            .success(function(data) {
                $state.go('repolist')
            })
            .error(function(data) {
                console.log('error' + data);
                alert('wrong password')
            })
          }
      })

// repo listing controller
.controller('repoListCtrl', function($scope, $http, $state) {
    $scope.reposSelected = [];
    $scope.reposSelectedFalse = [];
        // go to github API and get list of repos
    $http.get('https://api.github.com/users/thexande/repos')
        .success(function(data) {
            $scope.repoList = data;
            // console.log(data);
        })
        .error(function(data) {
            console.log('error' + data);
        })
        // get list of repos from form
    $scope.selectReposToWatch = function(repoData) {
        // check for truth
        for (var repoId in repoData) {
          if (repoData.hasOwnProperty(repoId)) {
            if(repoData[repoId] === true){
              $scope.reposSelected.push(parseInt(repoId));
            } else {
              $scope.reposSelectedFalse.push(parseInt(repoId));
            }
          }
        }
        // console.log($scope.reposSelected);
        // set scope var for repos tab
        $scope.selectedRepoFilter = $scope.repoList.filter(function(arg){
          //  console.log($scope.reposSelected.indexOf(arg.id))
           if($scope.reposSelected.indexOf(arg.id) != -1){
            //  id exists. push repo object to array for uses
            return arg;
           }
        })

        console.log($scope.selectedRepoFilter);
        $state.go('tab.chats')
    }
});
