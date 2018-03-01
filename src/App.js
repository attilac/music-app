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
      bpm: 80,
      samples: this.props.samples,
      kit: this.props.kit,
      songId: ' ',
      tracks: this.props.defaultSequence,
      users: [this.props.user.userName],
      userId: this.props.user.userName,
    };
    // pubnub
    let uuid = this.state.userId;
    /*
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
    // music app
    this.createLoop = this.createLoop.bind(this);
    this.startTransport = this.startTransport.bind(this);
    this.stopTransport = this.stopTransport.bind(this);
    this.updateCurrentBeat = this.updateCurrentBeat.bind(this);
    this.timeNotifier = this.timeNotifier.bind(this);
    this.toggleTrackBeat = this.toggleTrackBeat.bind(this);
    this.toggleClick = this.toggleClick.bind(this);
    this.clearTrackBeat = this.clearTrackBeat.bind(this);
    this.toggleEraseMode = this.toggleEraseMode.bind(this);
    this.toggleRecord = this.toggleRecord.bind(this);
  }

  componentWillMount() {
    // this.pubnub.clean('tracks');
    // this.subscribeTo();   
    // this.addListeners(); 
  }

  componentDidMount() {
    const { userId } = this.state;
    // this.createLoop(this.props.defaultSequence);

    // this.saveToFirestore('Default Pattern', true);
    this.loadTrackFromFirestore('0TFwRd72Jyocsg70hyju');
    // window.addEventListener('beforeunload', this.unsubscribe);
  }

  componentWillUnmount() {
    // this.unsubscribe();
  }

  createLoop(tracks) {
    const { bpm } = this.state;
    this.loop = this.props.sequencer
    .create(tracks, this.updateCurrentBeat, this.timeNotifier, this.props.players, this.state.kit);    
    this.loop.start();
    this.setTransportBPM(bpm);
    Tone.Transport.setLoopPoints(0, '1m');
    Tone.Transport.loop = true;
    this.setState({ tracks: tracks });
  }

  loadTrackFromFirestore(trackId) {
    const tracks = db.collection('tracks');
    tracks.doc(trackId)
      .get()
      .then(doc => {
        if (doc.exists) {        
          // console.log(doc.id, " => ", doc.data().channels);
          const song = doc.data();
          this.createLoop(song.channels);
          this.setState({ songId: doc.id });
        } else {
          console.log('No such document');          
        }       
      })
      .catch(error => {
          console.log('Error getting document:', error);
      }); 
  }

  saveToFirestore(title, isPublic) {
    const { tracks, userId } = this.state;
    const song = {
      name: title,
      public: isPublic,
      channels: tracks,
      user: userId,
    }
    // console.log(song);
    db.collection('tracks')
      .add(song)
      .then(function(docRef) {
        console.log('Document successfully written!');
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
      });  
  }

  updateTrackInFirestore() {
    const { tracks, userId, songId } = this.state;
    // console.log(songId);
    if (songId === '') { return; }
    const song = db.collection('tracks').doc(songId);
    return song.update({
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

  setTransportBPM(newBpm) {
    const { sequencer } = this.props;
    sequencer.setBPM(newBpm);
    this.setState({ bpm: newBpm });
  }

  startTransport() {
    Tone.Transport.start();
    this.setState({ playing: true });
  }

  stopTransport() {
    Tone.Transport.stop();
    this.setState({ currentBeat: -1, playing: false, record: false });
    // this.updateTrackInFirestore();
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
          this.loop = this.props.sequencer
            .update(this.loop, message.data, this.updateCurrentBeat, this.timeNotifier, this.props.players);   
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
  
  toggleClick() {
    const { click } = this.state;
    const { clickSeq } = this.props;
    if (!click) {
      clickSeq.start();
    } else {
      clickSeq.stop();
    }
    this.setState({ click: !click });
  }

  toggleTrackBeat(trackId) {
    const { tracks, currentBeat } = this.state;
    this.updateTracks(model.toggleTrackBeat(tracks, trackId, currentBeat));
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
    // const barsBeats = Tone.TransportTime().toBarsBeatsSixteenths();
    // console.log(barsBeats);
  }

  updateTracks(newTracks) {
    const { sequencer } = this.props;
    this.loop = sequencer
      .update(this.loop, newTracks, this.updateCurrentBeat, this.timeNotifier, this.props.players, this.state.kit);
    this.setState({ tracks: newTracks });
    // this.publishTrack('riff', newTracks);
  }

  toggleRecord() {
    const { record } = this.state;
    this.setState({ record: !record });
  }

  render() {
    const { click, currentBeat, tracks, record, playing, erase } = this.state;
    const { players } = this.props;
    return (
      <div className="container pt-3">
        <div className="row">
          <div className="col pb-3">
            <h2 className="App-intro text-center my-5">
              Hello Tone
            </h2>
            <div className="p-absolute user-list-wrapper">
              <h5>Users</h5>
              <ul className="module-user-list list-unstyled">{this.renderUsers()}</ul>
            </div>  
            <Controls
              click={click}
              record={record}
              playing={playing}
              erase={erase}
              startTransport={this.startTransport} 
              stopTransport={this.stopTransport}
              toggleRecord={this.toggleRecord}
              toggleEraseMode={this.toggleEraseMode}
              toggleClick={this.toggleClick}
            />  
          </div>
        </div>
        <div className="row justify-content-center mt-5">
          <div className="col">
          { 
            <DrumPadList
              players={players}
              samples={tracks}
              record={record}
              playing={playing}
              currentBeat={currentBeat}
              toggleTrackBeat={this.toggleTrackBeat}
              clearTrackBeat={this.clearTrackBeat}
              erase={erase}
            />
          }
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
