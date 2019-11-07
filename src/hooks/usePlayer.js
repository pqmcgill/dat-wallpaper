import { useState, useRef, useEffect, useCallback } from 'react'
import Dat from '@pqmcgill/dat-node'
import ram from 'random-access-memory'
import setWallpaper from '../util/setWallpaper'
import useAsyncInterval from './useAsyncInterval'

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)]
}

export default function usePlayer(delay, localDat, peers) {
  const [currentWallpaper, setCurrentWallpaper] = useState()
  const cancelRef = useRef(false)
  
  const selectPeerDat = useCallback((cb) => {
    const key = randomItem(peers)
    if (key === 'me') {
      console.log('selected me')
      cb(localDat.dat)
    } else {
      console.log('selected another peer')
      Dat(ram, { 
        key,
        sparse: true 
      }, (err, dat) => {
        if (err) {
          console.error(err);
          throw err;
        }
        dat.joinNetwork((err) => {
          if (err) throw err
          cb(dat)
        })
      })
    }
  }, [peers, localDat.dat])
  
  const ready = useCallback((cb) => { 
    if (localDat.ready) {
      cb()
    }
  }, [localDat.ready])

  const readDatAndCreateWallpaper = useCallback((dat, next) => {
    dat.archive.readdir('/', (err, ls) => {
      if (err) throw Error('error reading tmp dat: ' + err)
      const selectedWallpaperPath = randomItem(ls);
      dat.archive.readFile(selectedWallpaperPath, (err, data) => {
        if (err) throw Error('error downloading tmp wallpaper: ' + err)
        if (!cancelRef.current) {
          setWallpaper(data, selectedWallpaperPath)
          setCurrentWallpaper(selectedWallpaperPath)

          // close dat to clear up memory if it's not the local dat
          if (!dat.archive.writable) { 
            dat.close(next) 
          } else {
            next();
          }
        }
      })
    })
  }, [])
  
  const loop = useCallback((next) => {
    ready(() => {
      selectPeerDat((dat) => {
        readDatAndCreateWallpaper(dat, next)
      })
    })
  }, [ready, selectPeerDat, readDatAndCreateWallpaper])
  
  const { start, stop } = useAsyncInterval(loop, delay)
  
  useEffect(function togglePause() {
    if (delay) {
      cancelRef.current = false
      start()
    } else {
      cancelRef.current = true
      stop()
    }
  }, [delay, start, stop])
  
  return {
    currentWallpaper
  }
}











