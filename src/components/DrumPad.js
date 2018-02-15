import React, { Component } from 'react';
import Tone from 'tone';

class DrumPad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: null
    };
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() { 
    const {sound, kit} = this.props;
    const path = './audio/';
    const player = new Tone.Player({
      "url" : path + kit + '/' + sound.file,
      "autostart" : false,
    }).toMaster();    
    this.setState({player: player});
  }

  onClick(e) {
    const {sound} = this.props;
    console.log(sound.file + " was pressed");
    this.state.player.start();
  }

  render() {
    const {name} = this.props;
    return (
      <button onClick={this.onClick} className="pad btn btn-outline-primary">
        { name }
      </button>
    );
  }
}

export default DrumPad;