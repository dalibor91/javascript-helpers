

var Container = function () {
    
    var copyObject = function(s) {
        if (typeof s != 'object' || s === null) {
            return s;
        }
        
        if (typeof s.length != 'undefined') {
            var n = [];
            for (var i in s) {
                n.push(copyObject(s[i]));
            }
            return n;
        }
        
        var n = {};
        for (var i in s) {
            n[i] = copyObject(s[i]);
        }
        
        return n;
    };
    
    var block = function(data) {
        var data,
            updateCallback = function() {  };
        
        this.onUpdate = function(callback) {
            if (typeof callback == 'function') {
                updateCallback = callback;
            }
            return this;
        };
        
        this.setData = function(d) {
            var old = copyObject(data);
                data = copyObject(d);
                updateCallback(old, data);
            return this;
        };
        
        this.getData = function() {
            return data;
        };
        
        this.setData(data);
    };
    
    
    var blocks = {};
    
    this.add = function (name, value) {
        return (blocks[name] = new block(value));
    };
    
    this.get = function (name) {
        return blocks[name];
    };
    
    this.flush = function() {
        blocks = {};
        return this;
    };
    
    this.has = function (name) {
        return (typeof blocks[name] != 'undefined')
    };
};


/*

console.log("Testing...");

var cnt = new Container();

cnt.add('test1', [
    {
        id: 1
    },{
        id: 2
    },
]);

cnt.add('test2', [
    {
        id: 3
    },{
        id: 4
    },
]);

cnt.add('test3', [
    {
        id: 5
    },{
        id: 6
    },
]);

cnt.get('test1').onUpdate(function(oldData, newData) {
    console.log("---------old--------");
    console.log(oldData);
    console.log("---------new--------");
    console.log(newData)
});

setTimeout(function() {
    cnt.get('test1').setData({a:1})
}, 5000)


*/
