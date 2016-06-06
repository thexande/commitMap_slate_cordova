angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ReposCtrl', function($scope, Chats) {})

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
// my Repos controller
.controller('myReposCtrl', function($scope, $http, $state, reposFactory) {
  $scope.selectedRepos = reposFactory.selectedRepos

  $scope.removeRepo = function(repoId){
    reposFactory.removeRepo(repoId)
  }
})
// myRepos detail controller
.controller('myReposDetailCtrl', function($scope, $http, $stateParams, reposFactory){
  // fetch repo from
  $scope.repo = reposFactory.getRepo($stateParams.repoId)

})
// repo listing controller
.controller('repoListCtrl', function($scope, $http, $state, reposFactory) {
    $scope.reposSelected = [];
    $scope.reposIdsSelected = [];

    // factory method to fetch data from github
    reposFactory.getReposFromGitHub().then(function(response){
      $scope.repoList = response.data;
    })

        // get list of repos from form
    $scope.selectReposToWatch = function(repoData) {
        // check for truth
        for (var repoId in repoData) {
          if (repoData.hasOwnProperty(repoId)) {
            if(repoData[repoId] === true){
              // id of object selected. filter master repo object and return
              $scope.reposSelected.push($scope.repoList.filter(function(arg){
                if(parseInt(arg.id) === parseInt(repoId)){
                  return arg;
                }
              })[0])
            }
          }
        }
        // set data in factory.
        reposFactory.prepareForRepoView($scope.reposSelected);
        $state.go('tab.myrepos')
    }
});
