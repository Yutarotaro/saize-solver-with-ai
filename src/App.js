import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Inference from './Inference';
import ProcessImage from './ProcessImage';
import Header from './Header';
import ShowState from './ShowState';
import { StateProvider } from './StateContext';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

function App() {


  return (
    <FluentProvider theme={webLightTheme} className="App">
      <Header />
      <StateProvider >
        <ShowState />
        <ProcessImage />
      </StateProvider>
    </FluentProvider>
  );
}

export default App;
