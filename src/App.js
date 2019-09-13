import React, { useState, useEffect } from 'react'
import prettyHash from 'pretty-hash'
import { clipboard } from 'electron'
import './App.css'

const datUrl = 'deafbeefdeafbeefdeafbeefdeafbeefdeafbeefdeafbeefdeafbeefdeafbeef'

function App() {
  const [newFilePath, setNewFilePath] = useState('')
  const [filePath, setFilePath] = useState('')
  const [currentWallpaper, setCurrentWallpaper] = useState({ isMine: false, img: 'foo.jpg'})

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
        <button className="btn-link" onClick={handleLinkClick.bind(null, datUrl)}>
          dat://{prettyHash(datUrl)}
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