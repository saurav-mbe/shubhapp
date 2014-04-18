angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('dbhelper', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Sneakers' },
    { id: 1, name: 'Sandals' },
    { id: 2, name: 'Leather' },
    { id: 3, name: 'Slippers' }
  ];
  var db= window.openDatabase("shubhapp","1.0","shubhdb",200000);
  var errorCb = function(tx,err){
    console.log("error:"+err.message);
  } 
  return {
    populateDB: function() {
      
      if(localStorage.getItem('isDbCreated')){
        return;
      }
      //base data to be created....add 10 brands,10 colours 3 sub categories (for each category) .
      db.transaction(function(tx){
        //tx.executeSql('INSERT INTO colours (name) VALUES ("Pink")');
      //tx.executeSql('INSERT INTO colours (name) VALUES ("Lavender")');
      //tx.executeSql('INSERT INTO colours (name) VALUES ("Green")');
      //tx.executeSql('INSERT INTO brands (name) VALUES ("Lifestyle")');
      //tx.executeSql('INSERT INTO brands (name) VALUES ("Adidas")');
      //tx.executeSql('INSERT INTO brands (name) VALUES ("Nike")');
        tx.executeSql('CREATE TABLE IF NOT EXISTS shubhcats(ID INTEGER PRIMARY KEY AUTOINCREMENT, shubhcatname TEXT)',[],function(tx,e){});
        tx.executeSql('CREATE TABLE IF NOT EXISTS colours (ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)',[],function(){});
        tx.executeSql('CREATE TABLE IF NOT EXISTS brands (ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
        //tx.executeSql('INSERT INTO shubhcats (shubhcatname) VALUES ("Clothes")');
        //tx.executeSql('INSERT INTO shubhcats (shubhcatname) VALUES ("Shoes")');
        //tx.executeSql('INSERT INTO shubhcats (shubhcatname) VALUES ("Accessories")');
        tx.executeSql('CREATE TABLE IF NOT EXISTS shubhsubcats (ID INTEGER PRIMARY KEY AUTOINCREMENT,shubhsubcatname TEXT, shubhcatid INTEGER, FOREIGN KEY (shubhcatid) REFERENCES shubhcats(ID))');
        tx.executeSql('CREATE TABLE IF NOT EXISTS shubhitems (ID INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,image TEXT,colour INTEGER, '+
          'brand INTEGER ,shubhsubcatid INTEGER, FOREIGN KEY (shubhsubcatid) REFERENCES shubhsubcats (ID) ,FOREIGN KEY (brand) '+
          'REFERENCES brands (ID) ,FOREIGN KEY (colour) REFERENCES colours(ID))');
        });
      localStorage.setItem('isDbCreated','Yes');
    },
    //update and delete methods to be added for all tables
    getAllSubcategories : function(catId,cb) {
      db.transaction(function(tx){
        tx.executeSql('SELECT * FROM shubhsubcats WHERE shubhcatid = '+catId,[],cb,errorCb);
      });
    },
    getAllColours : function(cb){
      db.transaction(function(tx){
        tx.executeSql('SELECT * FROM colours',[],cb,errorCb);
      });
    },
    getAllBrands : function(cb){
      db.transaction(function(tx){
        tx.executeSql('SELECT * FROM brands',[],cb,errorCb);
      });
    },
    addSubcategory : function(name,catId,cb){
      db.transaction(function(tx){
        tx.executeSql('INSERT INTO shubhsubcats (shubhsubcatname,shubhcatid) VALUES (?,?)',[name,catId],cb,errorCb);
    });
    },
    saveColor : function(name,cb){
      db.transaction(function(tx){
        tx.executeSql('INSERT INTO colours (name) VALUES (?)',[name],cb,errorCb);
    });
    },
    saveBrand : function(name,cb){
      db.transaction(function(tx){
        tx.executeSql('INSERT INTO brands (name) VALUES (?)',[name],cb,errorCb);
    });
    },
    getAllItems : function(catId,cb){
      //alert("here")
      db.transaction(function(tx){
        tx.executeSql('SELECT * FROM shubhitems WHERE shubhsubcatid='+catId,[],cb,errorCb);
      });
    },
    saveItem : function(item,cb){
      db.transaction(function(tx){
        tx.executeSql('INSERT INTO shubhitems (name,image,colour,brand,shubhsubcatid) VALUES (?,?,?,?,?)',
          [item.name,item.image,item.colour,item.brand,item.shubhsubcatid],
          cb,errorCb)
      })
    }
}
});
