angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,dbhelper,$ionicModal) { 
	$scope.subcats = [];
  var tabs = {
    'clothes':{
      title : 'Clothes',
      catId : 1
    },
    'shoes':{
      title : 'Shoes',
      catId : 2
    },
    'accessories':{
      title : 'Accessories',
      catId : 3
    }
  };
  $scope.hash = location.hash.split('/')[2];;
  $scope.tab=tabs[$scope.hash];
  dbhelper.getAllSubcategories($scope.tab.catId,cb);
  $scope.$on('$locationChangeSuccess',function(e){
    $scope.hash = location.hash.split('/')[2];
    $scope.tab = tabs[$scope.hash];
    dbhelper.getAllSubcategories($scope.tab.catId,cb);
  });
	var cb = function(tx,results){
		$scope.subcats = [];
		for(var i = 0 ;i<results.rows.length;i++){
            $scope.subcats.push(results.rows.item(i));
		}
    $scope.$apply();
	};

	
	$scope.addSubCat = function(name){
		dbhelper.addSubCategory(name,$scope.tab.catId,cb);
	};
  $ionicModal.fromTemplateUrl('new-cat.html', function(modal) {
    $scope.catModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  var createCatCb = function(){
  	dbhelper.getAllSubcategories($scope.tab.catId,cb);
  };
  // Called when the form is submitted
  $scope.createCat = function(cat) {
    dbhelper.addSubcategory(cat.shubhsubcatname,$scope.tab.catId,createCatCb);
    $scope.catModal.hide();
    cat.shubhsubcatname = '';
  };

  // Open our new task modal
  $scope.newCat = function() {
    $scope.catModal.show();
  };

  // Close the new task modal
  $scope.closeNewCat = function() {
    $scope.catModal.hide();
  };
})
.controller('FriendDetailCtrl', function($scope, $stateParams, dbhelper,$ionicModal) {
   $scope.items = [];
   var pictureSource=navigator.camera.PictureSourceType;
   var destinationType=navigator.camera.DestinationType;
   var itemCb = function(tx,results){
   		$scope.items = [];
		for(var i = 0 ;i<results.rows.length;i++){
            $scope.items.push(results.rows.item(i));
		}   		
   };
   dbhelper.getAllItems($stateParams.catId,itemCb);
   $scope.newItem=function(){
    var resOnError = function(err){
      alert("err:"+err.code);
    };
    var photoSuccessCb = function(imageURI){
      var image = document.getElementById('myimage');
      image.src = imageURI;
      movePic(imageURI);
    };
    var movePic = function(file){
      window.resolveLocalFileSystemURI(file,resolveOnSuccess,resOnError);
    };
    var resolveOnSuccess = function(entry){
      var newFileName = (new Date()).getTime()+'.jpg';
      var folder = 'shubhapp';
      window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fileSys){
        fileSys.root.getDirectory(folder,{create:true,exclusive:false},function(directory){
          entry.moveTo(directory,fileName,successMove,resOnError)
        },resOnError)
      })
    };
    var successMove = function(entry){
      $scope.image = entry.fullPath;
      alert($scope.image);
      //we will be loading a modal with a form to save the item into database
    };
    var onCameraFail = function(message){
        alert("Failed because:"+message);
    };
    navigator.camera.getPicture(photoSuccessCb,onCameraFail,{quality:50,destinationType:destinationType.FILE_URI});
}})

