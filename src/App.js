import React, { Component } from 'react';
import Tone from 'tone';
import { settings } from './sounds/tone.js';
import './App.css';
import DrumPad from './components/DrumPad.js';
import DrumPads from './components/DrumPads.js';

class App extends Component {
  componentDidMount() {
    settings.testSynth.toMaster();
    settings.loop.start();
    console.log(settings.samples);
  }

  startLoop(e) {
    Tone.Transport.start();
  }

  stopLoop(e) {
    Tone.Transport.stop();
  }

  render() {
    return (
    <div className="container">
      <div className="row">
        <div className="col">    
          <p className="App-intro">
              Hello Tone
          </p>
          <button onMouseOver={this.startLoop} onMouseOut={this.stopLoop} className="btn btn-success mr-2">
            Start
          </button>
          <button onClick={this.stopLoop} className="btn btn-success">
            Stop
          </button> 
        </div>  
      </div>   
      <div className="row">   
        <div className="col">       
          <DrumPads samples={settings.samples} path="./audio/" kit="A" /> 
        </div>     
      </div>            
    </div>      
    );
  }
}

export default App;
