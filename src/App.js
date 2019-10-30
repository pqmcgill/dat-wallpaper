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

function PlayerSettings({ localDat, filePath, setFilePath, peers }) {
  const [delay, setDelay] = useState(null)

  // Main Loop
  const { currentWallpaper } = usePlayer(delay, localDat, peers)

  function toggleDelay() {
    setDelay(delay ? null : 5000)
  }

  return (
    <>
      <h1>DatWallpaper</h1>
      <FilePathConfig filePath={filePath} onFilePathChange={setFilePath} />
      {localDat.ready && <PlayButton isPlaying={delay} onToggle={toggleDelay} />}
      <h3>Current Wallpaper</h3>
      <p>
        <button className="btn-link">
          {prettyHash(currentWallpaper)}
        </button>
      </p>
    </>
  );
}

function NewSession() {
  const { conn, networkKey } = usePublicDat('new')

  if (!conn) {
    return <p>Connecting...</p>
  }

  return (
    <>
      <p>Connected</p>
      <p>dat://{networkKey}</p>
    </>
  )
}

function NetworkSettings() {
  return (
    <>
      <h3>Network Config</h3>
      <p>Not Connected</p>
      <button>Start New Session</button>
      <button>Join Remote Session</button>
      <NewSession />
    </>
  )
}

function App() {
  const [filePath, setFilePath] = usePersistence('localFilePath', '')
  const [peers, setPeers] = useState(['me', 'not me'])
  const localDat = useLocalDat(filePath)

  return (
    <div className="App">
      <PlayerSettings localDat={localDat} filePath={filePath} setFilePath={setFilePath} peers={peers}/>
      <hr />
      <NetworkSettings />
    </div>
  )
}

export default App