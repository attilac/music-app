import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as sequencer from './../../modules/sequencer';

class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempo: this.props.tempo,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    this.setState({ tempo: this.props.tempo });
  }

  componentWillReceiveProps(nextProps) {
    const { tempo } = this.state;
    if (nextProps.tempo !== tempo && !this.props.playing) {
      console.log(nextProps.tempo);
      this.setState({ tempo: nextProps.tempo });
    }
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({ tempo: value });
  }

  onKeyPress(e){
    const { value } = e.target;
    if(e.keyCode === 13) {
      if (sequencer.between(value, 60, 180)) {
        // console.log('value', e.target.value);
        this.props.setTransportBPM(this.state.tempo);
      } else {
        console.log('Unvalid input');
      }
    }
 }  

  render() {
    const { 
      click, 
      record, 
      playing, 
      erase,
      saveTrack,
      startTransport, 
      stopTransport, 
      toggleRecord,
      toggleEraseMode,
      toggleClick,
      transportPosition,
    } = this.props;
    const { tempo } = this.state;
    const activePlayClass = playing ? 'btn-secondary active' : 'btn-secondary';
    const activeRecordClass = record ? 'btn-secondary active' : 'btn-secondary';
    const activeEraseClass = erase ? 'btn-secondary active' : 'btn-secondary';
    const activeClickClass = click ? 'btn-secondary active' : 'btn-secondary';
    const clickLabel = click ? 'On' : 'Off';
    return (
      <div className="module-controls text-center module-controls--bottom module-controls--blue-lighter w-100">
        <div className="transport-container">

          <div className="transport-position d-flex mr-4">
            <p className="mb-0">{ transportPosition }</p>
          </div>   

          <div className="transport-controls d-flex mr-4">
            <button
              onClick={stopTransport}
              className="btn btn-round mr-2 btn-secondary transport-stop"
              title="Stop"
            >
              <i className="icon-stop" />
            </button>          
            <button
              onClick={startTransport}
              className={`btn btn-round mr-2 transport-play ${activePlayClass}`}
              title="Play"
            >
              <i className="icon-play" />            
            </button>
            <button
              onClick={toggleRecord}
              className={`btn btn-round mr-2 transport-record ${activeRecordClass}`}
              title="Record"
            >
              <i className="icon-record" />            
            </button>
            <button
              className={`btn erase-mode ${activeEraseClass}`}
              onClick={toggleEraseMode}
              title="Erase Mode"
            >
              Erase Mode
            </button>                           
          </div>

          <div className="tempo-controls d-flex flex-row mr-4">
            <div className="tempo-wrapper mr-2">
              <input 
                type="number" 
                className="form-control tempo form-control-sm" 
                value={tempo}
                onChange={this.handleChange}
                onKeyDown={this.onKeyPress}
                min="60"
                max="180"
              />
              <small>Tempo</small>
            </div>  
            <div className="click-wrapper">  
              <button
              className={`btn btn-sm text-uppercase d-block click ${activeClickClass}`}
              onClick={toggleClick}
              title="Click On/Off"
              >
                { clickLabel }
              </button>   
              <small>Click</small>
            </div>            
          </div>
          <div className="track-actions">
            <button
              className="btn btn-secondary text-uppercase d-block save-track"
              onClick={saveTrack}
              title="Save Track"
              >
                Save
              </button>           
          </div>
        </div>  
      </div>
    );
  }
}

Controls.defaultProps = {
  erase: false,
  playing: false,
  click: false,
  record: false,
};

Controls.propTypes = {
  click: PropTypes.bool,
  record: PropTypes.bool,
  playing: PropTypes.bool,
  erase: PropTypes.bool,
  startTransport: PropTypes.func.isRequired,
  stopTransport: PropTypes.func.isRequired,
  toggleRecord: PropTypes.func.isRequired,
  toggleEraseMode: PropTypes.func.isRequired,
  toggleClick: PropTypes.func.isRequired,
};

export default Controls;
