import React, { Component } from 'react';
import Tone from 'tone';
import { settings } from './sounds/tone.js';
import './App.css';
import DrumPad from './components/DrumPad.js';
import DrumPadList from './components/DrumPadList.js';

import * as sequencer from './sounds/sequencer.js';
import samples from "./sounds/samples.json";
// const samples = { 'samples': settings.samples, 'basePath': './audio/', 'kit': 'A' };

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBeat: null,
      bpm: 70
    };
  }  

  componentDidMount() {
    // settings.testSynth.toMaster();
    // settings.loop.start();
    // console.log(samples.basePath);  
    this.loop = sequencer.create(samples, this.updateCurrentBeat);
    this.loop.start();
  }

  startTransport() {
    Tone.Transport.start();
  }

  stopTransport() {
    Tone.Transport.stop();
  }

  updateCurrentBeat = (beat) => {
    this.setState({currentBeat: beat});
  }

  render() {
    return (
    <div className="container pt-3">
      <div className="row">
        <div className="col pb-3">    
          <h2 className="App-intro">
              Hello Tone
          </h2>
          <button onClick={this.startTransport} className="btn btn-success mr-2">
            Start
          </button>
          <button onClick={this.stopTransport} className="btn btn-success">
            Stop
          </button> 
        </div>  
      </div>   
      <div className="row">   
        <div className="col">       
          <DrumPadList samples={samples} path={settings.basePath} kit="A"/> 
        </div>     
      </div>            
    </div>      
    );
  }
}

export default App;
