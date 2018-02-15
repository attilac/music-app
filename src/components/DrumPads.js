import React, { Component } from 'react';
import Tone from 'tone';
import DrumPad from './DrumPad.js';

class DrumPads extends Component {
  state = {  };

  getDrumPadList() {
    const { samples, kit, path } = this.props;    
    return samples.map((item, index) => { 
      // console.log(item);
      return (
        <div key={`pad-${index}`} className="drumpad-list--item">
          <DrumPad 
            kit={kit} 
            sound={item} 
            name={`Pad ${index}`}
            path={path} 
          />
        </div>
      );
    }); 
  }
 
  render() {
    return (
      <div className="module-drumpad-list">
        <div className="drumpad-list"> 
          { this.getDrumPadList() } 
        </div>  
      </div>           
    );
  }
}

export default DrumPads;