import Tone from 'tone';
import * as model from './../data/model';

export function createPlayers(tracks) {
  // tracks: {id: 1, name: "hihat-reso", vol: .4, muted: false, beats: initBeats(16)}
  const limiter = new Tone.Limiter(-6).toMaster();
  const paths = tracks.reduce((acc, { path }) => ({ ...acc, [path]: path }), {});
  // new Tone.Players ( paths , [ onload ] )
  const samplePlayers = new Tone.Players(paths).connect(limiter);
  return samplePlayers;
}

export function createSamplePlayers(sounds, kit) {
  const limiter = new Tone.Limiter(-6).toMaster();
  const paths = sounds.reduce((acc, { file }) => ({ 
    ...acc, 
    [`${model.settings.basePath}${kit}/${file}`]: `${model.settings.basePath}${kit}/${file}` 
  }), {});
  // new Tone.Players ( paths , [ onload ] )
  const samplePlayers = new Tone.Players(paths).connect(limiter);
  return samplePlayers;
}

export function create(tracks, beatNotifier, transportPositionNotifier, samplePlayers, kit, sequenceLength) {
  // new Tone.Sequence ( callback , events , subdivision )
  const resulotion = 16;
  const beats = resulotion * sequenceLength;
  const loop = new Tone.Sequence(
    loopHandler(tracks, beatNotifier, transportPositionNotifier, samplePlayers, kit),
    new Array(beats).fill(0).map((_, i) => i),
    '16n',
  );
  return loop;
}

export function update(loop, tracks, beatNotifier, transportPositionNotifier, samplePlayers, kit) {
  loop.callback = loopHandler(tracks, beatNotifier, transportPositionNotifier, samplePlayers, kit);
  return loop;
}

export function setBPM(bpm) {
  Tone.Transport.bpm.value = bpm;
}

function loopHandler(tracks, beatNotifier, transportPositionNotifier, samplePlayers, kit) {
  return (time, index) => {
    Tone.Draw.schedule(function(){
      //this callback is invoked from a requestAnimationFrame
      //and will be invoked close to AudioContext time
      transportPositionNotifier();
      beatNotifier(index);
    }, time) //use AudioContext time of the event    
    tracks.forEach(({ path, vol, muted, beats, key }) => {
      if (beats.includes(index)) {
        try {
          // console.log(time);
          // const sampleName = model.getSampleByKey(key, kit);
          // const samplePath = `${model.settings.basePath}${kit}/${sampleName}`;
          // Player.start(startTime, offset, duration)
          samplePlayers.get(path).volume.value = vol;
          samplePlayers.get(path).mute = muted;
          samplePlayers.get(path).start(time, 0, '1n');
        } catch (e) {
          console.log(e, 'Sample buffer not loaded');
        }
      }
    });
  };
}

export function click(inst) {
  const loop = new Tone.Sequence(
    clickHandler(inst),
    ['G5', 'C5', 'C5', 'C5'],
    '4n',
  );
  return loop;
}

export function clickHandler(inst, vol) {
  return (time, note) => {
    inst.triggerAttackRelease(note, '16n');
  }
}

export function createClickSynth() {
  const synth = new Tone.Synth({
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0,
      decay: 0.1,
      sustain: 0,
      release: 0,
    },
  }).toMaster();
  synth.volume.value = -6;
  return synth;
}

export function between(x, min, max) {
  return x >= min && x <= max;
}
