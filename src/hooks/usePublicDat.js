import { useState, useEffect } from 'react'
import Dat from '@pqmcgill/dat-node'

export default function useDat(remoteKey) {
  const [dat, setDat] = useState()
  const [ready, setReady] = useState(false)
  const [networkKey, setNetworkKey] = useState()
  const [conn, setConnection] = useState(false)

  useEffect(() => {
    let opts = {
      temp: true,
      sparse: true
    }

    if (remoteKey !== 'new') {
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
        if (err) {
          throw err
        }

        setConnection(true)
        
        dat.network.on('connection', (...args) => {
          console.log('connected', ...args)
        })        

      })

      setNetworkKey(dat.key.toString('hex'))
      setReady(true)
    })
  }, [remoteKey])

  return {
    dat,
    networkKey,
    ready,
    conn
  }
}