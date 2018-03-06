import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';

import * as canvas from './../../helpers/canvas';

class Sequencer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bars: this.props.bars,
      tracks: this.props.tracks,
      width: 1280,
      height: 400,
    };
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    this.bgCanvas = this.refs.bgCanvas;
    this.bgContext = this.bgCanvas.getContext('2d');
    this.playheadCanvas = this.refs.playheadCanvas;
    this.playheadContext = this.playheadCanvas.getContext('2d');
    this.noteCanvas = this.refs.noteCanvas;
    this.noteContext = this.noteCanvas.getContext('2d');
    this.updatePlayheadCanvas();
    this.drawBgGrid(this.props.bars);
    // this.drawNotes(this.props.tracks, this.props.bars);
  }

  componentWillReceiveProps(nextProps) {
    const { bars } = this.state;

    if (nextProps.bars !== bars) {
      // console.log(nextProps.bars);
      this.setState({ bars: nextProps.bars });
      canvas.clearCanvas({
        ctx: this.bgContext,
        x: 0,
        y: 0,
        width: this.bgCanvas.width,
        height: this.bgCanvas.height,
      });
      this.drawBgGrid(nextProps.bars);
    }
    
    if (nextProps.tracks !== this.props.tracks) {
      // console.log('tracks', nextProps.tracks);
      canvas.clearCanvas({
        ctx: this.noteContext,
        x: 0,
        y: 0,
        width: this.noteCanvas.width,
        height: this.noteCanvas.height,
      });      
      this.drawNotes(nextProps.tracks, nextProps.bars);
    }
    
  }

  componentDidUpdate() {
    this.updatePlayheadCanvas();
  }

  onResize = (width, height) => {
    // console.log(width, height);
    this.setState({width: width, height: height});
    this.drawBgGrid(this.props.bars);
    this.drawNotes(this.props.tracks, this.props.bars);
  }

	getX(beat) {
    const { currentBeat } = this.props;
    const { bars } = this.state;
    const beatsTotal = bars * 16;
		return (currentBeat / beatsTotal) * this.playheadCanvas.width;
  }
  
	getY(pos) {
    const { currentBeat } = this.props;
		return this.playheadCanvas.height/(currentBeat) * (pos + 1);
  }

  drawPlayhead() {
    const { bars } = this.state;
    const steps = bars * 16;
    const gridWidth = this.playheadCanvas.width;
    const stepWidth = gridWidth / steps;
    canvas.drawLines({
      ctx: this.playheadContext, 
      x: this.getX() + (stepWidth / 2), 
      y: 0, 
      width: stepWidth, 
      height: this.playheadCanvas.height, 
      strokeStyle: 'rgba(255, 255, 255, .3)',
    });      
  }

  updatePlayheadCanvas() {
    canvas.clearCanvas({
      ctx: this.playheadContext,
      x: 0,
      y: 0,
      width: this.playheadCanvas.width,
      height: this.playheadCanvas.height,
    });    
    this.drawPlayhead();
  }

  drawBgGrid(bars) {
    const steps = bars * 16;
		const gridWidth = this.bgCanvas.width;
    const gridHeight = this.bgCanvas.height;
    const stepHeight = gridHeight / this.props.tracks.length;   
    const stepWidth = gridWidth / steps;
    this.bgContext.lineWidth = 1;
    for (let x = 0; x < gridWidth; x++) {
		  for (let y = 0; y < gridHeight; y++) {
        //draw tile with border 
        this.bgContext.beginPath();
        this.bgContext.strokeStyle = 'rgba(12, 12, 12, .5)';
        this.bgContext.strokeRect((x * stepWidth) + 0.50, (y * stepHeight) + 0.50, stepWidth, stepHeight);
        // this.bgContext.font = '12px Open Sans';
        // this.bgContext.fillText(x + 1, x * stepWidth, 12);

        // Quarter Notes
        if (x % 4 === 0 && x > 0) {
          canvas.drawLines({
            ctx: this.bgContext, 
            x: (x * stepWidth) + 0.5, 
            y: 0.50, 
            witdh: 1, 
            height: gridHeight, 
            strokeStyle: 'rgba(58, 58, 58, 1)',
          });   
        }
        // Bars
        if (x % 16 === 0) {
          canvas.drawLines({
            ctx: this.bgContext, 
            x: (x * stepWidth) + 0.5, 
            y: 0.50, 
            witdh: 1, 
            height: gridHeight, 
            strokeStyle:  'rgba(110, 110, 110, 1)',
          });                        
        }  
      }     
    }
  }

  drawNotes(tracks, bars) {
    console.log(bars);
    const steps = bars * 16;
    const tileMargin = 4.5;
		const gridWidth = this.noteCanvas.width;
    const gridHeight = this.noteCanvas.height;
    const stepHeight = gridHeight / tracks.length;   
    const stepWidth = gridWidth / steps;

    tracks.forEach((track, index) => {
      // console.log(track.beats);
      if (track.beats.length) {
        track.beats.forEach((beat) => {
          let x = beat * stepWidth;
          canvas.drawTile({
            ctx: this.noteContext, 
            x: beat,
            y: index, 
            offsetX: 1.5, 
            offsetY: 0.5, 
            width: stepWidth, 
            height: stepHeight, 
            margin: tileMargin, 
            fillStyle: 'rgba(79, 195, 247, .7)',
          });
        });
      } 
    });

  }

  render() {
    const { width, height } = this.state;
    return (
      <div className="module module-playbar w-100 text-center">
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
        <div className="grid">
        <canvas 
              ref="noteCanvas"
              className="note-canvas" 
              width={width} 
              height={height} 
            >
            </canvas>        
          <canvas 
              ref="playheadCanvas"
              className="playhead-canvas" 
              width={width} 
              height={height}
            >  
            </canvas>        
            <canvas 
              ref="bgCanvas"
              className="grid-canvas" 
              width={width} 
              height={height} 
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
