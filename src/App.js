import React, { useState, useEffect } from 'react'
import prettyHash from 'pretty-hash'
import { clipboard } from 'electron'
import './App.css'
import useLocalDat from './hooks/useLocalDat'
import usePublicDat from './hooks/usePublicDat'
import usePlayer from './hooks/usePlayer'
import usePersistence from './hooks/usePersistence'
import FilePathConfig from './components/FilePathConfig'
import PlayButton from './components/PlayButton'

function App() {
  const [filePath, setFilePath] = usePersistence('localFilePath', '')
  const [delay, setDelay] = useState(null)

  const localDat = useLocalDat(filePath)
  const publicDat = usePublicDat()

  // Main Loop
  const { currentWallpaper } = usePlayer(delay, localDat)

  function toggleDelay() {
    setDelay(delay ? null : 5000)
  }

  return (
    <div className="App">
      {/* Player */}
      <h1>DatWallpaper</h1>
      <FilePathConfig filePath={filePath} onFilePathChange={setFilePath} />
      {localDat.ready && <PlayButton isPlaying={delay} onToggle={toggleDelay} />}

      {/* Network */}
      
      {/* { !swarmConnection 
        ? <h2>Connecting...</h2> 
        : <>
          <h2>Connected!</h2>
          <h3>Share your url</h3>
          <p>
            <button className="btn-link" onClick={handleLinkClick.bind(null, publicDatNetworkKey)}>
              dat://{prettyHash(publicDatNetworkKey)}
            </button>
          </p>
        </>
      } */}
      
      {/* <h3>Connect to a shared url</h3>
      <input type="text"/> */}
    <h3>Current Wallpaper</h3>
    <p>
      <button className="btn-link">
        {prettyHash(currentWallpaper)}
      </button>
    </p>
    </div>
  );
}

export default App