import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DrumPad from './../DrumPad/DrumPad';

class DrumPadList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getDrumPadList() {
    const { samples } = this.props;
    // console.log(samples);
    return samples.map((item, index) =>
      (
        <DrumPad
          key={`${item.path}`}
          sample={item.path}
          title={item.key}
          trackId={item.id}
          vol={item.vol}
          beats={samples[index].beats}
          {...this.props}
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
};

DrumPadList.propTypes = {
  samples: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DrumPadList;
