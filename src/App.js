import React, { useState, useEffect } from 'react'
import prettyHash from 'pretty-hash'
import { clipboard } from 'electron'
import fs from 'fs'
import tmp from 'tmp'
import { watch } from 'pauls-dat-api'
import Dat from '@pqmcgill/dat-node'
import './App.css'
import setWallpaper from './util/setWallpaper'

function App() {
  const [newFilePath, setNewFilePath] = useState('')
  const [filePath, setFilePath] = useState('')
  const [currentWallpaper, setCurrentWallpaper] = useState({ isMine: false, img: 'foo.jpg'})
  const [networkKey, setNetworkKey] = useState(null)
  const [wallpaperKey, setWallpaperKey] = useState(null)

  useEffect(() => {
    if (filePath) {
      console.log('mirroring filePath', filePath)
      Dat(filePath, (err, dat) => {
        if (err) throw err
        const watcher = dat.importFiles({ watch: true })
        // watcher.on('put', (...args) => console.log('added file:', ...args))
        // watcher.on('del', (...args) => console.log('deleted file:', ...args))
        dat.archive.readdir('/', (err, ls) => {
          if (err) throw err
          console.log('files', ls)
        })
        // const es = watch(dat.archive)
        // es.on('data', ([e]) => {
        //   if (e === 'changed') {
        //     dat.archive.readdir('/', (err, ls) => {
        //       if (err) throw err
        //       console.log('files', ls)
        //     }) 
        //   } 
        // })
        dat.joinNetwork()
        setWallpaperKey(dat.key.toString('hex'))
        
        // main loop
        setInterval(() => {
          dat.archive.readdir('/', (err, ls) => {
            if (err) throw err
            const rand = Math.floor(Math.random() * Math.floor(ls.length));
            const img = ls[rand]
            // Manually download files via the hyperdrive API:
            dat.archive.readFile(img, function (err, content) {
              if (err) throw err
              setWallpaper(content, img)
              setCurrentWallpaper(img)
            })
          }) 
        }, 5000)
      })

      // TODO discover peers
      Dat('./', { temp: true }, (err, dat) => {
        dat.joinNetwork()
        setNetworkKey(dat.key.toString('hex'))
      })
    }
  }, [filePath])

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
        <button className="btn-link" onClick={handleLinkClick.bind(null, networkKey)}>
          dat://{prettyHash(networkKey)}
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