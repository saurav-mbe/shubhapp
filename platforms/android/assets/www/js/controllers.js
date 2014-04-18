angular.module('starter.controllers', [])

.controller('DashCtrl', function($state,$scope,dbhelper,$ionicModal) {
    document.addEventListener('deviceready',function(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fs){}); 
   // window.resolveLocalFileSystemURI('shubhapp',function(entry){alert("x"+entry.name)},function(err){alert("error"+err.code)});  
  },false)
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
  var cb = function(tx,results){
        $scope.subcats = [];
        for(var i = 0 ;i<results.rows.length;i++){
            $scope.subcats.push(results.rows.item(i));
        }
       $scope.$digest();
    };
  $scope.tab=$state.current.data;
  dbhelper.getAllSubcategories($scope.tab.catId,cb);
 /* $scope.$on('$stateChangeSuccess',function(e){
    $scope.hash = location.hash.split('/')[2];
    $scope.tab = tabs[$scope.hash];
    dbhelper.getAllSubcategories($scope.tab.catId,cb);
  });
  $scope.$on('$locationChangeSuccess',function(e){
    $scope.hash = location.hash.split('/')[2];
    $scope.tab = tabs[$scope.hash];
    dbhelper.getAllSubcategories($scope.tab.catId,cb);
  });*/  
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
.controller('FriendDetailCtrl', function($scope, $stateParams, dbhelper,$ionicModal,$ionicSlideBoxDelegate) {
   $scope.items = [];
   $scope.colours = [];
   $scope.brands = [];
   var pictureSource=navigator.camera.PictureSourceType;
   var destinationType=navigator.camera.DestinationType;
   var itemCb = function(tx,results){
   		$scope.items = [];
		for(var i = 0 ;i<results.rows.length;i++){
            $scope.items.push(results.rows.item(i));
           // console.log(results.row.item(i));
		}   		
    $scope.$digest();
    $ionicSlideBoxDelegate.update();
   };
   dbhelper.getAllColours(function(tx,results){
        $scope.colours = [];
        for(var i =0;i<results.rows.length;i++){
            $scope.colours.push(results.rows.item(i));
        }
   });
   dbhelper.getAllBrands(function(tx,results){
        $scope.brands = [];
        for(var i =0;i<results.rows.length;i++){
            $scope.brands.push(results.rows.item(i));
        }
   });
   
   dbhelper.getAllItems($stateParams.catId,itemCb);
   //alert("called");
   $scope.newItem=function(){
    var resOnError = function(err){
      alert("err:"+err.code);
    };
    var photoSuccessCb = function(imageURI){
      var image = document.getElementById('tryimage');
      image.src = imageURI;
      movePic(imageURI);
    };
    var movePic = function(file){
      //alert(window.resolveLocalFileSystemURI);
      //alert(window.resolveLocalFileSystemURL);
      window.resolveLocalFileSystemURI(file,resolveOnSuccess,resOnError);
    };
    var resolveOnSuccess = function(entry){
      var newFileName = (new Date()).getTime()+'.jpg';
      var folder = 'shubhapp';
      window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fileSys){
        fileSys.root.getDirectory(folder,{create:true,exclusive:false},function(directory){
          entry.moveTo(directory,newFileName,successMove,resOnError)
        },resOnError)
      })
    };
    var successMove = function(entry){
      alert(entry);
      $scope.image = entry.fullPath;
      $scope.newItemModal();

      //we will be loading a modal with a form to save the item into database
    };
    var onCameraFail = function(message){
        alert("Failed because:"+message);
    };
    //alert(navigator.camera);
    try{
      navigator.camera.getPicture(photoSuccessCb,onCameraFail,{quality:50,destinationType:destinationType.FILE_URI});  
    }
    catch(e){
      alert(e);
    }
    
  };
  $scope.createItem = function(item){
    item.image = $scope.image;
    item.shubhsubcatid = $stateParams.catId;
    dbhelper.saveItem(item, function(){
        alert("success");
    });
  };
  $ionicModal.fromTemplateUrl('new-item.html', function(modal) {
    $scope.itemModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  // Open our new task modal
  $scope.newItemModal = function() {
    $scope.itemModal.show();
  };

  // Close the new task modal
  $scope.closeNewItem = function() {
    $scope.itemModal.hide();
  };
})

