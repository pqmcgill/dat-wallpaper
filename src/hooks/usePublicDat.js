import { useState, useEffect } from "react";
import Dat from "@pqmcgill/dat-node";
// import DatPeers from 'dat-peers';

export default function useDat(remoteKey, localDat, peers, setPeers) {
  const [dat, setDat] = useState();
  const [ready, setReady] = useState(false);
  const [networkKey, setNetworkKey] = useState();
  const [conn, setConnection] = useState(false);

  useEffect(() => {
    let opts = {
      temp: true,
      sparse: true,
      extensions: ["discovery", "handshake"]
    };

    if (remoteKey !== "new") {
      opts = {
        ...opts,
        key: remoteKey
      };
    }

    localDat.archive.ready(() => {
      // Open public dat
      Dat("./", opts, (err, dat) => {
        if (err) throw err;

        setDat(dat);

        dat.archive.on("extension", (type, remoteKey, peer) => {
          if (type === "discovery") {
            // store the peer's remotekey
            // send them your remotekey via 'handshake'
            setPeers({
              ...peers,
              [peer.remoteId.toString('hex')]: remoteKey
            });
            peer.extension('handshake', localDat.key)
          } else if (type === "handshake") {
            console.log('handshake', remoteKey.toString('hex'))
            // store the peer's remotekey
            setPeers({
              ...peers,
              [peer.remoteId.toString('hex')]: remoteKey
            });
          } else {
            // nothing
            console.warn(
              "unsupported extension msg",
              type,
              remoteKey.toString("hex")
            );
          }
        });

        // join the swarm
        dat.joinNetwork(err => {
          if (err) {
            throw err;
          }

          dat.network.on("connection", (conn, info) => {
            // on connection stuff
          });

          dat.archive.metadata.on("peer-add", peer => {
            peer.extension("discovery", localDat.key);
          });
          setConnection(true);
        });

        setNetworkKey(dat.key.toString("hex"));
        setReady(true);
      });
    });
  }, [remoteKey, localDat]); // Watch out for inifinite loops, or risk crashing the entire OS

  return {
    dat,
    networkKey,
    ready,
    conn,
  };
}
