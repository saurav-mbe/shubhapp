angular.module('starter.controllers', [])

.controller('DashCtrl', function($state,$scope,dbhelper,$ionicModal) {
    document.addEventListener('deviceready',function(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fs){}); 
   // window.resolveLocalFileSystemURI('shubhapp',function(entry){alert("x"+entry.name)},function(err){alert("error"+err.code)});  
  },false)
  $scope.subcats = [];
  $scope.mode = 'nav';
  $scope.subcat = {};
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
            item = results.rows.item(i);
            $scope.subcats.push({
              ID:item.ID,
              shubhsubcatname:item.shubhsubcatname
            });
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
  $scope.isMizukPlaying = false;
  $scope.playAudio =function(obj,$event){
    if(!$scope.audio){
      console.log("here");
      $scope.audio = new Media ("/android_asset/www/media/"+$scope.tab.mp3,function(){},function(err){console.log(err.code)});
      $scope.audio.getDuration(function(position){console.log(position)},function(err){console.log(err)})
      console.log($scope.audio)
    }
    if(!$scope.isMizukPlaying){
      console.log('isMizukPlaying:false')
      $scope.audio.play();
      angular.element($event.target).removeClass('ion-ios7-play-outline').addClass('ion-ios7-pause-outline');
    }
    else {
     $scope.audio.pause();
     $scope.audio.release();
     angular.element($event.target).removeClass('ion-ios7-pause-outline').addClass('ion-ios7-play-outline') ;
    }
    $scope.isMizukPlaying = !$scope.isMizukPlaying;
  } 
  $scope.free = function(evt){
    console.log(evt)
  } 
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
    if(!cat.ID){
      dbhelper.addSubcategory(cat.shubhsubcatname,$scope.tab.catId,createCatCb);  
    }
    else{
      dbhelper.updateSubcategory(cat.shubhsubcatname,$scope.tab.catId,createCatCb);  
    }
    $scope.catModal.hide();
    cat.shubhsubcatname = '';
  };
  $scope.changeMode = function(obj,$event){
   if($scope.mode==='nav'){
    $scope.mode = 'edit';
    angular.element($event.target).removeClass('ion-ios7-compose-outline').addClass('ion-ios7-undo-outline')
   }
   else{
    $scope.mode = 'nav';
    angular.element($event.target).removeClass('ion-ios7-undo-outline').addClass('ion-ios7-compose-outline');
   }

    //$scope.$apply();
  };
  // Open our new task modal
  $scope.newCat = function() {
    if(arguments[0]){
      $scope.subcat = arguments[0]
    }
    $scope.catModal.show();
  };

  // Close the new task modal
  $scope.closeNewCat = function() {
    $scope.catModal.hide();
  };
})
.controller('FriendDetailCtrl', function($scope, $stateParams, dbhelper,$ionicModal,$ionicSlideBoxDelegate) {
   try{
   $scope.items = [];
   $scope.colours = [];
   $scope.brands = [];
   $scope.item = {brand:'',name:'',image:''}
   //var pictureSource=navigator.camera.PictureSourceType;
   //var destinationType=navigator.camera.DestinationType;
   var itemCb = function(tx,results){
   		$scope.items = [];
		for(var i = 0 ;i<results.rows.length;i++){
           var item = results.rows.item(i);
            $scope.items.push({
              brand:item.brand,
              colour:item.colour,
              name:item.name,
              shubhsubcatid:item.shubhsubcatid,
              ID:item.ID
            });
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
      //var image = document.getElementById('tryimage');
      $scope.image = imageURI;
      movePic(imageURI);
    };
    var movePic = function(file){
      //alert(window.resolveLocalFileSystemURI);
      //alert(window.resolveLocalFileSystemURL);
      console.log(file);
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
      //alert(entry);
     // $scope.image = entry.fullPath;
      $scope.newItemModal();

      //we will be loading a modal with a form to save the item into database
    };
    var onCameraFail = function(message){
        alert("Failed because:"+message);
    };
    //alert(navigator.camera);
    try{
      navigator.camera.getPicture(photoSuccessCb,onCameraFail,{quality:100,destinationType:destinationType.FILE_URI});  
    }
    catch(e){
      alert(e);
    }
    
  };
  $scope.createItem = function(item){
    if(!item.ID){
      item.image = $scope.image;
      item.shubhsubcatid = $stateParams.catId;
      dbhelper.saveItem(item, function(){
      dbhelper.getAllItems($stateParams.catId,itemCb); 
    });  
    }
    else{
      dbhelper.updateItem(item,function(){
        //dbhelper.getAllItems($stateParams.catId,itemCb);
      })
    }
    $scope.itemModal.hide();
  };
  $ionicModal.fromTemplateUrl('new-item.html', function(modal) {
    $scope.itemModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  // Open our new task modal
  $scope.newItemModal = function(item) {
    console.log($scope.item)
    $scope.item = item;
    $scope.itemModal.show();
  };

  // Close the new task modal
  $scope.closeNewItem = function() {
    $scope.itemModal.hide();
  };
  $scope.getColour = function(id){
    console.log("nsiden get coloir");
    for(var i = 0;i<$scope.colours.length;i++){
      if(id===$scope.colours[i].ID){
        return $scope.colours[i].name
      }
    }
  };
  $scope.getBrand = function(id){
     for(var i = 0;i<$scope.brands.length;i++){
      if(id===$scope.brands[i].ID){
        return $scope.brands[i].name
      }
    }
  };
}catch(e){
  console.log(e);
}
})

