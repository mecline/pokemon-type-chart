import React from 'react';
import './App.css';
import PokeInfo from './components/PokeInfo'
import { Toolbar } from '@material-ui/core';

function App() {
  return (
    <div className="homePage">
      <Toolbar className="toolbar"></Toolbar>
      <PokeInfo />
    </div>
  );
}

export default App;
