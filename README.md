# DatWallpaper (WIP)

## TODO

- [x] Boilerplate
  - [x] CRA setup
  - [x] rescripts for custom webpack config
  - [x] allow native node imports (fs, hyperdrive, etc.) in application
  - [x] npm scripts (dev, build, package, distribute)
- [ ] Dynamically change wallpaper POC
- [ ] UI
  - [ ] display dat:// url with copy to clipboard action
  - [ ] input for connecting to another wallpaper set via it's dat:// url
  - [ ] local folder path configuration
  - [ ] current file link
    - [ ] if own file, click opens up file in default file manager via electron.shell api
    - [ ] if other's file, click saves wallpaper and opens up file in default file manager
  - [ ] basic network status information - nice to have
- [ ] Data
  - Memory
    - Processed combined list of all wallpaper metadata found in the swarm
    - Set of connected peers mapped to their wallpaper dat:// urls and content metadata
  - Native drive
    - Own list of saved wallpapers
    - Current Wallpaper stored in a tmp folder
  - Hyperdrive
    - Own list of saved wallpapers
- [ ] Algorithm
  instantiate local drive or create if non existent 
  instantiate peers as empty set
  
  loop
    list all wallpapers from all peers including own
    randomly select one
    if valid image
      render to screen
      wait 1 minute
      loop
    else
      loop
  
  on adding a new peer
    if peers has peer
      return
    else
      peers.add(peer)
      let peer know about your dat:// url via extension message
  
  on peer announcing their dat:// url
    if peers has peer
      if the peer's url is already known
        return
      else
        read metadata contents of remote wallpaper drive
        update peer with url and metadata list




