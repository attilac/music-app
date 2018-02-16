import Tone from 'tone';
import { settings } from './tone.js';

export function create(tracks, beatNotifier) {
  // new Tone.Sequence ( callback , events , subdivision )
  const loop = new Tone.Sequence(
    loopProcessor(tracks, beatNotifier),
    new Array(16).fill(0).map((_, i) => i),
    "16n"
  );

  Tone.Transport.bpm.value = 70;
  Tone.Transport.start();
  // console.log(loop);
  return loop;
}

function loopProcessor(tracks, beatNotifier) {

  // new Tone.Players ( urls , [ onload ] )
  const keys = new Tone.Players({
    // tracks: {id: 1, name: "hihat-reso", vol: .4, muted: false, beats: initBeats(16)},
    "A" : settings.basePath + tracks[0].kit + '/' + tracks[0].file,
    "B" : settings.basePath + tracks[0].kit + '/' + tracks[1].file
  }).toMaster();

  return (time, index) => {
    beatNotifier(index);
    console.log(index);
    let vel = Math.random() * 0.5 + 0.5;
    if(index === 0 || index === 9) {   
      try {
        // "1n" should be set via some "resolution" track prop
        // keys.start(name, time, 0, "1n", 0, muted ? 0 : velocities[index] * vol);
        console.log('Trigger sound A');
        keys.get('A').start(time, 0, "1n", 0, vel);
      } catch(e) {
        // We're most likely in a race condition where the new sample hasn't been loaded
        // just yet; silently ignore, it will resiliently catch up later.
      }      
    }
    if(index === 5 || index === 13) {   
      try {
        console.log('Trigger sound B');
        keys.get('B').start(time, 0, "1n", 0, vel);
      } catch(e) {
      }      
    }    
  };
}