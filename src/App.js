import React, { useEffect } from 'react';
import fs from 'fs';
import logo from './logo.svg';
import './App.css';

function App() {

  useEffect(() => {
    console.log('dirname', __dirname)
    // example using native node dependencies in CRA
    fs.readdir('./', (err, files) => {
      files.forEach(file => console.log('file: ', file))
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App