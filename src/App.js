import React, { useState, useEffect } from 'react'
import prettyHash from 'pretty-hash'
import { clipboard } from 'electron'
import Dat from '@pqmcgill/dat-node'
import './App.css'
import useInterval from './hooks/useInterval'
import setWallpaper from './util/setWallpaper'
import useLocalDat from './hooks/useLocalDat'

function App() {
  const [newFilePath, setNewFilePath] = useState('')
  const [filePath, setFilePath] = useState('')
  const [currentWallpaper, setCurrentWallpaper] = useState({ isMine: false, img: 'foo.jpg'})

  const {
    localDat,
    localDatNetworkKey,
    localDatReady
  } = useLocalDat(filePath)

  // const {
  //   dat: publicDat,
  //   networkKey: publicDatNetworkKey,
  //   ready: publicDatReady
  // } = useDat('./')

  // Main Loop
  useInterval(() => {
    if (localDatReady) {
      // pick a connected peer (including self) at random
      // pick a wallpaper from that peer at random
      // 
      localDat.archive.readdir('/', (err, wallpapers) => {
        if (err) throw err
        const randIdx = Math.floor(Math.random() * Math.floor(wallpapers.length));
        const img = wallpapers[randIdx]
        // Manually download files via the hyperdrive API:
        localDat.archive.readFile(img, function (err, content) {
          if (err) throw err
          console.log(img)
          setWallpaper(content, img)
          setCurrentWallpaper(img)
        })
      }) 
    }
  }, 5000)

  function handleLinkClick(link) {
    clipboard.writeText(link)
    new Notification('You did it!', {
      body: `You copied the link to your clipboard!`
    })
  }

  function inputNewFilePath(e) {
    setNewFilePath(e.target.value)
  }

  function saveFilePath() {
    setFilePath(newFilePath)
    setNewFilePath('')
  }

  function handleWallpaperClick() {
    if (currentWallpaper.isMine) {
      // TODO: navigate to file location on OS
      console.log('mine! navigating to the location')
    } else {
      // TODO: download, then navigate
      console.log('not mine. it is now!')
    }
  }

  return (
    <div className="App">
      <h1>DatWallpaper</h1>
      
      <h3>Share your url</h3>
      <p>
        <button className="btn-link" onClick={handleLinkClick.bind(null, localDatNetworkKey)}>
          dat://{prettyHash(localDatNetworkKey)}
        </button>
      </p>
      
      <h3>Connect to a shared url</h3>
      <input type="text"/>
      
      <h3>Path to local wallpaper folder</h3>
      <p>Current Path: 
        <button className="btn-link" onClick={handleLinkClick.bind(null, filePath)}>
          {prettyHash(filePath)}
        </button>
      </p>
      <input type="text" value={newFilePath} onChange={inputNewFilePath}/>
      <button onClick={saveFilePath}>Set New Path</button>
      
      <h3>Current Wallpaper</h3>
      <p>
        <button className="btn-link" onClick={handleWallpaperClick}>
          {prettyHash(currentWallpaper.img)}
        </button>
      </p>
    </div>
  );
}

export default App