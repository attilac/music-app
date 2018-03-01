import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DrumPad from './../DrumPad/DrumPad';

class DrumPadList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createRow(row) {
    return row.map(key =>
      this.createKey(key)
    );
  }
  
  createKey(key) {
    const result = this.props.samples.find( item => item.key === key );
    if (typeof result === 'object') {
      return (
        <DrumPad
          key={`${result.path}`}
          sample={result.path}
          title={result.key}
          trackId={result.id}
          vol={result.vol}
          beats={result.beats}
          {...this.props}
      />        
      )
    } else {
      return null;
    }
  }

  getDrumPadList() {
    const { samples } = this.props;
    // console.log(samples); 
    const rows = [
      // ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "delete"],
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    ];
    return rows.map((row, rowIndex) =>
      (
        <div className="drumpad-list" key={rowIndex}>
          { this.createRow(row) }
        </div>  
      )
    )
  }

  render() {
    return (
      <div className="module module-drumpad-list">
        { this.getDrumPadList() }
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
