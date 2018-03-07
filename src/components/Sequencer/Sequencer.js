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
      width: 0,
      height: 0,
      notes: [],
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
    this.drawNotes(this.props.tracks, this.props.bars);
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
    this.setState({ width: Math.floor(width * 2), height: Math.floor(height * 2) });
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

    for (let x = 0; x < steps; x++) {
      for (let y = 0; y < this.state.tracks.length; y++) {
        this.bgContext.beginPath();
        this.bgContext.strokeStyle = 'rgba(12, 12, 12, .5)';
        this.bgContext.strokeRect((x * stepWidth) + 0.50, (y * stepHeight) + 0.50, stepWidth, stepHeight);
        // Quarter Note Lines 
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
        // Bar Lines
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
    // console.log(bars);
    const steps = bars * 16;
    const tileMargin = 4.5;
		const gridWidth = this.noteCanvas.width;
    const gridHeight = this.noteCanvas.height;
    const stepHeight = gridHeight / tracks.length;   
    const stepWidth = gridWidth / steps;
    const notes = [];
    tracks.map((track, index) => {
      // console.log(track.beats);
      if (track.beats.length) {
        track.beats.map((beat) => {
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
          notes.push({
            'x': Math.round((beat * stepWidth) + tileMargin + 1.5) / 2, 
            'y': Math.round((index * stepHeight) + tileMargin + 0.5) / 2,
            'width': stepWidth / 2,
            'height': stepHeight / 2,
            'track': index,
            'beat': beat,
          })
        });
      } 
    });
    this.setState({ notes: notes });
  }

  isIntersect(point, rect) {
    return (point.x >= rect.x && point.x <= rect.x + rect.width);
      // && (point.y >= rect.y && point.y <= rect.y + rect.height);
  }

  handleCanvasClick = (e) => {
    const offset = e.target.getBoundingClientRect();
    const mousePoint = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    };
    this.state.notes.forEach(note => {
      if(mousePoint.x >= note.x && mousePoint.x <= (note.x + note.width) && mousePoint.y >= note.y && mousePoint.y <= (note.y + note.height)) {
        console.log('Det finns en not här');
        console.log(note);
      }
    });
    //console.log(this.state.notes);
  } 

  render() {
    const { width, height } = this.state;
    return (
      <div className="module module-sequencer w-100 text-center">
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
        <div className="grid">
          <canvas
            ref="noteCanvas"
            className="note-canvas" 
            width={width}
            height={height}
            onClick={this.handleCanvasClick}
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
