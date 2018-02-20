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
    const {
      players,
      sample,
      muted,
      vol,
    } = this.props;
    players.get(sample).mute = muted;
    players.get(sample).volume.value = vol;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.beats.includes(nextProps.currentBeat)) {
      this.setState({ active: true });
    } else {
      this.setState({ active: false });
    }
  }

  onClick(e) {
    const { sample, players, playing, record } = this.props;
    const { active } = this.state;
    console.log(`${sample} was pressed`);
    this.playSound();
  }

  onKeyDown(keyName) {
    const { title, sample, players, playing } = this.props;
    if (keyName === title) {
      // console.log(`${sample} was pressed`);
      this.setState({ active: !this.state.active });
      this.playSound();
    }
  }

  onKeyUp(keyName) {
    const { title } = this.props;
    if (keyName === title) {
      this.setState({ active: !this.state.active });
    }
  }

  playSound() {
    const { currentBeat, record, title, sample, players, playing, vol } = this.props;
    if (playing) {
      // console.log(Tone.Transport.nextSubdivision('16n'));
      // console.log(currentBeat);
      players.get(sample).start(Tone.Transport.nextSubdivision('16n'), 0, '1n');
      // players.get(sample).start(AudioContext.currentTime, 0, '1n');
      if (record) {
        this.recordIt();
      }
    } else {
      players.get(sample).start(AudioContext.currentTime, 0, '1n');
    }
  }

  recordIt() {
    const { toggleTrackBeat, trackId } = this.props;
    // console.log(trackId);
    toggleTrackBeat(trackId);
  }

  render() {
    const { title } = this.props;
    const { active } = this.state;
    const activeClass = active ? 'active' : '';
    return (
      <div className="drumpad-list__item">
        <ReactKeymaster
          keyName={title}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
        />
        <button
          onClick={this.onClick}
          className={`pad btn btn-outline-secondary ${activeClass}`}
        >
          { title }
        </button>
      </div>
    );
  }
}

DrumPad.defaultProps = {
  currentBeat: '',
  muted: false,
  playing: false,
  record: false,
  vol: 1,
};

DrumPad.propTypes = {
  currentBeat: PropTypes.number,
  muted: PropTypes.bool,
  title: PropTypes.string.isRequired,
  sample: PropTypes.string.isRequired,
  playing: PropTypes.bool,
  players: PropTypes.object.isRequired,
  record: PropTypes.bool,
  vol: PropTypes.number,
};

export default DrumPad;
