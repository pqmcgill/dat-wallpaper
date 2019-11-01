import { useState, useEffect } from 'react'
import Dat from '@pqmcgill/dat-node'
// import DatPeers from 'dat-peers';

console.log('here', EventTarget, typeof EventTarget);

export default function useDat(remoteKey) {
  const [dat, setDat] = useState()
  const [ready, setReady] = useState(false)
  const [networkKey, setNetworkKey] = useState()
  const [conn, setConnection] = useState(false)

  useEffect(() => {
    let opts = {
      temp: true,
      sparse: true,
      extensions: ['discovery'],
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
        
        dat.network.on('connection', (conn, info) => {
          console.log('connected', conn, info);
        })   
        
        dat.archive.metadata.on('peer-add', (peer) => {
          console.log('peer added', peer);
          peer.extension('discovery', Buffer.from('hello world!'));
        });

        dat.archive.metadata.on('extension', (type, msg) => {
          if (type === 'discovery') {
            console.log('It worked!', msg);
          }
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