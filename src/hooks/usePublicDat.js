import { useState, useEffect } from 'react'
import Dat from '@pqmcgill/dat-node'

export default function useDat(remoteKey) {
  const [publicDat, setDat] = useState()
  const [publicDatReady, setReady] = useState(false)
  const [publicDatNetworkKey, setNetworkKey] = useState()
  const [swarmConnection, setConnection] = useState(false)

  useEffect(() => {
    let opts = {
      temp: true,
      sparse: true
    }

    if (remoteKey) {
      opts = {
        ...opts,
        key: remoteKey
      }
    }
    // Open public dat
    Dat('./', opts, (err, dat) => {
      if (err) throw err

      setDat(dat)
      // join the swarm
      dat.joinNetwork((err) => {
        debugger;
        if (err) {
          throw err
        }

        setConnection(true)
      })

      setNetworkKey(dat.key.toString('hex'))
      setReady(true)
    })
  }, [remoteKey])

  return {
    publicDat,
    publicDatNetworkKey,
    publicDatReady,
    swarmConnection
  }
}