import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tone from 'tone';
import PubNubReact from 'pubnub-react';

import firebase from './firebase.js';

import './App.css';
import DrumPadList from './components/DrumPadList/DrumPadList';
import Controls from './components/Controls/Controls';

import * as model from './data/model';

const db = firebase.firestore();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      click: false,
      erase: false,
      playing: false,
      record: false,
      currentBeat: -1,
      bpm: 120,
      samples: this.props.samples,
      kit: this.props.kit,
      songId: '',
      songTitle: 'Hello Tone',
      transportPosition: '0:0:0',
      tracks: this.props.defaultSequence,
      users: [this.props.user.userName],
      userId: this.props.user.userName,
    };
    // pubnub
    /*
    let uuid = this.state.userId;
    this.pubnub = new PubNubReact({
      publishKey: 'pub-c-08a9d77b-56c3-4db2-9328-38a797ff3150',
      subscribeKey: 'sub-c-00ca6876-17b9-11e8-bb84-266dd58d78d1',
      uuid: uuid,
      presenceTimeout: 130,
    });
    this.pubnub.init(this);
    */
    this.publishTrack = this.publishTrack.bind(this);
    this.addListeners = this.addListeners.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.subscribeTo = this.subscribeTo.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    //firestore
    this.loadTrackFromFirestore = this.loadTrackFromFirestore.bind(this);
    this.saveToFirestore = this.saveToFirestore.bind(this);
    this.updateTrackInFirestore = this.updateTrackInFirestore.bind(this);
    // music app
    this.createSequence = this.createSequence.bind(this);
    this.startTransport = this.startTransport.bind(this);
    this.stopTransport = this.stopTransport.bind(this);
    this.setTransportBPM = this.setTransportBPM.bind(this);
    this.transportPositionNotifier = this.transportPositionNotifier.bind(this);
    this.beatNotifier = this.beatNotifier.bind(this);
    this.toggleTrackBeat = this.toggleTrackBeat.bind(this);
    this.resetTrack = this.resetTrack.bind(this);
    this.toggleClick = this.toggleClick.bind(this);
    this.toggleEraseMode = this.toggleEraseMode.bind(this);
    this.toggleRecord = this.toggleRecord.bind(this);

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTitleKeyPress = this.handleTitleKeyPress.bind(this);
  }

  componentWillMount() {
    /*
    this.pubnub.clean('tracks');
    this.subscribeTo();   
    this.addListeners(); 
    */
  }

  componentDidMount() {
    // const { userId } = this.state;
    // this.createSequence(this.props.defaultSequence); 0;
    // this.saveToFirestore('Default Pattern', true);
    this.loadTrackFromFirestore('sgm9PttUn53mc9lt5wty');
    // window.addEventListener('beforeunload', this.unsubscribe);
  }

  componentWillUnmount() {
    // this.unsubscribe();
  }

  loadTrackFromFirestore(trackId) {
    const tracks = db.collection('tracks');
    tracks.doc(trackId)
      .get()
      .then(doc => {
        if (doc.exists) {        
          // console.log(doc.id, " => ", doc.data().channels);
          const song = doc.data();
          const bpm = parseInt(song.bpm, 10);
          this.setState({ songTitle: song.name });
          this.setState({ songId: doc.id });
          this.createSequence(song.channels, bpm);
        } else {
          console.log('No such document');          
        }       
      })
      .catch(error => {
          console.log('Error getting document:', error);
      }); 
  }

  saveToFirestore(title, isPublic) {
    const { tracks, userId, bpm } = this.state;
    const song = {
      name: title,
      public: isPublic,
      channels: tracks,
      user: userId,
      bpm: bpm,
    }
    // console.log(song);
    db.collection('tracks')
      .add(song)
      .then(docRef => {
        console.log('Document successfully written!');
        console.log("Document written with ID: ", docRef.id);
        this.setState({ songId: docRef.id });
      })
      .catch(error => {
        console.error('Error writing document: ', error);
      });  
  }

  updateTrackInFirestore() {
    const { tracks, songId, bpm } = this.state;
    // console.log(songId);
    if (songId === '') { return; }
    const song = db.collection('tracks').doc(songId);
    return song.update({
      bpm: bpm,
      channels: tracks,
    })
    .then(function() {
        console.log('Document successfully updated!');
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error);
    });
  }

  subscribeTo() {
    this.pubnub.subscribe({
      channels: ['tracks'],
      withPresence: true,
    });
    this.pubnub.getMessage('tracks', (msg) => {
      const { message } = msg;
      console.log(message);  
    });
    this.pubnub.getStatus((st) => {
      console.log(st);
    });
    this.pubnub.getPresence('tracks', (pres) => {
      console.log(pres);
    }); 
    this.pubnub.hereNow({
      channels: ['tracks'],
      includeState: true,
    }).then((response) => {
      console.log(response);
      const { occupants } = response.channels.tracks;
      const users = [...this.state.users];
      occupants.forEach(item => {
        if (!users.includes(item.uuid)) {
          users.push(item.uuid);
        }
      });
      this.setState({ users: users });              
    }).catch((error) => {
      console.log(error);
    });
  }

  addListeners() {
    this.pubnub.addListener({
      message: (msg) => {
        const { message } = msg;
        // console.log('got a message', message.data, ' from user ', message.userId);  
        // update if track is from different user
        if (message.userId !== this.state.userId) {
          console.log('Updating track from user ', message.userId);      
          this.sequence = this.props.sequencer
            .update(this.sequence, message.data, this.beatNotifier, this.transportPositionNotifier, this.props.players);   
          this.setState({ tracks: message.data}); 
        }
      },
      presence: (pres) => {
        console.log(pres);
        let users = [...this.state.users];
        if (pres.action === 'join') {
          if (!users.includes(pres.uuid)) {
            users = [...users, pres.uuid];
            this.setState({ users: users });
          }
        } else if (pres.action === 'leave' || pres.action === 'timeout') {
          let userId = users.indexOf(pres.uuid);
          // console.log(userId);
          if (userId !== -1) {
            users = [ ...users ];
            users.splice(userId, 1);
            // console.log(users);
            this.setState({ users: users });
          }
        }
        this.getUsers();
      }         
    });    
  }

  unsubscribe() {
    this.pubnub.unsubscribe({ channels: ['tracks'] });
    this.pubnub.removeListener('message');
    this.pubnub.removeListener('presence');
    this.pubnub.clean('tracks');
  }

  publishTrack(type, data) {
    const { userId } = this.state;
    this.pubnub.publish({
      channel: 'tracks',
      message: { type, data, userId },
      callback(msg) { console.log(msg); },
    });
  }

  getUsers() {
    const { users } = this.state;
    console.log(users);
  }

  renderUsers() {
    const { users, userId } = this.state;
    return users.map(user =>
      user === userId ?
        (<li key={user} className="user-list__item current-user" id='currentUser'>{user}</li>)
      : 
        (<li key={user} className="user-list__item">{user}</li>)  
    );
  }

  createSequence(tracks, bpm) {
    const { kit } = this.state;
    const { players } = this.props;
    this.sequence = this.props.sequencer.create(tracks, this.beatNotifier, this.transportPositionNotifier, players, kit);    
    this.sequence.start();
    this.setTransportBPM(bpm);
    Tone.Transport.setLoopPoints(0, '1m');
    Tone.Transport.loop = true;
    this.setState({ tracks: tracks });

    this.props.clickSynth.volume.value = -60; 
    this.props.clickSeq.start();  
  }

  updateSequence(newTracks) {
    const { sequencer, players } = this.props;
    const { kit } = this.state;
    this.sequence = sequencer
      .update(this.sequence, newTracks, this.beatNotifier, this.transportPositionNotifier, players, kit);
    this.setState({ tracks: newTracks });
    // this.publishTrack('riff', newTracks);
  }

  toggleTrackBeat(trackId) {
    const { tracks, currentBeat, userId } = this.state;
    this.updateSequence(model.toggleTrackBeat(tracks, trackId, currentBeat));
  }

  resetTrack(trackId) {
    const { tracks } = this.state;
    this.updateSequence(model.resetTrack(tracks, trackId));
  }

  beatNotifier(beat) {
    this.setState({ currentBeat: beat });
  }

  transportPositionNotifier() {
    const position = Tone.TransportTime().toBarsBeatsSixteenths();
    this.setState({ transportPosition: position });
    // console.log(Tone.TransportTime().toSamples());
  }

  setTransportBPM(newBpm) {
    const { sequencer } = this.props;
    sequencer.setBPM(newBpm);
    this.setState({ bpm: newBpm });
  }

  startTransport() {
    Tone.Transport.start('+0.1');
    this.setState({ playing: true });
  }

  stopTransport() {
    Tone.Transport.stop();
    this.setState({ currentBeat: -1, playing: false, record: false });
    // this.updateTrackInFirestore();
  }

  toggleEraseMode() {
    this.setState({ erase: !this.state.erase });
  } 
  
  toggleClick() {
    const { click } = this.state;
    const { clickSynth } = this.props;
    if (!click) {
      clickSynth.volume.value = -6;
    } else {
      clickSynth.volume.value = -60;
    }
    this.setState({ click: !click });
  }

  toggleRecord() {
    const { record } = this.state;
    this.setState({ record: !record });
  }

  handleTitleChange(event) {
    const { value } = event.target;
    this.setState({ songTitle: value });
  }

  handleTitleKeyPress(event) {
    if(event.keyCode === 13) {
      const { songTitle } = this.state;
      this.saveToFirestore(songTitle, true);
    }
  }

  render() {
    const { click, 
      currentBeat, 
      tracks, 
      record, 
      playing, 
      erase,
      songTitle,
      transportPosition, 
      bpm 
    } = this.state;
    const { players } = this.props;
    return (
      <div className="app container-fluid h-100">      
        <div className="module-user p-absolute p-3">
          <h5>Users</h5>
          <ul className="user-list list-unstyled">{this.renderUsers()}</ul>
        </div>          
        <div className="row h-100">
          <div className="col fluid d-flex flex-column">
            <div className="row justify-content-center">
              <div className="">
                <input 
                  className="form-control song-title mt-5 text-center"
                  type="text"
                  value={songTitle}
                  onChange={this.handleTitleChange}
                  onKeyDown={this.handleTitleKeyPress}
                />
              </div>  
            </div>               
            <div className="main row justify-content-center align-items-center">           
              { 
                <DrumPadList
                  players={players}
                  samples={tracks}
                  record={record}
                  playing={playing}
                  currentBeat={currentBeat}
                  toggleTrackBeat={this.toggleTrackBeat}
                  resetTrack={this.resetTrack}
                  erase={erase}
                />
              }
            </div>  
            <div className="row">
              <Controls
                click={click}
                record={record}
                playing={playing}
                erase={erase}
                saveTrack={this.updateTrackInFirestore}
                setTransportBPM={this.setTransportBPM}
                startTransport={this.startTransport} 
                stopTransport={this.stopTransport}
                tempo={bpm}
                toggleRecord={this.toggleRecord}
                toggleEraseMode={this.toggleEraseMode}
                toggleClick={this.toggleClick}
                transportPosition={transportPosition}
              />   
            </div>                 
          </div>         
        </div>  
      </div>
    );
  }
}

App.defaultProps = {
};

App.propTypes = {
  players: PropTypes.object.isRequired,
  sequencer: PropTypes.object.isRequired,
  clickSeq: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default App;
