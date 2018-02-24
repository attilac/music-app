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
const user = users.makeUserName();

const initProps = {
  sequencer,
  players,
  clickSeq,
  user,
};

ReactDOM.render(<App {...initProps} />, document.getElementById('root'));
registerServiceWorker();
