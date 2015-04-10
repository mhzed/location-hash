// Generated by CoffeeScript 1.8.0
(function() {
  var LocationHash,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = LocationHash = (function() {
    function LocationHash(str) {
      this._attr = LocationHash.parseMap(str);
      this._evnt = {};
    }

    LocationHash.prototype.get = function(key) {
      return this._attr[key];
    };

    LocationHash.prototype.set = function(key, val) {
      this._attr[key] = val;
      return this;
    };

    LocationHash.prototype.toStr = function() {
      return LocationHash.renderMap(this._attr);
    };

    LocationHash.prototype.navTo = function(attrs) {
      var a, k, newHash, v, _ref;
      a = {};
      _ref = this._attrs;
      for (k in _ref) {
        v = _ref[k];
        a[k] = v;
      }
      for (k in attrs) {
        v = attrs[k];
        a[k] = v;
      }
      newHash = '#' + LocationHash.renderMap(a);
      if (newHash !== location.hash) {
        return location.hash = newHash;
      }
    };

    LocationHash.prototype.on = function(key, cb) {
      var _base;
      (_base = this._evnt)[key] || (_base[key] = []);
      if (__indexOf.call(this._evnt[key], cb) < 0) {
        return this._evnt[key].push(cb);
      }
    };

    LocationHash.prototype._setNewAttrs = function(newAttr) {
      var e, newk, newv, oldAttr, oldk, oldv, _i, _j, _len, _len1, _ref, _ref1;
      oldAttr = this._attr;
      this._attr = newAttr;
      for (newk in newAttr) {
        newv = newAttr[newk];
        oldv = oldAttr[newk];
        if (oldv !== newv && this._evnt[newk].length > 0) {
          _ref = this._evnt[newk];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            e = _ref[_i];
            e(newv, oldv, newk);
          }
        }
        delete oldAttr[newk];
      }
      for (oldk in oldAttr) {
        oldv = oldAttr[oldk];
        if (this._evnt[oldk].length > 0) {
          _ref1 = this._evnt[oldk];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            e = _ref1[_j];
            e(void 0, oldv, oldk);
          }
        }
      }
      return oldAttr = newAttr;
    };

    LocationHash.installInBrowser = function() {
      if (LocationHash.inst === void 0) {
        LocationHash.inst = new LocationHash(location.hash.slice(1));
        return $(window).on('hashchange', (function(_this) {
          return function() {
            var newAttr;
            newAttr = LocationHash.parseMap(location.hash.slice(1));
            return LocationHash.inst._setNewAttrs(newAttr);
          };
        })(this));
      }
    };

    LocationHash.inst = void 0;

    LocationHash.parseMap = function(str) {
      var divider, key, map, match, val, _ref;
      map = {};
      while (match = /(\w+)=(.*?)([,;&]|$)(.*)$/.exec(str)) {
        _ref = match.slice(1, 5), key = _ref[0], val = _ref[1], divider = _ref[2], str = _ref[3];
        map[key] = val;
      }
      return map;
    };

    LocationHash.renderMap = function(map) {
      var key, val;
      return ((function() {
        var _results;
        _results = [];
        for (key in map) {
          val = map[key];
          if (val !== void 0) {
            _results.push("" + key + "=" + val);
          }
        }
        return _results;
      })()).join('&');
    };

    return LocationHash;

  })();

  module.exports = LocationHash;

  if ('undefined' !== typeof window) {
    LocationHash.installInBrowser();
  }

}).call(this);

//# sourceMappingURL=location-hash.js.map