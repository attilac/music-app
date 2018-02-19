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
    const { currentBeat, samples, players, playing, record } = this.props;
    // console.log(samples);
    return samples.map((item, index) =>
      (
        <DrumPad
          playing={playing}
          record={record}
          key={`${item.path}`}
          sound={item.path}
          name={item.key}
          players={players}
          vol={item.vol}
          currentBeat={currentBeat}
        />
      ));
  }

  render() {
    return (
      <div className="module module__drumpad-list">
        <div className="drumpad-list">
          { this.getDrumPadList() }
        </div>
      </div>
    );
  }
}

DrumPadList.defaultProps = {
  playing: false,
  record: false,
};

DrumPadList.propTypes = {
  samples: PropTypes.arrayOf(PropTypes.object).isRequired,
  playing: PropTypes.bool,
  players: PropTypes.object.isRequired,
  record: PropTypes.bool,
};

export default DrumPadList;
