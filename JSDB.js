var JSDB = function() {

	var indexField = "$_index_$",
	tableNameField = "$_tableName_$",
	_OnRowUpdate = function() {},
	_OnRowInsert = function() {},
       	_OnRowDelete = function() {};

    var _Database = function() {
        var data = {};

        this.add = function(name, val) {
            data[name] = val;
            return this;
        };

        this.isEmpty = function() {
        	for (var i in data) {
        		return false;
        	}
        	return true;
        };

        this.get = function (name) {
            return data[name] ? data[name] : null;
        };

        this.tables = function() {
            tables = [];
            for (var i in data) {
                tables.push(i);
            }
            return tables;
        };

        this.index = function() {
        	return this.get(indexField);
        };

        this.tableName = function() {
        	return this.get(tableNameField);
        };

        this.dump = function() {
          var e = {
            tables: {}
          };
          for (var i in data) {
            e.tables[i] = [];
            for (var j in data[i].all()) {
              var tmpdata = {},
                  actdata = data[i].row(j).get();
              for (var k in actdata) {
                if (k !== indexField && k !== tableNameField) {
                  tmpdata[k] = actdata[k];
                }
              }
              e.tables[i].push(tmpdata);
            }
          }
          return e;
        }
    };

    var _DataRow = function(d) {
        var data = d || {};

        this.set = function(name, val) {
            data[name] = val;
            _OnRowUpdate(data);
            return this;
        };

        this.get = function(name) {
            return typeof data[name] !== 'undefined' ? data[name] : data;
        };

        this.has = function(name) {
            return typeof data[name] !== 'undefined';
        };

        this.sameAs = function(name, value, strict) {
            return strict ? (this.has(name) && data[name] == value) :
                    (this.has(name) && data[name] === value);
        };
    };

    var _DataTable = function(name) {

        var data = [],
            onInsert = _OnRowInsert,
            onDelete = _OnRowDelete, 
            tableName = name;

        this.insert = function(k) {
            if (typeof k == 'object'){
                k[indexField] = data.length;
                k[tableNameField] = tableName;
                var s = new _DataRow(k);
                data.push(s)
                _OnRowInsert(s);
            }
            return this;
        };

        this.delete = function(index) {
            var row = data[index];
            data.splice(index, 1);
            _OnRowDelete(row);
            return this;
        };

        this.find = function(name, val) {
            for (var i in data) {
              var equals = true;
              for(var j in obj) {
                equals = equls && data[i].sameAs(j, obj[j])
              }
              if (equals) {
                return data[i];
              }
            }
        };

        this.isEmpty = function() {
        	return data.length == 0;
        };

        this.findAll = function(obj) {
          var d = []
          for (var i in data) {
            var equals = true;
            for(var j in obj) {
              equals = equals && data[i].sameAs(j, obj[j])
            }
            if (equals) {
              d.push(data[i]);
            }
          }
          return d;
        };

        this.all = function() {
            return data;
        };

        this.extract = function(name) {
            e = [];
            for (var i in data) {
              if (data[i].has(name)) {
                e.push(data[i].get(name));
              }
            }
            return e;
        };

        this.row = function(index) {
          return typeof data[index] !== 'undefined' ? data[index] : null;
        };

        this.count = function() {
          return data.length;
        };

        this.truncate = function() {
            if (data.length > 0) {
                data = [];
            }
        };

        this.getTableName = function() {
        	return tableName;
        } 
    };

    this.getTable = function (name) {
        return db.db.get(name);
    };

    this.addTable = function (name) {
        return db.db.add(name, new _DataTable(name));
    };

    this.tables = function() {
        return db.db.tables();
    };

    this.setDescription = function(desc) {
        db.desc = desc;
        return this;
    };

    this.getDescription = function() {
        return db.desc;
    };

    this.onRowUpdate = function(callback) {
      if (typeof callback == 'function') {
        _OnRowUpdate = callback;
      }
      return this;
    };

    this.onRowDelete = function(callback) {
      if (typeof callback == 'function') {
        _OnRowDelete = callback;
      }
      return this;
    };

    this.onRowInsert = function(callback) {
      if (typeof callback == 'function') {
        _OnRowInsert = callback;
      }
      return this;
    };

    this.dump = function() {
      var ex = {};
      for (var i in db) {
        if (i == 'db') {
          ex['database'] = db[i].dump();
        } else {
          ex[i] = db[i];
        }
      }
      return JSON.stringify(ex, null, 2);
    };

    var db = {
        db: new _Database(),
        desc: null
    };
};

JSDB.load = function(data) {

    if (typeof data.database != 'undefined') {

    	var db = new JSDB();

        if (typeof data.database.tables != 'undefined') {
            for (var i in data.database.tables) {
                db.addTable(i);

                for (var j in data.database.tables[i]) {
                    db.getTable(i).insert(data.database.tables[i][j]);
                }
            }
        }

        if (typeof data.desc != 'undefined') {
            db.setDescription(data.desc);
        }

        return db;
    }

    return null;
};
