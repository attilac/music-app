import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tone from 'tone';
import DrumPad from './../DrumPad/DrumPad';

class DrumPadList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getDrumPadList() {
    const { currentBeat, samples, players, playing, record, toggleTrackBeat } = this.props;
    // console.log(samples);
    return samples.map((item, index) =>
      (
        <DrumPad
          playing={playing}
          record={record}
          key={`${item.path}`}
          sample={item.path}
          title={item.key}
          trackId={item.id}
          players={players}
          vol={item.vol}
          currentBeat={currentBeat}
          toggleTrackBeat={toggleTrackBeat}
          beats={samples[index].beats}
        />
      ));
  }

  render() {
    return (
      <div className="module module-drumpad-list">
        <div className="drumpad-list">
          { this.getDrumPadList() }
        </div>
      </div>
    );
  }
}

DrumPadList.defaultProps = {
  currentBeat: -1,
  playing: false,
  record: false,
};

DrumPadList.propTypes = {
  currentBeat: PropTypes.number,
  samples: PropTypes.arrayOf(PropTypes.object).isRequired,
  playing: PropTypes.bool,
  players: PropTypes.object.isRequired,
  record: PropTypes.bool,
};

export default DrumPadList;
