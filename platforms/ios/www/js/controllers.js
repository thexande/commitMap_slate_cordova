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


.controller('loginCtrl', function($scope, $http, $state, $ionicLoading, reposFactory) {
      $scope.show = function() {
      $ionicLoading.show({
        template: '<ion-spinner icon="ios"></ion-spinner>'
      })
    }
    $scope.hide = function(){
      $ionicLoading.hide()
    }
    $scope.loginData = {}
        // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);
        // show loading modal
        $scope.show();

        // authenticate with local passport strategy
        // $http.post('http://commitmap.herokuapp.com/localAuth', $scope.loginData)
           $http.post('http://localhost:3000/localAuth', $scope.loginData)
           .catch(function(e) {
             $scope.hide()
             alert("incorrect login data")})
          .then(function(collection){
              $scope.hide()
              // store userdata inside of factory for access later
              reposFactory.setUserData(collection.data)
              $state.go('repolist')
            })
          }
      })
// my Repos controller
.controller('myReposCtrl', function($scope, $http, $state, reposFactory) {
  $scope.selectedRepos = reposFactory.selectedRepos

  $scope.removeRepo = function(repoId){
    reposFactory.removeRepo(repoId)
  }
  $scope.addRepo = function() {
    $state.go('repolist')
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
    $scope.reposSelected['selected_ids'] = [];


    // factory method to fetch data from github
    reposFactory.getReposFromGitHub().then(function(response){
      $scope.repoList = response.data;
    })
    // get all index method
    $scope.getAllIndexes = function(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
      return indexes;
    }

        // get list of repos from form
    $scope.selectReposToWatch = function(repoData) {
        // check for truth
        for (var repoId in repoData) {
          if (repoData.hasOwnProperty(repoId)) {
            // console.log(Object.keys($scope.reposSelected).indexOf(repoId.toString()));
            if(repoData[repoId] === true){
              // put selected id in out selected_ids array
                $scope.reposSelected.selected_ids.push(repoId)
              // check for index of selected id in destination object, prevent dupes
              if($scope.getAllIndexes($scope.reposSelected.selected_ids, repoId).length === 1){
                // id of object selected. filter master repo object and return
                $scope.reposSelected.push($scope.repoList.filter(function(arg){
                  if(parseInt(arg.id) === parseInt(repoId)){
                    return arg;
                  }
                })[0])
              }
            }
          }
        }
        // set data in factory.
        // remove dupes from selected_ids
        $scope.reposSelected.selected_ids = $scope.reposSelected.selected_ids.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
        })
        reposFactory.prepareForRepoView($scope.reposSelected);
        // sync data with backend
        reposFactory.syncSelectedRepos();
        $state.go('tab.myrepos')
    }
});
