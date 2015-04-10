
module.exports = class LocationHash

  # str: the one line attribute string of syntax: a=b&c=d&e=f
  constructor : (str)->
    @_attr = LocationHash.parseMap(str)
    @_evnt = {}

  # get/set attributes without side-effects
  get : (key)-> @_attr[key]
  set : (key,val)-> @_attr[key] = val; this   # allow chain

  # render attributes to one line string
  toStr : ()->LocationHash.renderMap(@_attr)

  # merge attrs to this, navigate to new location, triggers listeners
  navTo : (attrs)->
    a = {}
    (a[k] = v) for k,v of @_attrs
    (a[k] = v) for k,v of attrs
    newHash = '#' + LocationHash.renderMap(a)
    if newHash != location.hash then location.hash = newHash

  # cb(newVal, oldVal, key) is called when val changes on key
  # newVal is undefined if key is removed
  on : (key, cb)->
    @_evnt[key] ||= []
    if cb not in @_evnt[key] then @_evnt[key].push cb

  # set new attributes, fire listeners if value changed
  # internal helper for navTo, don't call this unless you know what you are doing
  _setNewAttrs : (newAttr)->
    oldAttr = @_attr;
    @_attr = newAttr;
    for newk,newv of newAttr
      oldv = oldAttr[newk]
      if oldv != newv and @_evnt[newk].length>0
        for e in @_evnt[newk]
          e(newv, oldv, newk)
      delete oldAttr[newk]
    # call listener on removed key
    for oldk,oldv of oldAttr when @_evnt[oldk].length>0
      e(undefined, oldv, oldk) for e in @_evnt[oldk]
    oldAttr = newAttr;

  @installInBrowser : ()->
    if LocationHash.inst == undefined
      LocationHash.inst = new LocationHash(location.hash.slice(1))
      $(window).on 'hashchange', ()=>
        newAttr = LocationHash.parseMap(location.hash.slice(1))
        LocationHash.inst._setNewAttrs(newAttr)

  @inst : undefined   # singleton

  # turns a=b&c=d,e=f;x=y
  # into { a: 'b', c: 'd', e: 'f', x: 'y'}
  @parseMap : (str)->
    map = {}
    while match = /(\w+)=(.*?)([,;&]|$)(.*)$/.exec(str)
      [key,val,divider,str]=match[1..4]
      map[key] = val
    map
  @renderMap : (map)->
    ("#{key}=#{val}" for key,val of map when val!=undefined).join('&')

module.exports = LocationHash;

if 'undefined' != typeof window   # is in browser
  LocationHash.installInBrowser()
