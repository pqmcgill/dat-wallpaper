import { useState, useEffect } from 'react'
import Dat from '@pqmcgill/dat-node'

export default function useDat(filePath) {
  const [dat, setDat] = useState()
  const [ready, setReady] = useState(false)
  const [networkKey, setNetworkKey] = useState()

  useEffect(() => {
    if (filePath) {
      let watcher;

      Dat(filePath, (err, dat) => {
        if (err) throw err

        setDat(dat)

        // watch for changes at local wallpaper folder
        watcher = dat.importFiles({ watch: true })
        watcher.on('put', handlePut)
        watcher.on('del', handleDel)
        
        // join the swarm
        dat.joinNetwork()

        setNetworkKey(dat.key.toString('hex'))
        setReady(true)
      })

      return () => {
        if (watcher) {
          watcher.off('put', handlePut)
          watcher.off('del', handleDel)
        }
      }

      function handlePut (...args) { console.log('added file:', ...args) }
      function handleDel (...args) { console.log('deleted file:', ...args) }
    }
  }, [filePath])

  return {
    dat,
    networkKey,
    ready
  }
}