import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { 
      click, 
      record, 
      playing, 
      erase, 
      startTransport, 
      stopTransport, 
      toggleRecord,
      toggleEraseMode,
      toggleClick,
    } = this.props;
    const activePlayClass = playing ? 'btn-secondary active' : 'btn-secondary';
    const activeRecordClass = record ? 'btn-secondary active' : 'btn-secondary';
    const activeEraseClass = erase ? 'btn-secondary active' : 'btn-secondary';
    const activeClickClass = click ? 'btn-secondary active' : 'btn-secondary';
    return (
      <div className="module-controls text-center">
        <div className="mb-2">
          <button
            onClick={startTransport}
            className={`btn mr-2 transport-play ${activePlayClass}`}
          >
            <i className="icon-play" />
            Play
          </button>
          <button
            onClick={toggleRecord}
            className={`btn mr-2 transport-record ${activeRecordClass}`}
          >
            <i className="icon-record" />
            Record
          </button>
          <button
            onClick={stopTransport}
            className="btn btn-secondary transport-stop"
          >
            <i className="icon-stop" />
            Stop
          </button>
        </div>
        <button
          className={`btn btn-sm mr-2 ${activeEraseClass}`}
          onClick={toggleEraseMode}
        >
          Erase Mode
        </button>
        <button
          className={`btn btn-sm ${activeClickClass}`}
          onClick={toggleClick}
        >
          Click
        </button>
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
