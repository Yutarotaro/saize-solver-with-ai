import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Inference from './Inference';
import ProcessImage from './ProcessImage';
import Header from './Header';
import ShowState from './ShowState';
import { StateProvider } from './StateContext';

function App() {
  const [isReady, setIsReady] = useState(false);

  const { cv } = window;

  useEffect(() => {
    if (cv) {
      cv['onRuntimeInitialized'] = () => {
        console.log('OpenCV Ready');
        setIsReady(true);
      }
    }
  }, []);


  return (
    <div className="App">
      <Header />
      <StateProvider >
        <ShowState />
        <ProcessImage />
      </StateProvider>
    </div>
  );
}

export default App;
