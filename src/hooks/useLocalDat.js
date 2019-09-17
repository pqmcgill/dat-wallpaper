import { useState, useEffect } from 'react'
import Dat from '@pqmcgill/dat-node'

export default function useDat(key) {
  const [localDat, setDat] = useState()
  const [localDatReady, setReady] = useState(false)
  const [localDatNetworkKey, setNetworkKey] = useState()

  useEffect(() => {
    if (key) {
      let watcher;
      Dat(key, (err, dat) => {
        if (err) throw err

        setDat(dat)

        // watch for changes at local wallpaper folder
        watcher = dat.importFiles({ watch: true })
        watcher.on('put', (...args) => console.log('added file:', ...args))
        watcher.on('del', (...args) => console.log('deleted file:', ...args))
        
        // join the swarm
        dat.joinNetwork()

        setNetworkKey(dat.key.toString('hex'))
        setReady(true)
      })

      return () => {
        if (watcher) {
          watcher.off()
        }
      }
    }
  }, [key])

  return {
    localDat,
    localDatNetworkKey,
    localDatReady
  }
}