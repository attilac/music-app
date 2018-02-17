import React, { Component } from 'react';
import Tone from 'tone';
import DrumPad from './../DrumPad/DrumPad';

class DrumPadList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getDrumPadList() {
    const { samples, kit, path } = this.props;
    return samples.map((item, index) =>
      (
        <div key={`pad-${item}`} className="drumpad-list__item">
          <DrumPad
            kit={kit}
            sound={item}
            name={index}
            path={path}
          />
        </div>
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

export default DrumPadList;
