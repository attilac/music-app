import React, { Component } from 'react';
import PropTypes from 'prop-types';

function rect(props) {
  const {ctx, x, y, width, height} = props;
  ctx.fillRect(x, y, width, height);
}

class Sequencer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bars: this.props.bars,
    };
  }

  componentDidMount() {
    this.bgCanvas = this.refs.bgCanvas;
    this.bgContext = this.refs.bgCanvas.getContext('2d');
    this.playheadCanvas = this.refs.playheadCanvas;
    this.playheadContext = this.refs.playheadCanvas.getContext('2d');
    this.updateCanvas();
    this.drawLines(this.props.bars);
  }

  componentWillReceiveProps(nextProps) {
    const { bars } = this.state;
    if (nextProps.bars !== bars) {
      // console.log(nextProps);
      this.setState({ bars: nextProps.bars });
      this.clearBgCanvas();
      this.drawLines(nextProps.bars);
    }
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

	getX(beat) {
    const { currentBeat } = this.props;
    const { bars } = this.state;
    const beatsTotal = bars * 16;
		return (currentBeat) / beatsTotal * this.playheadCanvas.width;
  }
  
	getY(pos) {
    const { currentBeat } = this.props;
    const { bars } = this.state;
		return this.playheadCanvas.height/(currentBeat) * (pos + 1);
	}  

  drawPlayhead() {
    const { bars } = this.state;
    const beatsTotal = bars * 16;
		this.playheadContext.beginPath();
		this.playheadContext.moveTo(this.getX() + (20 / 2), 0);
		this.playheadContext.lineTo(this.getX() + (20 / 2), this.playheadCanvas.height);
    this.playheadContext.lineWidth = 20;
		this.playheadContext.strokeStyle = 'rgba(255, 255, 255, .3)';
		this.playheadContext.stroke();    
  }

  clearPlayheadCanvas() {
    const W = this.playheadCanvas.width;
    const H = this.playheadCanvas.height;
    this.playheadContext.clearRect(0, 0, W, H);
  }
  
  updateCanvas() {
    this.clearPlayheadCanvas();
    this.drawPlayhead();
  }

  clearBgCanvas() {
    const W = this.bgCanvas.width;
    const H = this.bgCanvas.height;
    this.bgContext.clearRect(0, 0, W, H);
  }

  drawLines(bars) {
    const { currentBeat } = this.props;
    const beatsTotal = bars * 4;
		const gridWidth = this.bgCanvas.width;
    const gridHeight = this.bgCanvas.height;
    const tileWidth = gridWidth / beatsTotal;
		const tileHeight = gridHeight/ 4;    
		this.bgContext.strokeStyle = '#222f3e';
		this.bgContext.lineWidth = 1;
		for (let x = 0; x < gridWidth; x++) {
		  for (let y = 0; y < gridHeight; y++) {
				//draw tile with border
				this.bgContext.beginPath();
				this.bgContext.strokeRect((x * tileWidth) + 0.5, (y * tileHeight) + 0.5, tileWidth + 0.5, tileHeight + 0.5);
		  }
		}
	}

  render() {
    return (
      <div className="module module-playbar w-100 text-center">
        <div className="grid">
          <canvas 
              ref="playheadCanvas"
              className="playhead" 
              width="800" 
              height="160"
            >  
            </canvas>        
            <canvas 
              ref="bgCanvas"
              className="canvas" 
              width="800" 
              height="160" 
            >
            </canvas>
        </div>     
      </div>
    );
  }
}

Sequencer.defaultProps = {
};

Sequencer.propTypes = {
};

export default Sequencer;
