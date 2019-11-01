import { useState, useEffect, useCallback } from 'react'
import Dat from '@pqmcgill/dat-node'
// import DatPeers from 'dat-peers';

console.log('here', EventTarget, typeof EventTarget);

export default function useDat(remoteKey) {
  const [dat, setDat] = useState()
  const [ready, setReady] = useState(false)
  const [networkKey, setNetworkKey] = useState()
  const [conn, setConnection] = useState(false)
  const [newPeerListener, setNewPeerListener] = useState(null);

  const onNewlyDiscoveredPeer = useCallback((cb) => {
    setNewPeerListener(cb);
  }, []);

  useEffect(() => {
    let opts = {
      temp: true,
      sparse: true,
      extensions: ['discovery', 'handshake'],
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

      
      dat.archive.on('extension', (type, remoteKey, peer) => {
        if (newPeerListener) {
          if (type === 'discovery') {
            // store the peer's remotekey
            newPeerListener(peer.id.toString(), remoteKey);
            // send them your remotekey via 'handshake'
            peer.extension('handshake', '<MY_PRIVATE_KEY>')
          } else if (type === 'handshake') {
            // store the peer's remotekey
            newPeerListener(peer.id.toString(), remoteKey);
          } else {
            // nothing
            console.warn('unsupported extension msg', type, remoteKey.toString('hex'))
          }
        }
      })
      
      // join the swarm
      dat.joinNetwork((err) => {
        if (err) {
          throw err
        }
        
        dat.network.on('connection', (conn, info) => {
          // on connection stuff
        })
        
        dat.archive.metadata.on('peer-add', peer => {
          peer.extension('discovery', Buffer.from('hello world'));
        })
        setConnection(true)
      })

      setNetworkKey(dat.key.toString('hex'))
      setReady(true)
    })
  }, [remoteKey, newPeerListener])

  return {
    dat,
    networkKey,
    ready,
    conn,
    onNewlyDiscoveredPeer
  }
}