import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import * as model from './data/model';
import * as sequencer from './modules/sequencer';
import * as users from './data/users';

const players = sequencer.createPlayers(model.defaultSequence);
const clickSynth = sequencer.createClickSynth();
const clickSeq = sequencer.click(clickSynth);

// localStorage.removeItem('currentUser');
console.log(users.fetchCurrentUser());

if (users.fetchCurrentUser() === '') {
  users.storeCurrentUser({'userName': users.makeUserName()});   
} 
const user = users.fetchCurrentUser();

const initProps = {
  sequencer,
  players,
  clickSeq,
  user,
};

ReactDOM.render(<App {...initProps} />, document.getElementById('root'));
registerServiceWorker();
