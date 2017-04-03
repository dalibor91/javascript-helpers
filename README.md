# javascript-helpers

helper functions for javascript

Simple database writen in JS / JSDB

```
var db = new JSDB()

db.addTable('test');
db.addTable('test1');
db.addTable('test2');
db.addTable('test3');

db.getTable('test').insert({ a: 1, b: 2, c: 3 });
db.getTable('test').insert({ a: 5, b: 2, c: 3 });
db.getTable('test').insert({ a: 1, b: 2, c: 3 });
db.getTable('test').insert({ a: 6, b: 2, c: 3 });
db.getTable('test').insert({ a: 13, b: 2, c: 3 });
db.getTable('test').insert({ a: 14, b: 2, c: 3 });

db.getTable('test').findAll({ a: 1 }); //will return 2 rows

var idx = db.getTable('test').findAll({ a: 1 })[0].index();
db.getTable('test').row(idx).set('b', 0.0003);
db.getTable('test').findAll({ b: 0.0003 });  //this will return one row 

```



