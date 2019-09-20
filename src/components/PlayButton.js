import React from 'react'

export default function PlayButton({ isPlaying, onToggle }) {
  function togglePlay() {
    onToggle(isPlaying ? false : true)
  }

  return (
    <div>
      <button onClick={togglePlay}>
        { isPlaying ? 'pause' : 'play' }
      </button>
    </div>
  )
}