import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Inference from './Inference';
import ProcessImage from './ProcessImage';
import Header from './Header';

function App() {
  const [isReady, setIsReady] = useState(false);

  const { cv } = window;

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
      <Header />
      <ProcessImage/>
      <div>
        <h1> OpenCV.js with React</h1>
        {isReady ? <p>OpenCV is ready to use! </p>: <p>Loading OpenCV ...</p>}
      </div>
    </div>
  );
}

export default App;
