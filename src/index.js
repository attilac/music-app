import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import * as model from './data/model';
import * as sequencer from './modules/sequencer';
import * as users from './data/users';
import * as sampleKits from './data/sample-kits.json';

function getKitSounds(kitName) {
  return sampleKits.kits.find((item) =>
    item.name === kitName ? item : null
  );
}
const kit = 'A';
const samples = getKitSounds(kit).sounds;
// const players = sequencer.createPlayers(model.defaultSequence);
const players = sequencer.createSamplePlayers(samples, kit);
const defaultSequence = model.createDefaultSequence(samples, kit);
// const defaultSequence = model.defaultSequence;
const clickSynth = sequencer.createClickSynth();
const clickSeq = sequencer.click(clickSynth);

// localStorage.removeItem('currentUser');
// console.log(users.fetchCurrentUser());

if (users.fetchCurrentUser() === '') {
  users.storeCurrentUser({'userName': users.makeUserName()});   
} 
const user = users.fetchCurrentUser();

const initProps = {
  sequencer,
  players,
  clickSeq,
  user,
  defaultSequence,
  samples,
  kit,
  clickSynth,
};

ReactDOM.render(<App {...initProps} />, document.getElementById('root'));
registerServiceWorker();
