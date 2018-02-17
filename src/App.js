import React, { Component } from 'react';
import Tone from 'tone';
import './App.css';
import DrumPad from './components/DrumPad/DrumPad.js';
import DrumPadList from './components/DrumPadList/DrumPadList.js';

import { settings } from './data/model.js';
import * as sequencer from './modules/sequencer.js';
import { defaultSequence } from './data/model.js';
import samples from "./data/samples.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBeat: null,
      bpm: 70
    };
  }  

  componentDidMount() {
    this.loop = sequencer.create(defaultSequence, this.updateCurrentBeat);
    this.loop.start();
    this.setTransportBPM(80);
    // this.startTransport();
    console.log(defaultSequence);
  }

  startTransport() {
    Tone.Transport.start();
  }

  stopTransport() {
    Tone.Transport.stop();
  }

  setTransportBPM(bpm) {
    sequencer.setBPM(bpm);
  }

  updateCurrentBeat = (beat) => {
    this.setState({currentBeat: beat});
    // console.log(this.state.currentBeat);
  }

  render() {
    return (
    <div className="container pt-3">
      <div className="row">
        <div className="col pb-3">    
          <h2 className="App-intro">
              Hello Tone
          </h2>
          <div className="text-center">
            <button onClick={this.startTransport} className="btn btn-success mr-2">
              Start
            </button>
            <button onClick={this.stopTransport} className="btn btn-success mr-2">
              Stop
            </button> 
            <button onClick={this.updateCurrentBeat} className="btn btn-danger">
              Record
            </button> 
          </div>            
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
