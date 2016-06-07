angular.module('starter.services', [])
.factory('reposFactory', function($http){
  return {
    userData : {},
    selectedRepos : [],
    setUserData: function(data){
      this.userData = data;
    },
    getUserData: function(){
      return this.userData;
    },
    getReposFromGitHub : function() {
        return $http.get('https://api.github.com/users/thexande/repos')
    },
    syncSelectedRepos : function(){
      // logic to query backend and sync selectedRepos
      $http.post('http://127.0.0.1:3000/userWatchedRepos', {
        access_token : this.userData.bearer_token,
        selected_repos: this.selectedRepos
      })
      .catch(function(e){console.log(e)})
      .then(function(collection){
      })
    },
    prepareForRepoView : function(reposSelected) {
      this.selectedRepos = reposSelected;
    },
    getRepo : function(repoId){
      for (var i = 0; i < this.selectedRepos.length; i++) {
       if(parseInt(repoId) === this.selectedRepos[i].id){
         return this.selectedRepos[i]
       }
      }
    },
    removeRepo : function(repoId){
      console.log(this.selectedRepos);
      for (var i = 0; i < this.selectedRepos.length; i++) {
       if(parseInt(repoId) === this.selectedRepos[i].id){
         this.selectedRepos.splice(i,1);
       }
      }
    }
  }
});
