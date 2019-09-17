import { useState, useEffect } from 'react'
import Dat from '@pqmcgill/dat-node'

export default function useDat() {
  const [publicDat, setDat] = useState()
  const [publicDatReady, setReady] = useState(false)
  const [publicDatNetworkKey, setNetworkKey] = useState()

  useEffect(() => {
    Dat('./.dat-wallpaper', { temp: true }, (err, dat) => {
      if (err) throw err

      setDat(dat)
      
      // join the swarm
      dat.joinNetwork()

      setNetworkKey(dat.key.toString('hex'))
      setReady(true)
    })
  }, [])

  return {
    publicDat,
    publicDatNetworkKey,
    publicDatReady
  }
}