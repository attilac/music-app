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
    this.resetTrack = this.resetTrack.bind(this);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  onClick(e) {
    const { sample } = this.props;
    console.log(`${sample} was pressed`);
    this.playSound();
  }

  onKeyDown(keyName) {
    const { title, erase, record } = this.props;
    if (keyName === title) {
      // console.log(`${sample} was pressed`);
      switch (true) {
        case erase:
          this.resetTrack();
          break;
        case record:
          this.playSound();
          this.recordIt();
          break;
        default:
          this.playSound();
          break;
      }
      this.props.setCurrentTrack(title);
      this.setState({ active: !this.state.active });
      /*
      if (erase) {
        this.resetTrack();
      } else {
        this.playSound();
      }
      */
    }
  }

  onKeyUp(keyName) {
    const { title } = this.props;
    if (keyName === title) {
      this.setState({ active: !this.state.active });
    }
  }

  resetTrack() {
    const { trackId, resetTrack } = this.props;
    resetTrack(trackId);
    // const { trackId, eraseEventFromTrack, currentBeat } = this.props;
    // eraseEventFromTrack(trackId, currentBeat);
    // console.log('Erasing beat from track ', currentBeat);
  }

  playSound() {
    const { sample, players, playing } = this.props;
    players.get(sample).volume.value = -6;
    if (playing) {
      // players.get(sample).start('@16n', 0, '1n');
      players.get(sample).start(AudioContext.currentTime, 0, '1n');
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
    const playing = this.props.beats.includes(this.props.currentBeat) ? true : false;
    const activeClass = active || playing ? 'active' : '';
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
  resetTrack: PropTypes.func.isRequired,
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
