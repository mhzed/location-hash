location-hash
--------

Deal with #hash in url in browser.

In a single page webapp, sometimes states are persisted to location.hash so that refresh or bookmark will load
the webapp with the persisted state.

Thus, multiple component in webapp need to set location.hash and listen for lcoation.hash change.

Example:

    import lochash from "location-hash"
    
    // url is:  #theme=x&loc=us
    lochash.inst.get('theme') // returns 'x', locemitter.inst is the singleton bound to window.location.hash
    lochash.inst.get('loc')   // returns 'us'
  
    lochash.inst.on('theme', (oldTheme, newTheme)=>{
      // invoked every time theme changes
      newTheme == lochash.inst.get('theme') // this shall be true
    })
  
    lochash.inst.set('theme', 'y').toStr()       // theme=y&loc=us
    lochash.inst.set('theme', undefined).toStr() // loc=us
  
    lochash.inst.navTo({theme: 'z'})             // location.href changes, and triggers 'theme' listener above

