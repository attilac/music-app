import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    this.clearTrackBeat = this.clearTrackBeat.bind(this);
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
    const { sample } = this.props;
    console.log(`${sample} was pressed`);
    this.playSound();
  }

  onKeyDown(keyName) {
    const { title, erase } = this.props;
    if (keyName === title) {
      // console.log(`${sample} was pressed`);
      this.setState({ active: !this.state.active });
      if (erase) {
        this.clearTrackBeat();
      } else {
        this.playSound();
      }
    }
  }

  onKeyUp(keyName) {
    const { title } = this.props;
    if (keyName === title) {
      this.setState({ active: !this.state.active });
    }
  }

  clearTrackBeat() {
    const { trackId, clearTrackBeat } = this.props;
    clearTrackBeat(trackId);
    console.log('Erasing track');
  }

  playSound() {
    const { record, sample, players, playing } = this.props;

    if (playing) {
      // players.get(sample).start(Tone.Transport.nextSubdivision('16n'), 0, '1n');
      players.get(sample).start(AudioContext.currentTime, 0, '1n');
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
          className={`pad btn btn-secondary ${activeClass}`}
        >
          { title }
        </button>
      </div>
    );
  }
}

DrumPad.defaultProps = {
  beats: [],
  currentBeat: '',
  erase: false,
  muted: false,
  playing: false,
  record: false,
  vol: 1,
};

DrumPad.propTypes = {
  beats: PropTypes.arrayOf(PropTypes.number),
  clearTrackBeat: PropTypes.func.isRequired,
  currentBeat: PropTypes.number,
  erase: PropTypes.bool,
  muted: PropTypes.bool,
  title: PropTypes.string.isRequired,
  sample: PropTypes.string.isRequired,
  playing: PropTypes.bool,
  players: PropTypes.object.isRequired,
  record: PropTypes.bool,
  toggleTrackBeat: PropTypes.func.isRequired,
  trackId: PropTypes.number.isRequired,
  vol: PropTypes.number,
};

export default DrumPad;
