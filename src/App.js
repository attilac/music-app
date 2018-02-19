import React, { Component } from 'react';
import Tone from 'tone';

import './App.css';
import DrumPad from './components/DrumPad/DrumPad';
import DrumPadList from './components/DrumPadList/DrumPadList';

import samples from './data/samples.json';
import * as model from './data/model';
import * as sequencer from './modules/sequencer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      record: false,
      currentBeat: -1,
      bpm: 70,
      tracks: model.defaultSequence,
    };
    this.startTransport = this.startTransport.bind(this);
    this.stopTransport = this.stopTransport.bind(this);
    this.updateCurrentBeat = this.updateCurrentBeat.bind(this);
    this.toggleTrackBeat = this.toggleTrackBeat.bind(this);
    this.sequencer = sequencer;
    this.players = this.sequencer.createPlayers(model.defaultSequence);
  }

  componentDidMount() {
    const { tracks } = this.state;
    console.log(tracks);
    this.loop = this.sequencer.create(tracks, this.updateCurrentBeat, this.players);
    this.loop.start();
    this.setTransportBPM(80);
    // this.startTransport();
    // console.log(model.defaultSequence);
  }

  setTransportBPM(bpm) {
    this.sequencer.setBPM(bpm);
  }

  startTransport() {
    Tone.Transport.start();
    this.setState({ playing: true });
  }

  stopTransport() {
    Tone.Transport.stop();
    this.setState({ currentBeat: -1, playing: false, record: false });
  }

  updateCurrentBeat(beat) {
    this.setState({ currentBeat: beat });
    // console.log(this.state.currentBeat);
  }

  updateTracks(newTracks) {
    this.loop = sequencer.update(this.loop, newTracks, this.updateCurrentBeat);
    this.setState({ tracks: newTracks });
  }

  toggleTrackBeat(id, beat) {
    const { tracks } = this.state;
    this.updateTracks(model.toggleTrackBeat(tracks, id, beat));
  }

  recordIt() {
    this.setState({ record: true });
  }

  render() {
    const { currentBeat, tracks, record, playing } = this.state;
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
            <DrumPadList 
              players={this.players} 
              samples={tracks} 
              record={record} 
              playing={playing}
              currentBeat={currentBeat}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
