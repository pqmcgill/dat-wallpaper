import React, { useState, useCallback } from 'react'
import prettyHash from 'pretty-hash'
import { clipboard } from 'electron'

export default function FilePathConfig({ filePath, onFilePathChange }) {
  const [newFilePath, setNewFilePath] = useState(filePath)

  function inputNewFilePath(e) {
    setNewFilePath(e.target.value)
  }

  const saveFilePath = useCallback(() => {
    onFilePathChange(newFilePath)
  }, [onFilePathChange, newFilePath])

  const handleLinkClick = useCallback(() => {
    clipboard.writeText(filePath)
    new Notification('You did it!', {
      body: `You copied the link to your clipboard!`
    })
  }, [filePath])

  return (
    <>
      <h3>Path to local wallpaper folder</h3>
      <button className="btn-link" onClick={handleLinkClick}>
        {filePath}
      </button>
      <input type="text" value={newFilePath} onChange={inputNewFilePath}/>
      <button onClick={saveFilePath}>Set New Path</button>
    </>
  )
}