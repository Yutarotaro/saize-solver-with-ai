import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [isReady, setIsReady] = useState(false);

  const { cv } = window;
  console.log(cv)

  useEffect(() => {
    if(cv){
      cv['onRuntimeInitialized'] = () => {
        console.log('OpenCV Ready');
        setIsReady(true);
      }
    }
  }, []);


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
      <div>
        <h1> OpenCV.js with React</h1>
        {isReady ? <p>OpenCV is ready to use! </p>: <p>Loading OpenCV ...</p>}
      </div>
    </div>
  );
}

export default App;
