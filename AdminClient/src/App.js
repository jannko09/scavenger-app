import React, { Component } from 'react';
import Home from './components/Home'
import './App.css';
//import Particles from './components/Particles'
//<Particles></Particles>
 
class App extends Component{
  
    render(){
        return (
          <div className="app">
          <Home/>
          </div>
          );
    };
}
export default App;
