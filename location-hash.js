"use strict";
exports.__esModule = true;
var LocationHash = /** @class */ (function () {
    // str: the one line attribute string of syntax: a=b&c=d&e=f
    function LocationHash(str) {
        this._attr = LocationHash.parseMap(str);
        this._evnt = {};
    }
    // get/set attributes without side-effects
    LocationHash.prototype.get = function (key) {
        return this._attr[key];
    };
    LocationHash.prototype.set = function (key, val) {
        this._attr[key] = val;
        return this;
    }; // allow chain
    // render attributes to one line string
    LocationHash.prototype.toStr = function () {
        return LocationHash.renderMap(this._attr);
    };
    // merge attrs to this, navigate to new location, triggers listeners
    LocationHash.prototype.navTo = function (attrs) {
        var v;
        var a = {};
        for (var k in this._attrs) {
            v = this._attrs[k];
            a[k] = v;
        }
        for (k in attrs) {
            v = attrs[k];
            a[k] = v;
        }
        var newHash = "#" + LocationHash.renderMap(a);
        if (newHash !== location.hash) {
            return location.hash = newHash;
        }
    };
    // cb(newVal, oldVal, key) is called when val changes on key
    // newVal is undefined if key is removed
    LocationHash.prototype.on = function (key, cb) {
        if (!this._evnt[key]) {
            this._evnt[key] = [];
        }
        if (!this._evnt[key].includes(cb)) {
            return this._evnt[key].push(cb);
        }
    };
    // set new attributes, fire listeners if value changed
    // internal helper for navTo, don't call this unless you know what you are doing
    LocationHash.prototype.setNewAttrs = function (newAttr) {
        var e, oldv;
        var oldAttr = this._attr;
        this._attr = newAttr;
        for (var newk in newAttr) {
            var newv = newAttr[newk];
            oldv = oldAttr[newk];
            if (oldv !== newv && this._evnt[newk].length > 0) {
                for (var _i = 0, _a = this._evnt[newk]; _i < _a.length; _i++) {
                    e = _a[_i];
                    e(newv, oldv, newk);
                }
            }
            delete oldAttr[newk];
        }
        // call listener on removed key
        for (var oldk in oldAttr) {
            oldv = oldAttr[oldk];
            if (this._evnt[oldk].length > 0) {
                for (var _b = 0, _c = this._evnt[oldk]; _b < _c.length; _b++) {
                    e = _c[_b];
                    e(undefined, oldv, oldk);
                }
            }
        }
        return oldAttr = newAttr;
    };
    LocationHash.installInBrowser = function () {
        if (LocationHash.inst === undefined) {
            LocationHash.inst = new LocationHash(location.hash.slice(1));
            return window.addEventListener("onhashchange", function () {
                var newAttr = LocationHash.parseMap(location.hash.slice(1));
                return LocationHash.inst.setNewAttrs(newAttr);
            }, false); // singleton
        }
    };
    // turns a=b&c=d,e=f;x=y
    // into { a: 'b', c: 'd', e: 'f', x: 'y'}
    LocationHash.parseMap = function (str) {
        var match;
        var map = {};
        while (match = /(\w+)=(.*?)([,;&]|$)(.*)$/.exec(str)) {
            var divider = void 0, key = void 0, val = void 0;
            _a = match.slice(1, 5), key = _a[0], val = _a[1], divider = _a[2], str = _a[3];
            map[key] = val;
        }
        return map;
        var _a;
    };
    LocationHash.renderMap = function (map) {
        return (function () {
            var result = [];
            for (var key in map) {
                var val = map[key];
                if (val !== undefined) {
                    result.push(key + "=" + val);
                }
            }
            return result;
        })().join('&');
    };
    return LocationHash;
}());
exports["default"] = LocationHash;
;
if ('undefined' !== typeof window) {
    // is in browser
    LocationHash.installInBrowser();
}
