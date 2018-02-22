import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import * as model from './data/model';
import * as sequencer from './modules/sequencer';

const players = sequencer.createPlayers(model.defaultSequence);
const clickSynth = sequencer.createClickSynth();
const clickSeq = sequencer.click(clickSynth);

const initProps = {
  sequencer,
  players,
  clickSeq,
};

ReactDOM.render(<App {...initProps} />, document.getElementById('root'));
registerServiceWorker();
