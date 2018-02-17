import React, { Component } from 'react';
import Tone from 'tone';
import DrumPad from './../DrumPad/DrumPad.js';

class DrumPadList extends Component {
  state = {  };

  getDrumPadList() {
    const { samples, kit, path } = this.props;    
    return samples.map((item, index) => { 
      // console.log(item);
      return (
        <div key={`pad-${index}`} className="drumpad-list__item">
          <DrumPad 
            kit={kit} 
            sound={item} 
            name={index}
            path={path} 
          />
        </div>
      );
    }); 
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