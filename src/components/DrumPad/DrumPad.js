import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tone from 'tone';
import ReactKeymaster from 'react-keymaster';

class DrumPad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  componentDidMount() {
    const { players, sound, muted, vol } = this.props;
    players.get(sound).mute = muted;
    players.get(sound).volume.value = vol;
  }

  onClick(e) {
    const { sound, players, playing, record } = this.props;
    const { active } = this.state;
    console.log(`${sound} was pressed`);
    this.playSound();
  }

  onKeyDown(keyName) {
    const { name, sound, players, playing } = this.props;
    if (keyName === name) {
      // console.log(`${sound} was pressed`);
      this.setState({ active: !this.state.active });
      this.playSound();
    }
  }

  onKeyUp(keyName) {
    const { name } = this.props;
    if (keyName === name) {
      this.setState({ active: !this.state.active });
    }
  }

  playSound() {
    const { currentBeat, name, sound, players, playing, vol } = this.props;
    if (playing) {
      // console.log(Tone.Transport.nextSubdivision('16n'));
      console.log(currentBeat);
      players.get(sound).start(Tone.Transport.nextSubdivision('16n'), 0, '1n');
    } else {
      players.get(sound).start(AudioContext.currentTime, 0, '1n');
    }     
  }

  render() {
    const { name } = this.props;
    const { active } = this.state;
    const activeClass = active ? 'active' : '';
    return (
      <div className="drumpad-list__item">
        <ReactKeymaster
          keyName={name}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
        />
        <button
          onClick={this.onClick}
          className={`pad btn btn-outline-primary ${activeClass}`}
        >
          { name }
        </button>
      </div>
    );
  }
}

DrumPad.defaultProps = {
  muted: false,
  playing: false,
  record: false,
};

DrumPad.propTypes = {
  muted: PropTypes.bool,
  name: PropTypes.string.isRequired,
  sound: PropTypes.string.isRequired,
  playing: PropTypes.bool,
  players: PropTypes.object.isRequired,
  record: PropTypes.bool,
};

export default DrumPad;
