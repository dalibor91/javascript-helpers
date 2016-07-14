var JSDB = function() {
        
    var _Database = function() {
        var data = {};

        this.add = function(name, val) {
            data[name] = val;
            return this;
        };

        this.get = function (name) {
            return data[name] ? data[name] : null;
        };
    };

    var _DataRow = function(d) {
        var data = d || {},
            updateCallback = function() {   };

        this.set = function(name, val) {
            data[name] = val;
            updateCallback(data);
            return this;
        };

        this.get = function(name) {
            return data[name] ? data[name] : data;
        };

        this.has = function(name) {
            return typeof data[name] !== 'undefined';
        };

        this.sameAS = function(name, value, strict) {
            return strict ? (this.has(name) && data[name] == value) : 
                    (this.has(name) && data[name] === value);
        };

        this.onUpdate = function(callback) {
            if (typeof callback == 'function') {
                updateCallback = callback;
            }
            return this;
        };

        this.commit = function(callback) {
            if (typeof callback === 'function') {
                callback(data);
            }
            return this;
        };
    };

    var _DataTable = function() {

        var data = [], 
            onInsert = function() {},
            onDelete = function() {},
            updated = function() {};

        this.insert = function(k) {
            if (typeof k == 'object'){
                k["__id"] = data.length;
                var s = new _DataRow(k);
                data.push(s)
                onInsert(s);
            }
            return this;
        };

        this.delete = function(index) {
            onDelete(data[index]);
            data.splice(index, 0);
            return this;
        };

        this.find = function(name, val) {
            for (var i in data) {
                if (data[i].sameAs(name, val)) {
                    return data[i];
                }
            }
        };

        this.all = function() {
            return data;
        };

        this.onInsert = function(callback) {
            if (typeof callback == 'function') {
                onInsert = callback;
            }
            return this;
        };

        this.onDelete = function(callback) {
            if (typeof callback == 'function') {
                onDelete = callback;
            }
            return this;
        };

        this.onUpdate = function(callback) {
            if (typeof callback == 'function') {
                updated = callback;
            }
            return this;
        };

        this.truncate = function() {
            if (data.length > 0) {
                data = [];
                this.triggerUpdate();
            }
        };

        this.triggerUpdate = function() {
            updated(data);
        };
    };

    var db = {
        db: new _Database()
    }

    this.getTable = function (name) {
        return db.db.get(name);
    };
    
    this.addTable = function (name) {
        return db.db.add(name, new _DataTable());
    };
};


/*
 * 

 var db = new JSDB();
undefined
db.addTable("test1");
_Database {}
db.addTable("test2");
_Database {}
db.getTable("test1").insert({ a: 1 })
_DataTable {}
db.getTable("test1").insert({ a: 2 })
_DataTable {}
db.getTable("test1").insert({ a: 3 })
_DataTable {}
db.getTable("test1").insert({ a: 4 })
_DataTable {}
db.getTable("test2").insert({ a: 45 })
_DataTable {}
db.getTable("test2").insert({ a: 465 })
_DataTable {}
db.getTable("test2").insert({ a: 4657 })
_DataTable {}
db.getTable("test2")
_DataTable {}all: ()delete: (index)find: (name, val)insert: (k)onDelete: (callback)onInsert: (callback)onUpdate: (callback)triggerUpdate: ()truncate: ()__proto__: Object
db.getTable("test1").all();
[_DataRow, _DataRow, _DataRow, _DataRow]
db.getTable("test1").all()[0].get();
Object {a: 1, __id: 0}
 
 **/
