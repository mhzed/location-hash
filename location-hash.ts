


export default class LocationHash {
  static inst;
  private _attrs;
  private _evnt;
  private _attr;

  // str: the one line attribute string of syntax: a=b&c=d&e=f
  constructor(str) {
    this._attr = LocationHash.parseMap(str);
    this._evnt = {};
  }

  // get/set attributes without side-effects
  get(key) {
    return this._attr[key];
  }
  set(key, val) {
    this._attr[key] = val;return this;
  } // allow chain

  // render attributes to one line string
  toStr() {
    return LocationHash.renderMap(this._attr);
  }

  // merge attrs to this, navigate to new location, triggers listeners
  navTo(attrs) {
    let v;
    let a = {};
    for (var k in this._attrs) {
      v = this._attrs[k];a[k] = v;
    }
    for (k in attrs) {
      v = attrs[k];a[k] = v;
    }
    let newHash = `#${ LocationHash.renderMap(a) }`;
    if (newHash !== location.hash) {
      return location.hash = newHash;
    }
  }

  // cb(newVal, oldVal, key) is called when val changes on key
  // newVal is undefined if key is removed
  on(key, cb) {
    if (!this._evnt[key]) {
      this._evnt[key] = [];
    }
    if (!this._evnt[key].includes(cb)) {
      return this._evnt[key].push(cb);
    }
  }

  // set new attributes, fire listeners if value changed
  // internal helper for navTo, don't call this unless you know what you are doing
  setNewAttrs(newAttr) {
    let e, oldv;
    let oldAttr = this._attr;
    this._attr = newAttr;
    for (let newk in newAttr) {
      let newv = newAttr[newk];
      oldv = oldAttr[newk];
      if (oldv !== newv && this._evnt[newk].length > 0) {
        for (e of this._evnt[newk]) {
          e(newv, oldv, newk);
        }
      }
      delete oldAttr[newk];
    }
    // call listener on removed key
    for (let oldk in oldAttr) {
      oldv = oldAttr[oldk];
      if (this._evnt[oldk].length > 0) {
        for (e of this._evnt[oldk]) {
          e(undefined, oldv, oldk);
        }
      }
    }
    return oldAttr = newAttr;
  }

  static installInBrowser() {
    if (LocationHash.inst === undefined) {
      LocationHash.inst = new LocationHash(location.hash.slice(1));
      return window.addEventListener("onhashchange", () => {
        let newAttr = LocationHash.parseMap(location.hash.slice(1));
        return LocationHash.inst.setNewAttrs(newAttr);
      }, false); // singleton
    }
  }

  // turns a=b&c=d,e=f;x=y
  // into { a: 'b', c: 'd', e: 'f', x: 'y'}
  static parseMap(str) {
    let match;
    let map = {};
    while (match = /(\w+)=(.*?)([,;&]|$)(.*)$/.exec(str)) {
      let divider, key, val;
      [key, val, divider, str] = match.slice(1, 5);
      map[key] = val;
    }
    return map;
  }
  static renderMap(map) {
    return (() => {
      let result = [];
      for (let key in map) {
        let val = map[key];
        if (val !== undefined) {
          result.push(`${ key }=${ val }`);
        }
      }
      return result;
    })().join('&');
  }
};

if ('undefined' !== typeof window) {
  // is in browser
  LocationHash.installInBrowser();
}
