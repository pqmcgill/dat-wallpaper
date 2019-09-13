import React, { useEffect } from 'react'
import { resolve } from 'path'
import setWallpaper from './util/setWallpaper'
import './App.css'

const wallpaperPath = resolve('/Users/patrickmcgill/Desktop/test-wallpaper.jpg')

function App() {

  function handleClick() {
    setWallpaper(wallpaperPath)
  }

  return (
    <div>
      <button onClick={handleClick}>Test Wallpaper</button>
    </div>
  );
}

export default App