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
      erase: false,
      playing: false,
      record: false,
      currentBeat: -1,
      bpm: 70,
      tracks: model.defaultSequence,
    };
    this.startTransport = this.startTransport.bind(this);
    this.stopTransport = this.stopTransport.bind(this);
    this.updateCurrentBeat = this.updateCurrentBeat.bind(this);
    this.timeNotifier = this.timeNotifier.bind(this);
    this.toggleTrackBeat = this.toggleTrackBeat.bind(this);
    this.clearTrackBeat = this.clearTrackBeat.bind(this);
    this.toggleEraseMode = this.toggleEraseMode.bind(this);
    this.recordIt = this.recordIt.bind(this);
    this.sequencer = sequencer;
    this.players = this.sequencer.createPlayers(model.defaultSequence);
  }

  componentDidMount() {
    const { tracks } = this.state;
    console.log(tracks);
    this.loop = this.sequencer
      .create(tracks, this.updateCurrentBeat, this.timeNotifier, this.players);
    this.loop.start();
    this.setTransportBPM(80);
    Tone.Transport.setLoopPoints(0, '1m');
    Tone.Transport.loop = true;
    // this.startTransport();
    // console.log(model.defaultSequence);
  }

  setTransportBPM(newBpm) {
    const { bpm } = this.state;
    this.sequencer.setBPM(newBpm);
    this.setState({ bpm: newBpm });
  }

  startTransport() {
    Tone.Transport.start();
    this.setState({ playing: true });
  }

  stopTransport() {
    Tone.Transport.stop();
    this.setState({ currentBeat: -1, playing: false, record: false });
  }

  toggleTrackBeat(trackId) {
    const { tracks, currentBeat } = this.state;
    this.updateTracks(model.toggleTrackBeat(tracks, trackId, currentBeat));
    // console.log(model.toggleTrackBeat(tracks, trackId, currentBeat));
  }

  clearTrackBeat(trackId) {
    const { tracks } = this.state;
    this.updateTracks(model.clearTrackBeat(tracks, trackId));
  }

  toggleEraseMode() {
    this.setState({ erase: !this.state.erase });
  }

  updateCurrentBeat(beat) {
    this.setState({ currentBeat: beat });
  }

  timeNotifier() {
    const barsBeats = Tone.TransportTime().toBarsBeatsSixteenths();
    console.log(barsBeats);
  }

  updateTracks(newTracks) {
    this.loop = sequencer
      .update(this.loop, newTracks, this.updateCurrentBeat, this.timeNotifier, this.players);
    this.setState({ tracks: newTracks });
    // console.log(newTracks);
  }

  recordIt() {
    this.setState({ record: true });
  }

  render() {
    const { currentBeat, tracks, record, playing, erase } = this.state;
    const activePlayClass = playing ? 'btn-secondary active' : 'btn-outline-secondary';
    const activeRecordClass = record ? 'btn-secondary active' : 'btn-outline-secondary';
    const activeEraseClass = erase ? 'btn-secondary active' : 'btn-outline-secondary';
    return (
      <div className="container pt-3">
        <div className="row">
          <div className="col pb-3">
            <h2 className="App-intro text-center my-5">
              Hello Tone
            </h2>
            <div className="module-controls text-center">
              <div className="mb-2">
                <button
                  onClick={this.startTransport}
                  className={`btn mr-2 transport-play ${activePlayClass}`}
                >
                  <i className="icon-play" />
                  Play
                </button>
                <button
                  onClick={this.recordIt}
                  className={`btn mr-2 transport-record ${activeRecordClass}`}
                >
                  <i className="icon-record" />
                  Record
                </button>
                <button
                  onClick={this.stopTransport}
                  className="btn btn-outline-secondary transport-stop"
                >
                  <i className="icon-stop" />
                  Stop
                </button>
              </div>
              <button
                className={`btn btn-sm ${activeEraseClass}`}
                onClick={this.toggleEraseMode}
              >
                Erase Mode
              </button>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mt-5">
          <div className="col-lg-8">
            <DrumPadList
              players={this.players}
              samples={tracks}
              record={record}
              playing={playing}
              currentBeat={currentBeat}
              toggleTrackBeat={this.toggleTrackBeat}
              clearTrackBeat={this.clearTrackBeat}
              erase={erase}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
