import React, { useState, useEffect, useCallback } from 'react'
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

function NetworkSettings() {
  const [isSessionOpen, setSessionOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [remoteKey, setRemoteKey] = useState(null);
  const [showRemoteKeyInput, setShowRemoteKeyInput] = useState(false);

  const closeSession = useCallback(() => {
    setSessionOpen(false);
    setIsOwner(false);
    setRemoteKey(null);
    setShowRemoteKeyInput(false);
  }, [])

  const startNewSession = useCallback(() => {
    setSessionOpen(true);
    setIsOwner(true);
    setShowRemoteKeyInput(false);
    setRemoteKey('new');
  }, [])

  const joinRemoteSession = useCallback(() => {
    setIsOwner(false);
    setShowRemoteKeyInput(true);
  }, [])

  const handleKeyInput = useCallback((e) => {
    setRemoteKey(e.target.value);
  }, [])
  
  const handleSubmit = useCallback(() => {
    setSessionOpen(true);
  }, [])

  if (!isSessionOpen) {
    return (
      <>
        <h3>Network Config</h3>
        <p>Not Connected</p>
        <button onClick={startNewSession}>Start New Session</button>
        <button onClick={joinRemoteSession}>Join Remote Session</button>
        { showRemoteKeyInput && (
          <>
            <input type="text" onChange={handleKeyInput} />
            <button onClick={handleSubmit}>Join!</button>
          </>
        )}
      </>
    )
  } else {
    return (
      <>
        <h3>Network Config</h3>
        <Session owner={isOwner} remoteKey={remoteKey} onClose={closeSession}/>
      </>
    )
  }
}

function DatUrl(props) {
  const handleLinkClick = useCallback(() => {
    clipboard.writeText(props.url)
    new Notification('You did it!', {
      body: `You copied the link to your clipboard!`
    })
  }, [props.url])
  return (
    <p>url: <button className="btn-link" onClick={handleLinkClick}>{ props.url }</button></p>
  )
}

function Session(props) {
  const { conn, networkKey, onNewlyDiscoveredPeer } = usePublicDat(props.owner ? 'new' : props.remoteKey);

  useEffect(() => {
    onNewlyDiscoveredPeer((peerId, key) => {
      // do stuff
      console.log('new peer', peerId, key);
    })
  }, [onNewlyDiscoveredPeer])

  if (!conn) {
    return <p>Connecting...</p>
  }

  if (props.owner) {
    return (
      <>
        <h3>Connected to my own sesh</h3>
        <DatUrl url={`dat://${networkKey.toString('hex')}`} />
      </>
    )
  } else {
    return (
      <>
        <h3>Connected to someone else's sesh</h3>
        <DatUrl url={`dat://${networkKey.toString('hex')}`} />
      </>
    )
  }
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