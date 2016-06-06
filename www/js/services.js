angular.module('starter.services', [])
.factory('reposFactory', function($http){
  return {
    selectedRepos : [],
    getReposFromGitHub : function() {
        return $http.get('https://api.github.com/users/thexande/repos')
    },
    syncSelectedRepos : function(repo_id){
      // logic to query backend and sync selectedRepos
    },
    addToWatch : function(repo_id){
      // logic to query commitmap backend and add webhook for passed repo
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
